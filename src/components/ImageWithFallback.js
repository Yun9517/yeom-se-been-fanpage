import React, { useState, useEffect } from 'react';

const ImageWithFallback = ({ filename, roundedCircle, fluid, rounded, className, ...props }) => {
  const cloudStorageBaseUrl = `https://storage.googleapis.com/yeom-se-been-fanpage-assets`; // Your actual bucket URL
  const localBaseUrl = process.env.PUBLIC_URL;

  const cloudStorageUrl = `${cloudStorageBaseUrl}/${filename}`;
  const localUrl = `${localBaseUrl}/${filename}`;

  const [currentSrc, setCurrentSrc] = useState(cloudStorageUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state if filename changes
    setCurrentSrc(cloudStorageUrl);
    setHasError(false);
  }, [filename, cloudStorageUrl]);

  const handleError = () => {
    if (!hasError) {
      setCurrentSrc(localUrl); // Fallback to local URL on error
      setHasError(true); // Prevent infinite loop if local also fails
    }
  };

  // Conditionally add classes
  const finalClassName = [
    className,
    roundedCircle ? 'rounded-circle' : '',
    !roundedCircle && rounded ? 'rounded' : '',
    fluid ? 'img-fluid' : ''
  ].filter(Boolean).join(' ');

  return (
    <img
      src={currentSrc}
      onError={handleError}
      alt={props.alt || filename} // Use filename as default alt text
      className={finalClassName}
      loading="lazy" // Add lazy loading attribute
      {...props}
    />
  );
};

export default ImageWithFallback;