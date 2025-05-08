'use client';
import React from 'react';
import Image from 'next/image';

const Img = ({
  className,
  src = '/images/logos/defaultNoData.png',
  alt = 'image',
  isStatic = false,
  width,
  height,
  ...restProps
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const BASE_URL = '/images/';

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      className={className || ''}
      src={
        isStatic ? imgSrc : imgSrc.startsWith('/') ? imgSrc : BASE_URL + imgSrc
      }
      alt={alt}
      width={width || 100}
      height={height || 100}
      {...restProps}
      onError={() => {
        setImgSrc('/images/logos/defaultNoData.png');
      }}
    />
  );
};

export { Img };
