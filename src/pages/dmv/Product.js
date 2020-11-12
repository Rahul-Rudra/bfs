import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { fetchProducts, fetchProductsHeader } from '../../api/requests';
import { globalVar } from '../../config';

import Loader from './Common/Loader';

export default class Product extends Component {
  state = {
    header: {
      data: null,
      fetching: false,
    },
    products: {
      data: null,
      fetching: false,
    },
  };

  componentDidMount() {
    this.fetchHeader();
    this.fetchProducts();
  }

  fetchHeader = async () => {
    this.setState({ header: { data: null, fetching: true } });

    try {
      const { data } = await fetchProductsHeader();

      this.setState({ header: { data, fetching: false } });
    } catch (error) {
      this.setState({ header: { data: null, fetching: false } });

      console.error(error);
    }
  };

  fetchProducts = async () => {
    this.setState({ products: { data: null, fetching: true } });

    try {
      const { data } = await fetchProducts();

      this.setState({ products: { data, fetching: false } });
    } catch (error) {
      this.setState({ products: { data: null, fetching: false } });

      console.error(error);
    }
  };

  clearTag = (tag) => {
    const from = tag.indexOf('>');
    const to = tag.indexOf('<', from);

    return tag.substring(from + 1, to);
  };

  render() {
    const { products, header } = this.state;

    return (
      <section className="Recent_Bfs_Project pb-5">
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

        <section className="my-4 gallery_door_window_img">
          <div className="container">
            <div className="row">
              {products?.fetching && <Loader height="500px" />}

              {products?.data && products?.data.map((product) => product?.Thumbnail && (
                <div
                  key={product?.ProductId}
                  className="col-md-4 col-sm-6 section-remodal my-3"
                >
                  <Link to={`/decking/product/${product?.ProductId}`}>
                    <div className="overflow-hidden position-relative">
                      <img
                        src={`${globalVar.base_url}${product?.Thumbnail?.Url}`}
                        className="img-fluid"
                        alt="product"
                      />
                      <div
                        className="position-absolute p-3 bottom-0 left-0 text-white w-100 Aberdeen_ptoduct_Detail"
                      >
                        <h5 className="font-weight-light">{this.clearTag(product?.BannerSubTitle)}</h5>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    );
  }
}
