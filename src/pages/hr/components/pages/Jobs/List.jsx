import React from 'react'
import { Col, Form } from 'react-bootstrap'
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Highlighter from "react-highlight-words";
function formatDate(date) {
  if (date) {
    return moment(date).format('DD MMM YYYY');
  }
  else { return '' }

}
function List({ data, history, searchData, setItem, setShowDetail, pageContent }) {
  var { keywords, location } = searchData;
  const openDetail = (item) => {
    setItem(item)
    //   setShowDetail(true)
    window.open(`https://usr57.dayforcehcm.com/CandidatePortal/en-US/builders/Posting/View/${item.ReferenceNumber}`, '_blank')
  }
  return (

    <div
      className={data.length > 0 ? "job-frame ml-lg-4 mr-lg-4"
        : "job-frame ml-lg-4 mr-lg-4 no-data-found-con"}>

      {data.length > 0 ?
        data.map((item, index) =>

          <Col lg={{ span: 12 }} className="p-0" key={index}>
            <div className="job-post-con" key={index}>
              <div className="d-flex flex-wrap search-result">
                <h4 className="job-post-title">
                  <Highlighter
                    highlightClassName="bg-warning"
                    searchWords={keywords ? keywords.split(" ") : []}
                    autoEscape={true}
                    textToHighlight={item.Title}
                  />
                </h4>
                <div className="ml-sm-auto font-weight-bold">
                  {"Req #" + item.ReferenceNumber}
                </div>
              </div>
              <div className="job-post-date">
                <p className="mb-0"><strong>Posted On :</strong> {formatDate(item.DatePosted)}</p>
              </div>
              <div className="job-post-address mb-1 mt-2">
                <div className="address-inner d-flex align-items-start ">
                  {/* <img src={loactionImg} className="img-fluid" alt="location-icon" /> */}
                  <p className="mb-0"><strong>Address : </strong>
                    <Highlighter
                      highlightClassName="bg-warning"
                      searchWords={location ? location.split(",") : []}
                      autoEscape={true}
                      textToHighlight={item.AddressLine1}
                    />,
                    <Highlighter
                      highlightClassName="bg-warning"
                      searchWords={location ? location.split(",") : []}
                      autoEscape={true}
                      textToHighlight={item.City}
                    />,
                    <Highlighter
                      highlightClassName="bg-warning"
                      searchWords={location ? location.split(",") : []}
                      autoEscape={true}
                      textToHighlight={item.State}
                    />,
                    <Highlighter
                      highlightClassName="bg-warning"
                      searchWords={location ? location.split(",") : []}
                      autoEscape={true}
                      textToHighlight={item.PostalCode}
                    />
                    {/* {item.AddressLine1}, */}
                    {/* {item.City}, */}
                    {/* {item.State}, */}
                    {/* {item.PostalCode} */}
                  </p>
                </div>
              </div>

              <p className="description-content">
                <Highlighter
                  highlightClassName="bg-warning"
                  searchWords={keywords ? keywords.split(" ") : []}
                  autoEscape={true}
                  textToHighlight={item.Description.substring(0, 200)}
                />
                {/* {item.Description.substring(0, 200)} */}
                ...
                <a style={{ "cursor": "pointer", "color": "#10327c" }} onClick={() => openDetail(item)}>More</a>

              </p>
              {/* <div className="mt-3">
                                <a className="btn btn-primary theme-btn text-uppercase px-3 py-2 text-white read_more"
                                    onClick={() => openDetail(item)}>Apply</a>
                            </div> */}

            </div>
          </Col>
        ) :
        <Col lg={{ span: 12 }} className="p-0" hidden={!pageContent}>
          <div className="job-post-con no-data-found">
            <div className="d-flex flex-wrap search-result">
              <p className="mb-0 w-100 text-center">No Results Found</p>
            </div>
          </div>
        </Col>
      }
    </div>
  )
}

export default withRouter(List)
