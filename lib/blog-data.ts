export const BLOG_CATEGORIES=["Starting a Product","MOQ & Costs","Manufacturing","Packaging","Product Guides"] as const;
export type BlogCategory=typeof BLOG_CATEGORIES[number];
export type BlogPost={slug:string;title:string;description:string;publishedAt:string;updatedAt?:string;category:BlogCategory;readingTime:string;author:string;content:readonly string[];status:"draft"|"published"};
export const blogPosts:readonly BlogPost[]=[];
export const publishedBlogPosts=blogPosts.filter((post)=>post.status==="published");
export function getPublishedBlogPost(slug:string){return publishedBlogPosts.find((post)=>post.slug===slug)}
