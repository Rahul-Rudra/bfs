import React, { useEffect } from 'react';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Geocode from "react-geocode";
import axios from 'axios';
import states from './../../states';

const FormBanner = (props) => {
  const [keywords, setKeywords] = useState(undefined);
  const [location, setLocation] = useState(undefined);
  const [radius, setRadius] = useState(0);
  const [locationError, setLocationError] = useState(undefined);
  const [keywordsError, setkeywordsError] = useState(undefined);
  const [radiusError, setradiusError] = useState(undefined);
  const [valid, setValid] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('')
  const [isZip, setIzZip] = useState(false);
  const [zip1, setZip] = useState(false);
  const [selected, setSelected] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchOptions = {
    componentRestrictions: { country: ['us'] },
    types: ['(regions)']
  };

  useEffect(() => {
    // **************** WHENEVER THERE IS CHANGE IN HEADER INPUTS,
    //    CHANGE THEM IN THE JOB PAGE TOO ************************
    if (props.setKeywords) props.setKeywords(keywords);
    if (props.setLocation) props.setLocation(location);
    if (props.setRadius) props.setRadius(radius);
    if (props.setVal) props.setVal(value);
    console.log('EFFECT*******');
    // if (!location) reInitialize();
  }, [keywords, location, radius, value]);

  useEffect(() => {
    console.log('props.location.state HERE');
    console.log(props.location.state);
    console.log('props');
    console.log(props);
    if (props.headerSearch) {
      let { keywords, location, radius, value } = props.headerSearch;
      setValue(value);
      setKeywords(keywords);
      setLocation(value);
      setRadius(radius);
      console.log(keywords)
      console.log(value)
      console.log(radius)
      console.log(location)
      if (props.setKeywords) props.setKeywords(keywords);
      if (props.setLocation) props.setLocation(location);
      if (props.setRadius) props.setRadius(radius);
      if (props.setVal) props.setVal(value);
    }
  }, [props.location]);
  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  }

  // ************ SUBMIT SEARCHING CRITERIA, WITH VALIDATIONS FOR FIELDS *****************
  function submit() {
    console.log('submit')
    if (props.setSortSelected) {
      props.setSortSelected(0); console.log('sort RESET^^^^^^^^^^^^^^')
    }
    var tempPostal = undefined;
    // setValue('');
    if (!location) setIzZip(true);
    if (value === '' && !keywords && !radius) {
      setLocationError('Please enter atleast one query to search')
    }
    else if (value === '' && radius > 0) {
      setLocationError('Radius must be used with location')
    }
    else if (value === "" && !keywords && !radius
      || !value && !keywords && radius == 0) {
      setLocationError('Please enter atleast one query to search')
    }
    else {
      // *********** WHEN THERE IS EITHER LOCATION OR PINCODE ************
      if (value !== '') {
        if (location && !/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
          // *********** WHEN LOCATION, SELECTED BY DROPDOWN
          // WE GET THE CITY/STATE NAME ACCORDING TO THE INPUT  *****************
          setLocationError('')
          setValue(value);

          let theString = location.split(',', 1)[0];
          console.log('theString');
          console.log(theString);
          let found = undefined;
          Object.entries(states).forEach(([key, value]) => {
            if (value == theString) found = key;
          })
          console.log('found');
          console.log(found);
          let tempPostal = undefined;
          if (location) {
            if (location.match(/,/g).length == 1) {
              // state case
              tempPostal = found; console.log('case 1'); console.log(location)
            }
            else {
              // city case, delete string after last comma
              tempPostal = location.replace(/,[^,]+$/, ""); console.log('case 2'); console.log(location)
            }
          }
          if (tempPostal) tempPostal = tempPostal.replace(/\s*,\s*/g, ",");   // delete space after comma
          // let tempPostal = location.replace(/,[^,]+$/, "");  // DELETE ALL AFTER LAST COMMA

          if (tempPostal) setLocation(tempPostal);
          console.log('tempPostal')
          console.log(tempPostal)
          let tempHeaderSearch = { keywords: keywords, location: tempPostal, radius: radius > 0 ? radius : 0, value: value };
          var parts = window.location.href.split('/');
          var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
          // ************IF WE ARE NOT ON JOBS PAGE, WE SET THE JOBS PAGE PROPS FOR SEARCHING
          // THIS CONDITION IS BEING USED MULTIPLE TIMES IN DIFFERENT SITUATIONS ****************
          if (lastSegment !== 'jobs') {
            props.history.push({
              pathname: '/jobs',
              state: { headerSearch: tempHeaderSearch }
            })
            return;
          }
          // ************* THIS IS WHEN WE ARE ALREADY ON JOBS PAGE ************************
          else {
            var url = '';
            url = process.env.base_url +
              'umbraco/api/JobFeed/GetJobsWithParameters?';
            if (keywords) {
              url += 'keyword=' + keywords
            }
            if (tempPostal) {
              if (!keywords) {
                url += 'location=' + tempPostal
              } else { url += '&location=' + tempPostal }
            }
            if (radius > 0) {
              if (!keywords && !tempPostal) {
                url += 'radius=' + radius
              }
              else {
                url += '&radius=' + radius
              }
            }
            console.log('url in formBanner Location case');
            console.log(url);
            setSearching(true);
            props.setLoading(true);
            axios.get(url)
              .then(response => {
                props.fetchPageContent(response.data);
                props.setData(response.data);
                props.setOriginalData(response.data);
                props.setLoading(false);
                setSearching(false);
              }).catch(error => { console.log(error.response); setSearching(false); setLoading(false); })
          }
          //     }
          //     ,
          //     error => {
          //       console.error(error);
          //     }
          //   );
          // })
          // .catch(error => console.error('Error', error));
        }
        else if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)) {
          // ********************* ENTERED INPUT IS PINCODE, WE DO NOT USE GOOGLE AUTOCOMPLETE FOR THIS
          // ENTERED PINCODE WILL BE DIRECTLY SENT TO API IN LOCATION PARAMETER **********************
          setLocationError('')
          console.log('pincode here');
          let tempHeaderSearch = { keywords: keywords, location: value, radius: radius > 0 ? radius : 0, value: value };
          console.log('tempHeaderSearch');
          console.log(tempHeaderSearch);
          var parts = window.location.href.split('/');
          var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
          if (lastSegment !== 'jobs') {
            props.history.push({
              pathname: '/jobs',
              target: "_blank",
              state: { headerSearch: tempHeaderSearch }
            })
            return;
          }
          else {
            // ********************* NO FILTERING, GET ALL RESULTS********************
            var url = '';
            url = process.env.base_url +
              'umbraco/api/JobFeed/GetJobsWithParameters?';
            if (keywords) {
              url += 'keyword=' + keywords
            }
            if (value) {
              if (!keywords) {
                url += 'location=' + value
              } else { url += '&location=' + value }
            }
            if (radius > 0) {
              if (!keywords && !location && value == '') {
                url += 'radius=' + radius
              }
              else {
                url += '&radius=' + radius
              }
            }
            console.log('url in formBanner FOR PINCODE case');
            console.log(url);
            if (props.setLoading) props.setLoading(true);
            setSearching(true)
            axios.get(url)
              .then(response => {
                props.fetchPageContent(response.data);
                props.setData(response.data);
                props.setOriginalData(response.data);
                props.setLoading(false);
                setSearching(false)
              }).catch(error => { console.log(error.response); setSearching(false); setLoading(false); })
          }
        }
        else {
          setLocationError('Please select a location')
        }
      }
      else {
        // HANDLE THE OTHER 2 INPUT FIELDS- KEYWORD AND RADIUS
        console.log('Hit API Outside Location')
        var parts = window.location.href.split('/');
        var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
        if (lastSegment !== 'jobs') {
          let headerSearch = { keywords: keywords ? keywords : null, location: isZip ? value : tempPostal ? tempPostal : null, radius: radius > 0 ? radius : 0, value: value };
          props.history.push({
            pathname: '/jobs',
            target: "_blank",
            state: { headerSearch: headerSearch }
          });
          return;
        }
        else {
          let url = process.env.base_url +
            'umbraco/api/JobFeed/GetJobsWithParameters?';
          if (keywords) {
            url += 'keyword=' + keywords
          }
          if (isZip || tempPostal) {
            if(value!=='' && value){
            if (!keywords) {
              url += isZip ? 'location=' + value : 'location=' + tempPostal
            } else { url += isZip ? '&location=' + value : '&location=' + tempPostal }
          }
          }
          if (radius > 0) {
            if (!keywords && !isZip && !tempPostal) {
              url += 'radius=' + radius
            }
            else {
              url += '&radius=' + radius
            }
          }
          console.log('url OVERALL SEARCH inside formBanner,same page');
          console.log(url);
          props.setLoading(true);
          setSearching(true);
          axios.get(url)
            .then(response => {
              props.fetchPageContent(response.data);
              props.setData(response.data);
              props.setOriginalData(response.data);
              props.setLoading(false);
              setSearching(false);
            }).catch(error => { console.log(error.response); setSearching(false); setLoading(false); })
        }
      }
      setLocation(value);
    }
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    if (lastSegment == 'jobs') {
      props.location.state = undefined;
    }
  }
  const reInitialize = () => {
    // setValue('')
    // setValue('');
    console.log('reinitialized.....');
    setLocation(undefined);
    console.log(location);
    if (props.setLocation) props.setLocation(undefined);
  };

  const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions, loading, shouldDisplayListView = true }) => {
    return (
      <div className="autocomplete-root">
        <input
          {...getInputProps({
            placeholder: 'City, State or Zip',
            className: 'location-search-input',
            onFocus: reInitialize,
            disabled:searching,
            onKeyDown: _handleKeyDown

          })} />
        <div hidden={value.charAt(0) <= '9' && value.charAt(0) >= '0'} className="autocomplete-dropdown-container">
          {loading && <div>Loading...</div>}
          {suggestions.map(suggestion => (
            <div {...getSuggestionItemProps(suggestion)}>
              <span
                style={{ cursor: "pointer", width: "100%", display: "block" }}
                onClick={() => setLocation(suggestion.description)}
              >
                {suggestion.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='from-banner'>
      <div className='container h-100'>
        <div className='row h-100'>
          <div className='job-form w-100 px-xl-3 mb-lg-5 pb-xl-0 pb-lg-5'>
            <div className='row align-items-center justify-content-center w-100 job-form-inner'>
              <div className='col-lg-11 col-12 banner-title'>
                <h4 className='font-weight-bold text-white pb-xl-4 pb-2'>Search Jobs</h4>
              </div>
              <div className='col-lg-3 input-wrapper'>
                <div className='form-group'>
                  <label htmlFor='keywords' className='text-white input-label'>Keywords</label>
                  <input
                    onChange={e => setKeywords(e.target.value)}
                    value={keywords}
                    disabled={searching}
                    type='text'
                    className='form-control rounded-0 border-0'
                    id='keywords'
                    placeholder='Enter a keyword to Search'
                    onKeyDown={_handleKeyDown}
                  />

                  <span className="text-danger banner-error-msg" >{keywordsError}</span>
                </div>
              </div>
              <div className='col-lg-3 input-wrapper'
              >
                <div className='form-group'>
                  <label htmlFor='location' className='text-white input-label'>Location</label>
                  <PlacesAutocomplete
                    searchOptions={searchOptions}
                    value={value}
                    onChange={(value) => setValue(value)}

                  >
                    {/* custom render function */}
                    {renderFunc}
                  </PlacesAutocomplete>
                  <span className="text-danger banner-error-msg" >{locationError}</span>
                </div>
              </div>
              <div className='col-lg-3 input-wrapper'>
                <div className='form-group'>
                  <label htmlFor='radius' className='text-white input-label'>Radius</label>
                  <Form.Group controlId="exampleForm.SelectCustom" className="mb-0">
                    <Form.Control
                      as="select"
                      disabled={searching}
                      value={radius}
                      onChange={e => setRadius(e.target.value)} className="custom_input_Select border-0"
                      onKeyDown={_handleKeyDown}
                    >
                      <option value={0}>Choose Radius ...</option>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </Form.Control>
                  </Form.Group>
                  <span className="text-danger banner-error-msg" >{radiusError}</span>
                </div>
              </div>
              <div className='col-lg-2 '>
                <div className='form-group job-form-btn pt-4 mt-1'>
                  <button
                    disabled={searching}
                    onClick={submit} className='btn btn-danger text-uppercase theme-btn py-2 btn-block'>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(FormBanner);

