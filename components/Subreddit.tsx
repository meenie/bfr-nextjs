import { ChangeEvent, useState } from 'react';
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
  ClickAwayListener,
  Popper,
  Fade,
  IconButton,
  Paper,
  Button
} from '@material-ui/core';
import { AccessTime, ShowChart, Star, Whatshot, MoreVert, Delete } from '@material-ui/icons';
import createPersistedState from 'use-persisted-state';

import useSubreddit from '../hooks/useSubreddit';
import Post from './Post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'block',
      marginTop: theme.spacing(20),
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    postsWrapper: {
      height: '100%',
      overflowY: 'scroll',
      '-webkit-overflow-scrolling': 'touch'
    },
    filterSelector: {
      minWidth: '100px'
    },
    moreMenuContainerLabels: {
      width: '130px'
    },
    subredditWrapper: {
      height: '100%'
    },
    subredditControls: {
      display: 'flex',
      marginBottom: theme.spacing(1)
    },
    subredditTitle: {
      marginLeft: theme.spacing(2),
      minWidth: '150px',
      lineHeight: '38px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
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
    },
    deleteButtonContainer: {
      marginTop: theme.spacing(2),
      textAlign: 'center'
    },
    deleteIcon: {
      marginRight: theme.spacing(1)
    },
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid'
      }
    },
    popper: {
      zIndex: 1,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${theme.palette.common.white} transparent`
        }
      }
    },
    popperContent: {
      padding: theme.spacing(2)
    }
  })
);

export default function Subreddit({ subreddit, deckId, removeSubreddit }) {
  const classes = useStyles();
  const { posts, isLoading, setFilter, filter, setIsPaused, pauseOverride, setPauseOverride } = useSubreddit(
    subreddit,
    deckId
  );
  const [ isCompact, setIsCompact ] = createPersistedState(`${deckId}-${subreddit}-is-compact`)(false);
  const [ moreMenuAnchorEl, setMoreMenuAnchorEl ] = useState(null);
  const [ arrowRef, setArrowRef ] = useState(null);

  const refreshSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setPauseOverride(!event.target.checked);
  };
  const isCompactSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCompact(event.target.checked);
  };
  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchorEl(moreMenuAnchorEl ? null : event.currentTarget);
  };
  const handleArrowRef = (node) => {
    setArrowRef(node);
  };
  const handleRemoveSubreddit = () => {
    removeSubreddit({ deckId, subreddit });
  };

  const moreMenuOpen = Boolean(moreMenuAnchorEl);
  const moreMenuId = moreMenuOpen ? `more-menu-popper` : null;

  return (
    <Box className={classes.subredditWrapper}>
      <Box className={classes.subredditControls}>
        <Typography variant="h5" className={classes.subredditTitle} title={'r/' + subreddit}>
          r/{subreddit}
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
        <IconButton aria-describedby={moreMenuId} onClick={handleMoreMenuClick}>
          <MoreVert />
        </IconButton>
        <ClickAwayListener onClickAway={() => setMoreMenuAnchorEl(null)}>
          <Popper
            className={classes.popper}
            placement="bottom-end"
            id={moreMenuId}
            open={moreMenuOpen}
            anchorEl={moreMenuAnchorEl}
            transition
            modifiers={{
              arrow: {
                enabled: true,
                element: arrowRef
              }
            }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper className={classes.popperContent}>
                  <span className={classes.arrow} ref={handleArrowRef} />
                  <Box display="block">
                    <FormControlLabel
                      classes={{
                        label: classes.moreMenuContainerLabels
                      }}
                      labelPlacement="start"
                      control={<Switch checked={isCompact} onChange={isCompactSwitch} color="primary" />}
                      label="Compact Posts"
                    />
                  </Box>
                  <Box display="block">
                    <FormControlLabel
                      classes={{
                        label: classes.moreMenuContainerLabels
                      }}
                      labelPlacement="start"
                      control={<Switch checked={!pauseOverride} onChange={refreshSwitch} color="primary" />}
                      label="Auto Refresh"
                    />
                  </Box>
                  <Box display="block" className={classes.deleteButtonContainer}>
                    <Button variant="contained" color="secondary" onClick={handleRemoveSubreddit}>
                      <Delete className={classes.deleteIcon} />
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      </Box>
      <Box className={classes.postsWrapper}>
        {isLoading && <CircularProgress className={classes.progress} />}
        {!isLoading &&
          posts.map((post) => <Post key={post.id} post={post} setIsPaused={setIsPaused} isCompact={isCompact} />)}
      </Box>
    </Box>
  );
}
