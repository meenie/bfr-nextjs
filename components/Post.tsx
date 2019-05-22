import { useState, Fragment } from 'react';
import { Typography, Theme, Card, CardContent, CardActions, Button, CardHeader, Collapse } from '@material-ui/core';
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
		bottomIcons: {
			verticalAlign: 'bottom',
			marginRight: theme.spacing(0.5)
		},
		bottomText: {
			marginRight: theme.spacing(1.25)
		}
	})
);

export default function Post({ post, setIsPaused }: { post: RedditPost; setIsPaused: any }) {
	const classes = useStyles();
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
					</Fragment>
				}
				subheaderTypographyProps={{
					variant: 'body2'
				}}
				classes={{
					title: classes.headerText
				}}
			/>
			<RedditMedia post={post} onMediaStart={onMediaStart} onMediaStop={onMediaStop} />

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
					<ArrowUpward fontSize="small" className={classes.bottomIcons} />
					<NumberFormat
						className={classes.bottomText}
						displayType={'text'}
						thousandSeparator={true}
						value={post.score}
					/>
					<Chat fontSize="small" className={classes.bottomIcons} />
					<NumberFormat
						className={classes.bottomText}
						displayType={'text'}
						thousandSeparator={true}
						value={post.numComments}
					/>
					<AccessTime fontSize="small" className={classes.bottomIcons} />
					<TimeAgo fontSize="small" date={post.created} />
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" href={post.url} rel="noopener noreferrer" target="_blank">
					View Link
				</Button>
				<Button size="small" href={post.commentsUrl} rel="noopener noreferrer" target="_blank">
					View Comments
				</Button>
			</CardActions>
		</Card>
	);
}
