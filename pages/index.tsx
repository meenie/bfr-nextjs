
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
      display: 'flex',
      height: '100%',
      marginTop: '100px'
    },
    gridItem: {
      flex: '0 0 45%',
      //marginBottom: '350px'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    form: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-evenly'
    },
    paper: {
      padding: theme.spacing(1)
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

  const add = (event) => {
    event.preventDefault();

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
          <Paper className={classes.paper}>
            <form className={classes.form} onSubmit={add}>
              <TextField
                label="Deck Name"
                onChange={(event) => setDeckName(event.target.value)}
                value={deckName}
                className={classes.textField}
                />
              <TextField
                label="Subreddits"
                onChange={(event) => setSubreddits(event.target.value)}
                value={subreddits}
                className={classes.textField}
                />
              <Button variant="contained" type="submit">Add</Button>
            </form>
          </Paper>
        </Toolbar>
      </AppBar>
      <Grid
        container
        className={classes.grid}
        wrap="nowrap"
      >
        {activeDeck.subredditIds.map((subredditId: string) => (
          <Grid
            item
            className={classes.gridItem}
            key={subredditId}>
              <Subreddit subreddit={subredditId} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}
