import { useState, Fragment } from 'react';
import {
  Typography,
  Theme,
  Card,
  CardContent,
  CardActions,
  Button,
  CardHeader,
  Collapse,
  Box,
  Avatar,
  IconButton
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { ArrowUpward, Chat, AccessTime } from '@material-ui/icons';
import SanitizedHTML from 'react-sanitized-html';
import TimeAgo from 'react-timeago';
import NumberFormat from 'react-number-format';
import abbreviate from 'number-abbreviate';

import RedditMedia from './RedditMedia';
import { RedditPost } from '../types/RedditPost';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(1.5)
    },
    media: {
      paddingTop: '56.25%',
      backgroundPosition: '0% 15%'
    },
    headerText: {
      marginBottom: theme.spacing(2)
    },
    header: ({ isCompact }) => {
      return {
        flexDirection: isCompact ? 'row-reverse' : 'inherit'
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

export default function Post({
  post,
  setIsPaused,
  isCompact
}: {
  post: RedditPost;
  setIsPaused: any;
  isCompact: boolean;
}) {
  const classes = useStyles({ isCompact });
  const [ expanded, setExpanded ] = useState(false);

  const onMediaStart = () => {
    setIsPaused(true);
  };

  const onMediaStop = () => {
    setIsPaused(false);
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
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
            <a href={'https://reddit.com/u/' + post.author} rel="noopener noreferrer" target="_blank">
              {post.author}
            </a>
            <span> to </span>
            <a href={'https://reddit.com/r/' + post.subreddit} rel="noopener noreferrer" target="_blank">
              r/{post.subreddit}
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
          title: classes.headerText
        }}
        avatar={
          isCompact &&
          (post.thumbnail ? (
            <img alt={post.title} title={post.title} className={classes.thumbnail} src={post.thumbnail} width={40} />
          ) : (
            <span>&nbsp;</span>
          ))
        }
      />
      {!isCompact && <RedditMedia post={post} onMediaStart={onMediaStart} onMediaStop={onMediaStop} />}

      {!isCompact &&
      post.selftextHtml && (
        <CardContent>
          <Collapse in={expanded} collapsedHeight={'75px'}>
            <SanitizedHTML html={post.selftextHtml} />
          </Collapse>
          <Button size="small" onClick={() => setExpanded(!expanded)}>
            View {expanded ? 'Less' : 'More'}
          </Button>
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
            href={post.commentsUrl}
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
      {!isCompact && (
        <CardActions>
          <Button size="small" href={post.url} rel="noopener noreferrer" target="_blank">
            View Link
          </Button>
          <Button size="small" href={post.commentsUrl} rel="noopener noreferrer" target="_blank">
            View Comments
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
