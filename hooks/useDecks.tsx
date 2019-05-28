import { useReducer, useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
import { produce } from 'immer';

export interface Deck {
  id: string;
  name: string;
  subredditIds: string[];
}

export interface State {
  currentDeckId: string;
  usingApollo: boolean;
  deckIds: string[];
  decks: {
    [id: string]: Deck;
  };
}

type Actions =
  | { type: 'ADD_DECK'; payload: Deck }
  | { type: 'REMOVE_DECK'; payload: string }
  | { type: 'SET_CURRENT_DECK'; payload: string }
  | { type: 'SET_USING_APOLLO'; payload: boolean }
  | { type: 'ADD_SUBREDDIT'; payload: string }
  | { type: 'REMOVE_SUBREDDIT'; payload: { deckId: string; subreddit: string } }
  | { type: 'SET_STATE'; payload: State };

const useStateLocalStorage = createPersistedState('bfr-decks');

const reducer = produce((state: State, action: Actions) => {
  switch (action.type) {
    case 'ADD_DECK':
      // Can't add a deck with the same id;
      if (state.deckIds.find((id) => id === action.payload.id)) {
        return state;
      }

      state.deckIds.push(action.payload.id);
      state.decks[action.payload.id] = action.payload;

      return state;
    case 'REMOVE_DECK':
      // Not allowed to delete the last deck in the list.
      if (state.deckIds.length === 1 && action.payload === state.deckIds[0]) {
        return state;
      }

      delete state.decks[action.payload];
      state.deckIds = state.deckIds.filter((id) => id !== action.payload);

      if (action.payload === state.currentDeckId) {
        state.currentDeckId = state.deckIds[0];
      }

      return state;
    case 'SET_CURRENT_DECK':
      state.currentDeckId = action.payload;

      return state;
    case 'SET_USING_APOLLO':
      state.usingApollo = action.payload;

      return state;
    case 'SET_STATE':
      return action.payload;
    case 'REMOVE_SUBREDDIT':
      const deck = state.decks[action.payload.deckId];
      deck.subredditIds = deck.subredditIds.filter((id) => id !== action.payload.subreddit);
      state.decks[action.payload.deckId] = deck;

      return state;
  }
});

const useDecks = (initialState: State) => {
  const [ localStorageState, setLocalStorageState ] = useStateLocalStorage(initialState);
  const [ state, dispatcher ] = useReducer(reducer, localStorageState);
  const activeDeck = state.decks[state.currentDeckId];
  const addDeck = (payload: Deck) => {
    dispatcher({ type: 'ADD_DECK', payload });
  };
  const removeDeck = (payload: string) => {
    dispatcher({ type: 'REMOVE_DECK', payload });
  };
  const activateDeck = (deckId: string) => {
    dispatcher({ type: 'SET_CURRENT_DECK', payload: deckId });
  };
  const removeSubreddit = (payload: { deckId: string; subreddit: string }) => {
    dispatcher({ type: 'REMOVE_SUBREDDIT', payload });
  };
  const setUsingApollo = (payload: boolean) => {
    dispatcher({ type: 'SET_USING_APOLLO', payload });
  };

  // Any change to the state, set it to local storage
  useEffect(
    () => {
      setLocalStorageState(state);
    },
    [ state ]
  );

  // Any change from local storage, set it to the state
  useEffect(
    () => {
      dispatcher({ type: 'SET_STATE', payload: localStorageState });
    },
    [ localStorageState ]
  );

  return { ...state, activeDeck, addDeck, removeDeck, removeSubreddit, activateDeck, setUsingApollo };
};

export default useDecks;
