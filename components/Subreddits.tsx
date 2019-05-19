import React from 'react';
import { makeStyles, Theme, createStyles, Grid } from '@material-ui/core';

import Subreddit from '../components/Subreddit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: 'flex',
      height: '100%',
      marginTop: theme.spacing(10)
    },
    gridItemLessThanThree: {
      flex: '0 0 50%'
    },
    gridItem: {
      flex: '0 0 45%',
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
  const subredditCount = activeDeck.subredditIds.length;

  return(
    <Grid
      container
      className={classes.grid}
      wrap="nowrap">
      {activeDeck.subredditIds.map((subredditId: string) => (
        <Grid
          item
          className={
            subredditCount < 3 ? classes.gridItemLessThanThree : classes.gridItem
          }
          key={subredditId + activeDeck.id}>
            <Subreddit subreddit={subredditId} deckId={activeDeck.id} />
        </Grid>
      ))}
    </Grid>
  )
}
