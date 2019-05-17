
import { useState, useEffect, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import uuid from 'uuidv4';

import Subreddit from '../components/Subreddit';
import useDecks, { State as DecksState, Deck } from '../hooks/useDecks';
import { Typography, Tabs, Tab, Divider, TextField, makeStyles, Theme, createStyles, Button, Paper, Box } from '@material-ui/core';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      marginTop: theme.spacing(10)
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    input: {
      color: 'white'
    }
  })
);

export default function App() {
  const {
    activeDeck,
    decks,
    deckIds,
    addDeck,
    removeDeck,
    activateDeck
  } = useDecks(initialState);

  const classes = useStyles();

  const [isBrowser, setIsBrowser] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [subreddits, setSubreddits] = useState('');

  // useEffect() ties into componentDidMount which doesn't run on the server side.
  useEffect(() => {
    setIsBrowser(true);
  });
  // Disable SSR because we are relying on LocalStorage :-/
  if (! isBrowser) {
    return null;
  }

  const add = () => {
    const id = uuid();
    addDeck({
      id,
      name: deckName,
      subredditIds: subreddits.split(',').map(s => s.trim()),
    });

    activateDeck(id);
    setDeckName('');
    setSubreddits('');
  }

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Box>
            <Typography variant="h6">Bang! for Reddit</Typography>
          </Box>
          <Box flexGrow={1}>
            <Tabs value={activeDeck.id} onChange={(event, deckId) => activateDeck(deckId)}>
              {deckIds.map((deckId: string) => (
                <Tab key={deckId} value={deckId} label={decks[deckId].name} />
              ))}
            </Tabs>
          </Box>
          <Box>
            <TextField
              label="Deck Name"
              onChange={(event) => setDeckName(event.target.value)}
              value={deckName}
              className={classes.textField}
              InputLabelProps={{
                className: classes.input
              }}
              InputProps={{
                className: classes.input
              }}
              />
            <TextField
              label="Subreddits"
              onChange={(event) => setSubreddits(event.target.value)}
              value={subreddits}
              className={classes.textField}
              FormHelperTextProps={{
                className: classes.input
              }}
              InputLabelProps={{
                className: classes.input
              }}
              InputProps={{
                className: classes.input
              }}
              />
            <Button variant="contained" color="secondary" onClick={add}>Add</Button>
          </Box>

        </Toolbar>
      </AppBar>
      <Grid
        container
        direction="row"
        alignItems="stretch"
        className={classes.grid}
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
    </Fragment>
  );
}
