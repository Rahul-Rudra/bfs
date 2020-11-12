import React, {Component} from 'react';
import axios from 'axios';

import {globalVar} from '../../config';

import Route from './Routes';
import Header from './Header';
import Footer from './Footer';
import LocationsList from './LocationsList';
import ErrorBoundary from '../../ErrorBoundary';

import './css/style.css';
import './css/materialdesignicons.css';
import './css/loader.css';
import './css/App.css';

class Main extends Component {
  state = {
    menudata: {},
    headerData: [],
    footerData: [],
    headerImage: '',
    refreshStore: [],
    storeData: [],
    storeDataHeader: [],
    menuData: [],
    toptext: ''
  };

  getStoreData = data => {
    let aliasdata = [];
    fetch(globalVar.base_url + '/umbraco/api/LocationData/GetAllLocations', {
      body: JSON.stringify({
        radius: data.Radius,
        latitude: data.Latitude,
        longitude: data.Longitude,
        DistributionList: aliasdata,
        installedServiceName: '',
        Address: data.Address
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post'
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          storeData: data,
          refreshStore: [...this.state.refreshStore, 'refresh']
        });
      })
      .catch(() => {
      });
  };

  getStoreDataHeader = (data) => {
    let aliasdata = [];
    for (let i = 0; i < data.DistributionList.length; i++) {
      aliasdata.push({alias: data.DistributionList[i].alias});
    }
    fetch(
      globalVar.base_url + '/umbraco/api/LocationData/GetAllLocations',
      {
        body: JSON.stringify({
          radius: data.Radius,
          latitude: data.Latitude,
          longitude: data.Longitude,
          DistributionList: aliasdata,
          installedServiceName: '',
          Address: data.Address
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post'
      }
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          storeDataHeader: data
        });
      })
      .catch(() => {
      });
  };

  fetchFooterMenu = () => {
    axios
      .get(globalVar.base_url + '/umbraco/api/Content/GetMenus', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        let footerData = [];
        footerData.push(response.data.Footer);
        this.setState({
          headerData: response.data.Menu,
          footerData: footerData,
          headerImage: footerData[0].Properties.mainLogo
        });
      })
      .catch(() => {
      });
  };

  fetchMenu = () => {
    let base = globalVar.base_url;
    axios
      .get(base + '/umbraco/api/header', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        this.setState({
          menuData: response.data.Menu,
          toptext: response.data.TopText
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetchFooterMenu();
    this.fetchMenu();

  }

  render() {
    const childProps = {
      storeData: this.state.storeData,
      getStoreData: this.getStoreData,
      refreshStore: this.state.refreshStore,
      getStoreDataHeader: this.getStoreDataHeader,
      storeDataHeader: this.state.storeDataHeader
    };
    return (
      <ErrorBoundary>
        <div className='dmvpage'>
          <Header
            toptext={this.state.toptext}
            childProps={childProps}
            menuData={this.state.menuData}
          />
          <LocationsList/>
          <ErrorBoundary>
            <Route/>
          </ErrorBoundary>
          <Footer
            menuData={this.state.footerData}
          />
        </div>
      </ErrorBoundary>
    );
  }
}

export default Main;
