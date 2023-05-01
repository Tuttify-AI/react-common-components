import React, { useRef, useState } from 'react';
import Image from '.';

type Props = {
  src: string;
  alt?: string;
};

const ImageFullscreen: React.FC<Props> = ({ src, alt = '' }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const onClick = () => {
    if (imageRef?.current) {
      if (fullscreen) {
        setFullscreen(false);
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {
        setFullscreen(true);
        imageRef.current.requestFullscreen();
      }
    }
  };

  return <Image ref={imageRef} onClick={onClick} src={src} alt={alt} />;
};

export default ImageFullscreen;
