import React, { memo } from 'react';
import { Box, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
// @ts-ignore
import createPersistedState from 'use-persisted-state';

import useSubreddit from '../hooks/useSubreddit';
import SubredditControls from './SubredditControls';
import SubredditPosts from './SubredditPosts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

function Subreddit({
  subreddit,
  deckId,
  removeSubreddit,
  usingApollo
}: {
  subreddit: any;
  deckId: string;
  removeSubreddit: any;
  usingApollo: boolean;
}) {
  const classes = useStyles();
  const {
    posts,
    postIds,
    isLoading,
    setFilter,
    filter,
    setIsPaused,
    pauseOverride,
    setPauseOverride,
    setAfter
  } = useSubreddit(subreddit, deckId);
  const [ isCompact, setIsCompact ] = createPersistedState(`${deckId}-${subreddit}-is-compact`)(false);

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
      <SubredditPosts
        usingApollo={usingApollo}
        posts={posts}
        postIds={postIds}
        isLoading={isLoading}
        setIsPaused={setIsPaused}
        setAfter={setAfter}
        isCompact={isCompact}
      />
    </Box>
  );
}

export default memo(Subreddit);
