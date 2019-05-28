import { useEffect, useReducer, useState, useCallback, useRef } from 'react';
import useInterval from '@use-it/interval';
import useEventListener from '@use-it/event-listener';
import createPersistedState from 'use-persisted-state';
import { useAsyncEffect } from 'use-async-effect';
import axios, { AxiosResponse } from 'axios';
import { produce } from 'immer';

import { normalizeRedditPosts } from '../utils/reddit_helper';
import { RawSubreddit } from '../types/RawSubreddit';
import { RedditPost } from '../types/RedditPost';

interface State {
  posts: RedditPost[];
  isLoading: boolean;
}

type Action =
  | { type: 'FETCH_INIT'; payload: boolean }
  | { type: 'FETCH_SUCCESS'; payload: RedditPost[] }
  | { type: 'FETCH_FAILURE'; payload: any };

const SHORT_TIMER = 5e3;
const LONG_TIMER = 5 * 60e3;

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      state.isLoading = action.payload;

      return state;
    case 'FETCH_SUCCESS':
      state.posts = action.payload;
      state.isLoading = false;

      return state;
  }
});

const useSubreddit = (subreddit: string, deckId: string, initialFilter: string = 'hot') => {
  const [ filter, setFilter ] = createPersistedState(`subreddit-${deckId}-${subreddit}`)(initialFilter);
  const [ state, dispatch ] = useReducer(reducer, {
    posts: [],
    isLoading: false
  });
  const [ refreshTiming, setRefreshTiming ] = useState(SHORT_TIMER);
  const [ isPaused, setIsPaused ] = useState(false);
  const [ pauseOverride, setPauseOverride ] = createPersistedState(`subreddit-pauseOverride-${deckId}-${subreddit}`)(
    false
  );
  const firstLoad = useRef(true);
  // Used to store current subreddit/filter combo.
  const currentFilter = useRef<string>();
  const mounted = useRef(true);

  const fetchData = useCallback(
    async () => {
      // Only want to show loading if the combo has changed.
      let filterChanged = currentFilter.current !== filter;

      if (filterChanged) {
        currentFilter.current = filter;
      }

      if (firstLoad.current) {
        firstLoad.current = false;
      } else {
        if (!filterChanged && (isPaused || pauseOverride)) {
          return;
        }
      }

      dispatch({ type: 'FETCH_INIT', payload: filterChanged });

      const url = `https://www.reddit.com/r/${subreddit}/${filter}.json`;

      try {
        const result: AxiosResponse<RawSubreddit> = await axios(url);
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
    [ subreddit, filter, isPaused, pauseOverride ]
  );

  // Convenience state to check if we are still mounted
  useEffect(() => () => (mounted.current = false), []);
  // Load the initial posts and any time the callback function changes
  useAsyncEffect(fetchData, null, [ fetchData ]);
  // Set up auto-reload interval
  useInterval(fetchData, refreshTiming);
  // If the visibility of the tab is hidden, then use a long timer to not waste bandwidth
  useEventListener('visibilitychange', () => {
    setRefreshTiming(document.visibilityState === 'hidden' ? LONG_TIMER : SHORT_TIMER);
  });

  return { ...state, setFilter, filter, isPaused, setIsPaused, pauseOverride, setPauseOverride };
};

export default useSubreddit;
