import React, { useEffect } from 'react';

import useRequest, { STATUSES } from '../hooks/useRequest';
import { fetchBuildersPage } from '../api/requests';

import BannerSection from '../components/common/Banner';
import VisionMissionValuesSection from '../components/pages/WhyBuilders/TextSection';
import TeamMembers from '../components/pages/WhyBuilders/TeamMembers';
import TeamMemberBenefitsSection from '../components/common/TeamMemberBenefits';

import Loader from '../components/common/Loader';
import OurClients from '../components/common/OurClients';

const WhyBuildersPage = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchBuildersPage);

  useEffect(() => {
    fetchPageContent();
  }, []);

  if (pageContent.status === STATUSES.LOADING) {
    return (
      <Loader height='500px' />
    );
  }

  if (pageContent.data) {
    const { Title, SubTitle, Banner, VisionMissionValues, Awards, BfsCares, TeamMemberBenefits, HearFromOurTeamMembers } = pageContent.data;

    return (
      <div className='whyBuilders'>
        <BannerSection data={Banner} />
        <VisionMissionValuesSection
          awards={Awards}
          bfsCares={BfsCares}
          values={VisionMissionValues}
        />
        <TeamMemberBenefitsSection benefits={TeamMemberBenefits} />
        <TeamMembers teamMember={HearFromOurTeamMembers} />
        <OurClients />
      </div>
    );
  }

  return null;
};
export default WhyBuildersPage;
