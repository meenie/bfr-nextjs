import { Theme, Grid } from '@material-ui/core';
import { createStyles, makeStyles, CSSProperties } from '@material-ui/styles';

import Subreddit from '../components/Subreddit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      height: '100%',
      marginTop: theme.spacing(10)
    },
    gridItem: {
      flex: '0 0 100%',
      minWidth: '470px',
      [theme.breakpoints.down('sm')]: {
        flex: '0 0 100%'
      },
      [theme.breakpoints.up('md')]: {
        flex: '0 0 45%'
      }
    }
  })
);

export default function Subreddits({ activeDeck, removeSubreddit }) {
  const subredditCount = activeDeck.subredditIds.length;
  const classes = useStyles({ subredditCount });

  return (
    <Grid container className={classes.grid} wrap="nowrap">
      {activeDeck.subredditIds.map((subredditId: string) => (
        <Grid item key={subredditId + activeDeck.id} className={classes.gridItem}>
          <Subreddit removeSubreddit={removeSubreddit} subreddit={subredditId} deckId={activeDeck.id} />
        </Grid>
      ))}
    </Grid>
  );
}
