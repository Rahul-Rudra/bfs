import React from 'react';
import PropTypes from 'prop-types';

import {globalVar} from '../../config';

export default class TeamMember extends React.Component {
  handleClick = () => {
    const {memberData} = this.props;

    this.props.update(memberData);
  };

  render() {
    const {memberData} = this.props;

    let imgUrl = memberData?.Picture
      ? `${globalVar.base_url}/${memberData?.Picture?.Url}`
      : '';

    return (
      <div className='col-md-6 col-12 col-lg-4 mb-4'>
        <div
          data-toggle='modal'
          data-target='#myModal'
          className='emp_home_section employee-section position-relative'
          onClick={this.handleClick}
        >
          <div className='emp_img'>
            <img className='member_img' src={imgUrl} alt={memberData?.Name}/>
          </div>
          <div className='employee-info p-4'>
            <div className='titles_text w-100'>
              <h3 className='small-text-title text-white font-weight-medium'>
                {memberData?.Name}
              </h3>
              <h5
                className='small-txt-content text-white font-weight-medium text-light'
                style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflowX: 'hidden'}}
              >
                {memberData?.Position}
              </h5>
            </div>
            <button
              type='button'
              className='bg-transparent p-0 border-0 text-white font-weight-bold c-pointer'
            >
              Read More
              <span className='dis-sm-none'>
                <img
                  className='wid-20'
                  src={require('./img/read-arrow.svg').default}
                  alt='read_arrow'
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

TeamMember.propTypes = {
  memberData: PropTypes.shape({}),
};
