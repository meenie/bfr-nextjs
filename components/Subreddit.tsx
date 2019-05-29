import React, { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, CircularProgress, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
// @ts-ignore
import createPersistedState from 'use-persisted-state';
// @ts-ignore
import { CellMeasurer, CellMeasurerCache, List, AutoSizer } from 'react-virtualized';

import useSubreddit from '../hooks/useSubreddit';
import Post from './Post';
import SubredditControls from './SubredditControls';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      display: 'block',
      marginTop: theme.spacing(20),
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    postsWrapper: {
      height: '100%'
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
    list: {
      '& > div > div': {
        overflow: 'hidden'
      }
    }
  })
);

function Subreddit({
  subreddit,
  deckId,
  removeSubreddit,
  usingApollo
}: {
  subreddit: any;
  deckId: string;
  removeSubreddit: any;
  usingApollo: boolean;
}) {
  const classes = useStyles();
  const { posts, isLoading, setFilter, filter, setIsPaused, pauseOverride, setPauseOverride } = useSubreddit(
    subreddit,
    deckId
  );
  const [ isCompact, setIsCompact ] = createPersistedState(`${deckId}-${subreddit}-is-compact`)(false);
  const listRef = useRef({
    recomputeRowHeights: () => {},
    forceUpdate: () => {}
  });
  const scrollTimeoutRef = useRef<number>();

  const setListRef = (ref: any) => {
    if (ref) {
      listRef.current = ref;
    }
  };

  const cache = new CellMeasurerCache({
    defaultHeight: isCompact ? 152 : 300,
    fixedWidth: true
  });

  const onScroll = useCallback(
    () => {
      setIsPaused(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsPaused(false);
      }, 2500);
    },
    [ setIsPaused ]
  );

  const recomputeRowHeights = useMemo(
    () => {
      return (index?: number) => {
        return () => {
          if (typeof index !== 'undefined') {
            cache.clear(index);
          } else {
            cache.clearAll();
          }
          listRef.current.recomputeRowHeights();
          listRef.current.forceUpdate();
        };
      };
    },
    [ cache ]
  );

  useEffect(recomputeRowHeights(), [ isCompact ]);

  const rowRenderer = useMemo(
    () => {
      return ({ key, index, style, parent }: { key: number; index: number; style: any; parent: any }) => {
        const post = posts[index];

        return (
          <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
            {({ measure }: { measure: any }) => (
              <div style={style}>
                <Post
                  post={post}
                  setIsPaused={setIsPaused}
                  isCompact={isCompact}
                  usingApollo={usingApollo}
                  onLoad={measure}
                  onResize={recomputeRowHeights(index)}
                />
              </div>
            )}
          </CellMeasurer>
        );
      };
    },
    [ cache, isCompact, posts, recomputeRowHeights, setIsPaused, usingApollo ]
  );

  return (
    <Box className={classes.subredditWrapper}>
      <Box className={classes.subredditControls}>
        <Typography variant="h5" className={classes.subredditTitle} title={'r/' + subreddit}>
          r/{subreddit}
        </Typography>
        <Box flexGrow={1} />
        <SubredditControls
          subreddit={subreddit}
          deckId={deckId}
          removeSubreddit={removeSubreddit}
          setPauseOverride={setPauseOverride}
          pauseOverride={pauseOverride}
          isCompact={isCompact}
          setIsCompact={setIsCompact}
          filter={filter}
          setFilter={setFilter}
        />
      </Box>
      <Box className={classes.postsWrapper}>
        {isLoading && <CircularProgress className={classes.progress} />}
        {!isLoading && (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <List
                className={classes.list}
                width={width}
                height={height}
                ref={setListRef}
                deferredMeasurementCache={cache}
                rowCount={posts.length}
                rowHeight={cache.rowHeight}
                rowRenderer={rowRenderer}
                onScroll={onScroll}
              />
            )}
          </AutoSizer>
        )}
      </Box>
    </Box>
  );
}

export default memo(Subreddit);
