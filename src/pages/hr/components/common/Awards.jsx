import React from 'react';

const Awards = ({awards}) => {
  const formatYears = (years) => {
    if (years.length === 0) {
      return years;
    } else {
      let st = '';
      years.forEach((year) => {
        st += year;
        if (years.indexOf(year) !== years.length - 1) {
          st += ', ';
        }
      });
      return st;
    }
  };

  return awards && (
    <div className='awards-layout'>
      <h5 className='text-uppercase awards-head mb-3'>{awards.Title}</h5>
      <div className='row'>
        {awards.Received.map(({Name, Years, Presenter}) => (
            <div className='col-12  mb-4 px-md-3 px-0' key={Name}>
              <h6 className='text-uppercase sidebar-sm-head small'>{Name} ({formatYears(Years)})</h6>
              <p className='small mb-0'>
                - {Presenter}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Awards;
