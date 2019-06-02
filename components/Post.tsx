import React, { Fragment } from 'react';
import { Typography, Theme, Card, CardContent, CardActions, Button, CardHeader, Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { ArrowUpward, Chat, AccessTime } from '@material-ui/icons';
// @ts-ignore
import TimeAgo from 'react-timeago';
import NumberFormat from 'react-number-format';
// @ts-ignore
import abbreviate from 'number-abbreviate';
import { observer } from 'mobx-react-lite';

import RedditMedia from './RedditMedia';
import SelfTextHtml from './SelfTextHtml';
import { useStore } from '../hooks/useStore';
import { IPost } from '../models/Post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(1.5)
    },
    headerText: {
      marginBottom: theme.spacing(2)
    },
    header: ({ isCompact }: { isCompact: boolean }) => {
      return {
        flexDirection: isCompact ? 'row-reverse' : 'inherit',
        alignItems: 'flex-start'
      };
    },
    bottomIcons: {
      verticalAlign: 'bottom',
      marginRight: theme.spacing(0.5)
    },
    bottomText: {
      marginRight: theme.spacing(1.25)
    },
    award: {
      whiteSpace: 'nowrap',
      marginLeft: theme.spacing(1),
      '& img': {
        verticalAlign: 'text-bottom'
      },
      '& span': {
        marginLeft: theme.spacing(0.3)
      }
    },
    thumbnail: {
      width: '100px',
      height: '55px',
      borderRadius: '.25rem',
      objectFit: 'cover'
    },
    compactHeader: {
      flexDirection: 'row-reverse'
    },
    commentsLink: {
      textDecoration: 'none',
      color: theme.palette.text.secondary,
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    postAttributes: ({ isCompact }) => {
      if (isCompact) {
        return {
          paddingTop: 0
        };
      } else {
        return {};
      }
    }
  })
);

function Post({ post, onLoad, onResize }: { post: IPost; onLoad: any; onResize: any }) {
  const classes = useStyles({ isCompact: post.subreddit.isCompact });
  const store = useStore();

  const onMediaStart = () => {
    post.subreddit.setIsTempPaused(true);
  };

  const onMediaStop = () => {
    post.subreddit.setIsTempPaused(true);
  };

  const protocol = store.usingApollo ? 'apollo://' : 'https://';

  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <Fragment>
            <span title={`Score: ${post.score}`}>{abbreviate(post.score, 2)}</span>&nbsp;&mdash;&nbsp;
            <a href={post.url} rel="noopener noreferrer" target="_blank">
              {post.title}
            </a>
          </Fragment>
        }
        subheader={
          <Fragment>
            <span>Posted by: </span>
            <a href={`${protocol}reddit.com/u/${post.author}`} rel="noopener noreferrer" target="_blank">
              {post.author}
            </a>
            <span> to </span>
            <a href={`${protocol}reddit.com/r/${post.subreddit_source}`} rel="noopener noreferrer" target="_blank">
              r/{post.subreddit_source}
            </a>
            {post.awards.map((award) => {
              return (
                <Box key={award.id} className={classes.award} component="span">
                  <img src={award.imageUrl} width={16} height={16} alt={award.name} title={award.name} />
                  <span>{award.count}</span>
                </Box>
              );
            })}
          </Fragment>
        }
        subheaderTypographyProps={{
          variant: 'body2'
        }}
        classes={{
          root: classes.header,
          title: classes.headerText
        }}
        avatar={
          post.subreddit.isCompact &&
          (post.thumbnail ? (
            <a href={post.url} rel="noopener noreferrer" target="_blank">
              <img
                alt={post.title}
                title={post.title}
                className={classes.thumbnail}
                src={post.thumbnail}
                width={40}
                onLoad={onLoad}
              />
            </a>
          ) : (
            <span>&nbsp;</span>
          ))
        }
      />

      {!post.subreddit.isCompact && (
        <CardContent>
          <RedditMedia post={post} onMediaStart={onMediaStart} onMediaStop={onMediaStop} onLoad={onLoad} />
        </CardContent>
      )}

      {!post.subreddit.isCompact && (
        <CardContent>
          <SelfTextHtml selfTextHtml={post.selftextHtml} onResize={onResize} />
        </CardContent>
      )}

      <CardContent className={classes.postAttributes}>
        <Typography variant="body2" color="textSecondary" component="p">
          <ArrowUpward fontSize="small" className={classes.bottomIcons} />
          <NumberFormat
            className={classes.bottomText}
            displayType={'text'}
            thousandSeparator={true}
            value={post.score}
          />
          <a
            href={protocol + post.commentsUrl}
            className={classes.commentsLink}
            title="Reddit Comments"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Chat fontSize="small" className={classes.bottomIcons} />
            <NumberFormat
              className={classes.bottomText}
              displayType={'text'}
              thousandSeparator={true}
              value={post.numComments}
            />
          </a>
          <AccessTime fontSize="small" className={classes.bottomIcons} />
          <TimeAgo fontSize="small" date={post.created} />
        </Typography>
      </CardContent>

      {!post.subreddit.isCompact && (
        <CardActions>
          <Button size="small" href={post.url} rel="noopener noreferrer" target="_blank">
            View Link
          </Button>
          <Button size="small" href={protocol + post.commentsUrl} rel="noopener noreferrer" target="_blank">
            View Comments
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default observer(Post);
