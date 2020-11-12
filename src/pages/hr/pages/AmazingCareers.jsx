import React, { useEffect, useState } from 'react';

import useRequest, { STATUSES } from '../hooks/useRequest';
import { fetchCareersPage } from '../api/requests';

import VideoBannerSection from '../components/common/VideoBanner';
import TextSection from '../components/pages/AmazingCareers/TextSection';
import TeamMembers from '../components/pages/AmazingCareers/TeamMembers';
import CareerAwaits from '../components/common/CareerAwaits';
import OurClients from '../components/common/OurClients';
import Loader from '../components/common/Loader';
import { Youtube } from '../js/LoaderJS.js';
const AmazingCareersPage = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchCareersPage);
  const [playing, setPlaying] = useState(50);

  // useEffect(() => {
  //   Youtube();
  // }, []);
  useEffect(() => {
    fetchPageContent();
  }, []);


  if (pageContent.status === STATUSES.LOADING) {
    return (
      <Loader height='500px' />
    );
  }

  if (pageContent.data) {
    const { Title, SubTitle, BannerVideoUrl, HearFromOurTeamMembers, YourNewCareerAwaits } = pageContent.data;

    return (
      <div className='amazingCareers'>
        <VideoBannerSection BannerVideoUrl={BannerVideoUrl} />
        <TextSection title={Title} subTitle={SubTitle} />
        <TeamMembers
          data={HearFromOurTeamMembers}
          playing={playing}
          setPlaying={setPlaying}
        />
        <CareerAwaits
          playing={playing}
          setPlaying={setPlaying}
          data={YourNewCareerAwaits}
        />
        <OurClients />
      </div>
    );
  }

  return null;
};

export default AmazingCareersPage;
