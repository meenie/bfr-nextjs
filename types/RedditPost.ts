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
	image: null | string;
	created: Date;
	commentsUrl: string;
	numComments: number;
	domain: string;
	domainUrl: string;
	selftext: string;
	selftextHtml: null;
}
