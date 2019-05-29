export interface RedditPost {
  id: string;
  order: number;
  title: string;
  url: string;
  medium: string;
  useCustomImg: boolean | string;
  videoUrl: null | string;
  score: number;
  subreddit: string;
  author: string;
  thumbnail: string;
  image: undefined | string;
  created: Date;
  commentsUrl: string;
  numComments: number;
  domain: string;
  domainUrl: string;
  selftext: string;
  selftextHtml: string;
  awards: Award[];
}

interface Award {
  id: string;
  count: number;
  name: string;
  imageUrl: string;
}
