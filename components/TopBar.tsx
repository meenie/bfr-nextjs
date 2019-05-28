import { memo, useState, ChangeEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  IconButton,
  ClickAwayListener,
  Popper,
  Fade,
  Paper,
  FormControlLabel,
  Switch,
  Button,
  makeStyles,
  createStyles,
  Theme,
  FormHelperText
} from '@material-ui/core';
import { MoreVert, Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    moreMenuContainerLabels: {
      width: '130px'
    },
    helperText: {
      marginTop: 0,
      marginLeft: theme.spacing(2)
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
      zIndex: theme.zIndex.drawer,
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

function TopBar({ activeDeck, activateDeck, deckIds, decks, setUsingApollo, usingApollo, removeDeck }) {
  const classes = useStyles();
  const [ moreMenuAnchorEl, setMoreMenuAnchorEl ] = useState(null);
  const [ arrowRef, setArrowRef ] = useState(null);

  const setUsingApolloSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setUsingApollo(event.target.checked);
  };
  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchorEl(moreMenuAnchorEl ? null : event.currentTarget);
  };
  const handleArrowRef = (node) => {
    setArrowRef(node);
  };
  const handleRemoveDeck = () => {
    removeDeck(activeDeck.id);
    setMoreMenuAnchorEl(null);
  };
  const handleTabChange = (event, deckId) => {
    activateDeck(deckId);
    setMoreMenuAnchorEl(null);
  };

  const moreMenuOpen = Boolean(moreMenuAnchorEl);
  const moreMenuId = moreMenuOpen ? `top-bar-more-menu-popper` : null;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box>
          <Typography noWrap variant="h6">
            Bang! for Reddit
          </Typography>
        </Box>
        <Box width="50%">
          <Tabs value={activeDeck.id} variant="scrollable" scrollButtons="on" onChange={handleTabChange}>
            {deckIds.map((deckId: string) => <Tab key={deckId} value={deckId} label={decks[deckId].name} />)}
          </Tabs>
        </Box>
        <Box flexGrow={1} />
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
                      control={<Switch checked={usingApollo} onChange={setUsingApolloSwitch} color="primary" />}
                      label="Using Apollo?"
                    />
                    <FormHelperText className={classes.helperText}>
                      Turn this on to open links in Apollo.
                    </FormHelperText>
                  </Box>
                  <Box display="block" className={classes.deleteButtonContainer}>
                    <Button variant="contained" color="secondary" onClick={handleRemoveDeck}>
                      <Delete className={classes.deleteIcon} />
                      Delete Deck
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      </Toolbar>
    </AppBar>
  );
}

export default memo(TopBar);
