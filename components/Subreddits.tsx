import React, { memo } from 'react';
import { Theme, Grid, createStyles, makeStyles } from '@material-ui/core';

import Subreddit from '../components/Subreddit';
import { Deck } from '../hooks/useDecks';

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

function Subreddits({
  activeDeck,
  removeSubreddit,
  usingApollo
}: {
  activeDeck: Deck;
  removeSubreddit: (subreddit: string) => void;
  usingApollo: boolean;
}) {
  const classes = useStyles();

  return (
    <Grid container className={classes.grid} wrap="nowrap">
      {activeDeck.subredditIds.map((subredditId: string) => (
        <Grid item key={subredditId + activeDeck.id} className={classes.gridItem}>
          <Subreddit
            removeSubreddit={removeSubreddit}
            subreddit={subredditId}
            deckId={activeDeck.id}
            usingApollo={usingApollo}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default memo(Subreddits);
