import { types, Instance, IAnyModelType } from 'mobx-state-tree';
// @ts-ignore
import sanitizeHtml from 'sanitize-html';

import Subreddit from './Subreddit';
import Award from './Award';

const Post = types
  .model('Post', {
    id: types.identifier,
    order: types.number,
    title: types.string,
    url: types.string,
    medium: types.string,
    useCustomImg: types.boolean,
    videoUrl: types.maybe(types.string),
    score: types.number,
    subreddit: types.reference(types.late((): IAnyModelType => Subreddit)),
    subreddit_source: types.string,
    author: types.string,
    thumbnail: types.string,
    image: types.maybe(types.string),
    created: types.Date,
    commentsUrl: types.string,
    numComments: types.number,
    domain: types.string,
    awards: types.array(Award),
    domainUrl: types.string,
    selftextHtml: types.maybe(types.string)
  })
  .views((self) => ({
    get sanitizedSelftextHtml() {
      if (!self.selftextHtml) {
        return undefined;
      }
      return sanitizeHtml(self.selftextHtml, {
        allowedAttributes: { a: [ 'href', 'name', 'target', 'rel' ] },
        transformTags: {
          a: (tagName: string, attribs: any) => {
            let href: string = attribs.href;
            const matches = href.match(/^(https?):\/\//);
            if (!matches) {
              href = `https://www.reddit.com${href}`;
            } else if (matches[1] === 'http') {
              href = href.replace('http://', 'https://');
            }

            return {
              tagName,
              attribs: {
                ...attribs,
                href,
                rel: 'noopener noreferrer',
                target: '_blank'
              }
            };
          }
        }
      });
    }
  }));

export default Post;
export interface IPost extends Instance<typeof Post> {}
