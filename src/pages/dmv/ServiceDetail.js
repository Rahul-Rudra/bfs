import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {globalVar} from '../../config';
import {fetchServiceDetails, fetchLocalBuilders} from '../../api/requests';

import Loader from './Common/Loader';

class ServiceDetail extends Component {
  state = {
    localBuilders: {
      data: null,
      fetching: false,
    },
    serviceData: {
      data: null,
      fetching: false,
    },
  };

  componentDidMount() {
    this.fetchServiceData();
    this.fetchLocalBuilders();
  }

  fetchServiceData = async () => {
    const {match: {params: {serviceId}}} = this.props;

    this.setState({serviceData: {data: null, fetching: true}});

    try {
      const {data} = await fetchServiceDetails({serviceId});

      this.setState({
        serviceData: {
          data: {
            bannerImage: data.Banner.Url,
            bannerTitle: data.BannerTitle,
            description: data.Description,
          },
          fetching: false,
        },
      });
    } catch (error) {
      this.setState({serviceData: {data: null, fetching: false}});

      console.error(error);
    }
  };

  fetchLocalBuilders = async () => {
    this.setState({localBuilders: {data: null, fetching: true}});

    try {
      const {data} = await fetchLocalBuilders();

      this.setState({localBuilders: {data: data.LocalBuilders.Items, fetching: false}});
    } catch (error) {
      this.setState({localBuilders: {data: null, fetching: false}});

      console.error(error);
    }
  };

  render() {
    const {localBuilders, serviceData} = this.state;

    return (
      <div>
        {serviceData?.fetching && (
          <Loader height='500px'/>
        )}

        {serviceData?.data && (
          <React.Fragment>
            <section className='banner-home position-relative internal-banner'>
              {serviceData?.data?.bannerImage && (
                <figure className='mb-0 position-relative h-100'>
                  <img
                    alt='home banner'
                    className='img-fluid w-100 h-100 obj-fit'
                    src={`${globalVar.base_url}/${serviceData?.data?.bannerImage}`}
                  />
                </figure>
              )}
              <div className='container-fluid position-absolute top-0 banner-content window-Door-content'>
                <div className='row'>
                  <div className='col-xl-12 px-xl-0 col-md-12 col-12'>
                    <div
                      className='banner-text-service left-0 w-100 h-100 d-flex flex-warp align-items-center'>
                      <div className='text-white w-100'>
                        <h1
                          dangerouslySetInnerHTML={{__html: serviceData?.data?.bannerTitle}}
                          className='mb-0 font-weight-bold text-center display-2'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className='builders-h-whowe-sec'>
              <div className='container pt-5'>
                <span dangerouslySetInnerHTML={{__html: serviceData?.data?.description}}/>
              </div>
            </section>
          </React.Fragment>
        )}
        <section className='my-4 gallery_door_window_img'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12 '>
                <h2 className='font-weight-bold line-height-normal'>
                  See More from the Builders FirstSource Near You
                </h2>
              </div>
            </div>
            <div className='row'>
              {localBuilders?.fetching && (
                <Loader height='250px'/>
              )}

              {localBuilders?.data && localBuilders?.data.map((product) => (
                <div key={product.Url} className='col-md-4 col-sm-6  section-remodal  my-3'>
                  <div className='overflow-hidden position-relative'>
                    <img
                      src={`${globalVar.base_url}${product?.Thumbnail?.Url}`}
                      className='img-fluid'
                      alt='product'
                    />
                    <div className='position-absolute p-3 bottom-0 left-0 text-white w-100 Aberdeen_ptoduct_Detail'>
                      <Link to={`/decking${product?.Url}`}
                            className='bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                        <h5 className='p font-open-sans on_hover_remove mb-0'>
                          {product?.Name}
                        </h5>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default ServiceDetail
