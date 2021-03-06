export interface RedditPost {
  id: string;
  order: number;
  title: string;
  url: string;
  medium: string;
  useCustomImg: boolean;
  videoUrl: null | string;
  score: number;
  subreddit: string;
  author: string;
  thumbnail: string;
  image: string | null;
  created: Date;
  commentsUrl: string;
  numComments: number;
  domain: string;
  domainUrl: string;
  selftext: string;
  selftextHtml: string | null;
  awards: Award[];
}

interface Award {
  id: string;
  count: number;
  name: string;
  imageUrl: string;
}
