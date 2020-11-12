import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { globalVar } from '../../config';
import {fetchServices, fetchLocalBuilders, fetchServicesHeader} from '../../api/requests';

import Loader from './Common/Loader';

class Service extends Component {
  state = {
    header: {
      data: null,
      fetching: false,
    },
    localBuilders: {
      data: null,
      fetching: false,
    },
    services: {
      data: null,
      fetching: false,
    },
  };

  componentDidMount() {
    this.fetchHeader();
    this.fetchServices();
    this.fetchLocalBuilders();
  }

  fetchHeader = async () => {
    this.setState({ header: { data: null, fetching: true } });

    try {
      const { data } = await fetchServicesHeader();

      this.setState({ header: { data, fetching: false } });
    } catch (error) {
      this.setState({ header: { data: null, fetching: false } });

      console.error(error);
    }
  };

  fetchServices = async () => {
    this.setState({ services: { data: null, fetching: true } });

    try {
      const { data } = await fetchServices();

      this.setState({ services: { data: data, fetching: false } });
    } catch (error) {
      this.setState({ services: { data: null, fetching: false } });

      console.error(error);
    }
  };

  fetchLocalBuilders = async () => {
    this.setState({ localBuilders: { data: null, fetching: true } });

    try {
      const { data } = await fetchLocalBuilders();

      this.setState({
        localBuilders: { data: data.LocalBuilders.Items, fetching: false },
      });
    } catch (error) {
      this.setState({ localBuilders: { data: null, fetching: false } });

      console.error(error);
    }
  };

  render() {
    const { localBuilders, services, header } = this.state;
    return (
      <section className="Recent_Bfs_Project  pb-5">
        {header?.fetching && <Loader height="500px" />}

        {header?.data && (
          <React.Fragment>
            <section className="banner-home position-relative internal-banner">
              <figure className="mb-0 position-relative h-100">
                <img
                  src={`${globalVar.base_url}${header?.data?.Banner?.Url}`}
                  className="img-fluid w-100 h-100 obj-fit"
                  alt="banner"
                />
              </figure>
              <div className="container position-absolute top-0 banner-content window-Door-content">
                <div className="row">
                  <div className="col-xl-12 px-xl-0 col-md-12 col-12">
                    <div className="banner-text-service left-0 w-100 h-100 d-flex flex-warp align-items-center">
                      <div className="text-white w-100">
                        <h1 className="mb-0 font-weight-bold text-center display-2">
                          {header?.data?.Title}
                        </h1>
                        <h3 className="text-center mb-0 display-5">
                          {header?.data?.Caption}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="pb-4 gallery_door_window_img">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      className="bg-relative bg-white  pt-5"
                      dangerouslySetInnerHTML={{__html: header?.data?.Description}}
                    />
                  </div>
                </div>
              </div>
            </section>
          </React.Fragment>
        )}

        <section className="py-4 gallery_door_window_img">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="font-weight-bold line-height-normal">
                  Services we offer
                </h2>
              </div>
            </div>
            <div className="row mt-3">
              {services?.fetching && <Loader height="650px" />}

              {services?.data &&
                services?.data.map(service => (
                  <div key={service?.ID} className="col-md-4 mb-4">
                    <Link to={`/decking/service/${service?.ID}`}>
                      <div className="column-field">
                        <div className="overflow-hidden">
                          <img
                            src={`${globalVar.base_url}${service?.Thumbnail?.Url}`}
                            className="img-fluid"
                            alt="Service"
                          />
                        </div>
                        <p className="mb-0 text-truncate pt-3">
                          {service?.BannerTitle.replace(/(<([^>]+)>)/gi, '')}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="my-4 gallery_door_window_img">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2 className="font-weight-bold line-height-normal">
                  View More Products from Builders FirstSource Near You
                </h2>
              </div>
            </div>
            < div className="row">
              {localBuilders?.fetching && <Loader height="250px" />}

              {localBuilders?.data &&
                localBuilders?.data.map(product => (
                  <div
                    key={product?.Url}
                    className="col-md-4 col-sm-6 section-remodal my-3"
                  >
                    <div className="overflow-hidden position-relative">
                      <img
                        src={`${globalVar.base_url}${product?.Thumbnail?.Url}`}
                        className="img-fluid"
                        alt="Product"
                      />
                      <div className="position-absolute p-3 bottom-0 left-0 text-white w-100 Aberdeen_ptoduct_Detail">
                        <Link
                          to={`/decking${product?.Url}`}
                          className="bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none"
                        >
                          <h5 className="p font-open-sans on_hover_remove mb-0">
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
      </section>
    );
  }
}

export default Service;
