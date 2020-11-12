import React, { useEffect, useState } from 'react';
import { fetchFooter } from '../../api/requests';
import useRequest from '../../hooks/useRequest';

const OurClients = () => {
  const [pageContent, fetchPageContent] = useRequest(fetchFooter);

  useEffect(() => {
    fetchPageContent();
  }, []);

  if (pageContent.data) {

    var { Logos } = pageContent.data;

  }
  return (
    <section className="our_clients my-5">
      <div className="container">
        <div className="row text-center d-block">
          {Logos ?
            Logos.map((item, index) =>
              <div key={item.$id} className="align-items-center d-inline-block px-4">
                <figure className="mb-0 text-center">
                  <img
                    src={`${process.env.base_url}${item.Url}`}
                    className="img-fluid"
                    style={{height: '54px'}}
                    alt="client-logo"
                  />
                </figure>
              </div>
            )
            : null}
        </div>
      </div>
    </section>
  )
};

export default OurClients;
