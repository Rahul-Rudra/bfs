import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {
  fetchProductDetails,
  fetchLocationProducts,
  fetchLocalBuilders,
} from '../../api/requests';
import {globalVar} from '../../config';

import Loader from './Common/Loader';

export default class ProductDetail extends Component {
  state = {
    productDetails: {
      data: null,
      fetching: false,
    },
    products: {
      data: null,
      fetching: false,
    },
    locations: {
      data: null,
      fetching: false,
    },
    galleryId: null,
    imageId: null,
  };

  componentDidMount() {
    this.fetchProductDetails();
    this.fetchProducts();

    document.addEventListener('keydown', this.onKeyClick);
  }

  componentDidUpdate(prevProps) {
    const {match: {params: {productId: currProductId}}} = this.props;
    const {match: {params: {productId: prevProductId}}} = prevProps;

    if (currProductId !== prevProductId) {
      this.fetchProductDetails();
      this.fetchProducts();
    }
  }

  fetchProductDetails = async () => {
    const {match: {params: {productId}}} = this.props;
    this.setState({productDetails: {data: null, fetching: true}});

    try {
      const {data} = await fetchProductDetails({productId});

      this.setState({
        productDetails: {
          data: {
            banner: data.Banner.Url,
            bannerTitle: data.BannerTitle,
            bannerSubTitle: data.BannerSubTitle,
            galleries: data.Galleries,
          },
          fetching: false,
        },
      });
    } catch (error) {
      this.setState({productDetails: {data: null, fetching: false}});

      console.error(error);
    }
  };

  fetchProducts = async () => {
    const {match: {params: {locationName}}} = this.props;

    if (locationName) {
      this.setState({products: {data: null, fetching: true}});

      try {
        const {data} = await fetchLocationProducts({locationName});

        this.setState({products: {data: data.Products, fetching: false}});
      } catch (error) {
        this.setState({products: {data: null, fetching: false}});

        console.error(error);
      }
    } else {
      this.setState({locations: {data: null, fetching: true}});

      try {
        const {data} = await fetchLocalBuilders();

        this.setState({
          locations: {data: data.LocalBuilders.Items, fetching: false},
        });
      } catch (error) {
        this.setState({locations: {data: null, fetching: false}});

        console.error(error);
      }
    }
  };

  renderProducts() {
    const {products} = this.state;
    const {match: {params: {locationName}}} = this.props;

    if (products?.fetching) {
      return <Loader height='250px'/>;
    }

    return (
      products?.data &&
      products?.data.map(product => (
        <div
          key={product?.ProductId}
          className='col-md-4 col-sm-6 section-remodal my-3'
        >
          <div className='overflow-hidden position-relative'>
            <img
              alt='product'
              className='img-fluid'
              src={`${globalVar.base_url}${product?.Thumbnail?.Url}`}
            />
            <div
              className='position-absolute p-3 bottom-0 left-0 text-white w-100 Aberdeen_ptoduct_Detail'>
              <Link
                to={`/decking/product/${product?.ProductId}/${locationName}`}
                className='bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'
              >
                <h5 className='p font-open-sans on_hover_remove mb-0'>
                  {product?.Thumbnail?.Name}
                </h5>
              </Link>
            </div>
          </div>
        </div>
      ))
    );
  }

  renderLocations() {
    const {locations} = this.state;

    if (locations?.fetching) {
      return <Loader height='250px'/>;
    }

    return (
      locations?.data &&
      locations?.data.map(location => (
        <div
          key={location?.Url}
          className='col-md-4 col-sm-6  section-remodal my-3'
        >
          <div className='overflow-hidden position-relative'>
            <img
              src={globalVar.base_url + location?.Thumbnail?.Url}
              className='img-fluid'
              alt='product'
            />
            <div
              className='position-absolute p-3 bottom-0 left-0 text-white w-100 Aberdeen_ptoduct_Detail'>
              <Link
                to={`/decking${location?.Url}`}
                className='bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'
              >
                <h5 className='p font-open-sans on_hover_remove mb-0'>
                  {location?.Name}
                </h5>
              </Link>
            </div>
          </div>
        </div>
      ))
    );
  }

  renderPopUp() {
    const {productDetails, galleryId, imageId} = this.state;

    return (
      <div
        className='modal fade video-mem-popup'
        id='exampleModal1'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div
          className='modal-dialog modal-dialog-centered modal-lg'
          role='document'
        >
          <div className='modal-content border-0'>
            <div className='modal-header border-0'>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div
              className='modal-body px-2 py-2 position-relative d-flex flex-row'>
              <button
                className='product-control-btn-left'
                onClick={() => this.changeImage('left')}
              >
              </button>
              {imageId !== null && (
                <div className='product-image'>
                  <img
                    src={`${globalVar.base_url}${productDetails?.data?.galleries[galleryId]?.Images[imageId]?.Url}`}
                    alt='product'
                  />
                </div>
              )}
              <button
                className='product-control-btn-right'
                onClick={() => this.changeImage('right')}
              >
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  changeImage = (direction) => {
    const {productDetails, galleryId, imageId} = this.state;

    let newGalleryId = galleryId;
    let newImageId = imageId;

    newImageId += direction === 'right' ? 1 : -1;

    if (newImageId < 0) {
      newGalleryId--;
      if (newGalleryId < 0) newGalleryId = productDetails.data.galleries.length - 1;
      if (newGalleryId >= productDetails.data.galleries.length) newGalleryId = 0;

      newImageId = productDetails.data.galleries[newGalleryId].Images.length - 1;
    } else if (newImageId >= productDetails.data.galleries[newGalleryId].Images.length) {
      newGalleryId++;
      if (newGalleryId < 0) newGalleryId = productDetails.data.galleries.length - 1;
      if (newGalleryId >= productDetails.data.galleries.length) newGalleryId = 0;

      newImageId = 0;
    }

    this.setState({
      imageId: newImageId,
      galleryId: newGalleryId,
    });
  };

  onKeyClick = (e) => {
    const {imageId} = this.state;

    if (imageId === null) return;

    if (e.keyCode === 37) {
      this.changeImage('left');
    } else if (e.keyCode === 39) {
      this.changeImage('right');
    }
  };

  clearTag = (tag) => {
    const from = tag.indexOf('>');
    const to = tag.indexOf('<', from);

    return tag.substring(from + 1, to);
  };

  render() {
    const {productDetails} = this.state;
    const {match: {params: {locationName}}} = this.props;

    return (
      <section className='Recent_Bfs_Project pb-5'>
        {productDetails?.fetching && <Loader height='500px'/>}

        {productDetails?.data && (
          <React.Fragment>
            <section className='banner-home position-relative internal-banner'>
              <figure className='mb-0 position-relative h-100'>
                <img
                  src={`${globalVar.base_url}${productDetails?.data?.banner}`}
                  className='img-fluid w-100 h-100 obj-fit'
                  alt='banner'
                />
              </figure>
              <div
                className='container position-absolute top-0 banner-content window-Door-content'>
                <div className='row'>
                  <div className='col-xl-12 px-xl-0 col-md-12 col-12'>
                    <div
                      className='banner-text-service left-0 w-100 h-100 d-flex flex-warp align-items-center'>
                      <div className='text-white w-100'>
                        <h1
                          className='mb-0 font-weight-bold text-center display-2'
                          dangerouslySetInnerHTML={{
                            __html: productDetails?.data?.bannerTitle,
                          }}
                        />
                        <h3
                          className='text-center mb-0'
                          dangerouslySetInnerHTML={{
                            __html: productDetails?.data?.bannerSubTitle,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className='pb-4 gallery_door_window_img'>
              {productDetails?.data?.galleries.map((gallery, galleryId) => (
                <div key={galleryId} className='container'>
                  <div className='row'>
                    <div className='col-md-12 '>
                      <div className='bg-relative bg-white  pt-5 '>
                        <h3>
                          {this.clearTag(gallery?.Title)}
                        </h3>
                        <p>
                          {this.clearTag(gallery?.SubTitle)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    {gallery?.Images.map((image, imageId) => (
                      <div key={image?.Url} className='col-md-4 mb-4'>
                        <div className='overflow-hidden'>
                          <img
                            data-toggle='modal'
                            data-target='#exampleModal1'
                            src={`${globalVar.base_url}${image?.Url}`}
                            className='img-fluid'
                            alt='Product Item'
                            onClick={() => this.setState({
                              galleryId,
                              imageId,
                            })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <section className='pb-4 gallery_door_window_img'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12'>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: productDetails?.data?.description,
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className='my-4 gallery_door_window_img'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 '>
                    <h2 className='font-weight-bold  line-height-normal'>
                      View More Products from Builders FirstSource
                      {locationName
                        ? ` in ${locationName.charAt(0).toUpperCase()}${locationName.slice(1)}`
                        : ' Near You'}
                    </h2>
                  </div>
                </div>
                <div className='row'>
                  {locationName
                    ? this.renderProducts()
                    : this.renderLocations()}
                </div>
              </div>
            </section>
          </React.Fragment>
        )}
        {this.renderPopUp()}
      </section>
    );
  }
}
