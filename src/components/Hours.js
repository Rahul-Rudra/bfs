import React from 'react';

const Hours = ({summer, winter}) => {
  if (!summer || !winter) {
    return (
      <p className="mb-3 store_hours">Hours: {summer || winter}</p>
    );
  } else {
    return (
      <>
        <p className="mb-1 store_hours">Summer Hours: {summer}</p>
        <p className="mb-3 store_hours">Winter Hours: {winter}</p>
      </>
    );
  }
};

export default Hours;
