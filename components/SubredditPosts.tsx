import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core';
// @ts-ignore
import {
  CellMeasurer,
  CellMeasurerCache,
  List,
  AutoSizer,
  InfiniteLoader
} from 'react-virtualized';
import { observer } from 'mobx-react-lite';
import useInterval from '@use-it/interval';
import useEventListener from '@use-it/event-listener';

import { ISubreddit } from '../models/Subreddit';
import Post from './Post';

const SHORT_TIMER = 5e3;
const LONG_TIMER = 5 * 60e3;

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
    list: {
      '& > div > div': {
        overflow: 'hidden'
      }
    }
  })
);

function SubredditPosts({ subreddit }: { subreddit: ISubreddit }) {
  const classes = useStyles();
  const [ after, setAfter ] = useState<string | undefined>();
  const [ refreshTiming, setRefreshTiming ] = useState(SHORT_TIMER);
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

  const cache = useMemo(
    () => {
      return new CellMeasurerCache({
        defaultHeight: subreddit.isCompact ? 152 : 300,
        fixedWidth: true
      });
    },
    [ subreddit.isCompact ]
  );

  const onScroll = () => {
    subreddit.setIsTempPaused(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      subreddit.setIsTempPaused(false);
    }, 1000);
  };

  const myOnRowsRendered = (func: any) => {
    return (opts: { startIndex: number }) => {
      const { startIndex } = opts;
      if (startIndex === 0 || startIndex === 1) {
        setAfter('');
      } else {
        setAfter(subreddit.postIds[startIndex - 1]);
      }

      func(opts);
    };
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    if (subreddit.postIds.length - 1 < index) {
      return false;
    }

    return !!subreddit.postIds[index];
  };

  const loadMoreRows = ({ startIndex }: { startIndex: number }) => {
    setAfter(subreddit.postIds[startIndex - 1]);

    return subreddit.fetchPosts(after, false, false);
  };

  const recomputeRowHeights = useMemo(
    () => {
      return (index?: number) => {
        return () => {
          if (index) {
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

  const rowRenderer = ({
    key,
    index,
    style,
    parent
  }: {
    key: number;
    index: number;
    style: any;
    parent: any;
  }) => {
    const postId = subreddit.postIds[index];
    const post = subreddit.posts.get(postId);

    if (!post) {
      return null;
    }

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        columnIndex={0}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }: { measure: any }) => (
          <div style={style}>
            <Post
              post={post}
              onLoad={measure}
              onResize={recomputeRowHeights(index)}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };

  useEffect(recomputeRowHeights(), [ subreddit.isCompact ]);
  useEffect(
    () => {
      subreddit.fetchPosts();
    },
    [ subreddit ]
  );
  useInterval(() => {
    if (subreddit.isPaused || subreddit.isTempPaused) {
      return;
    }

    subreddit.fetchPosts(after, false, false);
  }, refreshTiming);
  useEventListener('visibilitychange', () => {
    setRefreshTiming(
      document.visibilityState === 'hidden' ? LONG_TIMER : SHORT_TIMER
    );
  });

  return (
    <Box className={classes.postsWrapper}>
      {subreddit.isLoading && <CircularProgress className={classes.progress} />}
      {!subreddit.isLoading && (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={Infinity}
        >
          {({ onRowsRendered }: { onRowsRendered: any }) => (
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <List
                  className={classes.list}
                  width={width}
                  height={height}
                  ref={setListRef}
                  onRowsRendered={myOnRowsRendered(onRowsRendered)}
                  deferredMeasurementCache={cache}
                  rowCount={subreddit.postIds.length}
                  rowHeight={cache.rowHeight}
                  rowRenderer={rowRenderer}
                  onScroll={onScroll}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
}

export default observer(SubredditPosts);
