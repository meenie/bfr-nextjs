import { Theme, Grid } from '@material-ui/core';
import { createStyles, makeStyles, CSSProperties } from '@material-ui/styles';

import Subreddit from '../components/Subreddit';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		grid: {
			height: '100%',
			marginTop: theme.spacing(10)
		}
	})
);

export default function Subreddits({ activeDeck }) {
	const subredditCount = activeDeck.subredditIds.length;
	const classes = useStyles({ subredditCount });

	return (
		<Grid container className={classes.grid} wrap="nowrap">
			{activeDeck.subredditIds.map((subredditId: string) => (
				<Grid item key={subredditId + activeDeck.id}>
					<Subreddit subreddit={subredditId} deckId={activeDeck.id} />
				</Grid>
			))}
		</Grid>
	);
}
