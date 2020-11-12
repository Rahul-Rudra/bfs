import React, { useEffect } from 'react';

import FormBanner from './FormBanner';

const VideoBannerSection = ({ BannerVideoUrl }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='banner-section video-banner-sec position-relative'>
      <div className="vid-banner-sec">
        <div style={{ padding: '56.25% 0 0 0',position: 'relative' }}>
          <iframe
            src={BannerVideoUrl ? `//player.vimeo.com/video/${/[^/]*$/.exec(BannerVideoUrl)[0]}?muted=1&background=1&title=0&loop=1&autopause=0` : ''}
            style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
            frameBorder='0'
            allowFullScreen
            allow='encrypted-media'
            title='Builders FirstSource Assemblers'
          />
        </div>
      </div>

      <FormBanner />
    </div>
  );
};

export default VideoBannerSection;
