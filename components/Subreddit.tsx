import React from 'react';
import { Box, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
// @ts-ignore

import SubredditControls from './SubredditControls';
import SubredditPosts from './SubredditPosts';
import { ISubreddit } from '../models/Subreddit';
import { observer } from 'mobx-react-lite';

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

function Subreddit({ subreddit }: { subreddit: ISubreddit }) {
  const classes = useStyles();

  return (
    <Box className={classes.subredditWrapper}>
      <Box className={classes.subredditControls}>
        <Typography variant="h5" className={classes.subredditTitle} title={'r/' + subreddit.id}>
          r/{subreddit.id}
        </Typography>
        <Box flexGrow={1} />
        <SubredditControls subreddit={subreddit} />
      </Box>
      <SubredditPosts subreddit={subreddit} />
    </Box>
  );
}

export default observer(Subreddit);
