import React, { useEffect } from 'react';
import { Youtube } from '../js/LoaderJS.js';
import useRequest, { STATUSES } from '../hooks/useRequest';
import { fetchVeteransPage } from '../api/requests';

import BannerSection from '../components/common/Banner';
import ProudSupporterSection from '../components/pages/Veterans/TextSection';
import MyExperienceSection from '../components/common/MyExperience';
import TeamMembers from '../components/pages/Veterans/TeamMembers';
import OurClients from '../components/common/OurClients';
import Loader from '../components/common/Loader';

const VeteransPage = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchVeteransPage);

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
    const { Title, SubTitle, MilitaryMakeoverVideo, Banner, MyExperience, ProudSupporter } = pageContent.data;
    MilitaryMakeoverVideo.Title = Title;
    return (
      <div className='whyBuilders'>
        <BannerSection data={Banner} />
        <ProudSupporterSection data={ProudSupporter} />
        <TeamMembers data={MilitaryMakeoverVideo} />
        <MyExperienceSection data={MyExperience} />
        <OurClients />
      </div>
    );
  }

  return null;
};

export default VeteransPage;
