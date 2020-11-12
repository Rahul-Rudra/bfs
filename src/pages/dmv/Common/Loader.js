import React from 'react';

import './Loader.css';

export default function Loader({width = '100%', height = '100%', color = '#004bcf'}) {
  return (
    <div
      className='LoaderWrapper'
      style={{width, height}}
    >
      <div className='LoaderContent'>
        {[0, 1, 2, 3].map((item) => (
          <div key={item} style={{backgroundColor: color}}/>
        ))}
      </div>
    </div>
  );
}
