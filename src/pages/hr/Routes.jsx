import React, {useEffect, useState} from 'react';

import AppliedRoute from '../../route/AppliedRouting';
import AmazingCareersPage from './pages/AmazingCareers';
import WhyBuildersPage from './pages/WhyBuilders';
import TraineesInternshipsPage from './pages/TraineesInternships';
import VeteransPage from './pages/Veterans';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Geocode from 'react-geocode';

function Routes({childProps}) {
  const [jobs, setJobs] = useState(false);
  const [position, setPosition] = useState('');
  const [locationError, setLocationError] = useState(undefined);
  const [postal, setPostal] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const onChange = ({ coords }) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  const onError = (error) => {
    setLocationError(error.message);
  };

  // to ask for location, don't ask when user is on jobs page
  useEffect(() => {
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    if (lastSegment !== 'jobs') {
      const geo = navigator.geolocation;
      if (!geo) {
        setLocationError('Geolocation is not supported');
        return;
      }
      const watcher = geo.watchPosition(onChange, onError);
      return () => geo.clearWatch(watcher);
    }
  }, []);

  // to get zipcode from lat and long
  useEffect(() => {
    if (position) {
      if (position.latitude && position.latitude !== '') {
        Geocode.setApiKey("AIzaSyBhQ3UkZ7rKzSGP003tRpuOdyqHxw5Nhro");
        Geocode.setLanguage("en");
        // get zipcode from lat long
        var tempPostal = null;
        Geocode.fromLatLng(position.latitude, position.longitude).then(
          response => {
            var results = response.results;
            for (var i = 0; i < results.length; ++i) {
              if (results[i].types[0] == "postal_code") {
                tempPostal = results[i].long_name;
              }
            }
            if (!tempPostal) {
              var tempResult = results[0].address_components;
              for (var i = 0; i < tempResult.length; ++i) {
                if (tempResult[i].types[0] == "postal_code") {
                  tempPostal = tempResult[i].long_name;
                }
              }
            }
            setPostal(tempPostal);
            localStorage.setItem('postalCodeBFS', tempPostal);
          },
          error => {
            console.error(error);
          }
        );
      }
    }
  }, [position]);

  return (
    <>
      <AppliedRoute exact path='/amazing-careers' component={AmazingCareersPage}/>
      <AppliedRoute exact path='/interns' component={TraineesInternshipsPage}/>
      <AppliedRoute exact path='/trainees-internships' component={TraineesInternshipsPage}/>
      <AppliedRoute exact path='/traineesinternships' component={TraineesInternshipsPage}/>
      <AppliedRoute exact path='/why-builders' component={WhyBuildersPage}/>
      <AppliedRoute exact path='/veterans' component={VeteransPage}/>
      <AppliedRoute
        path='/jobs'
        component={Jobs}
        props={{
          ...childProps,
          setJobs,
          postal,
          loading,
          setLoading,
        }}
      />
      <AppliedRoute
        path='/job-detail'
        component={JobDetail}
        props={{
          ...childProps,
          setJobs,
        }}
      />
    </>
  );
}

export default Routes;
