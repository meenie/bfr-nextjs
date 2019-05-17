
import { useState, useEffect } from 'react';import Grid from '@material-ui/core/Grid';

import Subreddit from '../components/Subreddit';
import useDecks, { State as DecksState, Deck } from '../hooks/useDecks';

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

const newDeckData: Deck = {
  id: 'foo',
  name: 'Test Foo',
  subredditIds: ['warriors', 'nba'],
};

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
    <div className="App">
      <header className="App-header">
        <button onClick={() => addDeck(newDeckData)}>Add</button>
        <button onClick={() => removeDeck('foo')}>Remove</button>
        {deckIds.map((deckId: string) => (
          <button key={deckId} onClick={() => activateDeck(deckId)}>{decks[deckId].name}</button>
        ))}
        <Grid
          container
          direction="row"
          alignItems="stretch"
        >
          {activeDeck.subredditIds.map((subredditId: string) => (
            <Grid
              item
              xs={12}
              md={6}
              key={subredditId}>
                <Subreddit subreddit={subredditId} />
            </Grid>
          ))}
        </Grid>
      </header>
    </div>
  );
}
