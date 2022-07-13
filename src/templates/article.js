import React from 'react';
import is from 'prop-types';
import { graphql } from 'gatsby';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styled from '@emotion/styled';
import Layout from './layout';
import WhiteContainer from '../components/white-container';
import Breadcrumb from '../components/breadcrumb';
import SEO from '../components/seo';

const rendererOptions = ({ locale = 'en-US' }) => ({
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
     if (node.data.uri.indexOf('scribehow.com') !== -1) {
        return (
          <IframeContainer>
            <iframe
              src={node.data.uri}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture ; fullscreen"
            />
          </IframeContainer>
        );
   } else
    return (
      <a
        href={node.data.uri}
        target='_blank'
        rel='noopener noreferrer'
      >{children}</a>

    );
},

    [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
      // check for assets only
      if (data.target.sys.type.linkType = 'Asset') return (
          <img
            src={data.target.fields.file[locale].url}
            alt={data.target.fields.title[locale]}
          />
        );
      }
    },
  }
);

const ArticleTitle = styled.h1`
  margin-bottom: 32px;

  color: #F66161;
  font-weight: 700;
  font-size: 28px;

  @media screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const IframeContainer = styled.span`
  padding-bottom: 56.25%; 
  position: relative; 
  display: block; 
  width: 100%;

  > iframe {
    height: 100%;
    width: 100%;
    position: absolute; 
    top: 0; 
    left: 0;
  }`

const ArticleContentContainer = styled.section`
  padding: 32px 94px;

  color: #536171;
  line-height: 1.5;
  font-size: 16px;

  h1 {
    font-size: 32px;
  }
  h2 {
    font-size: 28px;
  }
  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 20px;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 12px;
  }

  a {
    color: #3c80cf;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  code {
    display: inline-block;
    padding: 2px 10px;

    background-color: #fafafa;
    border-radius: 3px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    margin-left: 0;
    padding: 8px 0 8px 32px;

    line-height: 2;

    border-left: 5px solid #efefef;
  }

  @media screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export default function Article(props) {
  const { article } = props.data;

  return (
    <Layout withSearch={true}>
      <SEO
        title={article.title}
        description={article.description}
        lang={article.locale}
      />

      <Breadcrumb
        paths={[
          { url: '/', name: 'All categories' },
          { url: `/${article.category.slug}/`, name: article.category.name },
          { name: article.title },
        ]}
      />

      <article>
        <ArticleTitle>{props.data.article.title}</ArticleTitle>

        <WhiteContainer>
          <ArticleContentContainer>
            {documentToReactComponents(
              props.data.article.body.json,
              rendererOptions({ locale: article.locale })
            )}
          </ArticleContentContainer>
        </WhiteContainer>
      </article>
    </Layout>
  );
}

Article.propTypes = {
  data: is.shape({
    article: is.shape({
      title: is.string.isRequired,
      description: is.string.isRequired,
      locale: is.string.isRequired,
      category: is.shape({
        slug: is.string.isRequired,
        name: is.string.isRequired,
      }).isRequired,
      body: is.shape({
        json: is.any.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export const query = graphql`
  query Article($id: String) {
    article: contentfulKbAppArticle(id: { eq: $id }) {
      title
      slug
      description: metaDescription
      body {
        json
      }
      category: kbAppCategory {
        slug
        name
      }
      locale: node_locale
    }
  }
`;
