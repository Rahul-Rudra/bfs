import React from 'react';

import Navigation from '../../common/Navigation.jsx';

const ProudSupporterSection = ({data: {Title, SubTitle}}) => (
  <div className='amazing-careers-sec mt-5'>
    <div className='container px-sm-3 px-0'>
      <div className='row'>
        <div className='col-xl-3 col-lg-4'>
          <Navigation/>
        </div>
        <div className='col-xl-9 col-lg-8  pt-5 pt-lg-0'>
          <h5 className='text-blue mb-3 text-uppercase font-weight-bold'>{Title}</h5>
          <div className='row'>
            <div className='col-12 px-md-3 px-0' dangerouslySetInnerHTML={{__html: SubTitle}}/>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProudSupporterSection;
