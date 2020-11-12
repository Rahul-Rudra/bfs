import React from 'react';

import '../../css/Loader.css';

export default function Loader({width = '100%', height = '100%'}) {
  return (
    <div
      className='LoaderWrapper'
      style={{width, height}}
    >
      <div className='LoaderContent'>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>
  );
}
