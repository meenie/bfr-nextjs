import React from 'react';
import {
  Box,
  CircularProgress,
  createStyles,
  FormControl,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Typography,
} from '@material-ui/core';

import useSubreddit from '../hooks/useSubreddit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      marginTop: theme.spacing(20),
      marginLeft: 'auto',
      marginRight: 'auto'
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
    filterSelector: {
      minWidth: 120,
      margin: theme.spacing(0.5, 3, 0, 3)
    },
    subredditWrapper: {
      height: '100%'
    },
    subredditHeader: {
      display: 'flex',
    },
    subredditTitle: {
      marginLeft: theme.spacing(3)
    }
  })
);

export default function Subreddit({subreddit, deckId}) {
  const { posts, isLoading, setFilter, filter } = useSubreddit(subreddit, deckId);
  const classes = useStyles();

  return (
    <Box className={classes.subredditWrapper}>
      <Box display="flex">
        <Typography variant="h4" className={classes.subredditTitle}>/r/{subreddit}</Typography>
        <FormControl className={classes.filterSelector}>
          <Select
            onChange={(e: any) => setFilter(e.target.value)}
            value={filter}>
            <MenuItem value={'new'}>New</MenuItem>
            <MenuItem value={'rising'}>Rising</MenuItem>
            <MenuItem value={'top'}>Top</MenuItem>
            <MenuItem value={'hot'}>Hot</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className={classes.postsWrapper}>
        <Box className={classes.postsContainer}>
          {isLoading && <CircularProgress className={classes.progress} /> }
          {!isLoading && posts.map((post: any) => (
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
