import React, { memo, useRef, useEffect, useMemo } from 'react';
import { Box, CircularProgress, createStyles, makeStyles, Theme } from '@material-ui/core';
// @ts-ignore
import { CellMeasurer, CellMeasurerCache, List, AutoSizer, InfiniteLoader } from 'react-virtualized';

import Post from './Post';
import { RedditPost } from '../types/RedditPost';

type Props = {
  usingApollo: boolean;
  isCompact: boolean;
  posts: {
    [postId: string]: RedditPost;
  };
  postIds: string[];
  isLoading: boolean;
  setIsPaused: (isPaused: boolean) => void;
  setAfter: (after: string) => void;
  fetchData: (forceLoad?: boolean) => Promise<void>;
};

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

function SubredditPosts({
  usingApollo,
  isCompact,
  posts: _posts,
  postIds: _postIds,
  isLoading,
  setIsPaused,
  setAfter,
  fetchData
}: Props) {
  const classes = useStyles();

  const listRef = useRef({
    recomputeRowHeights: () => {},
    forceUpdate: () => {}
  });
  const scrollTimeoutRef = useRef<number>();
  const posts = useRef<{ [id: string]: RedditPost }>({});
  const postIds = useRef<string[]>([]);

  posts.current = _posts;
  postIds.current = _postIds;

  const setListRef = (ref: any) => {
    if (ref) {
      listRef.current = ref;
    }
  };

  const cache = useMemo(
    () => {
      return new CellMeasurerCache({
        defaultHeight: isCompact ? 152 : 300,
        fixedWidth: true
      });
    },
    [ isCompact ]
  );

  const onScroll = () => {
    setIsPaused(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  const myOnRowsRendered = (func: any) => {
    return (opts: { startIndex: number }) => {
      const { startIndex } = opts;
      if (startIndex === 0 || startIndex === 1) {
        setAfter('');
      } else {
        const postId = postIds.current[startIndex - 1];
        setAfter(postId);
      }

      func(opts);
    };
  };

  const isRowLoaded = ({ index }: { index: any }) => {
    return !!postIds.current[index];
  };

  const loadMoreRows = ({ startIndex }: { startIndex: number }) => {
    setAfter(postIds.current[startIndex - 1]);
    return fetchData(true);
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

  useEffect(recomputeRowHeights(), [ isCompact ]);

  const rowRenderer = useMemo(
    () => {
      return ({ key, index, style, parent }: { key: number; index: number; style: any; parent: any }) => {
        const postId = postIds.current[index];
        const post = posts.current[postId];

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
    [ cache, isCompact, recomputeRowHeights, setIsPaused, usingApollo ]
  );

  return (
    <Box className={classes.postsWrapper}>
      {isLoading && <CircularProgress className={classes.progress} />}
      {!isLoading && (
        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={Infinity}>
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
                  rowCount={postIds.current.length}
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

export default memo(SubredditPosts);
