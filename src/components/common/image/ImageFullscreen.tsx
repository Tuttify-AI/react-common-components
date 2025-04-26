import React, { useRef, useState } from 'react';
import Image from '.';

type Props = {
  src: string;
  alt?: string;
};

const ImageFullscreen: React.FC<Props> = ({ src, alt = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const onClick = () => {
    if (containerRef?.current) {
      if (fullscreen) {
        setFullscreen(false);
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {
        setFullscreen(true);
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <Image 
        onClick={onClick} 
        src={src} 
        alt={alt} 
        style={{objectFit: fullscreen ? 'contain' : 'cover'}}
      />
    </div>
  );
};

export default ImageFullscreen;
