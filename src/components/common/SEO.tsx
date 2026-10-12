import React, { useEffect } from 'react';
import { BRAND } from '../../config/brand';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  schemaType?: 'Article' | 'Review' | 'WebPage';
  reviewScore?: number;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = BRAND.subheading,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=630&q=80',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authorName = BRAND.author,
  breadcrumbs,
  faqs,
  schemaType,
  reviewScore,
}) => {
  const pageTitle = title
    ? `${title} — ${BRAND.name}`
    : `${BRAND.name} — ${BRAND.tagline} | Gaming News, Reviews & Esports`;

  useEffect(() => {
    // Document Title
    document.title = pageTitle;

    // Helper to set meta tags
    const setMeta = (nameAttr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);

    // OpenGraph
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', BRAND.name);
    if (canonicalUrl) {
      setMeta('property', 'og:url', canonicalUrl);
    }

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl || window.location.href);

    // JSON-LD Structured Data
    const scriptsToRemove: Element[] = [];
    document.querySelectorAll('script[data-seo-jsonld]').forEach(el => scriptsToRemove.push(el));
    scriptsToRemove.forEach(el => el.remove());

    const jsonLdData: Record<string, unknown>[] = [];

    // WebSite / Organization schema
    jsonLdData.push({
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: BRAND.name,
      url: BRAND.url,
      logo: `${BRAND.url}/favicon.svg`,
      description: BRAND.subheading,
      sameAs: BRAND.socialLinks.map(s => s.url),
    });

    // Breadcrumbs schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    // Article schema
    if (schemaType === 'Article' || ogType === 'article') {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        image: [ogImage],
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Person',
          name: authorName,
        },
        publisher: {
          '@type': 'Organization',
          name: BRAND.name,
          logo: {
            '@type': 'ImageObject',
            url: `${BRAND.url}/favicon.svg`,
          },
        },
        description,
      });
    }

    // Review schema
    if (schemaType === 'Review' && reviewScore !== undefined) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: title,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: reviewScore,
          bestRating: 10,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          name: authorName,
        },
        publisher: {
          '@type': 'Organization',
          name: BRAND.name,
        },
      });
    }

    // FAQ schema
    if (faqs && faqs.length > 0) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    // Append JSON-LD script
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo-jsonld', 'true');
    script.textContent = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [
    pageTitle,
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType,
    publishedTime,
    modifiedTime,
    authorName,
    breadcrumbs,
    faqs,
    schemaType,
    reviewScore,
  ]);

  return null;
};
