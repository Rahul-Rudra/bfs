import React from 'react';

const CollegeRecruitingSection = ({ data: { Title, Calendar, LeftSidePictureUrl } }) => (
  <div className='college-recruiting-sec mt-5'>
    <div className='container'>
      <div className='row'>
        <div className='col-lg-6 col-12'>
          <figure className='mb-0 h-100'>
            <img
              src={`${process.env.base_url}${LeftSidePictureUrl}`}
              alt='college-recruiting.jpg'
              className='w-100 h-100 college-recruiting-img object-cover'
            />
          </figure>
        </div>
        <div className='col-lg-6 col-12'>
          <div className='recruiting-text-con p-4 h-100 w-100'>
            <h5 className='text-blue mb-3 text-uppercase font-weight-bold'>{Title}</h5>
            {Calendar.map(({ Institution, Date, Location }, index) => (
              <div key={index} className='w-100 mb-3'>
                <h6 className='text-uppercase font-weight-normal text-dark'>{Location}</h6>
                <p className='font-14 mb-0 d-sm-flex'>
                  <span className='date-text'>{Date}</span><span className='text'>{Institution.split(',').map((i, ind) => <p key={ind} className='mb-0'>{i}</p>)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CollegeRecruitingSection;
