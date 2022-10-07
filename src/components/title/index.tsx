import React from 'react';
import { Helmet } from 'react-helmet';

type Props = {
  /**
   * Page title
   */
  title: string;
  /**
   * Page meta description
   */
  description?: string;
};

/**
 * Page title component on top of react-helmet.
 * Used in all pages
 */
export const Title: React.FC<Props> = ({ title, description = '' }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
  </Helmet>
);

export default Title;
