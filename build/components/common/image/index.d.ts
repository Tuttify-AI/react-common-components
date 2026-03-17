import React from 'react';
declare const Image: React.ForwardRefExoticComponent<React.ImgHTMLAttributes<HTMLImageElement> & {
    /**
     * used for static images -> if true do not show placeholder on loading
     */
    staticImage?: boolean | undefined;
    /**
     * url for custom placeholder
     */
    placeholderUrl?: string | undefined;
} & React.RefAttributes<HTMLImageElement>>;
export default Image;
