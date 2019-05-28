import { ChangeEvent, useState, Fragment } from 'react';
import {
  Box,
  createStyles,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  Theme,
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterSelector: {
      minWidth: '100px'
    },
    moreMenuContainerLabels: {
      width: '130px'
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

export default function SubredditControls({
  subreddit,
  deckId,
  removeSubreddit,
  setPauseOverride,
  setIsCompact,
  setFilter,
  filter,
  isCompact,
  pauseOverride
}) {
  const classes = useStyles();
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
    <Fragment>
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
    </Fragment>
  );
}
