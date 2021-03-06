import { types, IAnyModelType, Instance, getParent, destroy } from 'mobx-state-tree';

import Subreddit, { ISubreddit } from './Subreddit';

const Deck = types
  .model('Deck', {
    id: types.identifier,
    name: types.string,
    subreddits: types.array(types.late((): IAnyModelType => Subreddit))
  })
  .actions((self) => ({
    remove() {
      const parent: any = getParent(self, 2);
      if (parent) {
        parent.removeDeck(self);
      }
    },
    removeSubreddit(v: ISubreddit) {
      destroy(v);
    }
  }));

export default Deck;
export interface IDeck extends Instance<typeof Deck> {}
