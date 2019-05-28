import { memo, useState } from 'react';
import { Theme, Fade, Box, Collapse, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import SanitizedHTML from 'react-sanitized-html';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selfPostContent: {
      position: 'relative'
    },
    selfTextFade: {
      position: 'absolute',
      bottom: '46px',
      height: '55px',
      width: '100%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0, #ffffff 100%);'
    }
  })
);

function SelfTextHtml({ selfTextHtml }) {
  const [ expanded, setExpanded ] = useState(false);
  const classes = useStyles();
  if (!selfTextHtml) {
    return;
  }

  return (
    <Box className={classes.selfPostContent}>
      <Fade in={!expanded}>
        <Box className={classes.selfTextFade} />
      </Fade>
      <Collapse in={expanded} collapsedHeight={'55px'}>
        <SanitizedHTML html={selfTextHtml} />
      </Collapse>
      <Button size="small" onClick={() => setExpanded(!expanded)}>
        View {expanded ? 'Less' : 'More'}
      </Button>
    </Box>
  );
}

export default memo(SelfTextHtml);
