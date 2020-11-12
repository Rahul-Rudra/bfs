import React from 'react';

import FormBanner from './FormBanner';

import jobsIMG from '../../img/jobsIMG.jpg';

const BannerSection = ({
  data: { Url, Name },
  fetchPageContent,
  setVal,
  setData,
  setOriginalData,
  setLoading,
  setLocation,
  setKeywords,
  setRadius,
  setSortSelected,
  jobsPage,
  headerSearch
}) => {

  return (
    <div className='internal-banner position-relative vision-banner'>
      <div className='slide col-12 p-0'>
        <img
          className='banner-img'
          src={jobsPage ? jobsIMG : process.env.base_url + Url}
          alt='hero-image'
        />
      </div>

      <FormBanner
        fetchPageContent={fetchPageContent}
        setData={setData}
        setOriginalData={setOriginalData}
        setLoading={setLoading}
        setLocation={setLocation}
        setKeywords={setKeywords}
        setRadius={setRadius}
        setSortSelected={setSortSelected}
        setVal={setVal}
        headerSearch={headerSearch ? headerSearch : undefined}
      />
    </div>
  );
};

export default BannerSection;
