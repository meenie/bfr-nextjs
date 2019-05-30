import React, { useState, Fragment, memo } from 'react';
// @ts-ignore
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
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Add } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    openAddForm: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 2
    }
  })
);

function AddDeckForm({
  addDeck,
  activateDeck
}: {
  addDeck: ({ id, name, subredditIds }: { id: string; name: string; subredditIds: string[] }) => void;
  activateDeck: (deckId: string) => void;
}) {
  const theme = useTheme();
  const [ addFormOpen, setAddFormOpen ] = useState(false);
  const [ deckName, setDeckName ] = useState('');
  const [ deckSubreddits, setDeckSubreddits ] = useState('');
  const fullScreenAddDeck = useMediaQuery(theme.breakpoints.down('sm'));
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

      <Dialog
        open={addFormOpen}
        onClose={handleCloseAddForm}
        aria-labelledby="form-dialog-title"
        fullScreen={fullScreenAddDeck}
      >
        <DialogTitle id="form-dialog-title">Add Deck</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new deck enter in a name and comma delimited list of Subreddits that you'd like to see. You can
            also combine Subreddits by using the "+" notation. For example: nba+warriors, baseball+SFGiants.
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
            label="Subreddits (i.e. funny, gifs, videos)"
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

export default memo(AddDeckForm);
