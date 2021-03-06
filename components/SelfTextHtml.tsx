import React, { memo, useState } from 'react';
import {
  Theme,
  Fade,
  Box,
  Collapse,
  Button,
  makeStyles,
  createStyles
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles(() =>
  createStyles({
    selfPostContent: {
      position: 'relative'
    },
    selfTextFade: {
      position: 'absolute',
      bottom: '34px',
      height: '55px',
      width: '100%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #ffffff 100%);'
    }
  })
);

function SelfTextHtml({
  sanitizedSelftextHtml,
  onResize
}: {
  sanitizedSelftextHtml: string;
  onResize: any;
}) {
  const [ expanded, setExpanded ] = useState(false);
  const classes = useStyles();
  const theme: Theme = useTheme();

  const handleClick = () => {
    setExpanded(!expanded);
    setTimeout(() => {
      onResize();
    }, theme.transitions.duration.standard);
  };

  return (
    <Box className={classes.selfPostContent}>
      <Fade in={!expanded}>
        <Box className={classes.selfTextFade} />
      </Fade>
      <Collapse in={expanded} collapsedHeight={'55px'}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedSelftextHtml }} />
      </Collapse>
      <Button size="small" onClick={handleClick}>
        View {expanded ? 'Less' : 'More'}
      </Button>
    </Box>
  );
}

export default memo(SelfTextHtml);
