import { useEffect, useReducer, useState, useCallback, useRef } from 'react';
import useInterval from '@use-it/interval';
import useEventListener from '@use-it/event-listener';
import createPersistedState from 'use-persisted-state';
import axios, { AxiosResponse } from 'axios';

import { normalizeRedditPosts } from '../utils/reddit_helper';
import { RawSubreddit, RawPostData } from '../types/RawSubreddit';
import { RedditPost } from '../types/RedditPost';

interface State {
	posts: RedditPost[];
	isLoading: boolean;
}

type Action =
	| { type: 'FETCH_INIT'; payload: boolean }
	| { type: 'FETCH_SUCCESS'; payload: RawPostData[] }
	| { type: 'FETCH_FAILURE'; payload: any };

const SHORT_TIMER = 5e3;
const LONG_TIMER = 5 * 60e3;

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return { ...state, isLoading: action.payload };
		case 'FETCH_SUCCESS':
			const posts = normalizeRedditPosts(action.payload);
			return { ...state, posts, isLoading: false };
		default:
			return state;
	}
};

const useSubreddit = (subreddit: string, deckId: string, initialFilter: string = 'hot') => {
	const [ filter, setFilter ] = createPersistedState(`subreddit-${deckId}-${subreddit}`)(initialFilter);
	const [ state, dispatch ] = useReducer(reducer, {
		posts: [],
		isLoading: false
	});
	const [ refreshTiming, setRefreshTiming ] = useState(SHORT_TIMER);
	const [ pauseRefresh, setPauseRefresh ] = useState(false);
	// Used to store current subreddit/filter combo.
	const combo = useRef<string>();
	const mounted = useRef(true);

	const fetchData = useCallback(
		() => {
			if (pauseRefresh) {
				return;
			}

			// Only want to show loading if the combo has changed.
			let shouldShowLoading = combo.current !== subreddit + filter;

			if (shouldShowLoading) {
				combo.current = subreddit + filter;
			}

			dispatch({ type: 'FETCH_INIT', payload: shouldShowLoading });

			const url = `https://www.reddit.com/r/${subreddit}/${filter}.json`;

			axios(url)
				.then((result: AxiosResponse<RawSubreddit>) => {
					if (mounted.current) {
						const payload = result.data.data.children
							.sort((a, b) => {
								if (filter === 'rising') {
									return b.data.score - a.data.score;
								}

								return 0;
							})
							.map((post) => post.data);

						dispatch({ type: 'FETCH_SUCCESS', payload });
					}
				})
				.catch((error) => {
					if (mounted.current) {
						dispatch({ type: 'FETCH_FAILURE', payload: error });
					}
				});
		},
		[ subreddit, filter, pauseRefresh ]
	);

	// Convience state to check if we are still mounted
	useEffect(() => () => (mounted.current = false), []);
	useEffect(fetchData, [ fetchData ]);
	useInterval(fetchData, refreshTiming);
	useEventListener('visibilitychange', () => {
		setRefreshTiming(document.visibilityState === 'hidden' ? LONG_TIMER : SHORT_TIMER);
	});

	return { ...state, setFilter, filter, setPauseRefresh };
};

export default useSubreddit;
