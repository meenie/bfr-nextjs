/**
 * Generated from: https://app.quicktype.io/
 */

export interface RawSubreddit {
  kind: string;
  data: SubredditData;
}

interface SubredditData {
  modhash: string;
  dist: number;
  children: PostChild[];
  after: string;
  before: null;
}

interface PostChild {
  kind: Kind;
  data: RawPostData;
}

export interface RawPostData {
  approved_at_utc: null;
  subreddit: string;
  selftext: string;
  author_fullname: string;
  saved: boolean;
  mod_reason_title: null;
  gilded: number;
  clicked: boolean;
  title: string;
  link_flair_richtext: LinkFlairRichtext[];
  subreddit_name_prefixed: string;
  hidden: boolean;
  pwls: number;
  link_flair_css_class: null | string;
  downs: number;
  thumbnail_height: number;
  hide_score: boolean;
  name: string;
  quarantine: boolean;
  link_flair_text_color: FlairTextColor;
  author_flair_background_color: null | string;
  subreddit_type: SubredditType;
  ups: number;
  total_awards_received: number;
  media_embed: MediaEmbed;
  thumbnail_width: number;
  author_flair_template_id: null | string;
  is_original_content: boolean;
  user_reports: any[];
  secure_media: Media | null;
  is_reddit_media_domain: boolean;
  is_meta: boolean;
  category: null;
  secure_media_embed: MediaEmbed;
  link_flair_text: null | string;
  can_mod_post: boolean;
  score: number;
  approved_by: null;
  thumbnail: string;
  edited: boolean;
  author_flair_css_class: null | string;
  author_flair_richtext: AuthorFlairRichtext[];
  gildings: Gildings;
  post_hint: PostHint;
  content_categories: string[] | null;
  is_self: boolean;
  mod_note: null;
  created: number;
  link_flair_type: AuthorFlairType;
  wls: number;
  banned_by: null;
  author_flair_type: AuthorFlairType;
  domain: string;
  selftext_html: string;
  likes: null;
  suggested_sort: null | string;
  banned_at_utc: null;
  view_count: null;
  archived: boolean;
  no_follow: boolean;
  is_crosspostable: boolean;
  crosspost_parent_list: RawPostData[];
  pinned: boolean;
  over_18: boolean;
  preview: Preview;
  all_awardings: AllAwarding[];
  media_only: boolean;
  can_gild: boolean;
  spoiler: boolean;
  locked: boolean;
  author_flair_text: null | string;
  visited: boolean;
  num_reports: null;
  distinguished: null;
  subreddit_id: string;
  mod_reason_by: null;
  removal_reason: null;
  link_flair_background_color: string;
  id: string;
  is_robot_indexable: boolean;
  report_reasons: null;
  author: string;
  num_crossposts: number;
  num_comments: number;
  send_replies: boolean;
  whitelist_status: WhitelistStatus;
  contest_mode: boolean;
  mod_reports: any[];
  author_patreon_flair: boolean;
  author_flair_text_color: FlairTextColor | null;
  permalink: string;
  parent_whitelist_status: WhitelistStatus;
  stickied: boolean;
  url: string;
  subreddit_subscribers: number;
  created_utc: number;
  media: Media | null;
  is_video: boolean;
  link_flair_template_id?: string;
}

interface AllAwarding {
  is_enabled: boolean;
  count: number;
  subreddit_id: null;
  description: Description;
  coin_reward: number;
  icon_width: number;
  icon_url: string;
  days_of_premium: number;
  icon_height: number;
  resized_icons: ResizedIcon[];
  days_of_drip_extension: number;
  award_type: AwardType;
  coin_price: number;
  id: ID;
  name: Name;
}

export enum AwardType {
  Global = 'global'
}

export enum Description {
  GoldAward = 'Gold Award',
  SilverAward = 'Silver Award'
}

export enum ID {
  Gid1 = 'gid_1',
  Gid2 = 'gid_2'
}

export enum Name {
  Gold = 'Gold',
  Silver = 'Silver'
}

interface ResizedIcon {
  url: string;
  width: number;
  height: number;
}

interface AuthorFlairRichtext {
  e: string;
  t?: string;
  a?: string;
  u?: string;
}

export enum FlairTextColor {
  Dark = 'dark',
  Light = 'light'
}

export enum AuthorFlairType {
  Richtext = 'richtext',
  Text = 'text'
}

interface Gildings {
  gid_1?: number;
  gid_2?: number;
}

interface LinkFlairRichtext {
  e: AuthorFlairType;
  t: string;
}

interface Media {
  type?: string;
  oembed?: Oembed;
  reddit_video?: RedditVideo;
}

interface Oembed {
  provider_url: string;
  description: string;
  title: string;
  type: string;
  thumbnail_width: number;
  height: number;
  width: number;
  html: string;
  version: string;
  provider_name: string;
  thumbnail_url: string;
  thumbnail_height: number;
}

interface RedditVideo {
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url: string;
  dash_url: string;
  duration: number;
  hls_url: string;
  is_gif: boolean;
  transcoding_status: string;
}

interface MediaEmbed {
  content?: string;
  width?: number;
  scrolling?: boolean;
  height?: number;
  media_domain_url?: string;
}

export enum WhitelistStatus {
  AllAds = 'all_ads',
  HouseOnly = 'house_only',
  NoAds = 'no_ads',
  PromoAdultNsfw = 'promo_adult_nsfw'
}

export enum PostHint {
  HostedVideo = 'hosted:video',
  Image = 'image',
  Link = 'link',
  RichVideo = 'rich:video'
}

interface Preview {
  images: Image[];
  reddit_video_preview?: RedditVideo;
  enabled: boolean;
}

interface Image {
  source: ResizedIcon;
  resolutions: ResizedIcon[];
  variants: Variants;
  id: string;
}

interface Variants {
  gif?: GIF;
  mp4?: GIF;
  obfuscated?: GIF;
  nsfw?: GIF;
}

interface GIF {
  source: ResizedIcon;
  resolutions: ResizedIcon[];
}

export enum SubredditType {
  Public = 'public',
  Restricted = 'restricted'
}

export enum Kind {
  T3 = 't3'
}
