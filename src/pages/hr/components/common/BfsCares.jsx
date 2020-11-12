import React from 'react';

const BfsCares = ({bfsCares, bfsCares: {Title, Text, CTAText}}) => bfsCares && (
  <div className='p-4 w-100 d-flex flex-wrap bfs-cares'>
    <h6 className='text-white font-weight-bold'>{Title}</h6>
    <p className='text-white font-weight-light'>
      {Text.replace('<p><span>', '').replace('</span></p>', '')}
    </p>
    <a href='#' className='btn btn-light theme-btn ml-auto px-4 mr-sm-5 bfs-cares-btn'>{CTAText}</a>
    <div className='bfs-cares-transparent'/>
  </div>
);

export default BfsCares;
