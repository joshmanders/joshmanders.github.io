import { format } from 'date-fns';
import { graphql, Link } from 'gatsby';
import React, { FunctionComponent, Fragment } from 'react';
import Helmet from 'react-helmet';
import { Shell } from './Shell';
import { CompactBio as Bio } from './Bio';

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        description
      }
      html
      timeToRead
      wordCount {
        words
      }
    }
  }
`;

interface PostProps {
  data: {
    post: {
      frontmatter: {
        title: string;
        description: string;
      };
      html: string;
      timeToRead: number;
      wordCount: {
        words: number;
      };
    };
  };
  pageContext: {
    slug: string;
    date: string;
    previous?: {
      parent: {
        name: string;
      };
      frontmatter: {
        title: string;
      };
    };
    next?: {
      parent: {
        name: string;
      };
      frontmatter: {
        title: string;
      };
    };
  };
}

const Post: FunctionComponent<PostProps> = ({
  data: {
    post: {
      frontmatter: { title, description },
      html,
      timeToRead,
      wordCount: { words },
    },
  },
  pageContext: { slug, date, previous, next },
}) => {
  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Shell meta={{ title, description, slug }}>
        <h3 className="text-lg md:text-2xl font-semibold mb-4">
          <Link to="/" title="Thoughts, Stories &amp; Ideas">
            Thoughts, Stories &amp; Ideas
          </Link>
        </h3>
        <article>
          <h1 className="text-xl md:text-3xl font-semibold">{title}</h1>
          <div className="text-sm md:text-normal my-2 italic">
            <span>{format(new Date(`${date} 00:00`), 'LLLL do, yyyy')}</span>
            <span className="mx-2">-</span>
            <span>{words} words</span>
            <span className="mx-2">-</span>
            <span>{timeToRead} min read</span>
          </div>
          <div className="mt-4 md:mt-6 markdown-rendered" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <Bio />
        <ul className="mb-4 md:mb-6 flex flex-col md:flex-row md:flex-wrap md:justify-between">
          <li className="mb-2 md:mb-0 self-center md:self-auto">
            {previous && (
              <Link
                to={previous.parent.name.replace(/^(\d{4}-\d{2}-\d{2})-(.+)$/, '/$2')}
                className="border-b-2 border-brand hover:text-brand text-sm md:text-lg"
                title={`Previous: ${previous.frontmatter.title}`}
              >
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className="mt-2 md:mt-0 self-center md:self-auto">
            {next && (
              <Link
                to={next.parent.name.replace(/^(\d{4}-\d{2}-\d{2})-(.+)$/, '/$2')}
                className="border-b-2 border-brand hover:text-brand text-sm md:text-lg"
                title={`Next: ${next.frontmatter.title}`}
              >
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Shell>
    </Fragment>
  );
};

export default Post;
