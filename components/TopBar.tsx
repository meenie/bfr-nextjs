import React, { useState } from 'react';
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
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';

import { useStore } from '../hooks/useStore';
import TopBarMoreMenu from './TopBarMoreMenu';
import { IDeck } from '../models/Deck';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      zIndex: theme.zIndex.drawer
    }
  })
);

function TopBar() {
  const classes = useStyles();
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const store = useStore();

  const handleMoreMenuClick = (event: any) => {
    setMoreMenuAnchorEl(moreMenuAnchorEl ? null : event.currentTarget);
  };
  const handleArrowRef = (node: any) => {
    setArrowRef(node);
  };
  const closeMoreMenu = () => {
    setMoreMenuAnchorEl(null);
  };

  const moreMenuOpen = Boolean(moreMenuAnchorEl);
  const moreMenuId = moreMenuOpen ? `top-bar-more-menu-popper` : undefined;

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box>
          <Typography noWrap variant="h6">
            Bang! for Reddit
          </Typography>
        </Box>
        <Box width="50%">
          <Tabs
            value={store.currentDeck}
            variant="scrollable"
            scrollButtons="on"
            onChange={(_event, deck: IDeck) => store.setCurrentDeck(deck)}
          >
            {store.decks.map((deck) => (
              <Tab key={deck.id} value={deck} label={deck.name} />
            ))}
          </Tabs>
        </Box>
        <Box flexGrow={1} />
        <IconButton aria-describedby={moreMenuId} onClick={handleMoreMenuClick}>
          <MoreVert />
        </IconButton>

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
            <ClickAwayListener onClickAway={closeMoreMenu}>
              <TopBarMoreMenu
                transitionProps={TransitionProps}
                handleArrowRef={handleArrowRef}
                closeMoreMenu={closeMoreMenu}
              />
            </ClickAwayListener>
          )}
        </Popper>

      </Toolbar>
    </AppBar>
  );
}

export default observer(TopBar);
