import React from 'react';

const TeamMemberBenefitsSection = ({ benefits }) => {
  const count = Math.floor(benefits.Benefits.length / 2);

  return benefits && (
    <div className='team-benefits mt-5'>
      <div className='container px-xl-3 px-md-0'>
        <div className='row no-gutters overlay_container'>
          <div className='col-md-7'>
            <div className='w-100 h-100 team-benefits-con p-4'>
              <h4 className='font-weight-bold text-white text-uppercase'>{benefits.Title}</h4>
              <h6 className='text-white mt-3'>
                {benefits.SubTitle.replace('<p><span>', '')
                  .replace('</span></p>', '')}
              </h6>
              <div className='lists_wrapper'>
                <ul className='text-white pl-3 team-benefits-list mt-4 mb-0'>
                  {benefits.Benefits.slice(0, count)
                    .map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
                <ul className='text-white pl-3 team-benefits-list mt-4 mb-0'>
                  {benefits.Benefits.slice(count)
                    .map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-5'>
            <div className='overlay overlay--blue overlay--left'/>
            <figure className='mb-0 h-100 team-benefits-overlay'>
              <img
                src={require('../../img/team-benefits.jpg').default}
                alt='team-benefits.jpg'
                className='w-100 h-100 object-cover'
              />
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamMemberBenefitsSection;
