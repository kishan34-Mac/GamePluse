import React, { useEffect } from 'react';
import { BRAND } from '../../config/brand';

interface BreadcrumbItem { name: string; url: string; }
interface FAQItem { question: string; answer: string; }

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
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authorName = BRAND.author,
  breadcrumbs,
  faqs,
  schemaType,
  reviewScore,
}) => {
  const pageTitle = title ? (title.includes(BRAND.name) ? title : title + ' — ' + BRAND.name) : BRAND.name + ' — ' + BRAND.tagline + ' | Gaming News, Reviews & Esports';
  const canonical = canonicalUrl && /^https?:\/\//.test(canonicalUrl) ? canonicalUrl : undefined;

  useEffect(() => {
    const setMeta = (attribute: string, key: string, content: string) => {
      let element = document.querySelector('meta[' + attribute + '="' + key + '"]');
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    const removeMeta = (attribute: string, key: string) => document.querySelector('meta[' + attribute + '="' + key + '"]')?.remove();

    document.title = pageTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', BRAND.name);
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', description);
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    } else {
      removeMeta('property', 'og:image');
      removeMeta('name', 'twitter:image');
    }
    if (canonical) setMeta('property', 'og:url', canonical);
    else removeMeta('property', 'og:url');

    const existingCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      const link = existingCanonical || document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonical);
      if (!existingCanonical) document.head.appendChild(link);
    } else {
      existingCanonical?.remove();
    }

    document.querySelectorAll('script[data-seo-jsonld]').forEach(element => element.remove());
    const organization: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: BRAND.name,
      description: BRAND.subheading,
    };
    if (BRAND.url) {
      organization.url = BRAND.url;
      organization.logo = BRAND.url + '/favicon.svg';
    }
    if (BRAND.socialLinks.length) organization.sameAs = BRAND.socialLinks.map(social => social.url);

    const jsonLdData: Record<string, unknown>[] = [organization];
    if (breadcrumbs?.length && BRAND.url) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.url,
        })),
      });
    }
    if (schemaType === 'Article' || ogType === 'article') {
      const articleSchema: Record<string, unknown> = {
        '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title,
        datePublished: publishedTime, dateModified: modifiedTime || publishedTime,
        author: { '@type': 'Person', name: authorName },
        publisher: { '@type': 'Organization', name: BRAND.name }, description,
      };
      if (ogImage) articleSchema.image = [ogImage];
      jsonLdData.push(articleSchema);
    }
    if (schemaType === 'Review' && reviewScore !== undefined) {
      jsonLdData.push({
        '@context': 'https://schema.org', '@type': 'Review', name: title,
        reviewRating: { '@type': 'Rating', ratingValue: reviewScore, bestRating: 10, worstRating: 1 },
        author: { '@type': 'Person', name: authorName },
        publisher: { '@type': 'Organization', name: BRAND.name },
      });
    }
    if (faqs?.length) {
      jsonLdData.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      });
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonld = 'true';
    script.textContent = JSON.stringify(jsonLdData);
    document.head.appendChild(script);
    return () => script.remove();
  }, [title, pageTitle, description, canonical, ogImage, ogType, publishedTime, modifiedTime, authorName, breadcrumbs, faqs, schemaType, reviewScore]);

  return null;
};
