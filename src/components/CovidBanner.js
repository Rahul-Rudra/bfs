import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const CovidBanner = ({isDesktop = false}) => {
  const [show, setShow] = useState(true);

  return show && (
    <div className={`covid-banner ${isDesktop ? 'covid-banner-desktop' : ''}`}>
      <b>The health and safety of our employees, customers and communities is our top priority.&nbsp;</b>
      <span>Read about&nbsp;<Link to='/covid-19-update'>our response</Link>&nbsp;to COVID-19.</span>
      <span className='covid-close' onClick={() => setShow(false)}>&times;</span>
    </div>
  );
};

export default CovidBanner;
