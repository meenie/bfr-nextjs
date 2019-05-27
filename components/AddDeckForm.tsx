import { useState, Fragment } from 'react';
import uuid from 'uuidv4';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Fab,
  makeStyles,
  Theme,
  createStyles,
  Zoom
} from '@material-ui/core';

import { Add } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openAddForm: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  })
);

export default function AddDeck({ addDeck, activateDeck }) {
  const [ addFormOpen, setAddFormOpen ] = useState(false);
  const [ deckName, setDeckName ] = useState('');
  const [ deckSubreddits, setDeckSubreddits ] = useState('');
  const classes = useStyles();

  const handleCloseAddForm = () => {
    setAddFormOpen(false);
  };

  const handleAddDeck = () => {
    const id = uuid();
    addDeck({
      id,
      name: deckName,
      subredditIds: deckSubreddits.split(',').map((s) => s.trim())
    });

    handleCloseAddForm();
    activateDeck(id);
    setDeckName('');
    setDeckSubreddits('');
  };

  return (
    <Fragment>
      <Zoom in={!addFormOpen}>
        <Fab className={classes.openAddForm} color="primary" onClick={() => setAddFormOpen(true)}>
          <Add />
        </Fab>
      </Zoom>

      <Dialog open={addFormOpen} onClose={handleCloseAddForm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new deck enter in a name and comma delimited list of Subreddits that you'd like to see. You can
            also combine Subreddits by using the "+" notation. For example: nba+warriors, baseball+SFGiants
          </DialogContentText>
          <TextField
            autoFocus
            onChange={(event) => setDeckName(event.target.value)}
            value={deckName}
            margin="dense"
            label="Deck Name"
            fullWidth
          />
          <TextField
            onChange={(event) => setDeckSubreddits(event.target.value)}
            value={deckSubreddits}
            margin="dense"
            label="Subreddits (Comma seperated list. i.e. funny, gifs, videos, tihi)"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddDeck} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
