import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import {globalVar} from '../../config';
import {topFunctionButtonClick} from './utils';

export default class FooterComponent extends Component {
  state = {
    hideScroll: true,
    dropdownOpen: false,
    menuName: 'Main menu',
    oldUrl: window.location.pathname
  };

  componentDidUpdate() {
    if (this.state.oldUrl !== window.location.pathname) {
      topFunctionButtonClick();
    }
    const {activeMenu} = this.props;
    const {menuName} = this.state;

    let name = (activeMenu && activeMenu !== '/') ? activeMenu.split('-').join(' ').toUpperCase().slice(1) : 'Main Menu';

    if (name !== menuName) {
      this.setCaption(name)
    }
  }

  toggleDropdown = () => this.setState((state) => ({dropdownOpen: !state.dropdownOpen}));

  setCaption = (menuName) => this.setState({menuName});

  render() {
    const {menuData} = this.props;
    const {hideScroll, dropdownOpen, menuName} = this.state;

    let data = {
      footerLinks: [],
      footerTitle: '',
      footerContent: '',
      footerLogo: '',
    };

    if (menuData && menuData[0]) {
      data.footerLogo = menuData[0].Properties.footerLogo
        ? `${globalVar.base_url}${menuData[0].Properties.footerLogo}`
        : menuData[0].Properties.footerLogo;
      data.footerTitle = menuData[0].Properties.copyrightText;
      // data.footerLinks = JSON.parse(menuData[0].Properties.links);
      data.footerLinks = [
        {
          link: '/decking',
          caption: 'home',
        },
        {
          link: '/decking/product',
          caption: 'products',
        },
        {
          link: '/decking/service',
          caption: 'services',
        },
        {
          link: '/decking/contact',
          caption: 'contact',
        },
        {
          link: 'https://bldr.com/BFS-Terms',
          caption: 'bfs terms of use',
          isExternalLink: true,
        },
        {
          link: '/decking/locations/waldorf',
          caption: 'waldorf',
        },
        {
          link: '/decking/locations/manassas',
          caption: 'manassas',
        },
        {
          link: '/decking/locations/fredericksburg',
          caption: 'fredericksburg',
        },
      ];
      data.footerContent = menuData[0].Properties.footerContent;
    }

    return (
      <footer className='footr'>
        {hideScroll ? (
          <button className='btn gotop' onClick={topFunctionButtonClick}>
            <img src={require('./img/up-arrow-key.png').default} alt='up-arrow'/>
          </button>
        ) : null}
        <div className='container py-5 px-0'>
          <div className='row align-items-center justify-content-between m-0'>
            {data?.footerLogo ? (
              <div className='col-md-12 col-md-6 col-sm-12 text-center-media ftr-logo px-3 px-md-0'>
                <h3 className='text-white mb-0'>
                  <img src={data?.footerLogo} alt='footer img logo-footer'/>
                </h3>
              </div>
            ) : null}
          </div>
          <div className='col-12 pt-3 px-0 '>
            <p className='text-white mob-wid-75'>{data?.footerTitle}</p>
          </div>
          <div className='footer_form w-100 p-4 d-flex d-xl-none'>
            <div className='form-group bg-transparent position-relative w-100'>
              <Dropdown className='w-100' isOpen={dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret>
                  {menuName}
                </DropdownToggle>
                <DropdownMenu>
                  {data?.footerLinks.map((footerLink, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => this.setCaption(footerLink?.caption)}
                    >
                      {footerLink?.isExternalLink
                        ? (
                          <a href={footerLink?.link} rel='noopener noreferrer' target='_blank'>
                            {footerLink?.caption}
                          </a>
                        )
                        : (
                          <Link to={footerLink?.link}>
                            {footerLink?.caption}
                          </Link>
                        )
                      }
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className='d-none d-xl-block text-center-media px-3 px-md-0'>
            <nav className='navbar  navbar-expand-lg navbar-light w-100 mt-2 pr-0 pl-0'>
              <div className='navbar-collapse mt-3 mb-2 my-lg-0' id='navbarSupportedContent'>
                <ul className='navbar navbar-nav p-0 font-weight-semi-bold align-items-start footer-menu w-100'>
                  {data?.footerLinks.map((footerLink, index) => (
                    <li key={index} className='nav-item'>
                      {footerLink?.isExternalLink
                        ? (
                          <a
                            href={footerLink?.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='nav-link pl-0 text-white text-white-hover text-uppercase'
                          >
                            {footerLink?.caption}
                          </a>
                        )
                        : (
                          <Link
                            to={footerLink?.link}
                            className='nav-link pl-0 text-white text-white-hover text-uppercase'
                          >
                            {footerLink?.caption}
                          </Link>
                        )
                      }
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
          <div className='text-center-media bg-red_mob'>
            <span dangerouslySetInnerHTML={{__html: data?.footerContent}}></span>
          </div>
        </div>
      </footer>
    );
  }
}

FooterComponent.propTypes = {
  menuData: PropTypes.array,
  activeMenu: PropTypes.string
};
