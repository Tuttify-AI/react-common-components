import React from 'react';
declare type Props = {
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
export declare const Title: React.FC<Props>;
export default Title;
