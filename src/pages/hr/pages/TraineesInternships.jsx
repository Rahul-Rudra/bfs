import React, { useEffect } from 'react';

import useRequest, { STATUSES } from '../hooks/useRequest';
import { fetchInternsPage } from '../api/requests';

import BannerSection from '../components/common/Banner';
import TraineesInternshipSection from '../components/pages/TraineesInternships/TextSection';
import MyExperienceSection from '../components/common/MyExperience';
import CollegeRecruitingSection from '../components/common/CollegeRecruiting';
import Loader from '../components/common/Loader';
import OurClients from '../components/common/OurClients';

const TraineesInternshipsPage = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchInternsPage);

  useEffect(() => {
    fetchPageContent();
  }, []);

  if (pageContent.status === STATUSES.LOADING) {
    return (
      <Loader height='500px' />
    );
  }

  if (pageContent.data) {
    const { Title, SubTitle, Banner, TraineesInternship, MyExperience, CollegeRecruiting } = pageContent.data;

    return (
      <div className='whyBuilders'>
        <BannerSection data={Banner} />
        <TraineesInternshipSection data={TraineesInternship} />
        <MyExperienceSection data={MyExperience} />
        <CollegeRecruitingSection data={CollegeRecruiting} />
        <OurClients />
      </div>
    );
  }

  return null;
};

export default TraineesInternshipsPage;
