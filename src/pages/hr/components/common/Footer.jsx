import React, { useEffect } from 'react';

import useRequest from '../../hooks/useRequest';
import { fetchHeader } from '../../api/requests';

const Footer = (props) => {
  const [footerContent, fetchFooterContent] = useRequest(fetchHeader);

  useEffect(() => {
    fetchFooterContent();
  }, []);

  if (footerContent.data) {
    var footerData = footerContent.data.Footer
    var footerlinks = JSON.parse(footerData.Properties.links)
  }

  return footerContent.data && !props.hidden && (
    <footer className='footr'>

      <div className='container py-5 px-0'>
        <div className='row align-items-center justify-content-between m-0'>
          {footerData.Properties.footerLogo ? (<div className='col-md-12 col-md-6 col-sm-12 text-center-media ftr-logo px-3 px-md-0'>
            <h3 className='text-white mb-0'><img src
              ={process.env.base_url + footerData.Properties.footerLogo} alt='footer img logo-footer' /></h3>
          </div>) : null}
        </div>
        <div className='col-12 pt-3 px-0 '>
          <p className='text-white mob-wid-75'>{footerData.Properties.copyrightText}</p>
        </div>
        {/* <div className='footer_form w-100 p-4 d-flex d-xl-none'>
        <div className='form-group bg-transparent position-relative w-100'>
          <Dropdown className='w-100' isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {this.state.menuName}
            </DropdownToggle>
            <DropdownMenu>
              {footerlinks.map(function (footerlink, index) {
                if (!footerlink.isExternalLink) {
                  return (<DropdownItem onClick={() => {
                      this.setCaption(footerlink.caption)
                    }} key={index}> <a href={footerlink.link}> {footerlink.caption}</a></DropdownItem>
                  )
                } else {
                  return (<DropdownItem onClick={() => {
                    this.setCaption(footerlink.caption)
                  }} key={index}><a href={footerlink.link} rel='noopener noreferrer'
                                    target='_blank'> {footerlink.caption} </a></DropdownItem>)
                }
              }.bind(this))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div> */}
        <div className='d-none d-xl-block text-center-media px-3 px-md-0'>
          <nav className='navbar  navbar-expand-lg navbar-light w-100 mt-2 pr-0 pl-0'>
            <div className='navbar-collapse mt-3 mb-2 my-lg-0' id='navbarSupportedContent'>
              <ul className='navbar navbar-nav p-0 font-weight-semi-bold align-items-start footer-menu'>
                {footerlinks.map(function (footerlink, index) {
                  return (
                    <li key={index} className='nav-item'>
                      {footerlink.isExternalLink ? (
                        <a
                          href={footerlink.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='nav-link pl-0 text-white text-white-hover text-uppercase'
                        >
                          {footerlink.caption}
                        </a>
                      ) : (
                          <a
                            href={`/dmvdeck${footerlink.link}`}
                            className='nav-link pl-0 text-white text-white-hover text-uppercase'
                          >
                            {footerlink.caption}
                          </a>
                        )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
        <div className='text-center-media  bg-red_mob'>
          <span dangerouslySetInnerHTML={{ __html: footerData.Properties.footerContent }}></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
