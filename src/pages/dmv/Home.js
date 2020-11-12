import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {GoogleApiWrapper} from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {OverlappingMarkerSpiderfier} from 'ts-overlapping-marker-spiderfier';
import axios from 'axios';

import {globalVar} from '../../config';

import msg from './img/envelope.svg';
import loca from './img/location.svg';
import phone from './img/phone.svg';
import Loader from './Common/Loader';
//import banner_image from './img/hero-image.jpg';

var infoWindow;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      locationname: '',
      jsondata: [],
      isloading: true,
      locationData: [],
      bannerImage: '',
      bannerTitle: '',
      bannerSubtitle: '',
      bannerText: '',
      whoWeAreTitle: '',
      whoWeAre: '',
      whoWeAreImage: [],
      stores: [],
      currentlatitude: '',
      currentlongitude: '',
      gpsError: '',
      gallery: [],
      offertitle: '',
      offers: [],
      localbuilderstitle: '',
      localbuilders: [],
      requestaQuote: '',
      BannerLinkName: '',
      BannerLinkUrl: '',
      aboutUsLinkName: '',
      showMessage: false,
      selectLocationfirst: false,
      fetching: false,
    }
    infoWindow = new window.google.maps.InfoWindow();
    this.myRef = React.createRef();
  }

  initMap(locationData) {
    if (locationData.length > 0) {
      var latitude = locationData[0].Latitude;
      var longitude = locationData[0].Longitude;
    } else {
      latitude = this.state.currentlatitude
      longitude = this.state.currentlongitude
    }

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
      zoom: 12
    });
    var oms = new OverlappingMarkerSpiderfier(map, {
      markersWontMove: true,
      markersWontHide: true,
      basicFormatEvents: false,
      keepSpiderfied: true,
      ignoreMapClick: true,
    });
    var markers = [];
    var contents = [];
    var bounds = new window.google.maps.LatLngBounds();
    for (let i = 0; i < locationData.length; i++) {
      var myLatLng = new window.google.maps.LatLng(parseFloat(locationData[i].Latitude), parseFloat(locationData[i].Longitude));
      var latLng = new window.google.maps.LatLng(parseFloat(locationData[i].Latitude), parseFloat(locationData[i].Longitude));
      markers[i] = new window.google.maps.Marker({
        position: latLng,
        map: map,
        title: locationData[i].Address1
      });
      bounds.extend(myLatLng);
      map.fitBounds(bounds);
      markers[i].index = i;
      markers[i].name = locationData[i].Name;
      markers[i].email = locationData[i].Email;
      markers[i].phone = locationData[i].PhoneNo;
      markers[i].alias = locationData[i].Alias;
      markers[i].markerId = locationData[i].$id;
      console.log(locationData);
      if (locationData[i].Alias === 'waldorf' || locationData[i].Alias === 'manassas' || locationData[i].Alias === 'fredericksburg') {
        contents[i] = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<a target="_blank" href="/decking/locations/' + locationData[i].Alias + '"> ' +
          '<h2 id="firstHeading" className="firstHeading">' + locationData[i].Name + '</h2>' +
          '</a>' +
          '<div id="bodyContent">' +
          '<p><b>Phone:</b> ' + locationData[i].PhoneNo + '' +
          '<p><b>Email:</b> ' + locationData[i].Email + '' +
          '<p><b>Address:</b> ' + locationData[i].Address1 + '' +
          '</div>' +
          '</div>';
      } else {
        contents[i] = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<a target="_blank" href="/location_' + locationData[i].Alias + '"> ' +
          '<h2 id="firstHeading" className="firstHeading">' + locationData[i].Name + '</h2>' +
          '</a>' +
          '<div id="bodyContent">' +
          '<p><b>Phone:</b> ' + locationData[i].PhoneNo + '' +
          '<p><b>Email:</b> ' + locationData[i].Email + '' +
          '<p><b>Address:</b> ' + locationData[i].Address1 + '' +
          '</div>' +
          '</div>';
      }

      window.google.maps.event.addListener(markers[i], 'spider_click', function (e) {  // 'spider_click', not plain 'click'
        infoWindow.setContent(contents[i]);
        infoWindow.open(map, markers[this.index]);
      });
      oms.addMarker(markers[i]);
      this.setState({
        locationData: locationData
      })
    }
    oms.addListener('format', function (marker, status) {
      var iconURL =
        status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED
          ? require('../../assets/img/icons8-google-maps.png').default
          : status === OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE
            ? require('../../assets/img/google-maps-Plus.png').default
            : status === OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE
              ? require('../../assets/img/icons8-google-maps.png').default
              : null;
      marker.setIcon({
        url: iconURL,
        scaledSize: new window.google.maps.Size(24, 32)  // makes SVG icons work in IE
      });
    });
  }

  getHomeData() {
    let base = globalVar.base_url;
    axios.get(base + '/umbraco/api/home', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      // console.log({response});
      if (response.data.AboutUs.Link.Name) {
        this.setState({
          aboutUsLinkName: response.data.AboutUs.Link.Name
        })
      }

      let bannerImgArray = response.data.Banner.Images;
      if (bannerImgArray.length > 0) {
        this.setState({
          BannerLinkName: bannerImgArray[0].LinkTo && bannerImgArray[0].LinkTo.Name,
          BannerLinkUrl: bannerImgArray[0].LinkTo && bannerImgArray[0].LinkTo.Url,
          bannerTitle: bannerImgArray[0].Title,
          bannerSubtitle: bannerImgArray[0].Caption,
          bannerImage: bannerImgArray[0].Url,
          BannerText: response.data.Banner.Text,
        });
      }

      if (response.data.Gallery.Gallery.length > 0) {
        this.setState({
          gallery: response.data.Gallery.Gallery
        })
      }

      if (response.data.LocalBuilders.Title) {
        this.setState({
          localbuilderstitle: response.data.LocalBuilders.Title
        })
      }

      if (response.data.LocalBuilders.Items.length > 0) {
        this.setState({
          localbuilders: response.data.LocalBuilders.Items
        })
      }

      if (response.data.Offers.Title) {
        this.setState({
          offertitle: response.data.Offers.Title
        })
      }

      if (response.data.Offers.Offers.length > 0) {
        this.setState({
          offers: response.data.Offers.Offers
        })
      }

      if (response.data.AboutUs.Title) {
        this.setState({
          whoWeAre: response.data.AboutUs.Title
        })
      } else {
        this.setState({
          whoWeAre: ''
        })
      }
      if (response.data.AboutUs.Title) {
        this.setState({
          whoWeAreTitle: response.data.AboutUs.Title
        })
      } else {
        this.setState({
          whoWeAreTitle: ''
        })
      }
      if (response.data.AboutUs.BodyText) {
        this.setState({
          whoWeAre: response.data.AboutUs.BodyText
        })
      } else {
        this.setState({
          whoWeAre: ''
        })
      }
      if (response.data.AboutUs.Images.length > 0) {
        let photodata = [];
        for (let i = 0; i < response.data.AboutUs.Images.length; i++) {
          photodata.push({
            imageUrl: globalVar.base_url + response.data.AboutUs.Images[i].Url
          })
        }
        this.setState({
          whoWeAreImage: photodata
        })
      }

    }).catch((error) => {
      console.log(error);
    });
  }


  /**
   * Hit when We have current location access is On
   */
  allowCurrentLocation = () => {
    var locationOptions = {};
    var self = this;
    self.setState({gpsError: ''})
    locationOptions = {
      enableHighAccuracy: true,
      maximumAge: 600000,
      timeout: 60000
    }
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
      if (navigator.geolocation) {
        self.setState({
          showBlur: false
        })
        navigator.geolocation.getCurrentPosition(function (position) {
          self.setState({
            showBlur: false
          })
          if (position.coords.latitude && position.coords.longitude) {
            localStorage.setItem('currentlat', position.coords.latitude);
            localStorage.setItem('currentlon', position.coords.longitude);
            self.setState(
              {
                allowgps: false
              }
            )
            self.setSearchText(position.coords.latitude, position.coords.longitude)

            self.allowLocationClicked();
            if (self.props.document.getElementById('closetoast')) {
              self.props.document.getElementById('closetoast').click();
            }

          }
        }, function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              self.setState({gpsError: 'User denied the request for Geolocation.'})
              if (self.props.document.getElementById('closetoast')) {
                self.props.document.getElementById('closetoast').click();
              }
              var date = new Date();
              localStorage.setItem('gpsPopup', date.toDateString())
              break;
            case error.POSITION_UNAVAILABLE:
              self.setState({gpsError: 'Location information is unavailable.'})
              break;
            case error.TIMEOUT:
              self.setState({gpsError: 'The request to get user location timed out.'})
              break;
            case error.UNKNOWN_ERROR:
              self.setState({gpsError: 'An unknown error occurred.'})
              break;
            default:
              self.setState({gpsError: 'Current location could not be found.'})
          }
        }, locationOptions);
      } else {
        self.setState({gpsError: 'Geolocation is not supported by this browser.'})
        if (self.props.document.getElementById('closetoast')) {
          self.props.document.getElementById('closetoast').click();
        }
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          self.setState({
            showBlur: false
          })
          if (position.coords.latitude && position.coords.longitude) {
            localStorage.setItem('currentlat', position.coords.latitude);
            localStorage.setItem('currentlon', position.coords.longitude);
            self.setState(
              {
                allowgps: false
              }
            )
            self.setSearchText(position.coords.latitude, position.coords.longitude)
            self.allowLocationClicked();
            if (self.props.document) {
              if (self.props.document.getElementById('closetoast')) {
                self.props.document.getElementById('closetoast').click();
              }
            }

          }
        }, function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              self.setState({gpsError: 'User denied the request for Geolocation.'})
              /*if (self.props.document.getElementById('closetoast')) {
                  self.props.document.getElementById('closetoast').click();
              }*/
              var date = new Date()
              localStorage.setItem('gpsPopup', date.toDateString())
              break;
            case error.POSITION_UNAVAILABLE:
              self.setState({gpsError: 'Location information is unavailable.'})
              break;
            case error.TIMEOUT:
              self.setState({gpsError: 'The request to get user location timed out.'})
              break;
            case error.UNKNOWN_ERROR:
              self.setState({gpsError: 'An unknown error occurred.'})
              break;
            default:
              self.setState({gpsError: 'Current location could not be found.'})
          }
        }, locationOptions);
      } else {
        self.setState({gpsError: 'Geolocation is not supported by this browser.'})
        if (self.props.document.getElementById('closetoast')) {
          self.props.document.getElementById('closetoast').click();
        }
      }
    }
  }

  componentDidMount() {

    this.getHomeData();
    let locationdata = [
      {
        Latitude: 38.619229,
        Longitude: -76.90928500000001,
        Address: '11850 Pika Drive,Waldorf, MD 20602',
        Address1: '11850 Pika Drive,Waldorf, MD 20602',
        Name: 'Waldorf, MD',
        Email: 'waldorf-md_decking.sales@bldr.com',
        PhoneNo: '(301) 967-9100',
        Alias: 'waldorf',
        $id: '1'
      },
      {
        Latitude: 38.771958,
        Longitude: -77.43603300000001,
        Address: '9109 Owens Drive,Manassas Park, VA 20111',
        Address1: '9109 Owens Drive,Manassas Park, VA 20111',
        Name: 'Manassas, VA',
        Email: 'manassassales@bldr.com',
        PhoneNo: '(703) 330-80-95',
        Alias: 'manassas',
        $id: '2'
      },
      {
        Latitude: 38.25258669999999,
        Longitude: -77.4998501,
        Address: '5213 Jefferson Davis Hwy Fredericksburg, VA 22408',
        Address1: '5213 Jefferson Davis Hwy Fredericksburg, VA 22408',
        Name: 'Fredericksburg, VA',
        Email: 'fredericksburgvasales@bldr.com',
        PhoneNo: '(540) 898-5227',
        Alias: 'fredericksburg',
        $id: '3'
      }
    ];
    this.setState({
      stores: locationdata
    });
    this.initMap(locationdata)
  }

  componentDidUpdate(prevProps) {
    // this.scrollToTopic()
  }

  searchChangeHandler(e) {
    console.log(e);
  }

  searchWithParameter(e) {
  }

  setSearchText(latitude, longitude, type) {

    var element = document.getElementById('searchfield');
    var geocoder = new this.props.google.maps.Geocoder();
    var latlng = {lat: parseFloat(latitude, 10), lng: parseFloat(longitude, 10)};
    var state = '';
    var country = '';
    geocoder.geocode({'location': latlng}, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var super_var1 = results[0].address_components;
          for (let j = 0; j < super_var1.length; ++j) {
            var super_var2 = super_var1[j].types;
            for (let k = 0; k < super_var2.length; ++k) {

              if (super_var2[k] === 'administrative_area_level_1') {
                state = super_var1[j].long_name
              }
              if (super_var2[k] === 'country') {
                country = super_var1[j].long_name
              }
            }
          }
          if (type) {
            if (state) {
              element.value = state + ',' + country
            } else {
              element.value = country
            }
          } else {
            element.value = results[0].formatted_address;
          }
        }
      }
    })


    let data = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: 100,
    };

    axios.post(globalVar.base_url + '/umbraco/api/LocationData/GetAllLocations', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      let locationdata = [];
      for (let i = 0; i < response.data.length; i++) {
        locationdata.push(
          {
            Latitude: response.data[i].Latitude,
            Longitude: response.data[i].Longitude,
            Name: response.data[i].Name,
            Address: response.data[i].Address1,
            Address1: response.data[i].Address1,
            PhoneNo: response.data[i].PhoneNo,
            Email: response.data[i].Email,
            Alias: response.data[i].Alias
          }
        )
      }
      this.setState({
        stores: locationdata,
        currentlatitude: latitude,
        currentlongitude: longitude
      })
      this.initMap(locationdata);
    }).catch((error) => {
      console.log(error);
    });
  }

  getLatLon(place) {
    if (place.geometry) {
      let data = {
        latitude: parseFloat(place.geometry.location.lat()),
        longitude: parseFloat(place.geometry.location.lng()),
        radius: 100
      }

      this.setState({fetching: true});
      axios.post(globalVar.base_url + '/umbraco/api/LocationData/GetAllLocations', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        let locationdata = [];
        for (let i = 0; i < response.data.length; i++) {
          locationdata.push(
            {
              Latitude: response.data[i].Latitude,
              Longitude: response.data[i].Longitude,
              Name: response.data[i].Name,
              Address: response.data[i].Address1,
              Address1: response.data[i].Address1,
              PhoneNo: response.data[i].PhoneNo,
              Email: response.data[i].Email,
              Alias: response.data[i].Alias
            }
          )
        }
        this.setState({
          stores: locationdata
        })
        this.initMap(locationdata);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.setState({fetching: false});
      });
    } else {
      let data = {
        latitude: '',
        longitude: '',
        Address: place.name,
        radius: 100
      };

      this.setState({fetching: true});
      axios.post(globalVar.base_url + '/umbraco/api/LocationData/GetAllLocations', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        let locationdata = [];
        for (let i = 0; i < response.data.length; i++) {
          locationdata.push(
            {
              Latitude: response.data[i].Latitude,
              Longitude: response.data[i].Longitude,
              Name: response.data[i].Name,
              Address: response.data[i].Address1,
              Address1: response.data[i].Address1,
              PhoneNo: response.data[i].PhoneNo,
              Email: response.data[i].Email,
              Alias: response.data[i].Alias
            }
          )
        }
        this.setState({
          stores: locationdata
        })
        this.initMap(locationdata);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.setState({fetching: false});
      });
    }
  }

  /**
   * Handle gps change
   */
  getCurrentLocationOnClick() {
    this.setState({gpsError: ''});
    this.allowCurrentLocation();
  }

  allowLocationClicked = () => {
    if (localStorage.getItem('currentlat')) {
      let mylocation = {
        lat: parseFloat(localStorage.getItem('currentlat')),
        lng: parseFloat(localStorage.getItem('currentlon'))
      }
      this.setState({
        searchCentre: {
          latitude: parseFloat(localStorage.getItem('currentlat')),
          longitude: parseFloat(localStorage.getItem('currentlon'))
        },
        showBlur: false, storeData: []
      });
      this.setSearchText(mylocation.lat, mylocation.lng);
    }
  }

  chooseLocation = () => {

    this.setState({
      selectLocationfirst: true
    })

    /*if(localStorage.getItem('selectedStore')){
        var locationalias = localStorage.getItem('selectedStore');
        var alias = locationalias.split(',')[0];
        this.props.history.push('/decking/locations/'+alias);
    }else{

    }*/

    //window.scrollTo(0, this.myRef.current.offsetTop)
    //document.querySelector('.select-message').classList.remove('d-none');

  }

  closeSelectionMessage = () => {
    document.querySelector('.select-message').classList.add('d-none');
    /*this.setState({
        showMessage:false
    })*/
  }

  /**
   * Code to scroll to particular section
   */
  // scrollToTopic() {
  //   let self = this
  //   window.location.hash = window.decodeURIComponent(window.location.hash);
  //   var hashParts = []
  //   var scrollToAnchor = () => {
  //     hashParts = window.location.hash.split('#');
  //     if (hashParts.length > 0) {
  //       if (hashParts[1] === 'storelocator') {
  //         window.scrollTo(0, self.myRef.current.offsetTop)
  //
  //         if (localStorage.getItem('locationagain')) {
  //           var location = JSON.parse(localStorage.getItem('locationagain'));
  //           localStorage.removeItem('locationagain');
  //           //console.log(location.Latitude);
  //           //console.log(location.Longitude);
  //           self.setSearchText(location.Latitude, location.Longitude);
  //         }
  //         //document.querySelector('.select-message').classList.remove('d-none');
  //         //document.querySelector(`#${hashParts[1]}`).scrollIntoView();
  //       }
  //
  //     }
  //   };
  //   scrollToAnchor();
  //   window.onhashchange = scrollToAnchor;
  // }

  selectThisLocation(alias, id, name) {
    let storedetail = alias + ',' + id + ',' + name;
    localStorage.setItem('selectedStore', storedetail);
  }

  closeLocation = () => {
    this.setState({
      selectLocationfirst: false
    })
  }

  clickQuote() {
    document.querySelector('.requestheader').click();
  }

  render() {

    const galleryElements = this.state.gallery.map(function (element, i) {
      return (
        <div key={i} className='col-sm-4 col-12 our-service-panel'>
          <div className='card border-0 h-100'>
            <Link
              to={element.Image.LinkedToId !== -1 ? `/decking/product/${element.Image.LinkedToId}` : '/decking/product'}
              className='h-100 my-3 overflow-hidden'
            >
              <figure className='mb-0 figure position-relative h-100'>
                <img src={globalVar.base_url + element.Image.Url} className='w-100 h-100 object-fit'
                     alt='...'/>
                <figcaption
                  className='h5 text-uppercase text-white content mb-0 position-absolute px-md-3 px-sm-2 px-3 py-2 bg-primary w-100'>
                  {element.Title}
                </figcaption>
              </figure>
            </Link>
          </div>
        </div>
      );
    });

    const offersElements = this.state.offers.map(function (element, i) {

      /*if(element.Link){
          var url = element.Link.Url;
      }else{
          url = '';
      }*/
      if (i % 2 === 0) {

        return (
          <div key={i} className='row align-items-center'>
            <div className='col-md-6 col-12 order-md-2 py-lg-5'>
              <figure className='mb-0 rounded h-100 overflow-hidden'>
                <img src={globalVar.base_url + element.Image.Url} className='img-fluid width-full-mob'
                     alt='products.jpg'/>
              </figure>
            </div>
            <div className='col-md-6 col-12 order-md-1 py-lg-5 pt-3 pb-5 py-md-0'>
              <h3 className='font-weight-600 font-32'>{element.Title}</h3>
              <h5 className='font-weight-600' style={{fontSize: '18px'}}>{element.Subtitle}</h5>
              <p className='text-muted' style={{fontSize: '18px'}}>{element.Description}</p>
              <a
                href='/decking/product'
                className='btn btn-danger text-uppercase font-14 font-weight-light login-blue theme-btn px-4 mt-4 btn-height requestQuote text-white'
              >
                Learn More
              </a>
              {/*<Link to={url} className='btn btn-danger text-uppercase font-14 font-weight-light login-blue theme-btn px-4 mt-4 btn-height requestQuote'>Learn More</Link>*/}
            </div>
          </div>
        )
      } else {
        return (
          <div key={i} className='row align-items-center'>
            <div className='col-md-6 col-12 order-md-3 py-lg-5'>
              <figure className='mb-0 rounded h-100 overflow-hidden'>
                <img src={globalVar.base_url + element.Image.Url} className='img-fluid width-full-mob'
                     alt='services.jpg'/>
              </figure>
            </div>
            <div className='col-md-6 col-12 order-md-4 py-lg-5 pt-3 pb-5 py-md-0'>
              <h3 className='font-weight-600 font-32'>{element.Title}</h3>
              <h5 className='font-weight-600' style={{fontSize: '18px'}}>{element.Subtitle}</h5>
              <p className='text-muted' style={{fontSize: '18px'}}>
                {element.Description}
              </p>
              <a
                href='/decking/service'
                className='btn btn-danger text-uppercase font-14 font-weight-light login-blue theme-btn px-4 mt-4 btn-height requestQuote text-white'
              >
                Learn More
              </a>
            </div>
          </div>
        )
      }
    });

    const localBuilders = this.state.localbuilders.map((element, i) => {
      return (
        <div key={i} className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
          <div className='position-relative On_hover overlay-layer-builders'>
            <Link to={'/decking' + element.Url}>
              <img src={globalVar.base_url + element.Thumbnail.Url} className='h-100 w-100 object-fit'
                   alt='firstimage'/>
              <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                <h6
                  className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>{element.Name}</h6>
              </div>
              <div className='caption position-absolute w-100 h-100 top-0'>
                <div className='blur w-100 h-100 position-absolute'></div>
                <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                  <h6 className='p font-weight-600 font-open-sans text-uppercase'>{element.Name}</h6>
                  <span className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                    View More
                    <img alt='rightarrow' width='10px' className='ml-2' src={require('./img/right-arrow.svg').default}/>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )
    });


    const image = this.state.whoWeAreImage.map((item, i) => {
      return (
        <span key={i}>
                    <div className={i === 0 ? 'text-center w-100' : 'text-center w-100 mt-4'}>
                        <figure className='mb-0 overflow-hidden'>
                            <img alt='what' className='w-100 object-fit who-we-img' src={item.imageUrl}/>
                        </figure>
                    </div>
                </span>
      );
    });

    if (this.state.stores.length > 0) {
      var stores = this.state.stores.map((item, i) => {
        if (item.Alias === 'waldorf' || item.Alias === 'manassas' || item.Alias === 'fredericksburg') {
          return (
            <div key={i}>
              <div className='py-4'>
                <h6 className='mb-3'><Link onClick={() => {
                  this.selectThisLocation(item.Alias, item.$id, item.Name);
                }} to={'/decking/locations/' + item.Alias}
                                           className='h-100 my-3 overflow-hidden location-link'>{item.Name}</Link>
                </h6>
                <ul className='list-unstyled'>
                  <li className='mb-3 d-flex align-items-center'>
                    <img alt='location'
                         className='img-fluid mr-3 mt-1'
                         width='13px'
                         src={loca}
                    />
                    {item.Address}
                  </li>
                  <li className='mb-3  d-flex align-items-center'><img alt='phone'
                                                                       className='img-fluid mr-3'
                                                                       width='13px'
                                                                       src={phone}/>{item.PhoneNo}
                  </li>
                  <li className='d-flex align-items-center'><img alt='email'
                                                                 className='img-fluid mr-3'
                                                                 width='13px' src={msg}/>{item.Email}
                  </li>
                </ul>
              </div>
              <hr className='my-2 custom-hr'/>
            </div>
          );
        } else {
          return (
            <div key={i}>
              <div className='py-4'>
                <h6 className='mb-3'>
                  <Link
                    onClick={() => this.selectThisLocation(item.Alias, item.$id, item.Name)}
                    to={'/location_' + item.Alias}
                    className='h-100 my-3 overflow-hidden location-link'
                  >
                    {item.Name}
                  </Link>
                </h6>
                <ul className='list-unstyled'>
                  <li className='mb-3 d-flex align-items-center'><img alt='location'
                                                                      className='img-fluid mr-3 mt-1'
                                                                      width='13px'
                                                                      src={loca}/>{item.Address}</li>
                  <li className='mb-3  d-flex align-items-center'><img alt='phone'
                                                                       className='img-fluid mr-3'
                                                                       width='13px'
                                                                       src={phone}/>{item.PhoneNo}
                  </li>
                  <li className='d-flex align-items-center'><img alt='email'
                                                                 className='img-fluid mr-3'
                                                                 width='13px' src={msg}/>{item.Email}
                  </li>
                </ul>
              </div>
              <hr className='my-2 custom-hr'/>
            </div>
          );
        }
      });
    } else {
      stores = 'No Stores Found'
    }
    return (
      <div>
        {this.state.bannerImage ? (<section className='banner-home position-relative'>
          <figure className='mb-0 homebanner position-relative'>
            <img alt='homebanner' className='home-img' src={globalVar.base_url + this.state.bannerImage}/>
          </figure>
          <div className='container position-absolute top-0 banner-content'>
            <div className='row'>
              <div className='col-xl-12 px-xl-0 col-md-12 col-12'>
                <div
                  className='banner-text-service left-0 w-100 h-100 d-flex flex-warp align-items-center'>
                  <div className='text-white w-100'>
                    <h1 className="mb-0 font-weight-bold text-center display-2">
                      {this.state.BannerText}
                    </h1>
                    {/*<h3 className="text-center mb-0 display-5">*/}
                    {/*{this.state.bannerSubtitle}*/}
                    {/*</h3>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>) : null}

        {this.state.gallery.length > 0 ? (<section className='builders-h-construction-sec py-5 mt-4 clearfix'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 mb-4'>
                <h2 className='font-40 text-center font-weight-600'>Our Products</h2>
              </div>
            </div>
            <div
              className='row flex-column justify-content-center align-items-center our-service-row position-relative'>
              {galleryElements}
            </div>
          </div>
        </section>) : null}

        {this.state.offers.length > 0 ? (<section className='builders-h-professional py-5'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <h2 className='font-40 text-center font-weight-600'>{this.state.offertitle}</h2>
              </div>
            </div>
            {offersElements}
          </div>
        </section>) : null}

        <section className='whoWeare builders-h-whowe-sec'>
          <div className='container pt-5'>
            <div className='row py-4'>
              <div className='col-lg-6 col-12 text-md-left text-center mb-0 mb-sm-4 '>
                <h4 className='display-4 font-weight-normal'>{this.state.whoWeAreTitle}</h4>
                <div
                  dangerouslySetInnerHTML={{__html: this.state.whoWeAre}}
                  className='h4 font-weight-light p-content'
                />

                {/*{this.state.whoWeAre && (*/}
                {/*<div className='mt-md-5 mb-md-0 my-4 text-center text-lg-left'>*/}
                {/*<a*/}
                {/*className='btn theme-btn text-uppercase bg-info px-4 py-3 d-inline-block login-blue text-white mb-4'*/}
                {/*href='/about-us'*/}
                {/*>*/}
                {/*{this.state.aboutUsLinkName}*/}
                {/*</a>*/}
                {/*</div>*/}
                {/*)}*/}

              </div>
              <div className='col-lg-5 offset-lg-1 col-12'>
                {image}
              </div>
            </div>
          </div>
        </section>

        {this.state.localbuilders.length > 0 ? (<section className='local-builders py-5'>
          <div className='local-builders-con mx-auto'>
            <h2
              className='text-capitalize text-center font-weight-600 text-white font-40 mb-0 px-3'>{this.state.localbuilderstitle}</h2>
            <div className='mt-4 pt-lg-3'>
              <div className='row mx-0 justify-content-center'>
                {localBuilders}
                {/*<div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local1} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Aberdeen</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Aberdeen</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local2} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Brooking</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Brooking</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                 <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local3} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Hot Springs</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Hot Springs</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                 <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local4} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Huron</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Huron</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local5} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Madison</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Madison</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>


                                  <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local6} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Mitchell</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Mitchell</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                  <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local7} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Pierre</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Pierre</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local8} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Rapid city</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Rapid city</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local9} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Sioux Falls</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Sioux Falls</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-xl-custom-builder col-lg-3 col-md-4 col-sm-4 col-6 section-remodal  my-3'>
                                    <div className='position-relative On_hover overlay-layer-builders'>
                                        <img src={local10} className='img-fluid' alt='firstimage'/>
                                        <div className='position-absolute px-4 pb-3  bottom-0 left-0 text-white w-100'>
                                            <h6 className='p font-weight-normal font-open-sans text-uppercase on_hover_remove'>Spearfish</h6>
                                        </div>
                                        <div className='caption position-absolute w-100 h-100 top-0'>
                                            <div className='blur w-100 h-100 position-absolute'></div>
                                            <div className='caption-text position-absolute text-white h-100 w-100 p-4'>
                                                <h6 className='p font-weight-600 font-open-sans text-uppercase'>Spearfish</h6>
                                                <a className='position-absolute bottom-0 pb-4 text-white font-13 font-open-sans text-decoration-none'>
                                                    View More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>*/}
              </div>
            </div>
          </div>
        </section>) : null}

        <div ref={this.myRef} id='store_locator' className='store_locator py-sm-4  py-md-5'>
          <div className='px-0 pt-5 pt-md-0 container'>
            <div className='m-auto'>
              <h2 className='display-4 text-center font-weight-normal'>Store <span
                className='font-weight-light'>Locator</span></h2>
            </div>
            <div className='search_frm  pb-4 d-md-flex align-items-center'>
              <div className='input-group mb-3 mb-md-0'>
                <Autocomplete types={[]} className='form-control mr-md-3 mr-0' onKeyPress={(e) =>
                  this.searchWithParameter(e)} onChange={(e) => this.searchChangeHandler(e)}
                              style={{width: '100%'}} onPlaceSelected={(place) => {
                  this.getLatLon(place);
                }} id='searchfield'
                />
              </div>

              <div className='ml-auto'>
                <div className='my-lyc'>
                  <button onClick={() => {
                    this.getCurrentLocationOnClick();
                  }}
                          className='btn text-uppercase bg-info px-4 py-3 d-inline-block d-none-mob  text-white sp-shadow'>Use
                    My location
                  </button>
                </div>
              </div>
            </div>
            <div className='alert alert-success select-message d-none' role='alert'>
              Please select your location you can search by entering zipcode or storename or by selectig
              location name from suggestion
              <button onClick={() => {
                this.closeSelectionMessage();
              }} type='button' className='close' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
          </div>
        </div>

        <section className='mb-5'>
          <div className='container'>
            <div className='row'>
              <div className='col-sm-6 mr-sm-0 pr-sm-0'>
                <div className=' bg-blue text-white p-5 h-100 listing-stores'>
                  <h5 className='mb-0'>Builders Firstsource</h5>
                  {this.state.fetching
                    ? (
                      <Loader color='white'/>
                    )
                    : !this.state.gpsError ? stores : this.state.gpsError
                  }
                </div>
              </div>
              <div className='col-sm-6 ml-sm-0 pl-sm-0'>
                <div style={{height: '100%'}} id='map'/>
              </div>
            </div>
          </div>
        </section>

        <Modal isOpen={this.state.selectLocationfirst} className=' bfspage modal-dialog-centered location'>
          <ModalHeader className=' pb-0'>
            <span className=' allow-loc-head h3 m-auto pb-0 d-block font-weight-light'>Select location for the relevant products and services</span>
          </ModalHeader>
          <ModalBody className=''>
            <div className=' col-12 mb-3'>
              <div className=' row'>
                <div className=' col-sm-12'>
                  <h5 className=' font-weight-bold mb-2 mt-2 position-relative'>
                    <Link onClick={() => {
                      this.selectThisLocation(' waldorf', 4671, ' Waldorf, MD');
                    }} className=' thumbnail' to={'/decking/locations/waldorf'}>
                      <span className=' text-dark store-name align-top'>Waldorf, MD</span>
                    </Link>
                  </h5>
                  <p className=' mb-2 store_address'>
                    11850 Pika Drive,Waldorf, MD 20602
                  </p>
                  <p className=' mb-1 store_phone'>Phone: (301) 967-9100)</p>
                  <p className=' mb-3 store_hours'>Email: waldorf-md_decking.sales@bldr.com</p>
                </div>
              </div>
            </div>
            <div className=' col-12 mb-3'>
              <div className=' row'>
                <div className=' col-sm-12'>
                  <h5 className=' font-weight-bold mb-2 mt-2 position-relative'>
                    <Link onClick={() => {
                      this.selectThisLocation(' manassas', 5428, ' Manassas,VA');
                    }} className=' thumbnail' to={'/decking/locations/manassas'}>
                      <span className=' text-dark store-name align-top'>Manassas,VA</span>
                    </Link>
                  </h5>
                  <p className=' mb-2 store_address'>
                    9109 Owens Drive,Manassas Park, VA 20111
                  </p>
                  <p className=' mb-1 store_phone'>Phone: (703)330-80-95</p>
                  <p className=' mb-3 store_hours'>Email: manassassales@bldr.com</p>
                </div>
              </div>
            </div>
            <div className=' col-12 mb-3'>
              <div className=' row'>
                <div className=' col-sm-12'>
                  <h5 className=' font-weight-bold mb-2 mt-2 position-relative'>
                    <Link onClick={() => {
                      this.selectThisLocation(' fredericksburg', 4592, ' Fredericksburg, VA');
                    }} className=' thumbnail' to={'/decking/locations/fredericksburg'}>
                      <span className=' text-dark store-name align-top'>Fredericksburg, VA</span>
                    </Link>
                  </h5>
                  <p className=' mb-2 store_address'>
                    5213 Jefferson Davis Hwy Fredericksburg, VA 22408
                  </p>
                  <p className=' mb-1 store_phone'>Phone: (540) 898-5227</p>
                  <p className=' mb-3 store_hours'>Email: fredericksburgvasales@bldr.com</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className=' justify-content-end'>
            <Button className=' bg-info btn text-uppercase theme-btn px-4 py-3 btn btn-secondary border-0'
                    color=' primary' onClick={() => {
              this.closeLocation();
            }}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default GoogleApiWrapper(
  (props) => ({
      apiKey: globalVar.apiKey,
      language: props.language,
    }
  ))(Home)
