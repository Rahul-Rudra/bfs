import React, { useEffect } from 'react'
import { Col, Row, Button, InputGroup, FormControl, Container, Form } from 'react-bootstrap';
import { useState } from 'react'
import Loader from '../components/common/Loader'
import LoaderInside from '../components/common/LoaderInside'
import axios from 'axios'
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import LoadingOverlay from 'react-loading-overlay';
import List from '../components/pages/Jobs/List'
import Header from '../components/pages/Jobs/Header';
import Footer from '../components/pages/Jobs/Footer';
import JobDetail from './JobDetail'
// import { Prompt } from 'react-router-dom';
import AdvancedSearch from '../components/pages/Jobs/AdvancedSearch';
import { fetchVeteransPage } from '../api/requests';
import useRequest, { STATUSES } from '../hooks/useRequest';
import BannerSection from '../components/common/Banner';
import states from '../states';
import Navigation from '../components/common/Navigation';
import NavigationJobs from '../components/common/NavigationJobs';

// paging for non-searching module
function handlePageChange(data, setData, originalData, setOriginalData, active, setActive, perPage, pageNumber) {
  setActive(pageNumber);
  let temp = [];
  let page = pageNumber > 0 ? (pageNumber - 1) : 0;
  // PAGINATION
  temp = originalData.slice(page * perPage, (page + 1) * perPage);
  setData(temp);
  window.scrollTo(500, 0);
}
// paging for searching module
function handlePageChangeForSearch(data, setData, originalDataSearch, setOriginalData, activePage, setActive, perPage, pageNumber) {
  setActive(pageNumber);
  let temp = [];
  let page = pageNumber > 0 ? (pageNumber - 1) : 0;
  // PAGINATION
  temp = originalDataSearch.slice(page * perPage, (page + 1) * perPage);
  setData(temp);
}
// global searching being performed on frontend,rest of the searching with APIs


export default function Jobs(props) {
  props.setJobs(true)
  const [tempObj, setObj] = useState(undefined);
  const [back, setBack] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [pageContent, fetchPageContent] = useState(undefined)
  const [error, setError] = useState(null)
  const perPage = 10;
  const [activePage, setActive] = useState(1);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [query, setQuery] = useState('');
  const [apiType, setApiType] = useState('state');
  const [apiQuery, setApiQuery] = useState('');
  const [originalDataSearch, setOriginalDataSearch] = useState([]);
  const loading = props.loading;
  const setLoading = props.setLoading;
  const [date, setDate] = useState(new Date);
  const [showDetail, setShowDetail] = useState(false);
  const [message, setMessage] = useState('');
  const [item, setItem] = useState(undefined);
  const [valid, setvalid] = useState(true);
  // CALL PAGING WHENEVER THERE IS CHANGE IN ORIGINAL DATA
  const [pageContent1, fetchPageContent1] = useRequest(fetchVeteransPage);
  const [key, setKeywords] = useState(undefined);
  const [loc, setLocation] = useState(undefined);
  const [rad, setRadius] = useState(undefined);
  const [val, setVal] = useState(undefined);
  const [sortSelected, setSortSelected] = useState(0);
  useEffect(() => {
    fetchPageContent1();
  }, []);
  useEffect(() => {
    // ************** Reset paging everytime there is change in originalData array ************************
    window.scrollTo(500, 0);
    handlePageChange(data, setData,
      originalData, setOriginalData, activePage, setActive, perPage, 1);

  }, [originalData]);
  useEffect(() => {
    // initial search
    console.log('props ***********');
    console.log(props);

    console.log('props HISTORY ***********');
    console.log(props);
    if (!props.postal && !localStorage.getItem('postalCodeBFS') && !props.location.state && !props.location.state) {
      // **************** overall search case without any criteria *****************************
      console.log('THE OVERALL CASE')
      axios.get(process.env.base_url + '/umbraco/api/JobFeed/GetJobsWithParameters')
        .then(response => {
          fetchPageContent(response.data);
          setData(response.data);
          setOriginalData(response.data);
        }).catch(error => setError(error))
    }
    else if (localStorage.getItem('postalCodeBFS') && !props.location.state) {
      console.log('THE PINCODE CASE')
      //********************/ current location searching case *********************************
      // LOCATION API
      let postalCode = props.postal ? props.postal : localStorage.getItem('postalCodeBFS');
      // let postalCode=29418
      axios.get(process.env.base_url + '/umbraco/api/JobFeed/GetJobsWithParameters?location=' + postalCode)
        .then(response => {
          fetchPageContent(response.data);
          setData(response.data);
          setOriginalData(response.data);
          setLoading(false);
        }).catch(error => { setError(error); console.log(error); setLoading(false); })
    }
    else {
      //*****************/ Header search inputs criteria case for searching. ****************************
      console.log('THE HEADER SEARCH CASE')
      let temp = { keywords: key, location: loc, radius: rad }
      let { keywords, location, radius } = props.location.state
        ? props.location.state.headerSearch : temp;
      setObj(props.location.state.headerSearch);
      var url = '';
      url = process.env.base_url +
        'umbraco/api/JobFeed/GetJobsWithParameters?'
      if (keywords) {
        url += 'keyword=' + keywords
      }
      if (location) {
        if (!keywords) {
          url += 'location=' + location
        } else { url += '&location=' + location }
      }
      if (radius > 0) {
        if (!keywords && !location) {
          url += 'radius=' + radius
        }
        else {
          url += '&radius=' + radius
        }
      }
      console.log('url In JOBS PAGE After Redirection');
      console.log(url);
      axios.get(url)
        .then(response => {
          fetchPageContent(response.data);
          setData(response.data);
          setOriginalData(response.data);
          setLoading(false);

        }).catch(error => { setError(error); console.log(error); setLoading(false); })
    }
    window.scrollTo(500, 0);
    console.log('props ***********!!!!!!!!!!');
    console.log(props);
  }, [])

  const sorting = (type) => {
    let temp = { keywords: key, location: loc, radius: rad }
    setSortSelected(type);
    var { keywords, location, radius } = props.location.state ?
      props.location.state.headerSearch : temp;
    setKeywords(keywords); setLocation(location); setRadius(radius)
    console.log('type');
    console.log(type);
    let url = process.env.base_url +
      'umbraco/api/JobFeed/GetJobsWithParameters?';
    if (localStorage.getItem('postalCodeBFS') && !props.location.state
      && !loc && !rad && !key) {
      // ********************sorting with location API   *********************************
      console.log('LOCATION AND SORTING');
      let tempURL = process.env.base_url + 'umbraco/api/JobFeed/GetJobsWithParameters?location='
        + localStorage.getItem('postalCodeBFS');

      if (type === 'date asc') {
        tempURL += '&orderby=lastupdated&order=asc'
      }
      else if (type === 'date desc') {
        tempURL += '&orderby=lastupdated&order=desc'
      } else if (type === 'city asc') {
        tempURL += '&orderby=city&order=asc'
      }
      else if (type === 'city desc') {
        tempURL += '&orderby=city&order=desc'
      }
      else if (type === 'radius asc') {
        tempURL += '&orderby=radius&order=asc'
      }
      else if (type === 'radius desc') {
        tempURL += '&orderby=radius&order=desc'
      }
      else if (type == 0) {
        tempURL = tempURL;
      }
      console.log('tempURL')
      console.log(tempURL)
      setLoading(true);
      axios.get(tempURL)
        .then(response => {
          fetchPageContent(response.data);
          setData(response.data);
          setOriginalData(response.data);
          setLoading(false);
        }).catch(error => { setError(error); console.log(error); setLoading(false); })
    }
    else {
      // *************** sorting with all other non-current-location API *************************
      if (keywords) {
        url += 'keyword=' + keywords
      }
      if (location || val.charAt(0) <= '9' && val.charAt(0) >= '0') {
        let theZip = val.charAt(0) <= '9' && val.charAt(0) >= '0';
        if (!keywords) {
          if (theZip) url += 'location=' + val;
          else {
            // comma handle here
            if (!props.location.state) {
              let theString = location.split(',', 1)[0];

              let found = undefined;
              Object.entries(states).forEach(([key, value]) => {
                if (value == theString) found = key;
              })

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
              url += 'location=' + tempPostal;
            }
            else {
              url += 'location=' + location;
            }

          }
        } else {
          if (theZip) url += '&location=' + val;
          else {
            // comma handle here
            if (!props.location.state) {
              let theString = location.split(',', 1)[0];
              let found = undefined;
              Object.entries(states).forEach(([key, value]) => {
                if (value == theString) found = key;
              })
              let tempPostal = undefined;
              if (location) {
                if (location.match(/,/g).length == 1) {
                  // state case
                  tempPostal = found; console.log(location)
                }
                else {
                  // city case, delete string after last comma
                  tempPostal = location.replace(/,[^,]+$/, ""); console.log(location)
                }
              }
              if (tempPostal) tempPostal = tempPostal.replace(/\s*,\s*/g, ",");   // delete space after comma

              url += '&location=' + tempPostal;
            } else {
              url += '&location=' + location;
            }

          }
        }
      }
      if (radius > 0) {
        // handle if there is either the location selected by dropdown, or directly
        // entered zip code
        let theZip = val.charAt(0) <= '9' && val.charAt(0) >= '0';
        if (!keywords && !location && !theZip) {
          url += 'radius=' + radius
        }
        else {
          url += '&radius=' + radius
        }
      }
      // url manipulation for sorting starts
      if (type === 'date asc') {

        if (!keywords && !location && !radius) {
          url += 'orderby=lastupdated&order=asc'
        }
        else {
          url += '&orderby=lastupdated&order=asc'
        }
      }
      else if (type === 'date desc') {

        if (!keywords && !location && !radius) {
          url += 'orderby=lastupdated&order=desc'
        }
        else {
          url += '&orderby=lastupdated&order=desc'
        }
        //
      } else if (type === 'city asc') {
        if (!keywords && !location && !radius) {
          url += 'orderby=city&order=asc'
        }
        else {
          url += '&orderby=city&order=asc'
        }
      }
      else if (type === 'city desc') {
        if (!keywords && !location && !radius) {
          url += 'orderby=city&order=desc'
        }
        else {
          url += '&orderby=city&order=desc'
        }
      }
      else if (type === 'radius asc') {
        if (!keywords && !location && !radius) {
          url += 'orderby=radius&order=asc'
        }
        else {
          url += '&orderby=radius&order=asc'
        }
      }
      else if (type === 'radius desc') {
        if (!keywords && !location && !radius) {
          url += 'orderby=radius&order=desc'
        }
        else {
          url += '&orderby=radius&order=desc'
        }
      }
      else if (type == 0) {
        url = url;
      }
      // sorting in combination with inputs provided in either header search, or no criteria(get all)
      setLoading(true);
      console.log('url in SORTING');
      console.log(url);
      axios.get(url)
        .then(response => {
          fetchPageContent(response.data);
          setData(response.data);
          setOriginalData(response.data);
          setLoading(false);
        }).catch(error => { setError(error); console.log(error); setLoading(false); })
    }
  }

  if (!pageContent1) {
    return (
      <Loader height='500px' />
    );
  }
  if (pageContent || originalData && !error && pageContent1) {
    props.setJobs(false)
    if (pageContent1.data) {
      var { Banner } = pageContent1.data;
    }
    let searchData = { keywords: key, location: loc }
    let { keywords, location } = props.location.state
      ? props.location.state.headerSearch : searchData;
    return (
      <div>
        {/* <LoadingOverlay
          active={loading}
          spinner
          text='Loading your content...'
        /> */}
        {!showDetail ?
          <>
            {Banner ? <BannerSection
              data={Banner}
              fetchPageContent={fetchPageContent}
              setData={setData}
              setOriginalData={setOriginalData}
              setLoading={setLoading}
              setLocation={setLocation}
              setKeywords={setKeywords}
              setRadius={setRadius}
              setVal={setVal}
              setSortSelected={setSortSelected}
              jobsPage={true}
              headerSearch={tempObj}
            /> : null}

            <section className="d-flex p-2 mt-5">
             
              <Container>

                <Row>

                 <div className="col-xl-3 col-lg-4"> <NavigationJobs /></div>

                  <div className="col-xl-9 col-lg-8 pt-5 pt-lg-0">
                    <div className="ml-lg-4 mr-lg-4 px-md-0 d-md-flex justify-content-center">
                      {/*   SORT ELEMENT      */}
                      <div hidden={((pageContent && !loading) || (!pageContent && loading))}>
                        <LoaderInside />
                      </div>
                      {!loading && <> <Col hidden={data.length === 0} className="col-md-3 selectBox col-12 mt-2 p-0  mb-3">
                        <Form.Group controlId="exampleForm.SelectCustom"

                          className="mb-0 jobSearch-selection">

                          <Form.Control as="select"

                            value={sortSelected}
                            onChange={(evt) => sorting(evt.target.value)}
                            style={{ "backgroundColor": "#ffffff" }}
                            className="custom_input_Select">
                            <option value={0}>Choose Sort Type</option>
                            <option value="date asc">By Date Asc</option>
                            <option value="date desc">By Date Desc</option>
                            <option value="radius asc">By Radius Asc</option>
                            <option value="radius desc">By Radius Desc</option>
                            <option value="city asc">By City Asc</option>
                            <option value="city desc">By City Desc</option>

                          </Form.Control>
                        </Form.Group>
                      </Col>
                        <div hidden={data.length === 0} className="mt-2 p-0 ml-auto mb-3 mb-md-0">
                          <div className="mb-0 mt-2">Page {activePage} of {originalData.length} Jobs</div>
                        </div></>}
                    </div>
                    {/*   LISTING HERE  */}
                    {!loading && <><List data={data}
                      setItem={setItem}
                      searchData={{ keywords, location }}
                      setShowDetail={setShowDetail}
                      pageContent={pageContent}
                    />
                      {/*  PAGING HERE   */}
                      <Col md={12} className="mb-4" hidden={!originalData || originalData.length === 0}>
                        <Pagination
                          activePage={activePage}
                          itemsCountPerPage={perPage}
                          innerClass="pagination jobs-pagination justify-content-center"
                          itemClass="btn btn-success p-0 mx-1 pagination-btn"
                          linkClass="pagination-link"
                          /*   totalItemsCount={searchText.length > 0 ? filteredData.length : originalData.length}  */
                          totalItemsCount={query != '' ? originalDataSearch.length : originalData.length}
                          pageRangeDisplayed={5}
                          /* onChange={searchText.length === 0 ? this.handlePageChange : this.handlePageChangeForFiltered} */
                          onChange={!query ? (evt) => handlePageChange(data, setData,
                            originalData, setOriginalData, activePage, setActive, perPage, evt)
                            : (evt) => handlePageChangeForSearch(data, setData,
                              originalDataSearch, setOriginalData, activePage, setActive, perPage, evt)}
                        />
                      </Col> </>}
                  </div>
                </Row>
              </Container>
            </section>
          </>
          : <JobDetail setJobs={props.setJobs}
            setShowDetail={setShowDetail}
            item={item}
          />
        }
        {/* <Footer /> */}
      </div>
    )
  }
}
