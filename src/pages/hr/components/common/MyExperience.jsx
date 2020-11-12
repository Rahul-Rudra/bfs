import React, { useEffect, useState } from 'react';

const MyExperienceSection = ({ data: { Title, Testimonials } }) => {
  return (
    <section className="through-bfs-sec mt-5">
      <div className="container">
        <div className="row no-gutters">
          <div className="col-12">
            <h5 className="heading-tag heading-text position-relative text-blue mb-4 text-uppercase">{Title ? Title : ""}
            </h5>
          </div>
          <div className="card border-0 shadow-none w-100">
            <div id="carousel-slider" className="carousel slide carousel-slider" data-ride="carousel"
              data-interval="100000">
              <div className="w-100 carousel-inner" role="listbox">
                {Testimonials ?
                  Testimonials.map((item, index) =>
                    <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                      <div className="carousel-caption text-left py-0 h-100">
                        <div className="row no-gutters h-100 overlay_container">
                          <div className="col-md-6 col-sm-7 order-sm-1 order-2">
                            <div className="p-md-5 p-4 w-100 h-100 through-bfs-content h-100">
                              <p className="font-14 text-white mb-4">{item.Text}</p>
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-5 order-sm-2 order-1 c-img-overlay">
                            <div className='overlay overlay--left overlay--blue' />
                            <img src={item.PhotoUrl ? process.env.base_url + item.PhotoUrl : ""} className="w-100 h-100 object-cover"
                              alt="bfs-cares.jpg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                }
              </div>
              {Testimonials.length > 1 && (
                <div className="navi carousel-icons">
                  <a className="" href="#carousel-slider" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon ico" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="" href="#carousel-slider" role="button" data-slide="next">
                    <span className="carousel-control-next-icon ico" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

  )
};
export default MyExperienceSection;
