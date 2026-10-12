import React from 'react';
import { Article } from '../../types';
import {
  ArticleParagraph,
  ArticleHeading,
  ArticleImage,
  ArticleQuote,
  ArticleHighlight,
  ArticleInfoBox,
  ArticleWarningBox,
  ArticleProsCons,
  ArticleVideoPlaceholder,
  ArticleFAQ,
} from './ArticleComponents';

interface ArticleBodyProps {
  article: Article;
  className?: string;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article, className = '' }) => {
  return (
    <div className={`article-prose ${className}`}>
      {article.contentBlocks && article.contentBlocks.length > 0 ? (
        article.contentBlocks.map((block, index) => {
          switch (block.type) {
            case 'paragraph':
              return <ArticleParagraph key={index}>{block.text}</ArticleParagraph>;

            case 'heading':
              return (
                <ArticleHeading
                  key={index}
                  level={block.level || 2}
                  id={block.id}
                >
                  {block.text}
                </ArticleHeading>
              );

            case 'image':
              return (
                <ArticleImage
                  key={index}
                  src={block.src || ''}
                  alt={block.alt || article.title}
                  caption={block.caption}
                />
              );

            case 'quote':
              return (
                <ArticleQuote
                  key={index}
                  text={block.text || ''}
                  author={block.author}
                  role={block.role}
                />
              );

            case 'highlight':
              return <ArticleHighlight key={index} text={block.text || ''} />;

            case 'infobox':
              return (
                <ArticleInfoBox
                  key={index}
                  title={block.title}
                  text={block.text || ''}
                />
              );

            case 'warningbox':
              return (
                <ArticleWarningBox
                  key={index}
                  title={block.title}
                  text={block.text || ''}
                />
              );

            case 'proscons':
              return (
                <ArticleProsCons
                  key={index}
                  pros={block.pros || []}
                  cons={block.cons || []}
                />
              );

            case 'video':
              return (
                <ArticleVideoPlaceholder
                  key={index}
                  title={block.title}
                  caption={block.caption}
                />
              );

            default:
              return null;
          }
        })
      ) : (
        <ArticleParagraph>{article.excerpt}</ArticleParagraph>
      )}

      {/* Render FAQs if available */}
      {article.faqs && article.faqs.length > 0 && <ArticleFAQ faqs={article.faqs} />}
    </div>
  );
};
