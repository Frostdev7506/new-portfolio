export type BlogEditorMetadata = {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noindex?: boolean;
  nofollow?: boolean;
  nosnippet?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  description: string;
  category: string;
  takeaway: string;
  cover: string;
  coverAlt: string;
  coverWidth?: number;
  coverHeight?: number;
  date: string;
  updated?: string;
  tags: string[];
  source?: string;
  youtubeId?: string;
  draft: boolean;
};

export type EditorDocument = {
  slug: string;
  content: string;
  metadata: BlogEditorMetadata;
  revision: string;
};

export type EditorIndex = {
  posts: {
    slug: string;
    title: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
    draft: boolean;
  }[];
  covers: string[];
  errors: { fileName: string; message: string }[];
};
