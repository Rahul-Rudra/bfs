import React from 'react';

import Navigation from '../../common/Navigation';
import ApplyButton from '../../common/ApplyButton';

const TextSection = ({title, subTitle}) => (
  <div className='amazing-careers-sec mt-5'>
    <div className='container px-sm-3 px-0'>
      <div className='row'>
        <div className='col-xl-3 col-lg-4'>
          <Navigation/>
          <ApplyButton/>
        </div>
        <div className='col-xl-9 col-lg-8 pt-5 pt-lg-0'>
          <h5 className='text-blue mb-3 text-uppercase heading-text'>
            {title}
          </h5>
          <div dangerouslySetInnerHTML={{__html: subTitle}}/>
        </div>
      </div>
    </div>
  </div>
);

export default TextSection;
