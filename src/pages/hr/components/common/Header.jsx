import React, { useEffect, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { fetchHeader } from '../../api/requests';
import { LoadImages, intro } from '../../js/LoaderJS.js';
import menubutton from '../../img/menu-button.svg';
import loc_search from '../../img/loc_search.svg';
import download from '../../img/download.png';
import logo from '../../img/logo.jpg';
import close from '../../img/close.1d362ad2.svg';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

const  Header = (props) => {
  const [headerContent, fetchHeaderContent] = useRequest(fetchHeader);

  var [active, setHeaderActive] = useState("");

  useEffect(() => {
    var parts = window.location.href.split('/');
    var lastSegment = parts.pop() || parts.pop();  // handle potential trailing slash
    setHeaderActive("/" + lastSegment + "/");
  })


  // const headerContent = dummyResponse;
  useEffect(() => {
    // LoadImages();
    intro();
  })

  useEffect(() => {
    fetchHeaderContent();

  }, []);

  if (headerContent.data) {
    var navData = headerContent.data;
  }

  return headerContent.data && !props.hidden && (
    <div>
      <div className="main_header">
        <div className="sticky-navigation">
          <div className="d-flex align-items-center w-100 position-relative mobile-nav desk_nav">
            <nav className="navbar navbar-expand-xl navbar-light bg-white theme-navbar ">
              <span className="navbar-menu-icon">
                <img crossOrigin="anonymous" className="icon_size" src={menubutton} alt="Menu here" />
              </span>
              <div className="navbar-header">
                <a className="navbar-brand" href="#"><img crossOrigin="anonymous" src={logo} className="img-fluid" alt="logo here" /></a>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample06"
                aria-controls="navbarsExample06" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div data-tip="Find a location " className="loc_search loc_on"><img crossOrigin="anonymous" className="srch_img_svg"
                src={loc_search}
                alt="builder-first" /></div>
              <div className="collapse navbar-collapse" id="navbarsExample06">
                <ul className="navbar-nav mr-auto">

                  {
                    navData.Menu ?

                      navData.Menu.map((item, index) =>
                        // DROPDOWNS
                        item.Childrens ?

                          <li key={index} className="nav-item dropdown"
                            style={{ "cursor": "pointer" }}
                          >
                            <a className="nav-link dropdown-toggle text-uppercase font-weight-medium"
                              data-toggle="dropdown">
                              {item.RootName}
                            </a>
                            <ul className="dropdown-menu mt-xl-3 shadow">
                              {item.Childrens.map((child, i) =>

                                <li key={child.$id}>
                                  <Link className="dropdown-item" to={child.RootUrl}>
                                    {child.RootName}</Link>
                                </li>
                              )}
                            </ul>
                          </li>
                          :
                          // NON-DROPDOWNS
                          <li key={index} className="nav-item">
                            <Link className="nav-link text-uppercase font-weight-medium" to={item.RootUrl}>
                              {item.RootName}
                            </Link>
                          </li>
                      ) : null
                  }
                </ul>
              </div>
            </nav>

            <div className="form-inline my-2 my-md-0 ml-auto side-button d-none">
              <div className="loc_main_box position-relative">
                <div data-tip="Find a location" className="loc_search" currentitem="false">
                  <img crossOrigin="anonymous" className="srch_img_svg" src={loc_search} alt="builder-first" />
                </div>
              </div>
            </div>

            <button type="button" className="btn opt-video border-white btn-primary text-uppercase theme-btn d-md-inline-block d-none ml-auto">Request a
                quote
    </button>
            <button type="button" className="btn btn-link login d-none d-md-inline-block">
              <img crossOrigin="anonymous" src={download} alt="builder-first" />
              <span className="login-btn position-absolute w-100  h-100 align-items-center">
                <span className="w-100 d-flex align-items-center h-100">
                  <p className="position-relative mx-auto mb-0 h5 login-text">Login</p>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <nav id="sidebar">
        <div className="sidebar-header">
          <a className="navbar-brand" href="/">
            <img crossOrigin="anonymous" className="w-100 logo_size" src={logo} alt="logo here" />
          </a>
          <span className="close_Side_menu">
            <img crossOrigin="anonymous" src={close} alt="logo here" />
          </span>
        </div>
        <ul className="list-unstyled components mobile_components">

          {
            navData.Menu ?

              navData.Menu.map((item, index) =>
                // DROPDOWNS
                item.Childrens ?

                  <li key={index} className="nav-item dropdown"
                    style={{ "cursor": "pointer" }}
                  >
                    <a className="nav-link dropdown-toggle text-uppercase font-weight-medium"
                      data-toggle="dropdown">
                      {item.RootName}
                    </a>
                    <ul className="dropdown-menu mt-xl-3">
                      {item.Childrens.map((child, i) =>

                        <li key={child.$id}>
                          <Link className="dropdown-item" to={child.RootUrl}>
                            {child.RootName}</Link>
                        </li>
                      )}
                    </ul>
                  </li>
                  :
                  // NON-DROPDOWNS
                  <li key={item.$id} className="nav-item">
                    <Link className="nav-link text-uppercase font-weight-medium" to={item.RootUrl}>
                      {item.RootName}
                    </Link>
                  </li>
              ) : null
          }

        </ul>
        <div className="pt-3 text-center  loginOnMob">
          <img crossOrigin="anonymous" alt="builder-first" src={download} />
          <span className="mob-login position-absolute">Login</span>
        </div>
      </nav>
    </div>
  );
};
export default withRouter((Header));
