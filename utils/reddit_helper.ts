/**
 * Reddit has a very old API which requires some massaging.
 * This is not nice code.
 */
import { RawPostData } from '../types/RawSubreddit';
import { RedditPost } from '../types/RedditPost';

const IMGUR_REGEX = new RegExp('imgur.com/(.*?).gifv?');
const GFYCAT_REGEX = new RegExp('^http(?:s?)://thumbs.gfycat.com/(.*?)-size_restricted.gif$');
const STREAMABLE_REGEX = new RegExp('streamable.com');
const VIMEO_REGEX = new RegExp('vimeo.com');
const REDDIT_VIDEO_REGEX = new RegExp('^https://v.redd.it');
const REDDIT_URL = 'https://www.reddit.com';

const combineRegex = (regexes: RegExp[]) => new RegExp(regexes.map((regex) => regex.source).join('|'));
const extractVideoUrl = (post: RawPostData): [boolean, string] => {
  if (post.url.match(combineRegex([ STREAMABLE_REGEX, VIMEO_REGEX ]))) {
    return [ false, post.url ];
  }

  if (post.url.match(REDDIT_VIDEO_REGEX)) {
    if (post.media && post.media.reddit_video) {
      return [ true, `https://cors-anywhere.herokuapp.com/${post.media.reddit_video.dash_url}` ];
    }

    if (post.crosspost_parent_list && post.crosspost_parent_list.length > 0) {
      const firstCrosspost = post.crosspost_parent_list[0];

      return [ true, `https://cors-anywhere.herokuapp.com/${firstCrosspost.media.reddit_video.dash_url}` ];
    }
  }

  if (post.media && post.media.type) {
    switch (post.media.type) {
      case 'gfycat.com': {
        const matches: RegExpMatchArray = post.media.oembed.thumbnail_url.match(GFYCAT_REGEX);
        if (matches) {
          return [ true, `https://giant.gfycat.com/${matches[1]}.webm` ];
        }
      }
      default:
        const matches = post.media.oembed.html
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .match(/src="(.*?)"/);
        return matches ? [ false, matches[1] ] : [ false, null ];
    }
  } else {
    const matches: RegExpMatchArray = post.url.match(IMGUR_REGEX);
    if (matches) {
      return [ true, `https://i.imgur.com/${matches[1]}.mp4` ];
    }

    return [ false, null ];
  }
};
const determineMedium = (post: RawPostData) => {
  if (post.media) {
    return 'video';
  }

  if (post.url.match(combineRegex([ IMGUR_REGEX, STREAMABLE_REGEX, VIMEO_REGEX, REDDIT_VIDEO_REGEX ]))) {
    return 'video';
  }

  if (post.url.match(/\.gif$/)) {
    return 'gif';
  }

  return 'image';
};

export function normalizeRedditPosts(posts: RawPostData[]): RedditPost[] {
  return posts.filter((post) => post.subreddit !== 'The_Donald').map((post, index) => {
    let url = post.url;
    if (post.media && post.media.reddit_video && post.media.reddit_video.fallback_url) {
      url = post.media.reddit_video.fallback_url;
    }

    const [ useCustomImg, videoUrl ] = extractVideoUrl(post);

    return {
      id: post.id,
      order: index,
      title: post.title.replace(/&amp;/g, '&'),
      url,
      medium: determineMedium(post),
      useCustomImg,
      videoUrl,
      score: post.score,
      subreddit: post.subreddit,
      author: post.author,
      thumbnail: post.thumbnail.slice(0, 4) === 'http' ? post.thumbnail : '',
      image: post.preview ? post.preview.images[0].source.url.replace(/&amp;/g, '&') : null,
      created: new Date(post.created_utc * 1000),
      commentsUrl: `${REDDIT_URL}${post.permalink}`,
      numComments: post.num_comments,
      domain: post.domain,
      awards: post.all_awardings.map((award) => {
        return {
          id: award.id,
          count: award.count,
          name: award.name,
          imageUrl: award.icon_url
        };
      }),
      domainUrl:
        post.domain.slice(0, 5) === 'self.'
          ? `${REDDIT_URL}/r/${post.subreddit}`
          : `${REDDIT_URL}/domain/${post.domain}`,
      selftext: post.selftext,
      selftextHtml: !!post.selftext_html
        ? post.selftext_html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/↵/g, '\\n').replace(/&amp;/g, '&')
        : null
    };
  });
}
