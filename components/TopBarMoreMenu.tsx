import React, { ReactNode } from 'react';
import {
  Box,
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
import { TransitionProps } from '@material-ui/core/transitions';
import { Delete } from '@material-ui/icons';
import { observer } from 'mobx-react-lite';

import { useStore } from '../hooks/useStore';

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
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`
      }
    },
    popperContent: {
      padding: theme.spacing(2)
    }
  })
);

function TopBarMoreMenu({
  transitionProps,
  handleArrowRef,
  closeMoreMenu
}: {
  transitionProps: TransitionProps | undefined;
  handleArrowRef: (node: ReactNode) => void;
  closeMoreMenu: () => void;
}) {
  const classes = useStyles();
  const store = useStore();

  const handleRemoveDeck = () => {
    store.currentDeck.remove();
    closeMoreMenu();
  };

  return (
    <Fade {...transitionProps} timeout={350}>
      <Paper className={classes.popperContent}>
        <span className={classes.arrow} ref={handleArrowRef} />
        <Box display="block">
          <FormControlLabel
            classes={{
              label: classes.moreMenuContainerLabels
            }}
            labelPlacement="start"
            control={
              <Switch
                checked={store.usingApollo}
                onChange={(event) => store.setUsingApollo(event.target.checked)}
                color="primary"
              />
            }
            label="Using Apollo?"
          />
          <FormHelperText className={classes.helperText}>Turn this on to open links in Apollo.</FormHelperText>
        </Box>
        <Box display="block" className={classes.deleteButtonContainer}>
          <Button variant="contained" color="secondary" onClick={handleRemoveDeck}>
            <Delete className={classes.deleteIcon} />
            Delete Deck
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
}

export default observer(TopBarMoreMenu);
