import {
  types,
  Instance,
  getParent,
  flow,
  cast,
  applySnapshot
} from 'mobx-state-tree';
import axios, { AxiosResponse } from 'axios';

import Post from './Post';
import Deck from './Deck';
import { RawSubreddit } from '../types/RawSubreddit';
import { normalizeRedditPosts } from '../utils/reddit_helper';

const Subreddit = types
  .model('Subreddit', {
    id: types.identifier,
    deck: types.reference(types.late(() => Deck)),
    posts: types.optional(types.map(Post), {}),
    postIds: types.optional(types.array(types.string), []),
    filter: types.optional(
      types.enumeration([ 'hot', 'top', 'rising', 'new', 'controversial' ]),
      'hot'
    ),
    isCompact: types.optional(types.boolean, false),
    isLoading: types.optional(types.boolean, false),
    isPaused: types.optional(types.boolean, false),
    isTempPaused: types.optional(types.boolean, false)
  })
  .actions((self) => {
    return {
      remove() {
        const parent: any = getParent(self);
        if (parent) {
          parent.removeSubreddit(self);
        }
      },
      setIsCompact(v: boolean) {
        self.isCompact = v;
      },
      setIsLoading(v: boolean) {
        self.isLoading = v;
      },
      setIsPaused(v: boolean) {
        self.isPaused = v;
      },
      setIsTempPaused(v: boolean) {
        self.isTempPaused = v;
      },
      setFilter(v: 'hot' | 'top' | 'rising' | 'new' | 'controversial') {
        self.filter = v;
        this.fetchPosts();
      },
      resetPosts() {
        applySnapshot(self.postIds, []);
        applySnapshot(self.posts, {});
      },
      fetchPosts: flow(function*(
        after: string = '',
        showLoading: boolean = true,
        resetPosts: boolean = true
      ) {
        const url = `https://www.reddit.com/r/${self.id}/${self.filter}.json`;

        if (!resetPosts && self.isLoading) {
          return;
        }

        try {
          self.isLoading = showLoading;
          const result: AxiosResponse<RawSubreddit> = yield axios(
            url + (after ? `?after=${after}` : '')
          );
          const newPosts = normalizeRedditPosts(
            result.data.data.children.map((post) => post.data)
          ).map((post) => Object.assign(post, { subreddit: self.id }));
          if (resetPosts) {
            applySnapshot(self.postIds, newPosts.map((post) => post.id));
            applySnapshot(
              self.posts,
              newPosts.reduce(
                (memo, post) => {
                  memo[post.id] = post;
                  return memo;
                },
                {} as { [id: string]: any }
              )
            );
          } else {
            const newPostIds = newPosts
              .map((post) => post.id)
              .filter((id) => self.postIds.indexOf(id) === -1);

            self.postIds = cast(self.postIds.concat(newPostIds));

            newPosts.forEach((post) => {
              self.posts.set(post.id, post);
            });
          }

          self.isLoading = false;
        } catch (e) {
          console.error(e);
        }
      })
    };
  });

export default Subreddit;
export interface ISubreddit extends Instance<typeof Subreddit> {}
