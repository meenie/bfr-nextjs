import { memo } from 'react';
import { Box, CircularProgress, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import createPersistedState from 'use-persisted-state';

import useSubreddit from '../hooks/useSubreddit';
import Post from './Post';
import SubredditControls from './SubredditControls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'block',
      marginTop: theme.spacing(20),
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    postsWrapper: {
      height: '100%',
      overflowY: 'scroll',
      '-webkit-overflow-scrolling': 'touch'
    },
    subredditWrapper: {
      height: '100%'
    },
    subredditControls: {
      display: 'flex',
      marginBottom: theme.spacing(1)
    },
    subredditTitle: {
      marginLeft: theme.spacing(2),
      minWidth: '150px',
      lineHeight: '38px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  })
);

function Subreddit({ subreddit, deckId, removeSubreddit }) {
  const classes = useStyles();
  const { posts, isLoading, setFilter, filter, setIsPaused, pauseOverride, setPauseOverride } = useSubreddit(
    subreddit,
    deckId
  );
  const [ isCompact, setIsCompact ] = createPersistedState(`${deckId}-${subreddit}-is-compact`)(false);

  console.log('hmmmm');
  return (
    <Box className={classes.subredditWrapper}>
      <Box className={classes.subredditControls}>
        <Typography variant="h5" className={classes.subredditTitle} title={'r/' + subreddit}>
          r/{subreddit}
        </Typography>
        <Box flexGrow={1} />
        <SubredditControls
          subreddit={subreddit}
          deckId={deckId}
          removeSubreddit={removeSubreddit}
          setPauseOverride={setPauseOverride}
          pauseOverride={pauseOverride}
          isCompact={isCompact}
          setIsCompact={setIsCompact}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>
      <Box className={classes.postsWrapper}>
        {isLoading && <CircularProgress className={classes.progress} />}
        {!isLoading &&
          posts.map((post) => <Post key={post.id} post={post} setIsPaused={setIsPaused} isCompact={isCompact} />)}
      </Box>
    </Box>
  );
}

export default memo(Subreddit);
