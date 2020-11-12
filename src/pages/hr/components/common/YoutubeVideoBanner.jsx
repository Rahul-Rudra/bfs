import React, { useEffect } from 'react';

import FormBanner from './FormBanner';

const YoutubeVideoBanner = ({ video }) => {

  return (
    <div className='banner-section video-banner-sec position-relative'>
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        <iframe
          style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
          src={video.replace('watch?v=', 'embed/')}
          frameBorder='0'
          allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        >
        </iframe>
      </div>
    </div>
  );
};

export default YoutubeVideoBanner;
