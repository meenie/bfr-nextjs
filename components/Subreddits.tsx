import React from 'react';
import { makeStyles, Theme, createStyles, Grid } from '@material-ui/core';

import Subreddit from '../components/Subreddit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'flex',
      height: '100%',
      marginTop: '67px'
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

export default function Subreddits({activeDeck}) {
  const classes = useStyles();

  return(
    <Grid
      container
      className={classes.grid}
      wrap="nowrap"
    >
      {activeDeck.subredditIds.map((subredditId: string) => (
        <Grid
          item
          className={classes.gridItem}
          key={subredditId + activeDeck.id}>
            <Subreddit subreddit={subredditId} deckId={activeDeck.id} />
        </Grid>
      ))}
    </Grid>
  )
}