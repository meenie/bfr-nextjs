
import { NoSsr } from '@material-ui/core';

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

  return (
    <NoSsr>
      <TopBar
        activateDeck={activateDeck}
        decks={decks}
        deckIds={deckIds}
        activeDeck={activeDeck}
        addDeck={addDeck}
      />
      <Subreddits activeDeck={activeDeck} />
    </NoSsr>
  );
}
