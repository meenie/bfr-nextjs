import React, { useEffect, useState, Fragment } from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import useSubreddit from '../hooks/useSubreddit';
import { FormControl, Select, MenuItem, Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(3, 2),
      margin: theme.spacing(1.5),
    },
    postsWrapper: {
      height: '100%',
      overflowY: 'scroll'
    },
    postsContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    formControl: {
      margin: theme.spacing(1, 2, 2),
      minWidth: 120,
    },
    subredditWrapper: {
      height: '100%'
    }
  })
);

export default function Subreddit(props: any) {
  const { posts, isLoading, setFilter, filter } = useSubreddit(props.subreddit);
  const classes = useStyles();

  return (
    <Box className={classes.subredditWrapper}>
      <h1>/r/{props.subreddit}</h1>
      {<FormControl className={classes.formControl}>
        <Select
          onChange={(e: any) => setFilter(e.target.value)}
          value={filter}
        >
          <MenuItem value={'new'}>New</MenuItem>
          <MenuItem value={'rising'}>Rising</MenuItem>
          <MenuItem value={'top'}>Top</MenuItem>
          <MenuItem value={'hot'}>Hot</MenuItem>
        </Select>
      </FormControl>}
      {isLoading && <CircularProgress className={classes.progress} /> }
      <Box className={classes.postsWrapper}>
        <Box className={classes.postsContainer}>
          {posts.map((post: any) => (
            <Paper key={post.id} className={classes.paper}>
              <Typography variant="h6" component="h5">
                <a href={post.url} rel="noopener noreferrer" target="_blank">{post.title}</a>
              </Typography>
              <Typography component="p">
              {post.score}
              &nbsp;&mdash;&nbsp;
              (<a href={post.commentsUrl} rel="noopener noreferrer" target="_blank">{post.numComments} Comments</a>)
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
