import React, { Component } from 'react';
import $ from 'jquery';
import legent_locations from '../assets/img/legend_new.PNG';
import PropTypes from 'prop-types';
import { globalVar } from '../config';
import AccoladesData from './AccoladesData';
var base_url = globalVar.base_url;

export default class UsaHeatChartComponent extends Component {
  constructor(props) {
    super(props);
    this.show = true;
    this.diskstyle = {
      color: 'red',
      'list-style-type': 'disc',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps || prevProps.mapdata !== this.props.mapdata) &&
      this.props.mapdata &&
      this.props.mapdata.length > 0
    ) {
      this.getSortedData();
    }
  }

  /**
   * Apply Sorting
   */
  getSortedData = () => {
    var mapArray = [];
    mapArray = this.props.mapdata;
    for (let i = 0; i < mapArray.length; i++) {
      let x = mapArray[i];
      mapArray[i]['distance'] = this.getDistanceFromLatLonInKm(
        44.999142,
        -67.927621,
        x.lat,
        x.lng
      );
    }

    for (let i = 0; i < mapArray.length - 1; i++) {
      for (let j = i + 1; j < mapArray.length; j++) {
        if (mapArray[i].distance > mapArray[j].distance) {
          let temp = mapArray[i];
          mapArray[i] = mapArray[j];
          mapArray[j] = temp;
        }
      }
    }

    AccoladesData.locations = mapArray;
    this.createMap();
  };

  /**
   * Measue the distance bw two point with lat lng
   * @param {first point} lat1
   * @param {first point} lon1
   * @param {Second point} lat2
   * @param {Second point} lon2
   */
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  /**
   * Degree to radion conversion
   * @param  deg
   */
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Handle the scroll event
   */
  handleScroll = () => {
    $(document).ready(function() {
      var simplemaps_usmap = '';
      $('[class^=sm_location]').each(function(i) {
        var isIE =
          !!navigator.userAgent.match(/Trident/g) ||
          !!navigator.userAgent.match(/MSIE/g);
        if (isIE) {
          if (
            $(this)[0] &&
            $(this)[0].className &&
            $(this)[0].animVal !== 'sm_location_groupBy'
          ) {
            let row = $(this);
            setTimeout(function() {
              $('#test').animate({ left: '100px', top: '100px' }, 500);
              row
                .css({
                  opacity: '0.5',
                  display: 'block',
                })
                .show()
                .animate({ opacity: 1 });
              if (simplemaps_usmap) {
                var locationcolor =
                  simplemaps_usmap.mapdata.locations[i].locationcolor;
                row.css({
                  stroke: locationcolor,
                  fill: locationcolor,
                  transition: '1.0s',
                });
              }
            }, 1000 + i * 10);
          }
        } else {
          if (
            $(this)[0] &&
            $(this)[0].classList &&
            $(this)[0].classList.length > 0 &&
            $(this)[0].classList[0] !== 'sm_location_groupBy'
          ) {
            let row = $(this);
            setTimeout(function() {
              $('#test').animate({ left: '100px', top: '100px' }, 500);
              row
                .css({
                  opacity: '0.5',
                  display: 'block',
                })
                .show()
                .animate({ opacity: 1 });
              if (simplemaps_usmap) {
                var locationcolor =
                  simplemaps_usmap.mapdata.locations[i].locationcolor;
                row.css({
                  stroke: locationcolor,
                  fill: locationcolor,
                  transition: '1.0s',
                });
              }
            }, 1000 + i * 10);
          }
        }
      });
    });
  };

  /**
   * Initate the map
   */
  createMap() {
    let mapdata = document.createElement('script');
    mapdata.type = 'text/javascript';
    var mapdatastringify =
      'var simplemaps_usmap_mapdata=' + JSON.stringify(AccoladesData);
    mapdata.type = 'text/javascript';
    mapdata.innerText = mapdatastringify;
    mapdata.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(mapdata);
    const script = document.createElement('script');
    script.src =
      'https://simplemaps.com/static/lib/simplemaps/trials/maps/usmap.js';
    script.async = true;
    document.body.appendChild(script);
    $('.mapline')
      .css({ display: 'block' })
      .animate({}, 500);

    setInterval(() => {
      let inner_map = $('#map_inner');
      if (inner_map && inner_map.children('div').length) {
        let child = inner_map.children('div');
        if (this.checkForIE()) {
          // For the IE
          if (child[0].id && child[0].id === 'tt_sm_map') {
            child[1].style['cssText'] = '';
            child[1].style['display'] = 'none';
          } else if (child[1]) {
            child[0].style['cssText'] = '';
            child[0].style['display'] = 'none';
          }
        } else {
          // For the Others
          if (child[0].id && child[0].id === 'tt_sm_map') {
            child[1].style['display'] = 'none';
          } else {
            child[0].style['display'] = 'none';
          }
        }
      }
    }, 10);
  }

  checkForIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer, return version number
      return true;
    } // If another browser, return 0
    else {
      return false;
    }
  }
  render() {
    var USAComponent = (
      <div>
        <div className="row ">
          <div className="col col-xl-12">
            <div id="map" className="accoladesmap" />
            {this.props.regionimage ? (
              <img
                alt="mapdescription"
                className="float-right"
                src={base_url + this.props.regionimage}
              />
            ) : (
              <img
                alt="mapdescription"
                className="float-right"
                src={legent_locations}
              />
            )}
          </div>
        </div>
      </div>
    );
    return USAComponent;
  }

  /**
   * Load the point data on map
   */
  load() {
    $('[class^=sm_location]').each(function() {
      if ($(this)[0].classList[0] !== 'sm_location_groupBy') {
        $(this)
          .css({
            opacity: '0',
            display: 'none',
          })
          .hide()
          .animate({ opacity: '1' });
      }
    });
  }
}

/**
 * Define the protype
 */
UsaHeatChartComponent.propTypes = {
  mapdata: PropTypes.array,
};
