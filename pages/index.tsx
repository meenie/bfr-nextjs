
import { useState, useEffect, Fragment } from 'react';

import useDecks, { State as DecksState } from '../hooks/useDecks';

import TopBar from '../components/TopBar';
import Subreddits from '../components/Subreddits';

const initialState: DecksState = {
  currentDeckId: 'default',
  deckIds: ['default'],
  decks: {
    default: {
      id: 'default',
      name: 'Default',
      subredditIds: ['all', 'politics'],
    }
  }
}



export default function App() {
  const {
    activeDeck,
    decks,
    deckIds,
    addDeck,
    removeDeck,
    activateDeck
  } = useDecks(initialState);

  const [isBrowser, setIsBrowser] = useState(false);

  // useEffect() ties into componentDidMount which doesn't run on the server side.
  useEffect(() => {
    setIsBrowser(true);
  });
  // Disable SSR because we are relying on LocalStorage :-/
  if (! isBrowser) {
    return null;
  }

  return (
    <Fragment>
      <TopBar
        activateDeck={activateDeck}
        decks={decks}
        deckIds={deckIds}
        activeDeck={activeDeck}
        addDeck={addDeck}
      />
      <Subreddits activeDeck={activeDeck} />
    </Fragment>
  );
}
