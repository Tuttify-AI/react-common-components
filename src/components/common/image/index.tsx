import React, { useCallback, useMemo, useState } from 'react';
import imagePlaceholder from './placeholder';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * used for static images -> if true do not show placeholder on loading
   */
  staticImage?: boolean;
  /**
   * url for custom placeholder
   */
  placeholderUrl?: string;
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, staticImage = false, placeholderUrl, alt, draggable = false, ...rest }, ref) => {
    const [error, setError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const onError = useCallback(() => setError(true), []);

    const onLoad = useCallback(() => setLoading(false), []);

    const placeholder = useMemo(() => placeholderUrl || imagePlaceholder, [placeholderUrl]);

    const showPlaceholder = useMemo(
      () => error || !src || (isLoading && !staticImage),
      [error, src, isLoading, staticImage]
    );

    return (
      <img
        ref={ref}
        src={showPlaceholder ? placeholder : src}
        className={className}
        alt={alt}
        onError={onError}
        onLoad={onLoad}
        draggable={draggable}
        {...rest}
      />
    );
  }
);

export default Image;
