import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import backpng from '../img/back.png';
import locationImg from '../img/location.svg';
// import locationImg from '../img/location.svg';
import moment from 'moment';
function formatDate(date) {
  if (date) {
    return moment(date).format('DD MMM YYYY');
  }
  else { return '' }
}
export default function JobDetail(props) {

  props.setJobs(true)
  let item = undefined;
  if (props.item) { item = props.item; window.scrollTo(500, 0); }
  return (
    <div>

      {item ?
        <>
          <section className="banner-job-detail">
            <Container>
              <Row className="py-5">
                <Col className="pb-1" md={12}>
                  <h6 className="requestid text-white mb-0" >
                    {"Req #" + item.$id}
                  </h6>
                  <h1 className="text-white font-weight-normal">{item.Title}</h1>

                </Col>
                <Col className="pb-1" md={12}>
                  <div className="job-post-address mb-4">
                    <div className="d-flex address-inner">
                      <img src={locationImg} className="mr-1" width="15px" />
                      <h5 className="mb-0 font-weight-normal text-address"><span>Address : </span>{item.AddressLine1}</h5>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
          <section className="my-4">
            <Container>
              <Row className="">
                <Col md={{ span: 12 }} className="mb-4">
                                    <span onClick={() => props.setShowDetail(false)} className="mb-4 goBack"
                                          style={{ "cursor": "pointer" }}><img src={backpng} width="15px" height="10px" /> Go Back</span>
                </Col>
                <Col md={{ span: 12 }} className="">
                  <div className="job-post-con-detail">

                    <div className="job-post-date mb-3">
                      <p className="mb-0"><strong>Posted On : </strong>

                        {formatDate(item.DatePosted)}</p>
                    </div>
                    {
                      item.Description.split("\n").map(function (item, idx) {
                        return (
                          <p key={idx}>
                            {item}
                          </p>
                        )
                      })
                    }
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </>
        : null}
    </div>
  )
}
