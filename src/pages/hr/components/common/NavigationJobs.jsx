import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNavigation } from '../../api/requests';

import useRequest from '../../hooks/useRequest';

const NavigationJobs = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchNavigation);
  const [active, setActive] = useState('');

  useEffect(() => {
    const parts = window.location.href.split('/');
    const lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    setActive('/' + lastSegment + '/');
  });

  useEffect(() => {
    fetchPageContent();
  }, []);

  return pageContent.data && (
    <div className='list-group list-group-flush bg-custom-light' style={{"maxHeight":"200px"}}>
      {pageContent.data.map((item) => (
        <Link
          key={item.Url}
          to={item.Url}
          className={item.Url === active
            ? 'list-links-layout list-group-item list-group-item-action bg-transparent border-0 text-uppercase text-blue h6 active-link'
            : 'list-links-layout list-group-item list-group-item-action bg-transparent border-0 text-uppercase text-blue h6'
          }
        >
          {item.Name}
        </Link>
      ))}
    </div>
  );
};

export default NavigationJobs;
