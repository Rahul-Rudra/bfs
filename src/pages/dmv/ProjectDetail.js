import React, {Component} from 'react';
import facebook from './img/facebook.svg';
import twitter from './img/twitter-li.svg';
import pinterest from './img/pinterest.svg';
import facebookgray from './img/facebook-gray.svg';
import twittergray from './img/twitter-gray.svg';
import pinterestgray from './img/pinterest-gray.svg';
import degree from './img/360-Degree.jpg';
import play from './img/Play.svg';
import Carousel, {Modal, ModalGateway} from 'react-images';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import ImageMasonry from 'react-image-masonry';
import ReactPlayer from 'react-player';
import {Link} from 'react-router-dom';
import 'react-image-lightbox/style.css';
import {globalVar} from '../../config';

class ProjectDetail extends Component {

  constructor() {
    super();
    this.state = {
      photos: [],
      modalIsOpen: false,
      gallery: [],
      title: '',
      Summary: '',
      Description: '',
      mainImage: '',
      salesRepresentative: '',
      builder: '',
      facebooklink: '',
      pinterestlink: '',
      twitterlink: '',
      isLoad: true,
      Details: {},
      Property: {},
      MorePropertyImages: [],
      Video: {},
      videodata: '',
      videoplay: false,
      galleryLinkName: '',
      galleryLink: ''

    }
  }

  playVideo() {
    this.setState({
      videoplay: true
    })
  }

  componentDidMount() {
    this.getProjectDetail()
  }

  toggleModal = () => {
    this.setState(state => ({modalIsOpen: !state.modalIsOpen}));
  };

  componentDidUpdate() {

  }

  getProjectDetail() {
    let projectid = this.props.match.params.id
    let base = globalVar.base_url;
    axios.get(base + '/umbraco/api/projectitem/' + projectid, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      let photosdata = [];
      if (response.data.Gallery) {
        if (response.data.Gallery.length > 0) {
          for (let i = 0; i < response.data.Gallery.length; i++) {
            photosdata.push(
              globalVar.base_url + response.data.Gallery[i].Url
            )
          }
        }
      }

      if (response.data.Image) {
        if (response.data.Image.Url) {
          var mainImage = response.data.Image.Url
        }
      }

      if (response.data.Video) {
        if (response.data.Video.Video) {
          var video = response.data.Video.Video
        }
      }

      if (response.data.Gallery) {
        if (response.data.Gallery.GalleryLink) {
          this.setState({
            galleryLinkName: response.data.Gallery.GalleryLink.Name,
            galleryLink: response.data.Gallery.GalleryLink.Url
          })
        }
      }

      this.setState({
        title: response.data.Name,
        Summary: response.data.Summary,
        photos: photosdata,
        salesRepresentative: response.data.SalesRepresentative,
        mainImage: mainImage,
        Description: response.data.Description,
        facebooklink: response.data.FacebookLink,
        pinterestlink: response.data.PinterestLink,
        twitterlink: response.data.TwitterLink,
        builder: response.data.Builders,
        Details: response.data.Details,
        Property: response.data.Property,
        isLoad: false,
        MorePropertyImages: response.data.Property.Images,
        Video: response.data.Video,
        videodata: video
      })
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 8,
      responsive: [{
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3
        }
      },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            initialSlide: 5
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
            initialSlide: 5
          }
        }
      ]
    };
    if (this.state.MorePropertyImages && this.state.MorePropertyImages.length > 0) {
      var propertyimage = this.state.MorePropertyImages.map(function (element, i) {
        return (
          <div key={i} className='position-relative on_hover_property float-left'>
            <img className='morepropertyimg' alt='moreproperty' src={globalVar.base_url + element?.Url}/>
            <a href='/decking/locations/fredericksburg/'>
              <div className='property-caption position-absolute w-100 h-100 top-0'>
                <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                <div
                  className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                  {element?.Name}
                </div>
              </div>
            </a>
          </div>
        )
      });
    }

    return (
      <div>
        <section className='Detailed_section'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-md-12 px-0 property-detail'>
                {this.state.mainImage ? (
                  <img alt='bannerimg' className='w-100' src={globalVar.base_url + this.state.mainImage}/>) : null}
              </div>
            </div>
          </div>
        </section>
        <section className='project_portfolio_detail mb-5'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-8 bg-white py-5 px-md-5'>
                <h2 className='font-weight-bold text-capitalize line-height-normal'>{this.state.title}</h2>
                <p>{this.state.summary}</p>
                <span dangerouslySetInnerHTML={{__html: this.state.Description}}></span>
              </div>
              <div className='col-lg-4 pt-3    px-md-5'>
                {this.state.facebooklink !== '' || this.state.twitterlink !== '' || this.state.pinterestlink !== '' ? (
                  <ul className='list-unstyled mb-0'>
                    <li className='list-inline-item font-weight-bold mr-y text-share'>
                      Share
                    </li>
                    {this.state.facebooklink !== '' ? (<li className='list-inline-item'>
                      <a target='_blank' href={this.state.facebooklink}><img alt='facebook' className='img-fluid mr-2'
                                                                             src={facebook} width='30px'/></a>
                    </li>) : null}
                    {this.state.twitterlink !== '' ? (<li className='list-inline-item'>
                      <a target='_blank' href={this.state.twitterlink}><img alt='twitter' className='img-fluid mr-2'
                                                                            src={twitter} width='30px'/></a>
                    </li>) : null}
                    {this.state.pinterestlink !== '' ? (<li className='list-inline-item'>
                      <a target='_blank' href={this.state.pinterestlink}><img alt='pinterest' className='img-fluid mr-2'
                                                                              src={pinterest} width='30px'/></a>
                    </li>) : null}
                  </ul>) : null}
                <div className='mt-lg-5 py-3 mt-4'>
                  {this.state.builder || this.state.salesRepresentative || (this.state.Details && this.state.Details?.Location) || (this.state.Details && this.state.Details?.ProjectLocation) || (this.state.facebooklink || this.state.twitterlink || this.state.pinterestlink) ? (
                    <h3 className='font-weight-bold mb-3'>Detail</h3>) : null}
                  {this.state.builder ? (<div className='detail_project p-4 mb-3'>
                    <h6 className='font-weight-bold detail_project_heading mb-1'>Builder</h6>
                    <h6 className='detail_project_content mb-0'>{this.state.builder}</h6>
                  </div>) : null}
                  {this.state.salesRepresentative ? (<div className='detail_project p-4 mb-3'>
                    <h6 className='font-weight-bold detail_project_heading mb-1'>Outside Sales Representative</h6>
                    <h6 className='detail_project_content mb-0'>{this.state.salesRepresentative}</h6>
                  </div>) : null}
                  {this.state.Details && this.state.Details?.Location ? (<div className='detail_project p-4 mb-3'>
                    <h6 className='font-weight-bold detail_project_heading mb-1'>Location</h6>
                    <h6 className='detail_project_content mb-0'>{this.state.Details?.Location}</h6>
                  </div>) : null}
                  {this.state.Details && this.state.Details?.ProjectLocation ? (<div className='detail_project p-4 mb-3'>
                    <h6 className='font-weight-bold detail_project_heading mb-1'>Project Location</h6>
                    <h6 className='detail_project_content mb-0'>{this.state.Details?.ProjectLocation}</h6>
                  </div>) : null}
                  {this.state.facebooklink !== '' || this.state.twitterlink !== '' || this.state.pinterestlink !== '' ? (
                    <div className='detail_project p-4 mb-3'>
                      <ul className='list-unstyled'>
                        <li className='list-inline-item font-weight-bold'>
                          Share:
                        </li>
                        {this.state.facebooklink !== '' ? (<li className='list-inline-item'>
                          <a target='_blank' href={this.state.facebooklink}><img alt='facebook'
                                                                                 className='img-fluid mx-1'
                                                                                 src={facebookgray} width='7px'/></a>
                        </li>) : null}
                        {this.state.twitterlink !== '' ? (<li className='list-inline-item'>
                          <a target='_blank' href={this.state.twitterlink}><img alt='twitter' className='img-fluid mr-1'
                                                                                src={twittergray} width='15px'/></a>
                        </li>) : null}
                        {this.state.pinterestlink !== '' ? (<li className='list-inline-item'>
                          <a target='_blank' href={this.state.pinterestlink}><img alt='pinterest'
                                                                                  className='img-fluid mr-1'
                                                                                  src={pinterestgray} width='15px'/></a>
                        </li>) : null}
                      </ul>
                    </div>) : null}
                  {/*<div className='mb-5'>
                              <button type='button' className='btn btn-danger w-100 text-uppercase font-14 theme-btn py-3  px-4 mt-4'>
                              View on zillow
                              </button>
                            </div>*/}
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr/>
        <section className='gallery pb-4'>
          <div className='container'>
            {this.state.photos?.length > 0 ? (<div className='row'>
              <div className='col-md-12 pt-5 pb-4'>
                <h2 className='font-weight-bold text-center text-uppercase'>Gallery</h2>
              </div>
            </div>) : null}
            <div className='row align-items-center justify-content-center'>
              <div className='col-md-12 text-center'>
                <div className='d-lg-flex'>
                  <ImageMasonry
                    onClick={() => this.toggleModal()}
                    imageUrls={this.state.photos}
                    numCols={3}
                    containerWidth={'100%'}
                  />

                  {/*<div onClick={() => this.toggleModal()} className='my-3 mr-lg-4'>
                           <div className='position-relative d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery1}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1 mr-lg-4 my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery2}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1  my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery3' className='img-fluid' src={gallery3}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                      <div className='d-lg-flex'>
                        <div onClick={() => this.toggleModal()} className=' mr-lg-4 my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery4}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1 mr-lg-4  my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery5}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1 my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery6}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        </div>
                        <div className='d-lg-flex'>
                        <div onClick={() => this.toggleModal()} className='  mr-lg-4  my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery7}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1 mr-lg-4  my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery8}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div onClick={() => this.toggleModal()} className=' ml-lg-1   my-3'>
                           <div className='position-relative  d-inline-block gallery_On_hover'>
                              <img alt='gallery' className='img-fluid' src={gallery9}/>
                              <div className='gallery-caption position-absolute w-100 h-100 top-0'>
                                 <div className='gallery-blur w-100 h-100 position-absolute'></div>
                                 <div className='gallery-caption-text position-absolute text-white h-100 w-100'>
                                    <div className='figcaption h-100  px-3 py-4 float-left'>
                                       <img alt='increasesize' className='img-fluid' src={increasesize}/>
                                    </div>
                                    <div className='share_caption h-100 p-4 text-right float-left'>
                                       <div className='share_section text-center float-right'>
                                          <img alt='sharevariant' className='img-fluid' src={sharevariant}/>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                             </div>
                          </div>*/}
                </div>
                <ModalGateway>
                  {this.state.modalIsOpen ? (
                    <Modal onClose={this.toggleModal}>
                      <Carousel views={this.state.photos}/>
                    </Modal>
                  ) : null}
                </ModalGateway>
              </div>
            </div>
            <div className='row my-5'>
              <div className='col-md-12 text-center'>
                {this.state.galleryLinkName && this.state.galleryLink ? (<Link to={'/'}
                                                                               className='btn btn-primary btn-read-more text-uppercase theme-btn py-3 px-5'> {this.state.galleryLinkName}</Link>) : null}

              </div>
            </div>
          </div>
        </section>
        {this.state.videodata ? (<hr/>) : null}
        <section className='py-5'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                <h2 className='font-weight-bold text-center text-uppercase'>{this.state.Video?.Title}</h2>
                <h5 className='text-center line-height-normal'>{this.state.Video?.Subtitle}</h5>
              </div>
            </div>
            {this.state.videodata ? (<div className='row mt-4'>
              <div className='col-md-12'>
                <div className='position-relative'>
                  {this.state.videoplay ? (
                    <ReactPlayer width='100%' url='https://player.vimeo.com/video/289773652?portrait=0&app_id=122963'
                                 playing/>) : null}
                  {!this.state.videoplay ? (<img alt='degree' className='img-fluid' src={degree}/>) : null}
                  {!this.state.videoplay ? (<div
                    className='position-absolute top-0 h-100 w-100 d-flex align-items-center justify-content-center flex-column explore_3d_section'>
                    <a href={null} onClick={() => this.playVideo()}><img alt='play' className='img-fluid'
                                                                         src={play}/></a>
                    <h5 className='font-weight-bold mt-4'>{this.state.Video?.VideoText}</h5>
                  </div>) : null}
                </div>
              </div>
            </div>) : null}
          </div>
        </section>
        <section className='pt-lg-5 view_more_property'>
          <div className='container-fluid'>
            <div className='row'>
              {this.state.Property && this.state.Property?.Title ? (<div className='col-md-12'>
                <h5 className='text-center'>{this.state.Property?.Title}</h5>
              </div>) : null}
            </div>

            {this.state.MorePropertyImages && this.state.MorePropertyImages?.length > 0 ? (<div className='row mt-4'>
              <div className='col-md-12 px-0'>
                <div className='center slider line-height-normal overflow-hidden justify-content-center'>
                  <Slider {...settings}>
                    {propertyimage}
                  </Slider>
                  {/*<Slider {...settings}>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='morepreoperty' src={moreproperty}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='morepreoperty' src={moreproperty}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty1}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty2}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty3}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty4}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty5}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty6}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty7}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div>
                                    <div className='position-relative on_hover_property float-left'>
                                       <img alt='moreproperty' src={moreproperty8}/>
                                       <div className='property-caption position-absolute w-100 h-100 top-0'>
                                             <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                             <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                                New Home by Rae Marie Homes in Golden Hills Development
                                             </div>
                                       </div>
                                    </div>
                                 </div>
                              </Slider>*/}

                  {/* <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty1}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty2}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty3}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty4}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty5}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty6}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty7}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>
                                 <div className='position-relative on_hover_property float-left'>
                                    <img alt='moreproperty' src={moreproperty8}/>
                                    <div className='property-caption position-absolute w-100 h-100 top-0'>
                                          <div className='property-blur w-100 h-100 position-absolute p-3'></div>
                                          <div className='property-caption-text position-absolute text-white h-100 w-100 text-center d-flex align-items-center justify-content-center line-height-normal'>
                                             New Home by Rae Marie Homes in Golden Hills Development
                                          </div>
                                    </div>
                                 </div>*/}
                </div>
              </div>
            </div>) : null}
          </div>
        </section>
      </div>
    )
  }
}

export default ProjectDetail
