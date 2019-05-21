import { Fragment, useState } from 'react';
import { CardMedia, Theme } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { makeStyles, createStyles } from '@material-ui/styles';

import { RedditPost } from '../types/RedditPost';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		media: {
			height: '371.25px'
		},
		gifPreviewContainer: ({ image }) => {
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
			};
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
	const [ showGif, setShowGif ] = useState(false);
	const startGif = () => {
		setShowGif(true);
		onMediaStart();
	};

	const stopGif = () => {
		setShowGif(false);
		onMediaStop();
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

			{!showGif &&
			post.medium == 'gif' &&
			post.url && (
				<div className={classes.gifPlayContainerContainer}>
					<div className={classes.gifPreviewContainer} onClick={startGif}>
						<div className={classes.gifPlayContainer}>
							<div className={classes.gifPlayIcon} />
						</div>
					</div>
				</div>
			)}

			{showGif &&
			post.medium == 'gif' &&
			post.url && (
				<CardMedia
					component="img"
					alt={post.title}
					className={classes.media}
					image={post.url}
					title={post.title}
					onClick={() => stopGif}
				/>
			)}

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
