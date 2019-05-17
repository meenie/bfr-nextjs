import { useReducer, useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
import { stat } from 'fs';

export interface Deck {
  id: string;
  name: string;
  subredditIds: string[];
}

export interface State {
  currentDeckId: string;
  deckIds: string[];
  decks: {
    [id: string]: Deck;
  }
}

type Actions =
  | { type: 'ADD_DECK', payload: Deck }
  | { type: 'REMOVE_DECK', payload: string }
  | { type: 'SET_CURRENT_DECK', payload: string }
  | { type: 'ADD_SUBREDDIT', payload: string }
  | { type: 'REMOVE_SUBREDDIT', payload: string }
  | { type: 'SET_STATE', payload: State }

const useStateLocalStorage = createPersistedState('bfr-decks');

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'ADD_DECK':
      // Can't add a deck with the same id;
      if (state.deckIds.find(id => id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        deckIds: state.deckIds.concat([action.payload.id]),
        decks: {...state.decks, [action.payload.id]: action.payload }
      }
    case 'REMOVE_DECK':
      // Not allowed to delete the last deck in the list.
      if (state.deckIds.length === 1 && action.payload === state.deckIds[0]) {
        return state;
      }
      let newState = { ...state };
      delete newState.decks[action.payload];
      newState.deckIds  = newState.deckIds.filter(id => id !== action.payload);
      // If the deck you are deleting is the one that is active,
      // set the current deck to the first one in the list.
      if (action.payload === newState.currentDeckId) {
        newState.currentDeckId = newState.deckIds[0];
      }
      return newState;
    case 'SET_CURRENT_DECK':
      return { ...state, currentDeckId: action.payload }
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
}

const useDecks = (initialState: State) => {
  const [localStorageState, setLocalStorageState] = useStateLocalStorage(initialState)
  const [state, dispatcher] = useReducer(reducer, localStorageState);
  const activeDeck = state.decks[state.currentDeckId];
  const addDeck = (payload: Deck) => {
    dispatcher({type: 'ADD_DECK', payload});
  };
  const removeDeck = (payload: string) => {
    dispatcher({type: 'REMOVE_DECK', payload});
  };
  const activateDeck = (deckId: string) => {
    dispatcher({type: 'SET_CURRENT_DECK', payload: deckId})
  }

  // Any change to the state, set it to local storage
  useEffect(() => {
    setLocalStorageState(state)
  }, [state]);

  // Any change from local storage, set it to the state
  useEffect(() => {
    dispatcher({type: 'SET_STATE', payload: localStorageState})
  }, [localStorageState])

  return { ...state, activeDeck, addDeck, removeDeck, activateDeck };
}

export default useDecks;
