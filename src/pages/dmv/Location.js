import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import {Link} from 'react-router-dom';

import {globalVar} from '../../config';
import {fetchLocationProducts, fetchLocationHeader} from '../../api/requests';

import TeamMember from './TeamMember';

export default class Location extends Component {
  state = {
    Banner: {},
    Products: [],
    Project: [],
    Offer: {},
    Title: '',
    Summary: '',
    OfferItems: [],
    ProjectItems: [],
    OurTeam: {},
    AllTeams: [],
    iframeurl: '',
    Projects: [],
    ContactText: '',
    ContactPhone: '',
    latitude: '',
    longitude: '',
    locationname: '',
    Services: [],
    modal: false,
    currentTeamMember: {Picture: {Url: ''}},
  };

  componentDidMount() {
    this.getLocationData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.locationname !== prevProps.match.params.locationname) {
      this.getLocationData();
    }
  }

  getLocationData = async () => {
    let locationName = this.props.match.params.locationname;

    this.setSelectedStore(locationName);
    const {data: {Title, Caption, Banner, Description}} = await fetchLocationHeader();

    const {data} = await fetchLocationProducts({locationName});

    if (!data) return;

    this.setState({
      Title: data.Title,
      Summary: data.Summary,
      Banner: data.Banner.Images[0].Url,
      BannerText: data.Banner.Text,
      BannerTitle: data.Banner.Images[0].Title,
      BannerCaption: data.Banner.Images[0].Caption,
      Name: data.Name,
      Products: data.Products,
      Services: data.Services,
      Project: data.Project,
      Offer: data.Offer,
      OfferItems: data.Offer.Items,
      ProjectItems: data.Project.Projects,
      OurTeam: data.OurTeam,
      AllTeams: data.OurTeam.Teams,
      latitude: data.Latitude,
      longitude: data.Longitude,
      iframeurl: `https://maps.google.com/maps?q=${data.Latitude},${data.Longitude}&output=embed`,
      ContactText: data.ContactText,
      ContactPhone: data.ContactPhone,
      locationname: locationName,
    });
  };

  setSelectedStore(locationName) {
    const locations = {
      waldorf: 4671,
      fredericksburg: 5428,
      manassas: 4592,
    };

    let name = locationName.charAt(0).toUpperCase() + locationName.slice(1);
    let storedetail = locationName + ',' + locations[locationName] + ',' + name;
    localStorage.setItem('selectedStore', storedetail);
  }

  updateModal = member => {
    this.setState({currentTeamMember: member}, () => this.toggle());
  };

  toggle = () => {
    this.setState({modal: !this.state.modal});

    if (this.state.modal) {
      let root = document.getElementsByTagName('html')[0];
      root.removeAttribute('class');
    } else {
      let root = document.getElementsByTagName('html')[0];
      root.setAttribute('class', 'popupclass');
    }
  };

  selectQuote() {
    document.querySelector('.requestheader').click();
  }

  clearTag = (tag) => {
    const from = tag.indexOf('>');
    const to = tag.indexOf('<', from);

    return tag.substring(from + 1, to);
  };

  render() {
    if (this.state.Products) {
      var products = this.state.Products.map((product) => {
        if (product?.Thumbnail) {
          return (
            <div
              key={product?.ProductId}
              className="col-lg-3 col-md-4 col-sm-4 col-6 section-remodal my-2 dmvpage"
            >
              <Link to={`/decking/product/${product?.ProductId}`}>
                <div className="position-relative On_hover">
                  <img
                    alt="firstimage"
                    className="img-fluid"
                    src={globalVar.base_url + '/' + product?.Thumbnail?.Url}
                  />
                  <div className="position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100">
                    <h6 className="p font-weight-bold font-open-sans on_hover_remove">
                      {this.clearTag(product?.BannerTitle)}
                    </h6>
                  </div>
                  <div className="caption position-absolute w-100 h-100 top-0">
                    <div className="blur w-100 h-100 position-absolute"></div>
                    <div className="caption-text position-absolute text-white h-100 w-100 p-4">
                      <h6 className="p font-weight-bold font-open-sans">
                        {this.clearTag(product?.BannerTitle)}
                      </h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        } else {
          return '';
        }
      });
    }

    if (this.state.Services) {
      var services = this.state.Services.map(function (element, i) {
        return (
          <div
            key={i}
            className="col-lg-4 col-md-4 col-sm-4 col-6 section-remodal  my-2"
          >
            <div className="position-relative On_hover">
              <Link to={'/decking/service/' + element.ID}>
                <img
                  alt="firstimage"
                  className="img-fluid"
                  src={globalVar.base_url + '/' + element?.Thumbnail?.Url}
                />
                <div className="position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100">
                  <h6
                    dangerouslySetInnerHTML={{__html: element?.BannerTitle}}
                    className="p font-weight-bold font-open-sans on_hover_remove"
                  ></h6>
                </div>
                <div className="caption position-absolute w-100 h-100 top-0">
                  <div className="blur w-100 h-100 position-absolute"></div>
                  <div className="caption-text position-absolute text-white h-100 w-100 p-4">
                    <h6
                      dangerouslySetInnerHTML={{__html: element?.BannerTitle}}
                      className="p font-weight-bold font-open-sans"
                    ></h6>

                    <div
                      className="position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none"
                    >
                      View Service
                      <img
                        alt="rightarrow"
                        width="10px"
                        className="ml-2"
                        src={require('./img/right-arrow.svg').default}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      });
    }

    if (this.state.OfferItems) {
      var items = this.state.OfferItems.map(function (element, i) {
        return (
          <li
            key={i}
            className="list-inline-item mb-sm-5 mb-3 position-relative  pl-4"
          >
            {element}
          </li>
        );
      });
    }

    if (this.state.ProjectItems && this.state.ProjectItems.length > 0) {
      var projects = this.state.ProjectItems.map(function (element, i) {
        return (
          <div key={i} className="col-lg-4 col-md-6 my-3">
            <div className="bg-white box-shadow recent_project h-100 d-flex flex-wrap">
              {element.ThumbnailImage ? (
                <figure className="mb-0 recent-project-img">
                  <img
                    alt="portfolio"
                    className="h-100 w-100 object-fit"
                    src={globalVar.base_url + '/' + element?.ThumbnailImage?.Url}
                  />
                </figure>
              ) : null}
              <div className="px-4 py-3">
                {element?.Builders ? (
                  <h6 className="text-uppercase font-13 font-weight-medium swett_const">
                    builder: {element?.Builders}
                  </h6>
                ) : null}
                {element?.Name ? (
                  <h4 className="font-weight-semi-bold line-height-normal">
                    {element?.Name}
                  </h4>
                ) : null}
                {element?.SalesRepresentative ? (
                  <h6 className="sales_represent">
                    Sales Representative:{' '}
                    <span>{element?.SalesRepresentative}</span>
                  </h6>
                ) : null}
                {element?.Summary ? (
                  <p className="font-13 font-open-sans">{element?.Summary}</p>
                ) : null}
              </div>
              <div className="d-flex align-items-center mt-auto w-100 px-4 mb-2 pb-3">
                <div className="">
                  <Link
                    to={'/decking' + element?.Url + element?.Id}
                    className="btn btn-danger  theme-btn py-2 font-weight-normal px-4"
                  >
                    Read More
                  </Link>
                </div>
                <div className="ml-auto">
                  {element?.FacebookLink ||
                  element?.PinterestLink ||
                  element?.TwitterLink ? (
                    <ul className="list-unstyled d-flex">
                      <li className="list-inline-item fon-14 text-share font-13 font-weight-semi-bold mr-lg-0 mr-4">
                        {' '}
                        Share:
                      </li>
                      {element?.FacebookLink ? (
                        <li className="list-inline-item mr-2">
                          <a target="_blank" href={element?.FacebookLink}>
                            <img alt="facebook" src={require('./img/facebook-black.svg').default}/>{' '}
                          </a>
                        </li>
                      ) : null}
                      {element?.TwitterLink ? (
                        <li className="list-inline-item mr-2">
                          <a target="_blank" href={element?.TwitterLink}>
                            <img alt="twitter" src={require('./img/twitter-black.svg').default}/>{' '}
                          </a>
                        </li>
                      ) : null}
                      {element?.PinterestLink ? (
                        <li className="list-inline-item">
                          <a target="_blank" href={element?.PinterestLink}>
                            <img alt="pinterest" src={require('./img/pinterest-black.svg').default}/>
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      projects = '';
    }

    return (
      <div>
        {this.state.Banner ? (
          <section className="banner-home position-relative internal-banner top-0">
            <figure className="mb-0 position-relative h-100">
              <img
                alt={this.state.Banner?.Name}
                className="img-fluid w-100 h-100 obj-fit"
                src={
                  this.state.Banner
                    ? globalVar.base_url + this.state.Banner
                    : require('./img/Header.jpg')
                }
              />
            </figure>

            <div className="container position-absolute top-0 banner-content window-Door-content">
              <div className="row">
                <div className="col-xl-12 px-xl-0 col-md-12 col-12">
                  <div className="banner-text-service left-0 w-100 h-100 d-flex flex-warp align-items-center">
                    <div
                      className="position-relative d-flex justify-content-center align-items-center banner-Text w-100 flex-column text-white">
                      <h1 className="mb-0 font-weight-bold line-height-normal display-2">
                        {this.state.BannerText}
                      </h1>
                      {/*<h2*/}
                      {/*dangerouslySetInnerHTML={{*/}
                      {/*__html: this.state.BannerCaption,*/}
                      {/*}}*/}
                      {/*className="font-weight-semi-bold mb-0 line-height-normal"*/}
                      {/*></h2>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <section className="Meet_team">
          <div className="container">
            {this.state.OurTeam && this.state.OurTeam?.Title ? (
              <div className="row my-5 text-center justify-content-center">
                <div className="col-md-10">
                  <h2 className="font-weight-bold">
                    {this.state.OurTeam?.Title}
                  </h2>
                  <h6 className="font-open-sans">
                    {this.state.OurTeam?.Subtitle}
                  </h6>
                </div>
              </div>
            ) : null}
          </div>
          <div className="container pb-4 pb-lg-5">
            {this.state.AllTeams && this.state.AllTeams.length > 0 ? (
              <div className="row m-0">
                {this.state.AllTeams.map((item, index) => {
                  return (
                    <TeamMember
                      key={index}
                      memberData={item}
                      update={this.updateModal}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        </section>
        {this.state.Products && this.state.Products.length > 0 ? (
          <section className="pb-4">
            <div className="container">
              <div className="row">
                <div className="col-md-12 ">
                  {this.state.Title && this.state.Summary ? (
                    <div className="bg-relative bg-white sourthern-Hill pt-5 px-md-5">
                      <h2 className="font-weight-bold  line-height-normal">
                        {this.state.Title}
                      </h2>
                      <h5 className="font-weight-light">
                        {this.state.Summary}
                      </h5>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row">{products}</div>
            </div>
          </section>
        ) : null}
        <section className="pb-4">
          <div className="container">
            <div className="row">
              <div className="col-md-12 ">
                {this.state.Title && this.state.Summary ? (
                  <div className="bg-relative bg-white sourthern-Hill pt-5 px-md-5">
                    <h2 className="font-weight-bold  line-height-normal">
                      Services we offer
                    </h2>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="row">{services}</div>
          </div>
        </section>
        {this.state.OfferItems && this.state.OfferItems.length > 0 ? (
          <section className="building_material py-5 bg-gray-theme">
            <div className="container py-4">
              <div className="row align-items-start">
                <div className="column-padd col-xl-6 col-md-6 col-sm-6">
                  <h2 className="font-weight-bold mb-3 line-height-normal">
                    {this.state.Offer?.Title}
                  </h2>
                  <h6 className="font-open-sans">
                    {this.state.Offer?.Subtitle}
                  </h6>
                </div>
                <div className="col-xl-6 col-md-6 col-sm-6 mt-xl-0 mt-5">
                  <ul className="list-unstyled ul-quality-built">{items}</ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {this.state.ContactText && this.state.ContactPhone ? (
          <section className="learnMore py-4 my-5">
            <div className="container">
              <div className="row">
                <div className="col-md-12 py-2">
                  <div className="d-lg-flex align-items-center text-lg-left text-center justify-content-center">
                    <h3 className="text-uppercase mr-lg-5 mb-0 text-white line-height-normal font-weight-bold">
                      {this.state.ContactText}
                    </h3>
                    <a
                      href={'tel:' + this.state.ContactPhone}
                      className="btn bg-none border-white border-width-2 mt-lg-0 mt-4 text-white text-uppercase theme-btn  btn-number pt-3"
                    >
                      {this.state.ContactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        {/*{this.state.ProjectItems.length > 0 ? (*/}
        {/*<section className="Recent_Bfs_Project pt-4 pb-2 ">*/}
        {/*<div className="container">*/}
        {/*<div className="row mb-4">*/}
        {/*<div className="col-md-12">*/}
        {/*<h2 className="font-weight-bold text-center line-height-normal">*/}
        {/*{this.state.Project.Title}*/}
        {/*</h2>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*<div className="row justify-content-center">{projects}</div>*/}
        {/*</div>*/}
        {/*</section>*/}
        {/*) : null}*/}
        {/*{this.state.Projects && this.state.Projects.length > 0 ? <hr/> : null}*/}

        {this.state.latitude && this.state.longitude ? (
          <section className="map mt-5 pt-4">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 px-0">
                  <iframe
                    title="location"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    src={this.state.iframeurl}
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody className="p-4 p-lg-5">
            <div className="row mx-0 d-flex position-relative member-section">
              <div className="container">
                <div className="row h-100 align-items-center ">
                  <div className="col-md-6 modal-member-header">
                    <img
                      src={
                        globalVar.base_url +
                        '/' +
                        this.state.currentTeamMember?.Picture?.Url
                      }
                      alt={this.state.currentTeamMember?.Name}
                      className="modal-img-member"
                    />
                  </div>
                  <div className="col-md-6 p-3 order-lg-2 ">
                    <h2 className="font-weight-bold mb-0 line-height-normal w-100">
                      {this.state.currentTeamMember?.Name}
                    </h2>
                    <h6 className="font-color-57 w-100">
                      {this.state.currentTeamMember?.Position}
                    </h6>
                    <ul className="list-unstyled my-4 w-100">
                      {this.state.currentTeamMember?.Phone
                        ? (
                          <li className="ont-weight-medium mb-3  d-flex">
                            <img alt="call" className="img-fluid mr-3" src={require('./img/Call.svg').default}/>
                            {this.state.currentTeamMember?.Phone}
                          </li>
                        )
                        : null
                      }
                      {this.state.currentTeamMember?.Email
                        ? (
                          <li className="ont-weight-medium mb-3  d-flex">
                            <img alt="mail" className="img-fluid mr-3" src={require('./img/Mail.svg').default}/>
                            {this.state.currentTeamMember?.Email}
                          </li>
                        )
                        : null
                      }
                    </ul>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row align-items-center ">
                  <div className="col-md-12 p-3 order-lg-2 ">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.state.currentTeamMember?.AboutMe,
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
