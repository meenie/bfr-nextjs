import { types, Instance, destroy } from 'mobx-state-tree';

import Deck, { IDeck } from './Deck';

const Store = types
  .model('Store', {
    currentDeck: types.reference(Deck),
    usingApollo: types.boolean,
    decks: types.array(Deck)
  })
  .actions((self) => ({
    setUsingApollo(v: boolean) {
      self.usingApollo = v;
    },
    setCurrentDeck(v: IDeck) {
      self.currentDeck = v;
    },
    addDeck(v: any) {
      self.decks.push(v);
    },
    removeDeck(v: IDeck) {
      const nextDeck = self.decks.find((deck) => deck.id !== v.id);
      // Don't delete the last deck
      if (!nextDeck) {
        return;
      }

      this.setCurrentDeck(nextDeck);
      destroy(v);
    }
  }));

export default Store;

export interface IStore extends Instance<typeof Store> {}
