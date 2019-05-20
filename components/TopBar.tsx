import { useState, FormEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import grey from '@material-ui/core/colors/grey';
import {
  Typography,
  Tabs,
  Tab,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Box
} from '@material-ui/core';
import uuid from 'uuidv4';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    input: {
      color: grey[50]
    },
    label: {
      color: `${grey[300]} !important`
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      padding: theme.spacing(0.5),
      margin: theme.spacing(0.5),
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-evenly'
    },
    submitButton: {
      marginTop: theme.spacing(0.75)
    }
  })
);

export default function TopBar({activeDeck, activateDeck, deckIds, decks, addDeck}) {
  const classes = useStyles();
  const [deckName, setDeckName] = useState('');
  const [subreddits, setSubreddits] = useState('');

  const add = (event: FormEvent<HTMLFormElement>) => {
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
    <AppBar position="fixed">
      <Toolbar>
        <Box>
          <Typography noWrap variant="h6">Bang! for Reddit</Typography>
        </Box>
        <Box width="50%">
          <Tabs
            value={activeDeck.id}
            variant="scrollable"
            scrollButtons="on"
            onChange={(event, deckId) => activateDeck(deckId)}
          >
            {deckIds.map((deckId: string) => (
              <Tab key={deckId} value={deckId} label={decks[deckId].name} />
            ))}
          </Tabs>
        </Box>
        <Box flexGrow={1}></Box>
        <Box className={classes.formContainer} borderRadius={5}>
          <form onSubmit={add}>
            <TextField
              label="Deck Name"
              onChange={(event) => setDeckName(event.target.value)}
              value={deckName}
              className={classes.textField}
              InputProps={{
                classes: {
                  input: classes.input
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                }
              }}
            />
            <TextField
              label="Subreddits"
              onChange={(event) => setSubreddits(event.target.value)}
              value={subreddits}
              className={classes.textField}
              InputProps={{
                classes: {
                  input: classes.input
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                }
              }}
            />
            <Button className={classes.submitButton} color="primary" variant="contained" type="submit">Add</Button>
          </form>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
