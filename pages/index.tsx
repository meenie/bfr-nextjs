import { NoSsr } from '@material-ui/core';

import useDecks, { State as DecksState } from '../hooks/useDecks';
import TopBar from '../components/TopBar';
import Subreddits from '../components/Subreddits';
import AddDeckForm from '../components/AddDeckForm';

const initialState: DecksState = {
  currentDeckId: 'default',
  deckIds: [ 'default' ],
  usingApollo: false,
  decks: {
    default: {
      id: 'default',
      name: 'Default',
      subredditIds: [ 'all', 'politics' ]
    }
  }
};

export default function App() {
  const {
    activeDeck,
    decks,
    deckIds,
    addDeck,
    removeDeck,
    removeSubreddit,
    activateDeck,
    setUsingApollo,
    usingApollo
  } = useDecks(initialState);

  return (
    <NoSsr>
      <TopBar
        activateDeck={activateDeck}
        decks={decks}
        deckIds={deckIds}
        activeDeck={activeDeck}
        setUsingApollo={setUsingApollo}
        usingApollo={usingApollo}
        removeDeck={removeDeck}
      />
      <AddDeckForm addDeck={addDeck} activateDeck={activateDeck} />
      <Subreddits activeDeck={activeDeck} removeSubreddit={removeSubreddit} usingApollo={usingApollo} />
    </NoSsr>
  );
}
