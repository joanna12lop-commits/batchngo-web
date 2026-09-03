import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getPublishedBlogPost, publishedBlogPosts } from "../../../lib/blog-data";
import { canonical, safeJsonLd } from "../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedBlogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `/blog/${post.slug}`, publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);
  if (!post) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    mainEntityOfPage: canonical(`/blog/${post.slug}`),
  };
  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
        <nav aria-label="Breadcrumb" className="text-sm text-[#7C7A74]">
          <Link href="/">Home</Link><span aria-hidden> / </span><Link href="/blog">Blog</Link><span aria-hidden> / </span><span>{post.title}</span>
        </nav>
        <article className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#7C8A6A]">{post.category} · {post.readingTime}</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg text-[#7C7A74]">{post.description}</p>
          <div className="mt-10 space-y-6 leading-8">{post.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
