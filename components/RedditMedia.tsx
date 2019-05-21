import { Fragment, useState } from "react";
import { CardMedia, Theme } from "@material-ui/core";
import ReactPlayer from "react-player";
import { makeStyles, createStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		media: {
			height: '371.25px'
    },
    gifPreviewContainer: ({image}) => {
      return {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${image})`
      }
    },
    gifPlayContainerContainer: {
      width: '660px',
      height: '371px'
    },
    gifPlayContainer: {
      background: 'radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)',
      borderRadius: '64px',
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    gifPlayIcon: {
      borderStyle: 'solid',
      borderWidth: '16px 0px 16px 26px',
      borderColor: 'transparent transparent transparent white',
      marginLeft: '7px'
    }
	})
);

const IMGUR_REGEX = /imgur\.com\/(.*?)\.gifv?/;
const GFYCAT_REGEX = /^http(?:s?):\/\/thumbs.gfycat.com\/(.*?)-size_restricted.gif$/;

const extractVideoUrl = (post: any) => {
	if (post.media && post.media.reddit_video) {
		return [post.media.reddit_video.is_gif, `https://cors-anywhere.herokuapp.com/${post.media.reddit_video.dash_url}`];
	} else if (post.media && post.media.type) {
		switch (post.media.type) {
			case 'streamable.com':
			case 'vimeo.com': {
				return [false, post.url];
			}
			case 'gfycat.com': {
				const matches: RegExpMatchArray = post.media.oembed.thumbnail_url.match(GFYCAT_REGEX);
				if (matches) {
					return [true, `https://giant.gfycat.com/${matches[1]}.webm`];
				}
			}
			default:
				const matches = post.media.oembed.html
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&amp;/g, '&')
					.match(/src="(.*?)"/);
				return matches ? [false, matches[1]] : [false, null];
		}
	} else {
    const matches: RegExpMatchArray = post.url.match(IMGUR_REGEX);
    if (matches) {
      return [true, `https://i.imgur.com/${matches[1]}.mp4`];
    }

		return [false, null];
	}
};

const determineMedium = (post: any) => {
  if (post.media) {
    return 'video';
  }

  if (post.url.match(IMGUR_REGEX)) {
    return 'video';
  }

  if (post.url.match(/\.gif$/)) {
    return 'gif';
  }

  return 'image';
}

export default function RedditMedia({post, onVideoStart, onVideoStop}) {
  const medium = determineMedium(post);
  const [useCustomImg, videoUrl] = extractVideoUrl(post);
  const classes = useStyles({image: post.image});
  const [showGif, setShowGif] = useState(false);

  return (
    <Fragment>
      {(medium == 'image') && post.image && <CardMedia
        component='img'
        alt={post.title}
        className={classes.media}
        image={post.image}
        title={post.title}
      />}

      {!showGif &&
        medium == 'gif' &&
        post.url &&
        <div className={classes.gifPlayContainerContainer}>
          <div className={classes.gifPreviewContainer} onClick={() => setShowGif(true)}>
            <div className={classes.gifPlayContainer}>
              <div className={classes.gifPlayIcon}></div>
            </div>
          </div>
        </div>}

      {showGif && (medium == 'gif') && post.url && <CardMedia
        component='img'
        alt={post.title}
        className={classes.media}
        image={post.url}
        title={post.title}
        onClick={() => setShowGif(false)}
      />}

      {medium == 'video' && videoUrl && <ReactPlayer
        width={660}
        height={371}
        url={videoUrl}
        controls={true}
        playing
        light={useCustomImg ? post.image : true}
        loop
        onStart={onVideoStart}
        onPause={onVideoStop}
        onPlay={onVideoStart}
        onEnded={onVideoStop}
      />}
    </Fragment>
  )
}
