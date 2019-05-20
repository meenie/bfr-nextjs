import {
	Box,
	CircularProgress,
	createStyles,
	FormControl,
	makeStyles,
	MenuItem,
	Select,
	Theme,
	Typography
} from '@material-ui/core';

import useSubreddit from '../hooks/useSubreddit';
import Post from './Post';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		progress: {
			marginTop: theme.spacing(20),
			marginLeft: 'auto',
			marginRight: 'auto'
		},
		postsWrapper: {
			height: '100%',
			overflowY: 'scroll'
		},
		postsContainer: {
			// display: 'flex',
			// flexDirection: 'column',
			width: '700px'
		},
		filterSelector: {
			minWidth: 120,
			margin: theme.spacing(0.5, 3, 0, 3)
		},
		subredditWrapper: {
			height: '100%'
		},
		subredditControls: {
			display: 'flex',
			marginBottom: theme.spacing(1)
		},
		subredditTitle: {
			marginLeft: theme.spacing(3)
		}
	})
);

export default function Subreddit({ subreddit, deckId }) {
	const { posts, isLoading, setFilter, filter, setPauseRefresh } = useSubreddit(subreddit, deckId);
	const classes = useStyles();

	return (
		<Box className={classes.subredditWrapper}>
			<Box className={classes.subredditControls}>
				<Typography variant="h4" className={classes.subredditTitle}>
					/r/{subreddit}
				</Typography>
				<FormControl className={classes.filterSelector}>
					<Select onChange={(e: any) => setFilter(e.target.value)} value={filter}>
						<MenuItem value={'new'}>New</MenuItem>
						<MenuItem value={'rising'}>Rising</MenuItem>
						<MenuItem value={'top'}>Top</MenuItem>
						<MenuItem value={'hot'}>Hot</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Box className={classes.postsWrapper}>
				<Box className={classes.postsContainer}>
					{isLoading && <CircularProgress className={classes.progress} />}
					{!isLoading &&
						posts.map((post: any) => <Post key={post.id} post={post} setPauseRefresh={setPauseRefresh} />)}
				</Box>
			</Box>
		</Box>
	);
}
