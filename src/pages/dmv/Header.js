import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import {GoogleApiWrapper} from 'google-maps-react';
import ReactLoading from 'react-loading';
import ReactTooltip from 'react-tooltip';
import cookie from 'react-cookies'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import $ from 'jquery'
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';

import {globalVar} from '../../config';

import close_icon from '../../assets/img/close.svg';
import loc_search from '../../assets/img/loc_search.svg';
import togller from '../../assets/img/menu-button.svg';
import defaultimage from '../../assets/img/default.jpg';
import headerlogo from '../../assets/img/Logo.png';
import search_icon from '../../assets/img/icon-search.svg';
import {fetchClosestStore} from '../../api/requests';
import login from '../../assets/img/builder-logo.jpg';
import Hours from '../../components/Hours';

var mybody = {}
var captchaKey = globalVar.googleCaptchaKey;
const gid = 'AIzaSyCAPzibK06qRZ_9o8V7GxOA8k1a5o3WOYs';

class HeaderComponent extends Component {
  constructor() {
    super();

    this.state = {
      showLocationNotification: false,
      gpsError: '',
      loginLink: 'https://www.bldr.com/mybfsbuilder/login',

      addClass: false,
      modal: false,
      toggleClass: false,
      toggleLocation: false,
      searchZipcode: '',
      nameErr: '',
      email: '',
      emailErr: '',
      zipcode: '',
      zipcodeErr: '',
      phone: '',
      phoneErr: '',
      message: '',
      messageErr: '',
      messageSuccess: '',
      quoteEmailStatus: '',
      showBlur: true,
      recaptchaValue: '',
      captchaErr: '',
      showPrompt: true,
      noStoreFound: false,
      refreshStores: [],
      zipcodeModal: false,
      storemessage: '',
      storeDataHeader: [],
      showSpinner: false,
      sendquotemodal: false,
      dropdownOpen: false,
      locationDropdownOpen: false,
      serviceOption: '',
      isNotificationOn: true,
    };
  }

  interval = null;
  previousStore = localStorage.getItem('selectedStore');

  setCookie() {
    let userIdCookies = 1;
    cookie.save('userIdCookies', userIdCookies, {path: '/'})
    localStorage.setItem('userIdCookies', userIdCookies);
  };

  closeNotify() {
    this.setState({
      isNotificationOn: false
    })
  }

  componentDidMount() {
    this.interval = setInterval(() => this.checkLocationUpdate(), 500);

    if (parseInt(localStorage.getItem('userIdCookies'), 10) !== 1) {
      if (window.location.pathname === '/IBS' || window.location.pathname === '/IBS_login' || window.location.pathname === '/IBS_update_event' || window.location.pathname === '/IBSrejectinvite' || window.location.pathname === '/forgetpassword' || window.location.pathname === '/reset-password') {

      } else {
        this.showPopUPNotLogin();
      }

    }
    window.addEventListener('scroll', this.handleScroll);

    const status = localStorage.getItem('locationStatus');

    if (!status) {
      this.setState({showLocationNotification: true});
    } else {
      const date = localStorage.getItem('locationStatusDate');
      if (status === 'declined' && date && moment().subtract(1, 'd').isAfter(moment(date, 'DD.MM.YYYY HH:mm:ss'))) {
        this.setState({showLocationNotification: true});
      }
    }
  }

  componentDidUpdate() {
    if (this.props.childProps.refreshStore && this.props.childProps.refreshStore.length !== this.state.refreshStores.length) {
      if (this.props.childProps.storeData.length === 0) {
        if (this.state.modal === false) {
          this.setState({
            modal: true,
            noStoreFound: true,
            refreshStores: this.props.childProps.refreshStore,
            showSpinner: false
          });
        }
      } else {
        this.setState({refreshStores: this.props.childProps.refreshStore, showSpinner: false})
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    window.removeEventListener('scroll', this.handleScroll);
  }

  //--------------------------------REFACTORED----------------------------------

  checkLocationUpdate = () => {
    if (this.previousStore !== localStorage.getItem('selectedStore')) {
      this.previousStore = localStorage.getItem('selectedStore');
      this.forceUpdate();
    }
  };

  getNearbyStores = async (latitude, longitude) => {
    const {data} = await fetchClosestStore({
      radius: 200,
      latitude: latitude,
      longitude: longitude
    });

    if (data) {
      localStorage.setItem('selectedStore', `${data.Alias},${data.Id},${data.Name}`);
    }
  };

  allowGPS = () => {
    this.setState({showLocationNotification: false});
    localStorage.setItem('locationStatus', 'allowed');
  };

  cancelGPS = () => {
    this.setState({showLocationNotification: false});
    localStorage.setItem('locationStatus', 'declined');
    localStorage.setItem('locationStatusDate', moment().format('DD.MM.YYYY HH:mm:ss'));
  };

  allowCurrentLocation = () => {
    this.setState({gpsError: ''});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords.latitude && position.coords.longitude) {
            this.allowGPS();

            localStorage.setItem('currentlat', position.coords.latitude);
            localStorage.setItem('currentlon', position.coords.longitude);
            this.getNearbyStores(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          this.cancelGPS();

          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.setState({gpsError: 'User denied the request for Geolocation.'});
              break;
            case error.POSITION_UNAVAILABLE:
              this.setState({gpsError: 'Location information is unavailable.'});
              break;
            case error.TIMEOUT:
              this.setState({gpsError: 'The request to get user location timed out.'});
              break;
            case error.UNKNOWN_ERROR:
              this.setState({gpsError: 'An unknown error occurred.'});
              break;
            default:
              this.setState({gpsError: 'Current location could not be found.'});
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 600000,
          timeout: 60000
        },
      );
    } else {
      this.setState({gpsError: 'Geolocation is not supported by this browser.'});
    }
  };

  renderLocationNotification() {
    const {showLocationNotification} = this.state;

    return showLocationNotification && (
      <div
        className={`alert alert-primary toastpopup ${window.pageYOffset > 140 ? 'slideInDown' : ''}`}
        role="alert"
      >
        <a href="#" className="close" id="closetoast" data-dismiss="alert" aria-label="close">&times;</a>
        <div className="container">
          If you would like to be able to find stores close to you, please enable GPS or allow location sharing.
          <a className="text-white text-underline location-notification__link" onClick={this.allowCurrentLocation}>Allow</a>
          <a className="text-white text-underline location-notification__link" onClick={this.cancelGPS}>Deny</a>
        </div>
      </div>
    );
  }

  //--------------------------------REFACTORED----------------------------------

  /**
   * Events on selecting recaptcha
   */
  onRecaptchChange(value) {
    this.setState({recaptchaValue: value});
  }

  /**
   * Show and hide popup modal
   */
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  /**
   * Show and hide popup modal
   */
  toggle2 = () => {
    if (this.state.modalSecond) {
      // console.log('rredirect to other.......');
      window.open('https://www.bldr.com/mybfsbuilder', '_blank');
    } else {
      // console.log('neeed to set values.......');
    }
    this.setState({
      modalSecond: true
    });
  }

  /**
   * Show and hide send quote modal
   */
  togglesendquote = () => {
    if (this.state.sendquotemodal === false) {
      document.getElementsByTagName('html')[0].classList.add('bfs-modal-opened')
    } else {
      document.getElementsByTagName('html')[0].classList.remove('bfs-modal-opened')
    }
    this.setState({
      sendquotemodal: !this.state.sendquotemodal
    });
  }


  /**
   * Show and hide location modal
   */
  togglelocation = () => {
    this.setState({
      showLocationNotification: !this.state.showLocationNotification
    })
  }


  /**
   * Show and hide zip code box
   */
  togglezipmodal = () => {
    this.setState({
      zipcodeModal: !this.state.zipcodeModal
    })
  }

  /**
   * View all search result
   */
  viewAllResult = () => {
    this.setState({
      zipcodeModal: false,
      toggleLocation: false
    });
    if (localStorage.getItem('zipcodevalue')) {
      this.getLatLngFromZipHeader(localStorage.getItem('zipcodevalue'));
    } else {
      this.getLatLngFromZipHeader(this.state.searchZipcode);
    }
  }


  /**
   * Reset the search
   */
  resetSearch = () => {
    localStorage.removeItem('storesitem');
    localStorage.removeItem('storesitemdata');
    localStorage.removeItem('zipcodevalue');
    this.setState({
      toggleLocation: !this.state.toggleLocation,
      zipcodeModal: !this.state.zipcodeModal
    })
  }

  /**
   * Handler of the scroll event
   */
  handleScroll = () => {
    if (window.scrollY > 120) {
      this.setState({
        addClass: true
      })
    } else {
      this.setState({
        addClass: false
      })
    }
  }


  /**
   * Hiding scroll
   */
  addToggleClass = () => {
    this.setState({
      toggleClass: true
    })
    document.body.classList.add('hidescroll');
  };

  /**
   * Event on entering area of div through mouse
   */
  enterArea = () => {
    this.setState({
      toggleLocation: true
    })
  };

  /**
   * Event on leaving area of div through mouse
   */
  leaveArea = () => {
    this.setState({
      toggleLocation: false
    })
  };

  /**
   * Showing and hiding location based upon condition
   */
  addToggleLocation = () => {
    if (localStorage.getItem('storesitem')) {
      var values = JSON.parse(localStorage.getItem('storesitem'));
      if (new Date(values[0]) < new Date()) {
        localStorage.removeItem('storesitem');
        localStorage.removeItem('storesitemdata');
        localStorage.removeItem('zipcodevalue');
        this.setState({
          toggleLocation: !this.state.toggleLocation
        })
      } else {
        this.setState({
          storeDataHeader: JSON.parse(localStorage.getItem('storesitemdata')),
          storemessage: ''
        })
        this.togglezipmodal();
      }
    } else {
      this.setState({
        toggleLocation: !this.state.toggleLocation
      })
    }
  };

  /**
   * Closing sidebar on phone
   */
  closeSideBar = () => {
    this.setState({
      toggleClass: false
    })
    document.body.classList.remove('hidescroll');
  };

  /**
   * Redirecting to login
   */
  redirectToLogin = () => {
    window.open(this.state.loginLink, '_blank');
  };

  /**
   * Validating zip and hitting api to fetch location if zipcode is correct
   */
  numberOnly = (e) => {
    let self = this;
    var element = document.getElementById('zip_code_search');
    var regex = /[^0-9]/gi;
    element.value = element.value.replace(regex, '');
    this.setState({searchZipcode: e.target.value});
    if (e.key === 'Enter') {
      this.setState({
        toggleLocation: !this.state.toggleLocation
      })
      this.setState({
        storemessage: '',
        storeDataHeader: [],
        zipcodeModal: true
      })

      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({'componentRestrictions': {'postalCode': e.target.value}}, function (results, status) {
        if (results[0]) {
          document.getElementById('zip_code_search').value = '';
          localStorage.setItem('locationzip', 'locationdetail');
          mybody = {};
          mybody['Address'] = '';
          mybody['Radius'] = 200;
          mybody['DistributionList'] = [];
          mybody['InstalledServiceList'] = [];
          mybody['Latitude'] = results[0].geometry.location.lat();
          mybody['Longitude'] = results[0].geometry.location.lng();
          self.setState({noStoreFound: false})
          self.props.childProps.getStoreDataHeader(mybody);
          setTimeout(function () {
            if (self.props.childProps.storeDataHeader) {
              let mydata = [];
              var myHour = new Date();
              myHour.setMinutes(myHour.getMinutes() + 30); //one hour from now
              mydata.push(myHour);
              localStorage.setItem('storesitem', JSON.stringify(mydata));
              localStorage.setItem('storesitemdata', JSON.stringify(self.props.childProps.storeDataHeader));
              localStorage.setItem('zipcodevalue', self.state.searchZipcode);
              self.setState({
                storeDataHeader: self.props.childProps.storeDataHeader,
                storemessage: '',
                searchZipcode: ''
              })
            } else {
              self.setState({
                storeDataHeader: self.props.childProps.storeDataHeader,
                storemessage: 'No result found matching your zip code please try with another zip code'
              })
            }
          }, 5000);
        } else {
          self.setState({
            storemessage: 'This Zip code could not be found please try with another zipcode.'
          })
        }
      });
    }
  };

  /**
   * Searching location through API
   */
  searchWithZipCode = () => {
    this.setState({
      toggleLocation: !this.state.toggleLocation,

      storemessage: '',
      storeDataHeader: [],
      zipcodeModal: true
    })


    fetch('https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:' + parseInt(this.state.searchZipcode, 10) + '&sensor=false&key=' + gid)
      .then((response) => {
        const results = response.json();

        if (results[0]) {
          document.getElementById('zip_code_search').value = '';
          localStorage.setItem('locationzip', 'locationdetail');
          mybody = {};
          mybody['Address'] = '';
          mybody['Radius'] = 200;
          mybody['DistributionList'] = [];
          mybody['InstalledServiceList'] = [];
          mybody['Latitude'] = results[0].geometry.location.lat();
          mybody['Longitude'] = results[0].geometry.location.lng();
          this.setState({noStoreFound: false})
          this.props.childProps.getStoreDataHeader(mybody);
          setTimeout(() => {
            if (this.props.childProps.storeDataHeader) {
              let mydata = [];
              var myHour = new Date();
              myHour.setMinutes(myHour.getMinutes() + 30); //one hour from now
              mydata.push(myHour);
              localStorage.setItem('storesitem', JSON.stringify(mydata));
              localStorage.setItem('storesitemdata', JSON.stringify(this.props.childProps.storeDataHeader));
              localStorage.setItem('zipcodevalue', this.state.searchZipcode);
              this.setState({
                storeDataHeader: this.props.childProps.storeDataHeader,
                storemessage: '',
                searchZipcode: ''
              })
            } else {
              this.setState({
                storeDataHeader: this.props.childProps.storeDataHeader,
                storemessage: 'No result found matching your zip code please try with another zip code'
              })
            }
          }, 5000);
        } else {
          this.setState(
            {
              storemessage: 'This zipcode could not be found please try with another zipcode!'
            }
          )
        }
      });
  };

  /**
   * Validating phone number
   */
  numberOnlyInMoblile = (e) => {
    let self = this;
    this.setState({searchZipcode: e.target.value});
    if (e.key !== 'Enter') {
      var element = document.getElementById('zip_code_search_mobile');
      var regex = /[^0-9]/gi;
      element.value = element.value.replace(regex, '');
    } else {
      this.setState({
        storemessage: '',
        storeDataHeader: [],
        zipcodeModal: true,
        toggleLocation: !this.state.toggleLocation
      })

      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({'componentRestrictions': {'postalCode': e.target.value}}, function (results, status) {
        if (results[0]) {
          document.getElementById('zip_code_search_mobile').value = '';
          localStorage.setItem('locationzip', 'locationdetail');
          mybody = {};
          mybody['Address'] = '';
          mybody['Radius'] = 200;
          mybody['DistributionList'] = [];
          mybody['InstalledServiceList'] = [];
          mybody['Latitude'] = results[0].geometry.location.lat();
          mybody['Longitude'] = results[0].geometry.location.lng();
          self.setState({noStoreFound: false})
          self.props.childProps.getStoreDataHeader(mybody);
          setTimeout(function () {
            if (self.props.childProps.storeDataHeader) {
              let mydata = [];
              var myHour = new Date();
              myHour.setMinutes(myHour.getMinutes() + 30); //one hour from now
              mydata.push(myHour);
              localStorage.setItem('storesitem', JSON.stringify(mydata));
              localStorage.setItem('storesitemdata', JSON.stringify(self.props.childProps.storeDataHeader));
              localStorage.setItem('zipcodevalue', self.state.searchZipcode);
              self.setState({
                storeDataHeader: self.props.childProps.storeDataHeader,
                storemessage: '',
                searchZipcode: ''
              })
            } else {
              self.setState({
                storeDataHeader: self.props.childProps.storeDataHeader,
                storemessage: 'No result found matching your zip code please try with another zip code'
              })
            }
          }, 5000);
        } else {
          self.setState({
            storemessage: 'This Zip code could not be found please try with another zipcode.'
          })
        }
      });
    }
  };

  /**
   * Search with the zip code
   */
  searchWithZipCodeMobile = () => {
    this.setState({
      toggleLocation: !this.state.toggleLocation,
      storemessage: '',
      storeDataHeader: [],
      zipcodeModal: true
    })

    fetch('https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:' + parseInt(this.state.searchZipcode, 10) + '&sensor=false&key=' + gid)
      .then((response) => {
        const results = response.json();

        if (results[0]) {
          localStorage.setItem('locationzip', 'locationdetail');
          mybody = {};
          mybody['Address'] = '';
          mybody['Radius'] = 200;
          mybody['DistributionList'] = [];
          mybody['InstalledServiceList'] = [];
          mybody['Latitude'] = results[0].geometry.location.lat();
          mybody['Longitude'] = results[0].geometry.location.lng();
          this.setState({noStoreFound: false})
          document.getElementById('zip_code_search_mobile').value = '';
          this.props.childProps.getStoreDataHeader(mybody);
          setTimeout(() => {
            if (this.props.childProps.storeDataHeader) {
              let mydata = [];
              var myHour = new Date();
              myHour.setMinutes(myHour.getMinutes() + 30); //one hour from now
              mydata.push(myHour);
              localStorage.setItem('storesitem', JSON.stringify(mydata));
              localStorage.setItem('storesitemdata', JSON.stringify(this.props.childProps.storeDataHeader));
              localStorage.setItem('zipcodevalue', this.state.searchZipcode);
              this.setState({
                storeDataHeader: this.props.childProps.storeDataHeader,
                storemessage: '',
                searchZipcode: ''
              })
            } else {
              this.setState({
                storeDataHeader: this.props.childProps.storeDataHeader,
                storemessage: 'No result found matching your zip code please try with another zip code'
              })
            }
          }, 5000);
        } else {
          this.setState({
            storemessage: 'This Zip code could not be found please try with another zipcode.'
          })
        }
      });
  };

  /**
   * Validating email
   */
  validateEmail = (email) => {
    let re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    return re.test(email);
  };

  /**
   * Zipcode validator
   */
  handleZipcodeChange = (e) => {
    var element = document.getElementById('zipcode');
    var regex = /[^0-9]/gi;
    element.value = element.value.replace(regex, '');
    this.setState({zipcode: e.target.value})
  };

  /**
   * Phone number validator
   */
  handlePhoneChange = () => {
    var element = document.getElementById('phone');
    var regex = /[^0-9]/gi;
    element.value = element.value.replace(regex, '');
  };

  /**
   *Form validator
   */
  checkHeaderFormValidation = () => {
    if (document.getElementById('name').value === '' || document.getElementById('name').value.trim() === '') {
      this.setState({nameErr: 'Name is required'});
    } else {
      this.setState({nameErr: ''});
    }
    if (!this.validateEmail(document.getElementById('email').value.trim())) {
      this.setState({emailErr: 'Email entered is not valid'});
    } else {
      this.setState({emailErr: ''});
    }
    if (document.getElementById('phone').value === '' || document.getElementById('phone').value.trim() === '') {
      this.setState({phoneErr: 'Phone Number is required'})
    } else {
      this.setState({phoneErr: ''})
    }
    if (document.getElementById('message').value === '' || document.getElementById('message').value.trim() === '') {
      this.setState({messageErr: 'Message is required'})
    } else {
      this.setState({messageErr: ''})
    }
    if (document.getElementById('zipcode').value === '' || document.getElementById('zipcode').value.trim() === '') {
      this.setState({zipcodeErr: 'Zipcode is required'})
    } else {
      this.setState({zipcodeErr: ''})
    }
    if (this.state.recaptchaValue === '') {
      this.setState({captchaErr: 'Captcha is not valid'})
    } else {
      this.setState({captchaErr: ''})
    }
    return !(document.getElementById('name').value === ''
      || document.getElementById('name').value.trim() === ''
      || !this.validateEmail(document.getElementById('email').value.trim()
        || document.getElementById('phone').value === ''
        || document.getElementById('phone').value.trim() === ''
        || document.getElementById('message').value === ''
        || document.getElementById('message').value.trim() === ''
        || document.getElementById('zipcode').value === ''
        || document.getElementById('zipcode').value.trim() === ''
        || this.state.recaptchaValue === ''
      ));
  };

  getCurrentLocation = () => {
    const pos = {};
    return pos;
  };

  getLocationData = () => {
    const info = {
      id: '',
      alias: '',
      title: '',
    };

    const data = localStorage.getItem('selectedStore');

    if (data) {
      const location = data.split(',');

      info.id = location[1];
      info.alias = location[0];
      info.title = location[2];
    }

    return info;
  };

  /**
   * Send the Quote mail
   */
  sendQuote = () => {
    if (this.checkHeaderFormValidation() === true) {
      this.setState({quoteEmailStatus: 'Please wait sending email...'})
      let quoteData = {
        FullName: document.getElementById('name').value,
        Email: document.getElementById('email').value,
        ServiceName: this.state.serviceOption,
        ZipCode: document.getElementById('zipcode').value,
        Phone: document.getElementById('phone').value,
        Message: document.getElementById('message').value,
        LocationId: this.getLocationData().id,
        RecaptchaResponse: this.state.recaptchaValue
      }
      this.sendQuoteApi(quoteData);
    }
  }

  /**
   * Send mail Api
   */
  sendQuoteApi = (quoteData) => {
    let self = this;
    axios.post(globalVar.base_url + '/umbraco/Api/Content/SendQuoteByLocation', quoteData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.data === true) {
        this.setState({quoteEmailStatus: 'Email has been sent successfully'})

        setTimeout(() => {
          self.setState({sendquotemodal: !this.state.sendquotemodal, quoteEmailStatus: ''})
        }, 2000)
      } else {
        this.setState({quoteEmailStatus: 'Internal problem occured not able to send email please try again'})
      }

    }).catch((error) => {
      //console.log(error);
      //this.setState({ quoteEmailStatus: error })
    });
  }

  /**
   * Show gps popup
   */
  showPopUP = () => {
    if (localStorage.getItem('selectedStore')) {
      this.togglesendquote();
    } else {
      if (window.location.pathname === '/decking') {
        $('html,body').animate({scrollTop: $("#store_locator").offset().top - 150}, 500);
      } else {
        this.props.history.push('/decking');
        setTimeout(() => $('html,body').animate({scrollTop: $("#store_locator").offset().top - 150}, 500), 700);
      }
    }
  };

  /**
   * Show gps popup
   */
  showPopUPNotLogin = () => {
    this.toggle2();
  }

  showPopUPNotLoginClonse = () => {
    let self = this;
    self.showPopUPNotLogin();
  }

  /**
   * Go to the store locator
   */
  newChangesHidePopup = () => {
    this.setState({
      modalSecond: !this.state.modalSecond
    });
  }

  newChangesHidePopupClose = () => {
    this.setState({
      modalSecond: !this.state.modalSecond
    });
    if (parseInt(localStorage.getItem('userIdCookies'), 10) !== 1) {
      this.setCookie();
    }
  }

  /**
   * Go to the store locator
   */
  goToStoreQuote = () => {
    this.setState({noStoreFound: false})
    if (!this.state.zipcode) {
      this.setState({zipcodeErr: 'Zip code is required.'})
    } else if (this.state.zipcode.length !== 5) {
      this.setState({zipcodeErr: 'Zip code is not valid.'})
    } else {
      this.setState({zipcodeErr: ''})
      this.getLatLngFromZip(this.state.zipcode);
    }
  }

  /**
   * Get the lat lng from the zip code
   */
  getLatLngFromZip = (zip) => {
    let self = this;
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({'componentRestrictions': {'postalCode': zip}}, function (results, status) {
      if (results[0]) {
        localStorage.setItem('locationzip', 'locationdetail');
        mybody = {};
        mybody['Address'] = '';
        mybody['Radius'] = 200;
        mybody['DistributionList'] = [];
        mybody['InstalledServiceList'] = [];
        mybody['Latitude'] = results[0].geometry.location.lat();
        mybody['Longitude'] = results[0].geometry.location.lng();
        localStorage.setItem('locationagain', JSON.stringify(mybody));
        self.setState({noStoreFound: false})
        self.props.childProps.getStoreData(mybody);
        self.toggleModal();
        document.getElementById('linkToHome').click();
      } else {
        self.setState({zipcodeErr: 'Zip code could not be found.'})
      }
    });
  }

  /**
   * Get the lat lng from the zip
   */
  getLatLngFromZipHeader = (zip) => {
    let self = this
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({'componentRestrictions': {'postalCode': zip}}, function (results, status) {
      if (results[0]) {
        mybody = {};
        mybody['Address'] = '';
        mybody['Radius'] = 200;
        mybody['DistributionList'] = [];
        mybody['InstalledServiceList'] = [];
        mybody['Latitude'] = results[0].geometry.location.lat();
        mybody['Longitude'] = results[0].geometry.location.lng();
        localStorage.setItem('locationzip', JSON.stringify(mybody));
        localStorage.setItem('locationagain', JSON.stringify(mybody));
        self.setState({noStoreFound: false})
        self.props.childProps.getStoreData(mybody);
        let page = window.location.href.split('/');
        if (!(page[3] === 'products-services' || page[3] === '')) {
          document.getElementById('linkToHome').click();
        }
      } else {
        self.setState({zipcodeErr: 'Zip code could not be found.'})
      }
    });
  }

  /**
   * Closing the popup
   */
  closeThePopup = (alias, id, name) => {
    //let storedetail = alias + "," + id + "," + name;
    //localStorage.setItem('selectedStore', storedetail);
    this.setState({zipcodeModal: false, toggleLocation: false})
  }

  /**
   * Closing the zipcode popup
   */
  closeSearchZip = () => {
    this.setState({
      toggleLocation: false
    })
  };

  getLocationsMenu = () => {
    const {menuData} = this.props;

    let locationsMenu = [];
    if (menuData && menuData.length > 0) {
      //Build Locations Sub Menu
      return menuData.map(function (item) {
        if (item.Name === 'Locations') {
          item.SubMenu.map(function (subloc) {
            return locationsMenu.push(`<Link  to="${subloc.Url}">${subloc.Name}</Link>`)
          })
        } else {
          return ''
        }
      })
    } else {
      return ''
    }
  };

  /**
   * Selecting dropdown from popup
   */
  selectDropToggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  locationDropToggle = () => {
    this.setState(prevState => ({
      locationDropdownOpen: !prevState.locationDropdownOpen
    }));
  };

  getGpsStatus = () => {
    const gpsStatus = localStorage.getItem('gpsStatus');

    return !(gpsStatus === 'canceled' || gpsStatus === 'allowed');
  };

  render() {
    const {menuData} = this.props;

    const menuItems = [];

    if (menuData && menuData.length > 0) {
      menuData.map(function (item, i) {
        let isActive = false;
        if (item.SubMenu.length > 0) {
          if (item.Name === 'Contact') {
            menuItems.push(
              <li className="nav-item" key={i}>
                <Link to="/decking/contact"
                      className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
              </li>)
            return true;
          } else {
            if (item.Name === 'Products') {
              menuItems.push(
                <li className="nav-item" key={i}>
                  <Link to="/decking/product"
                        className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
                </li>)
              return true;
            }
            else if (item.Name === 'Services') {
              menuItems.push(
                <li className="nav-item" key={i}>
                  <Link to="/decking/service"
                        className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
                </li>)
              return true;
            } else {
              // Drop down menus
              menuItems.push(
                <li className="dropdown nav-item" key={i}>
                  {item.SubMenu.map(function (submenu, index) {
                    let r = submenu.Url.split('/');
                    if (window.location.pathname === '/' + r[2] && window.location.pathname !== '/investors.bldr.com') {
                      isActive = true;
                    }
                    if (isActive === false && index === item.SubMenu.length - 1) {
                      if (item.Name === 'Project') {
                        return null;
                        // return <a key={index} className="dropdown-toggle nav-link text-uppercase font-weight-medium"
                        //           data-toggle="dropdown" href="">Recent Projects</a>
                      } else {
                        // Locations drop down
                        return <a key={index}
                                  className="dropdown-toggle nav-link text-uppercase font-weight-medium dropdown-location"
                                  data-toggle="dropdown" href="">{item.Name}</a>
                      }
                    }
                    if (isActive === true && index === item.SubMenu.length - 1) {
                      if (item.Name === 'Project') {
                        return null;
                        // return <a key={index}
                        //           className="dropdown-toggle nav-link  text-uppercase font-weight-medium active-menu"
                        //           data-toggle="dropdown" href="">Recent Projects</a>
                      } else {
                        return <a key={index}
                                  className="dropdown-toggle nav-link  text-uppercase font-weight-medium active-menu"
                                  data-toggle="dropdown" href="">{item.Name}</a>
                      }
                    } else {
                      return ''
                    }
                  })}

                  {item.Name === 'Locations' ? (<ul className="dropdown-menu mt-xl-3 shadow_d">
                    {
                      // Locations subitems
                      item.SubMenu.map(function (submenu, index) {
                        if (submenu.IsExternal) {
                          return <li key={index}>
                            <a href={submenu.Url} rel="noopener noreferrer" className="dropdown-item"> </a></li>
                        } else {
                          let r = submenu.Url.split('/');
                          return <li key={index}>
                            <Link to={'/decking/' + r[1] + '/' + r[2]}
                                  className={(window.location.pathname === '/' + r[2] && window.location.pathname !== '/investors.bldr.com') ? 'dropdown-item active-menu' : 'dropdown-item'}> {submenu.Name}</Link>
                          </li>
                        }

                      })}
                  </ul>) : (

                    <ul className="dropdown-menu mt-xl-3 shadow_d">
                      {item.SubMenu.map(function (submenu, index) {
                        if (submenu.IsExternal) {
                          return <li key={index}>
                            <a href={submenu.Url} rel="noopener noreferrer"
                               className="dropdown-item"> {submenu.Name}33</a></li>
                        } else {
                          let r = submenu.Url.split('/');
                          return <li key={index}>
                            <Link to={'/decking/' + r[1] + '/' + r[2]}
                                  className={(window.location.pathname === '/' + r[2] && window.location.pathname !== '/investors.bldr.com') ? 'dropdown-item active-menu' : 'dropdown-item'}> {submenu.Name}</Link>
                          </li>
                        }

                      })}
                    </ul>
                  )}
                </li>)

              return true;
            }

          }


        } else {
          if (item.Url === '/home/') {
            menuItems.push(
              <li className="nav-item" key={i}>
                <Link to="/decking"
                      className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
              </li>)
            return true
          } else if (item.Url === '/contact/') {
            menuItems.push(
              <li className="nav-item" key={i}>
                <Link to="/decking/contact"
                      className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
              </li>)
            return true
          } else if (item.Url === '/services/') {
            menuItems.push(
              <li className="nav-item" key={i}>
                <Link to="/decking/service"
                      className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
              </li>)
            return true
          } else {
            if (item.Url) {
              menuItems.push(
                <li className="nav-item" key={i}>
                  <Link to={item.RootUrl.slice(0, -1)}
                        className={window.location.pathname === item.Url.slice(0, -1) ? 'nav-link text-uppercase font-weight-medium active-menu ' : 'nav-link text-uppercase font-weight-medium '}>{item.Name}</ Link>
                </li>)
            }
            return true
          }
        }
      });
    }

    return (
      <div
        className={'header col-12 px-0 dmvpage ' + (window.pageYOffset > 130 ? 'on_top_head ' : '') + (window.pageYOffset > 140 ? 'head_sticky' : '')}>
        <div className={'header-fixed mobile_navigation_menu' + (this.state.isNotificationOn ? ' bartopon' : '')}>
          <div id="content_for_mobnav">
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
              <div className="container-fluid">
                <div className="dmv-nav-wrapper">
                <span className="navbar-menu-icon dmv-navbar-menu-icon" onClick={() => {
                  this.addToggleClass()
                }}> <img className="icon_size" src={togller} alt="Menu here"/>  </span>
                  <Link className="navbar-brand" to="/decking">
                    <img className="flex-1 main-logo-mob p-1" src={headerlogo} alt=""/>
                  </Link>
                </div>
                {localStorage.getItem('selectedStore') && (
                  <div className="cartSection">
                    <p className="">
                      Selected Store <br/>
                      <Link
                        className="color-dark-gray d-inline-block pr-4"
                        to={'/decking/locations/' + this.getLocationData().alias}
                      >
                        {this.getLocationData().title}
                      </Link>
                    </p>
                  </div>
                )}
                <div className="loc_main_box position-relative">
                  {<div onClick={() => {
                    this.addToggleLocation()
                  }} className="loc_search">
                    <img className="srch_img_svg" src={loc_search} alt="builder-first"/>
                  </div>}
                  <div
                    className={this.state.toggleLocation ? 'position-absolute locate locate_form text-right loc_serch_show' : 'position-absolute locate locate_form text-right invisible'}>
                    <div className="lt-box w-100 p-4 d-inline-block">
                      <h6 className="text-white mb-3">Find a Location1</h6><span className="position-absolute"><a
                      style={{color: '#fff'}} onClick={() => {
                      this.closeSearchZip()
                    }} className="close" aria-label="close">&times;</a></span>
                      <div className="input-group search-section rounded w-100">
                        <input placeholder="Zip sCode" onChange={(e) => {
                          this.setState({searchZipcode: e.target.value})
                        }} autoComplete="off" type="text" maxLength="5" onKeyPress={(e) => this.numberOnlyInMoblile(e)}
                               id="zip_code_search_mobile"
                               className="c-search form-control border-0  montserrat font-weight-normal bg-transparent text-white"/>
                        <div className="input-group-append">
                                                <span
                                                  className="input-group-text border-0 bg-transparent pl-0 py-md-2 py-0"
                                                  id="basic-addon2">
                                                    {this.state.searchZipcode.length === 5 ?
                                                      <a onClick={() => {
                                                        this.searchWithZipCodeMobile()
                                                      }}>
                                                        <img className="icon-search" src={search_icon}
                                                             alt="search_icon"/>
                                                      </a>
                                                      :
                                                      <img className="icon-search" src={search_icon} alt="search_icon"/>
                                                    }
                                                </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="dmv-location-nav">{this.getLocationsMenu()}</div>
          <nav id="sidebar" className={this.state.toggleClass ? 'sidebar_open' : null}>
            <div className="sidebar-header">
              <Link className="navbar-brand" to="/decking">
                <img className="w-100 logo_size" src={headerlogo} alt=""/>
              </Link>
              <span className="close_Side_menu" onClick={() => {
                this.closeSideBar()
              }}>  <img src={close_icon} alt=""/> </span>
            </div>


            <ul className="list-unstyled components mobile_components">
              {menuItems}
            </ul>


            <div onClick={this.redirectToLogin} className="pt-3 position-relative text-center">
              <img src={login} width={70} height={57} alt="builder-first"/>
              <p className="mob-login position-absolute">Customer Login</p>
            </div>
          </nav>
        </div>

        <div
          className={'sticky-navigation py-1' + (window.pageYOffset > 140 ? ' slideInDown' : '') + (this.state.isNotificationOn ? ' bartopon' : '')}>

          <div className="d-flex align-items-center w-100 position-relative mobile-nav desk_nav">

            <nav className="navbar navbar-expand-xl navbar-light bg-white theme-navbar px-0 w-100">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/decking">
                  <img src={headerlogo} alt=""/>
                </Link>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample06"
                      aria-controls="navbarsExample06" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="d-flex align-items-start">
                <div className="form-inline my-2 my-md-0 ml-3 side-button d-none d-md-block">
                  <div className="loc_main_box position-relative">
                    <div data-tip="Find a location" onClick={() => {
                      this.addToggleLocation()
                    }} className="loc_search" style={{width: 35, height: 35}}>
                      <img className="srch_img_svg" src={loc_search} alt="builder-first"/>
                    </div>
                    <div
                      className={this.state.toggleLocation ? 'position-absolute locate locate_form text-right loc_serch_show' : 'position-absolute locate locate_form text-right invisible'}>
                      <div className="lt-box w-100 p-4 d-inline-block">
                        <h6 className="text-white mb-3">Find a Location</h6><span className="position-absolute"><a
                        style={{color: '#fff'}} onClick={() => {
                        this.closeSearchZip()
                      }} className="close" aria-label="close">&times;</a></span>
                        <div className="input-group search-section rounded w-100">
                          <input placeholder="Zip Code" onChange={(e) => {
                            this.setState({searchZipcode: e.target.value})
                          }} autoComplete="off" type="text" maxLength="5" onKeyPress={(e) => this.numberOnly(e)}
                                 id="zip_code_search"
                                 className="c-search form-control border-0  montserrat font-weight-normal bg-transparent text-white"/>
                          <div className="input-group-append">
                            <span
                              className="input-group-text border-0 bg-transparent pl-0 py-md-2 py-0"
                              id="basic-addon2"
                            >
                              {this.state.searchZipcode.length === 5
                                ? (
                                  <a onClick={this.searchWithZipCode}>
                                    <img className="icon-search" src={search_icon} alt="search_icon"/>
                                  </a>
                                )
                                : (
                                  <img className="icon-search" src={search_icon} alt="search_icon"/>
                                )
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ol className="breadcrumb right_nav_link p-0  mb-0 text-left d-inline-block bg-transparent">
                  {localStorage.getItem('selectedStore') && (
                    <li className="breadcrumb-item font-weight-medium d-flex flex-column">
                      Selected Store:
                      <Link
                        className="color-dark-gray"
                        to={'/location_' + this.getLocationData().alias}
                      >
                        {this.getLocationData().title}
                      </Link>
                    </li>
                  )}
                </ol>
              </div>
              <div className="collapse navbar-collapse justify-content-end" id="navbarsExample06">
                <ul className="mainmenu navbar-nav">
                  {menuItems}
                  <li className="nav-item d-md-none">

                    <button
                      type="button"
                      onClick={this.showPopUP}
                      className="btn btn-danger text-uppercase theme-btn  px-4 py-3"
                    >
                      Request a quote
                    </button>
                  </li>
                  <li className="nav-item d-md-none">
                    <a className="nav-link text-uppercase font-weight-bold "
                       href="https://www.bldr.com/mybfsbuilder/login" rel="noopener noreferrer"
                       target="_blank">Login</a>
                  </li>
                </ul>
                <div className="form-inline my-2 my-md-0">
                  <button
                    type="button"
                    onClick={this.showPopUP}
                    className="btn opt-video border-white btn-primary text-uppercase  d-md-inline-block d-none"
                  >
                    {this.state.showSpinner && (
                      <i className="fa fa-refresh fa-spin px-1" style={{fontSize: '15px'}}></i>
                    )}
                    Request a quote
                  </button>

                  <button onClick={this.redirectToLogin} type="button" className="btn btn-link login">
                    <img src={login} width={70} height={57} alt="builder-first"/>
                    <span className="login-btn position-absolute w-100  h-100 align-items-center">
                        <span className="w-100 d-flex align-items-center h-100 flex-column justify-content-center">
                        <p className="position-relative mx-auto mb-0 h5 login-text customer-login">Customer</p>
                        <p className="position-relative mx-auto mb-0 h5 login-text customer-login">Login</p>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </nav>

          </div>
        </div>

        {this.renderLocationNotification()}

        {/*<Modal isOpen={this.state.modalSecond} className="bfspage request-form tour-content-area">

                <ModalHeader className="tour-close-button">
                    <Button className="text-uppercase" onClick={this.newChangesHidePopupClose}><img src={iconremove} alt="cross-sign" /></Button>{' '}
                </ModalHeader>

            <ModalBody className="tour-modal btn text-uppercase text-uppercase-new" >
                <div className="row" onClick={this.showPopUPNotLoginClonse}>

                    <h1 className="tour-title font-weight-bold" >Additional delivery information</h1>
                    <h4 className="font-weight-bold sub-title-tour">for participating locations!</h4>
                    <div className="line-hr"></div>
                    <h3 className="tour-title font-weight-bold" >Now available on</h3>

                    <div className="mybfs-logo"><img src={mybfs} alt="mybfs-logo" /></div>




                </div>
                <Button className="text-uppercase" onClick={this.newChangesHidePopupClose}>Don't show this again<span><img src={iconremove} alt="remove" /></span></Button>{' '}
            </ModalBody>

            <ModalFooter className="border-0 px-5  pb-5 d-none">
                <Button className="btn btn-danger text-uppercase theme-btn  px-4 py-3" onClick={this.showPopUPNotLoginClonse}>Request Close</Button>{' '}
            </ModalFooter>
            </Modal>*/}

        <Link to={'/hh'} style={{display: 'none'}} id="linkToHome"></Link>

        <Link to={'/locations'} style={{display: 'none'}} id="linkToLocations"></Link>

        <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="bfspage request-form modal-dialog-centered">
          <ModalHeader toggle={this.toggleModal}>
            {this.state.noStoreFound === true ?
              <span className="display-6 m-auto pt-5 pb-4 d-block ">
                            We found no store nearby you please try with zipcode.
                        </span>
              :
              <span className="display-4 m-auto pt-5 pb-4 d-block ">
                            Enter your zip code
                            </span>
            }
          </ModalHeader>
          <ModalBody className="px-4 pt-4 px-md-5 pt-md-5 pb-0">
            <div className="row  m-0">
              <div className="form-group col-12  mb-5">
                <div className="position-relative">
                  <input id="zipcode" type="text" maxLength="5" onChange={(e) => this.handleZipcodeChange(e)}
                         className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                         autoComplete="off"/>
                  <label htmlFor="Zip" className="head-label h5 font-weight-normal">Zip Code</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.zipcodeErr}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-0 px-5  pb-5">
            <Button className="btn btn-danger text-uppercase theme-btn  px-4 py-3" onClick={this.goToStoreQuote}>Request
              Quote</Button>{' '}
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.zipcodeModal} toggle={this.togglezipmodal}
               className="bfspage modal-dialog-centered location">
          {this.state.storeDataHeader.length > 0 ? (<ModalHeader toggle={this.togglezipmodal} className="pb-0"><span
            className="allow-loc-head h1 m-auto pb-0 d-block font-weight-light ">Locations near you</span></ModalHeader>) : (
            <ModalHeader toggle={this.togglezipmodal} className="pb-0"><span
              className="allow-loc-head h1 m-auto pb-0 d-block font-weight-light finding-location">Finding locations near you  <ReactLoading
              className="loaderhead" type={'spin'} color={'black'} height={40} width={40}/></span></ModalHeader>)}
          <ModalBody className="">
            <h5>{this.state.storemessage}</h5>
            {this.state.storeDataHeader.slice(0, 5).map((store, index) => (
              <div key={index} className="col-12 mb-3">
                <div className="row">
                  <div className="col-sm-5 mb-2">
                    <Link onClick={() => this.closeThePopup(store.Alias, store.id, store.Name)} className="thumbnail"
                          to={'/location_' + store.Alias}>
                                        <span className="thumbnail">
                                            {store.LargeImage ? (<img onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = defaultimage
                                            }} className="w-100" src={globalVar.base_url + store.LargeImage}
                                                                      alt="store here"/>) : (
                                              <img className="w-100" src={defaultimage} alt="store here"/>)}
                                        </span>
                    </Link>
                  </div>
                  <div className="col-sm-7">
                    <h5 className="font-weight-bold mb-2 mt-2 position-relative">
                      <span className="d-inline-block">{store.$id}. </span> <Link
                      onClick={() => this.closeThePopup(store.Alias, store.id, store.Name)} className="thumbnail"
                      to={'/location_' + store.Alias}><span
                      className="text-dark store-name align-top">{store.Name}</span></Link>
                    </h5>
                    <p className="mb-2 store_address">
                      {store.Address1}<br/>
                      {store.city} {store.State} {store.ZipCode}
                    </p>
                    <p className="mb-1 store_phone">Phone: {store.PhoneNo}</p>
                    <Hours summer={store.HoursMFSummer} winter={store.HoursMF} />
                  </div>
                </div>
              </div>
            ))
            }
          </ModalBody>
          {this.state.storeDataHeader.length > 0 ? (<ModalFooter className="justify-content-end">
            <Button className="bg-info btn text-uppercase theme-btn  px-4 py-3 btn btn-secondary border-0"
                    color="primary"
                    onClick={this.resetSearch}>Reset Search</Button>
            <Button className="bg-info btn text-uppercase theme-btn  px-4 py-3 btn btn-secondary border-0"
                    color="primary"
                    onClick={this.viewAllResult}>View All</Button>
          </ModalFooter>) : null}
        </Modal>

        <Modal isOpen={this.state.sendquotemodal} toggle={this.togglesendquote}
               className="bfspage request-form modal-dialog-centered ">
          <ModalHeader toggle={this.togglesendquote}><span
            className="display-4 m-auto pt-5 pb-4 d-block ">Request a quote</span></ModalHeader>
          <ModalBody className="px-4 pt-4 px-md-5 pt-md-5 pb-0">
            <div className="row  m-0">
              <div className="form-group col-md-6  mb-5">
                <div className="position-relative">
                  <input id="name" type="text"
                         className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                         autoComplete="off"/>
                  <label htmlFor="name" className="head-label h5 font-weight-normal">Full Name</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.nameErr}</span>
              </div>
              <div className="form-group col-md-6  mb-5">
                <div className="position-relative">
                  <input id="email" type="text"
                         className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                         autoComplete="off"/>
                  <label htmlFor="Email" className="head-label h5 font-weight-normal">Email</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.emailErr}</span>

              </div>
              <div className="form-group col-md-12  mb-5">
                <div className="position-relative choose_serv">
                  <Dropdown isOpen={this.state.dropdownOpen} toggle={this.selectDropToggle}>
                    <DropdownToggle caret>
                      {this.state.serviceOption}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => {
                        this.setState({serviceOption: 'Manufacturing'})
                      }}>Manufacturing</DropdownItem>
                      <DropdownItem onClick={() => {
                        this.setState({serviceOption: 'Distribution'})
                      }}>Distribution</DropdownItem>
                      <DropdownItem onClick={() => {
                        this.setState({serviceOption: 'Installation'})
                      }}>Installation</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <label htmlFor="Email" className="head-label h5 font-weight-normal">Service Type</label>
                </div>
              </div>
              <div className="form-group col-md-6  mb-5">
                <div className="position-relative">
                  <input id="zipcode" type="text" maxLength="5" onChange={(e) => this.handleZipcodeChange(e)}
                         className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                         autoComplete="off"/>
                  <label htmlFor="Zip" className="head-label h5 font-weight-normal">Zip Code</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.zipcodeErr}</span>
              </div>
              <div className="form-group col-md-6  mb-5">
                <div className="position-relative">
                  <input id="phone" type="text" maxLength="12" onChange={(e) => this.handlePhoneChange(e)}
                         className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                         autoComplete="off"/>
                  <label htmlFor="Phone" className="head-label h5 font-weight-normal">Phone</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.phoneErr}</span>
              </div>
              <div className="form-group col-md-12  mb-5">
                <div className="position-relative">
                <textarea id="message"
                          className="form-control effect-2 mb-0 bg-transparent rounded-0 border-top-0  border-left-0 border-right-0 px-0"
                          autoComplete="off"></textarea>
                  <label htmlFor="Phone" className="head-label h5 font-weight-normal">Message</label>
                  <span className="focus-border"></span>
                </div>
                <span className="error-message">{this.state.messageErr}</span>
                <span className="success-message">{this.state.successMsg}</span>
              </div>
              <div className="form-group col-md-12  mb-5">
                <ReCAPTCHA
                  sitekey={captchaKey}
                  onChange={(e) => this.onRecaptchChange(e)}
                  className='d-flex justify-content-center'
                />
                <span className="error-message">{this.state.captchaErr}</span>
              </div>
              <div style={{color: '#2C3E50'}}>{this.state.quoteEmailStatus}</div>
            </div>
          </ModalBody>
          <ModalFooter className="border-0 px-5 pb-5 dmvpage d-flex justify-content-center">
            <Button className="btn btn-danger text-uppercase theme-btn  px-4 py-3" onClick={this.sendQuote}>Request a Quote</Button>
          </ModalFooter>
        </Modal>
        <ReactTooltip place="bottom"/>
      </div>);
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: globalVar.apiKey,
    language: props.language,
  }))(withRouter(HeaderComponent));


HeaderComponent.propTypes = {
  childProps: PropTypes.object,
  menuData: PropTypes.array,
  mainImage: PropTypes.string
};
