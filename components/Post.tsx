import { useState } from 'react';
import {
	Typography,
	Theme,
	Card,
	CardContent,
	CardActions,
	Button,
	CardHeader,
	Collapse,
	CardMedia
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import SanitizedHTML from 'react-sanitized-html';
import ReactPlayer from 'react-player';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			margin: theme.spacing(1.5)
		},
		media: {
			paddingTop: '56.25%',
			backgroundPosition: '0% 15%'
		}
	})
);

export default function Post({ post, setPauseRefresh }) {
	const classes = useStyles();
	const [ expanded, setExpanded ] = useState(false);

	const onVideoStart = () => {
		setPauseRefresh(true);
	};

	const onVideoStop = () => {
		setPauseRefresh(false);
	};

	return (
		<Card className={classes.card}>
			{post.image &&
			!post.videoUrl &&
			!post.gifUrl && <CardMedia className={classes.media} image={post.image} title={post.title} />}
			{post.videoUrl && (
				<ReactPlayer
					width={660}
					height={371}
					url={post.videoUrl}
					controls={true}
					playing
					light
					loop
					onStart={onVideoStart}
					onPause={onVideoStop}
					onPlay={onVideoStart}
					onEnded={onVideoStop}
				/>
			)}
			{post.gifUrl && (
				<ReactPlayer
					width={660}
					height={371}
					url={post.gifUrl}
					controls={true}
					playing
					light={post.image}
					loop
					onStart={onVideoStart}
					onPause={onVideoStop}
					onPlay={onVideoStart}
					onEnded={onVideoStop}
				/>
			)}
			<CardHeader
				title={post.title}
				subheader={`Posted by ${post.author} to r/${post.subreddit}`}
				titleTypographyProps={{
					variant: 'h6'
				}}
			/>

			{post.selftextHtml && (
				<CardContent>
					<Collapse in={expanded} collapsedHeight={'75px'}>
						<SanitizedHTML html={post.selftextHtml} />
					</Collapse>
					<Button size="small" onClick={() => setExpanded(!expanded)}>
						View {expanded ? 'Less' : 'More'}
					</Button>
				</CardContent>
			)}

			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{post.score}
					&nbsp;&mdash;&nbsp; (<a href={post.commentsUrl} rel="noopener noreferrer" target="_blank">
						{post.numComments} Comments
					</a>)
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" href={post.url} rel="noopener noreferrer" target="_blank">
					View Link
				</Button>
			</CardActions>
		</Card>
	);
}
