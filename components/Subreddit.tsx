import { ChangeEvent } from 'react';
import {
	Box,
	CircularProgress,
	createStyles,
	FormControl,
	makeStyles,
	MenuItem,
	Select,
	Theme,
	Typography,
	FormControlLabel,
	Switch,
	Tooltip
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import { AccessTime, ShowChart, Star, Whatshot, ViewHeadline, ViewDay } from '@material-ui/icons';
import createPersistedState from 'use-persisted-state';

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
			width: '684px'
		},
		filterSelector: {
			minWidth: 120,
			margin: theme.spacing(0, 3, 0, 3)
		},
		autoRefreshSwitch: {
			marginRight: theme.spacing(5)
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
		},
		menuIcon: {
			verticalAlign: 'bottom',
			marginRight: theme.spacing(1)
		},
		compactSwitch: {
			marginRight: theme.spacing(2),
			'& button': {
				height: '35px'
			}
		}
	})
);

export default function Subreddit({ subreddit, deckId }) {
	const { posts, isLoading, setFilter, filter, setIsPaused, pauseOverride, setPauseOverride } = useSubreddit(
		subreddit,
		deckId
	);

	const classes = useStyles();
	const refreshSwitch = (event: ChangeEvent<HTMLInputElement>) => {
		setPauseOverride(!event.target.checked);
	};
	const isCompactSwitch = (event: any, value: boolean) => {
		setIsCompact(value);
	};

	const [ isCompact, setIsCompact ] = createPersistedState(`${deckId}-${subreddit}-is-compact`)(false);

	return (
		<Box className={classes.subredditWrapper}>
			<Box className={classes.subredditControls}>
				<Typography variant="h4" className={classes.subredditTitle}>
					/r/{subreddit}
				</Typography>
				<Box flexGrow={1} />
				<FormControl className={classes.filterSelector}>
					<Select onChange={(e: any) => setFilter(e.target.value)} value={filter}>
						<MenuItem value={'hot'}>
							<Whatshot className={classes.menuIcon} />
							<span>Hot</span>
						</MenuItem>
						<MenuItem value={'top'}>
							<Star className={classes.menuIcon} />
							<span>Top</span>
						</MenuItem>
						<MenuItem value={'rising'}>
							<ShowChart className={classes.menuIcon} />
							<span>Rising</span>
						</MenuItem>
						<MenuItem value={'new'}>
							<AccessTime className={classes.menuIcon} />
							<span>New</span>
						</MenuItem>
					</Select>
				</FormControl>
				<ToggleButtonGroup
					className={classes.compactSwitch}
					value={isCompact}
					exclusive
					onChange={isCompactSwitch}
				>
					<ToggleButton value={true}>
						<Tooltip title="View posts compacted" aria-label="View posts compacted">
							<ViewHeadline />
						</Tooltip>
					</ToggleButton>,
					<ToggleButton value={false}>
						<Tooltip title="View posts expanded" aria-label="View posts expanded">
							<ViewDay />
						</Tooltip>
					</ToggleButton>
				</ToggleButtonGroup>
				<FormControlLabel
					className={classes.autoRefreshSwitch}
					control={<Switch checked={!pauseOverride} onChange={refreshSwitch} color="primary" />}
					label="Auto Refresh"
				/>
			</Box>
			<Box className={classes.postsWrapper}>
				<Box className={classes.postsContainer}>
					{isLoading && <CircularProgress className={classes.progress} />}
					{!isLoading &&
						posts.map((post) => (
							<Post key={post.id} post={post} setIsPaused={setIsPaused} isCompact={isCompact} />
						))}
				</Box>
			</Box>
		</Box>
	);
}
