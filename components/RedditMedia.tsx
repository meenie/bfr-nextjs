import { Fragment } from 'react';
import { CardMedia, Theme } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { makeStyles, createStyles } from '@material-ui/styles';
import GifPlayer from '@mayankmohit/react-gif-player';

import { RedditPost } from '../types/RedditPost';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		media: {
			maxHeight: '371.25px',
			maxWidth: '660px',
			display: 'block',
			margin: '0 auto',
			width: 'auto',
			objectFit: 'contain'
		}
	})
);

export default function RedditMedia({
	post,
	onMediaStart,
	onMediaStop
}: {
	post: RedditPost;
	onMediaStart: any;
	onMediaStop: any;
}) {
	const classes = useStyles({ image: post.image });
	const toggleGif = (playing) => {
		if (playing) {
			onMediaStart();
		} else {
			onMediaStop();
		}
	};

	return (
		<Fragment>
			{post.medium == 'image' &&
			post.image && (
				<CardMedia
					component="img"
					alt={post.title}
					className={classes.media}
					image={post.image}
					title={post.title}
				/>
			)}

			{post.medium == 'gif' &&
			post.url && <GifPlayer gif={post.url} still={post.image} onTogglePlay={toggleGif} />}

			{post.medium == 'video' &&
			post.videoUrl && (
				<ReactPlayer
					width={660}
					height={371}
					url={post.videoUrl}
					controls={true}
					playing
					light={post.useCustomImg ? post.image : true}
					loop
					onStart={onMediaStart}
					onPause={onMediaStop}
					onPlay={onMediaStart}
					onEnded={onMediaStop}
				/>
			)}
		</Fragment>
	);
}
