import { useEffect, useReducer, useState, useCallback, useRef } from 'react';
import useInterval from '@use-it/interval';
import useEventListener from '@use-it/event-listener';
import createPersistedState from 'use-persisted-state';

import axios from 'axios';

interface State {
	posts: any[];
	isLoading: boolean;
}

type Action =
	| { type: 'FETCH_INIT'; payload: boolean }
	| { type: 'FETCH_SUCCESS'; payload: any }
	| { type: 'FETCH_FAILURE'; payload: any };

const REDDIT_URL = 'https://www.reddit.com';
const SHORT_TIMER = 5e3;
const LONG_TIMER = 5 * 60e3;

const extractVideoUrl = (post: any) => {
	if (!post.media) {
		return null;
	}

	if (post.media.reddit_video) {
		return `https://cors-anywhere.herokuapp.com/${post.media.reddit_video.dash_url}`;
	} else if (post.media.type) {
		switch (post.media.type) {
			case 'gfycat.com': {
				const url = post.media.oembed.thumbnail_url.match(
					/^http(?:s?):\/\/thumbs.gfycat.com\/(.*?)-size_restricted.gif$/
				);
				if (url) {
					return `https://giant.gfycat.com/${url[1]}.webm`;
				}
			}
			case 'streamable.com': {
				return post.url;
			}
			case 'imgur.com': {
				return null;
			}
			default:
				const matches = post.media.oembed.html
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&amp;/g, '&')
					.match(/src="(.*?)"/);
				return matches ? matches[1] : null;
		}
	} else {
		return null;
	}
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return { ...state, isLoading: action.payload };
		case 'FETCH_SUCCESS':
			const posts = action.payload
				.filter((post: any) => post.data.subreddit !== 'The_Donald')
				.map((post: any, index: number) => {
					let url = post.data.url;
					if (post.data.media && post.data.media.reddit_video && post.data.media.reddit_video.fallback_url) {
						url = post.data.media.reddit_video.fallback_url;
					}
					return {
						id: post.data.id,
						order: index,
						title: post.data.title,
						url,
						isVideo: post.data.is_video,
						videoUrl: extractVideoUrl(post.data),
						score: post.data.score,
						subreddit: post.data.subreddit,
						author: post.data.author,
						thumbnail: post.data.thumbnail.slice(0, 4) === 'http' ? post.data.thumbnail : '',
						image: post.data.preview ? post.data.preview.images[0].source.url.replace(/&amp;/g, '&') : null,
						created: new Date(post.data.created_utc * 1000),
						commentsUrl: `${REDDIT_URL}${post.data.permalink}`,
						numComments: post.data.num_comments,
						domain: post.data.domain,
						domainUrl:
							post.data.domain.slice(0, 5) === 'self.'
								? `${REDDIT_URL}/r/${post.data.subreddit}`
								: `${REDDIT_URL}/domain/${post.data.domain}`,
						selftext: post.data.selftext,
						selftext_html: !!post.data.selftext_html
							? post.data.selftext_html
									.replace(/&lt;/g, '<')
									.replace(/&gt;/g, '>')
									.replace(/↵/g, '\\n')
									.replace(/&amp;/g, '&')
							: null
					};
				});
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
				.then((result: any) => {
					if (mounted.current) {
						const payload = result.data.data.children.sort((a: any, b: any) => {
							if (filter === 'rising') {
								return b.data.score - a.data.score;
							}

							return 0;
						});

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
