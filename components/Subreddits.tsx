import React from 'react';
import { Theme, Grid, createStyles, makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';

import Subreddit from '../components/Subreddit';
import { useStore } from '../hooks/useStore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      height: '100%',
      marginTop: theme.spacing(10)
    },
    gridItem: {
      flex: '0 0 100%',
      [theme.breakpoints.down('sm')]: {
        flex: '0 0 100%'
      },
      [theme.breakpoints.up('md')]: {
        flex: '0 0 45%'
      }
    }
  })
);

function Subreddits() {
  const classes = useStyles();
  const store = useStore();
  return (
    <Grid container className={classes.grid} wrap="nowrap">
      {store.currentDeck.subreddits.map((subreddit) => (
        <Grid item key={subreddit.id + store.currentDeck.id} className={classes.gridItem}>
          <Subreddit subreddit={subreddit} />
        </Grid>
      ))}
    </Grid>
  );
}

export default observer(Subreddits);
