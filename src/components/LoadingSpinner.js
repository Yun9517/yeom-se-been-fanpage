import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
      <ClipLoader color={"#123abc"} loading={loading} size={50} />
    </div>
  );
};

export default LoadingSpinner;