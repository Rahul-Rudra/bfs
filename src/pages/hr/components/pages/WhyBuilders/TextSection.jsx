import React from 'react';

import Awards from '../../common/Awards';
import Navigation from '../../common/Navigation';
import BfsCares from '../../common/BfsCares';

const VisionMissionValuesSection = ({awards, bfsCares, values}) => {
  if (values) {
    const {Title, Vision, Mission, Values, LeftSidePictureUrl} = values;
    const firstColValues = Values.slice(0, 2);
    const secondColValues = Values.slice(2);
    const formattedVision = Vision
      .replace('<p><span>', '<h6 class="text-uppercase font-weight-normal">')
      .replace('</span></p>', '</h6>')
      .replace('<p><span>', '<p class="small mb-0">')
      .replace('</span></p>', '</p>');
    const formattedMission = Mission
      .replace('<p><span>', '<h6 class="text-uppercase font-weight-normal">')
      .replace('</span></p>', '</h6>')
      .replace('<p><span>', '<p class="small mb-0">')
      .replace('</span></p>', '</p>');

    return (
      <div className='amazing-careers-sec mt-5'>
        <div className='container px-sm-3 px-0'>
          <div className='row'>
            <div className='col-xl-3 col-lg-4'>
              <Navigation/>
              <figure className='my-4'>
                <img
                  src={values ? process.env.base_url + values.LeftSidePictureUrl : ''}
                  alt='sidebar-img'
                  className='img-fluid w-100'
                />
              </figure>
              <Awards awards={awards}/>
            </div>
            <div className='col-xl-9 col-lg-8  pt-5 pt-lg-0'>
              <h5 className='text-blue mb-3 text-uppercase font-weight-bold mt-5 mt-md-0'>{Title}</h5>
              <div className='row'>
                <div className='col-md-6 mb-3 px-md-3 px-0'>
                  <div className='w-100 mb-3' dangerouslySetInnerHTML={{__html: formattedVision}}/>
                  <div className='w-100 mb-3' dangerouslySetInnerHTML={{__html: formattedMission}}/>
                  {firstColValues.map(({Title, Description}) => (
                    <div className='w-100 mb-3' key={Title}>
                      <h6 className='text-uppercase font-weight-normal'>{Title}</h6>
                      <p className='small mb-0'>{Description}</p>
                    </div>
                  ))}
                </div>
                <div className='col-md-6 mb-3  px-md-3 px-0'>
                  {secondColValues.map(({Title, Description}) => (
                    <div className='w-100 mb-3' key={Title}>
                      <h6 className='text-uppercase font-weight-normal'>{Title}</h6>
                      <p className='small mb-0'>{Description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='bfs-cares-sec'>
                <div className='row no-gutters overlay_container'>
                  <div className='col-md-6'>
                    <figure className='mb-0 h-100 bfs-cares-overlay'>
                      <img
                        src={require('../../../img/bfs-cares.jpg').default}
                        alt='bfs-cares.jpg'
                        className='w-100 h-100 object-cover'
                      />
                    </figure>
                    <div className='overlay overlay--right overlay--red'/>
                  </div>
                  <div className='col-md-6'>
                    <BfsCares bfsCares={bfsCares}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div/>;
};

export default VisionMissionValuesSection;
