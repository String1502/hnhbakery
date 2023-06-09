import { Box, Skeleton } from '@mui/material';
import React from 'react';

export default function Skeleton_img(props: any) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <>
      {!isLoaded && (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
      <Box
        style={{ display: isLoaded ? 'block' : 'none' }}
        height={'100%'}
        width={'100%'}
        component={'img'}
        onLoad={handleImageLoad}
        loading="lazy"
        alt=""
        {...props}
      />
    </>
  );
}
