import React, { Fragment, memo, useEffect } from 'react';
import { CardMedia, makeStyles, createStyles } from '@material-ui/core';
import ReactPlayer from 'react-player';
// @ts-ignore
import GifPlayer from '@mayankmohit/react-gif-player';

import { RedditPost } from '../types/RedditPost';

const useStyles = makeStyles(() =>
  createStyles({
    media: {
      maxHeight: '371.25px',
      maxWidth: '660px',
      display: 'block',
      margin: '0 auto',
      objectFit: 'contain'
    }
  })
);

function RedditMedia({
  post,
  onMediaStart,
  onMediaStop,
  onLoad
}: {
  post: RedditPost;
  onMediaStart: any;
  onMediaStop: any;
  onLoad: any;
}) {
  const classes = useStyles();
  const toggleGif = (playing: boolean) => {
    if (playing) {
      onMediaStart();
    } else {
      onMediaStop();
    }
  };

  useEffect(
    () => {
      if (!post.medium || (post.medium === 'image' && !post.image)) {
        onLoad();
      }
    },
    [ post.medium, post.image, onLoad ]
  );

  return (
    <Fragment>
      {post.medium === 'image' &&
      post.image && (
        <CardMedia
          component="img"
          alt={post.title}
          className={classes.media}
          image={post.image}
          title={post.title}
          onLoad={onLoad}
        />
      )}

      {post.medium === 'gif' &&
      post.url && <GifPlayer gif={post.url} still={post.image} onTogglePlay={toggleGif} onLoad={onLoad} />}

      {post.medium === 'video' &&
      post.videoUrl && (
        <ReactPlayer
          width={'100%'}
          url={post.videoUrl}
          controls={true}
          playing
          light={post.useCustomImg && post.image ? post.image : true}
          loop
          onReady={onLoad}
          onStart={onMediaStart}
          onPause={onMediaStop}
          onPlay={onMediaStart}
          onEnded={onMediaStop}
        />
      )}
    </Fragment>
  );
}

export default memo(RedditMedia);
