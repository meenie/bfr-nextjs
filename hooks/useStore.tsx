import React, { ReactNode } from 'react';
import { onSnapshot } from 'mobx-state-tree';
// @ts-ignore
import makeInspectable from 'mobx-devtools-mst';
// @ts-ignore
import cloneDeep from 'lodash.clonedeep';

import Store, { IStore } from '../models/Store';

const storeContext = React.createContext<IStore | null>(null);

let initialState = {
  currentDeck: 'default',
  usingApollo: false,
  decks: [
    {
      id: 'default',
      name: 'Default',
      subreddits: [
        {
          id: 'all',
          postIds: [],
          posts: {},
          deck: 'default',
          filter: 'hot'
        },
        {
          id: 'politics',
          postIds: [],
          posts: {},
          deck: 'default',
          filter: 'rising'
        }
      ]
    },
    {
      id: 'aww',
      name: 'Aww',
      subreddits: [
        {
          id: 'aww',
          postIds: [],
          posts: {},
          deck: 'aww',
          filter: 'hot'
        },
        {
          id: 'puppies',
          postIds: [],
          posts: {},
          deck: 'aww',
          filter: 'hot'
        }
      ]
    }
  ]
};

if (process.browser && localStorage.getItem('bfr-store')) {
  const localBFRStore = localStorage.getItem('bfr-store');
  if (localBFRStore) {
    initialState = JSON.parse(localBFRStore);
  }
}

const store = Store.create(initialState);
makeInspectable(store);
onSnapshot(store, (snapshot) => {
  snapshot = cloneDeep(snapshot);
  snapshot.decks = snapshot.decks.map((deck) => {
    deck.subreddits = deck.subreddits.map((subreddit) => {
      subreddit.posts = {};
      subreddit.postIds = [];

      return subreddit;
    });

    return deck;
  });
  localStorage.setItem('bfr-store', JSON.stringify(snapshot));
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('You have forgot to use StoreProvider, shame on you.');
  }
  return store;
};
