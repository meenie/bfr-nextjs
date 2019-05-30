import { useEffect, useReducer, useState, useRef, Reducer, useMemo } from 'react';
import useInterval from '@use-it/interval';
import useEventListener from '@use-it/event-listener';
// @ts-ignore
import createPersistedState from 'use-persisted-state';
import { useAsyncEffect } from 'use-async-effect';
import axios, { AxiosResponse } from 'axios';
import { produce } from 'immer';

import { normalizeRedditPosts } from '../utils/reddit_helper';
import { RawSubreddit } from '../types/RawSubreddit';
import { RedditPost } from '../types/RedditPost';

interface State {
  posts: {
    [id: string]: RedditPost;
  };
  postIds: string[];
  isLoading: boolean;
}

type Action =
  | { type: 'FETCH_INIT'; payload: boolean }
  | { type: 'FETCH_SUCCESS'; payload: RedditPost[] }
  | { type: 'FETCH_FAILURE'; payload: any }
  | { type: 'RESET_STATE' };

const SHORT_TIMER = 5e3;
const LONG_TIMER = 5 * 60e3;
const INITIAL_STATE = {
  posts: {},
  isLoading: false,
  postIds: []
};

const reducer = (state: State, action: Action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'FETCH_INIT':
        draft.isLoading = action.payload;

        return draft;
      case 'FETCH_SUCCESS':
        const newPostIds = action.payload.map((post) => post.id).filter((id) => state.postIds.indexOf(id) === -1);
        draft.postIds = state.postIds.concat(newPostIds);
        action.payload.forEach((post) => {
          draft.posts[post.id] = post;
        });
        draft.isLoading = false;

        return draft;

      case 'RESET_STATE':
        return INITIAL_STATE;
    }
  });
};

const useSubreddit = (subreddit: string, deckId: string, initialFilter: string = 'hot') => {
  const [ refreshTiming, setRefreshTiming ] = useState(SHORT_TIMER);
  const [ filter, _setFilter ] = createPersistedState(`subreddit-${deckId}-${subreddit}`)(initialFilter);
  const [ pauseOverride, setPauseOverride ] = createPersistedState(`subreddit-pauseOverride-${deckId}-${subreddit}`)(
    false
  );
  const [ state, dispatch ] = useReducer<Reducer<State, Action>>(reducer, INITIAL_STATE);
  const firstLoad = useRef(true);
  // Used to store current subreddit/filter combo.
  const currentFilter = useRef<string>();
  const currentAfter = useRef<string>();
  const mounted = useRef(true);
  const after = useRef<string>();
  const isPaused = useRef<boolean>(false);

  const setAfter = (newAfter: string) => {
    after.current = newAfter;
  };

  const setIsPaused = (newIsPaused: boolean) => {
    isPaused.current = newIsPaused;
  };

  const setFilter = (newFilter: string) => {
    dispatch({ type: 'RESET_STATE' });
    setAfter('');
    _setFilter(newFilter);
  };

  const fetchData = useMemo(
    () => async (forceLoad: boolean = false) => {
      // Only want to show loading if the combo has changed.
      let filterChanged = currentFilter.current !== filter;

      if (filterChanged) {
        currentFilter.current = filter;
      }

      let afterChanged = currentAfter.current !== after.current;

      if (afterChanged) {
        currentAfter.current = after.current;
      }

      if (firstLoad.current) {
        firstLoad.current = false;
      } else {
        if (!forceLoad) {
          if (!filterChanged && !afterChanged && (isPaused.current || pauseOverride)) {
            return;
          }
        }
      }

      dispatch({ type: 'FETCH_INIT', payload: filterChanged });
      const url = `https://www.reddit.com/r/${subreddit}/${filter}.json`;

      try {
        const result: AxiosResponse<RawSubreddit> = await axios(url + (after.current ? `?after=${after.current}` : ''));
        if (!mounted.current) {
          return;
        }
        const payload = result.data.data.children.map((post) => post.data);

        dispatch({ type: 'FETCH_SUCCESS', payload: normalizeRedditPosts(payload) });
      } catch (e) {
        if (mounted.current) {
          dispatch({ type: 'FETCH_FAILURE', payload: e });
        }
      }
    },
    [ subreddit, filter, pauseOverride ]
  );

  // Convenience state to check if we are still mounted
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  // Load the initial posts and any time the callback function changes
  useAsyncEffect(fetchData, undefined, [ fetchData ]);
  // Set up auto-reload interval
  useInterval(fetchData, refreshTiming);
  // If the visibility of the tab is hidden, then use a long timer to not waste bandwidth
  useEventListener('visibilitychange', () => {
    setRefreshTiming(document.visibilityState === 'hidden' ? LONG_TIMER : SHORT_TIMER);
  });

  return {
    ...state,
    setFilter,
    filter,
    isPaused,
    setIsPaused,
    pauseOverride,
    setPauseOverride,
    setAfter,
    fetchData
  };
};

export default useSubreddit;
