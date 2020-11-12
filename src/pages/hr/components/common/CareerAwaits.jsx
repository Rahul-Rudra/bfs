import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'

import { Youtube } from '../../js/LoaderJS.js';

const CareerAwaits = ({ data: { Title, Videos }, playing, setPlaying }) => {
  // useEffect(() => {
  //   Youtube();
  // });
  // Videos[0].Url = "https://www.youtube.com/watch?v=lKooLHWbz-8";
  // Videos[2].Url = "https://www.youtube.com/watch?v=lKooLHWbz-8";
  const mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
  return (
    <section className="career-awaits-sec mt-5">
      <div className="container px-md-3 px-0">
        <div className="row">
          <div className="col-12">
            <h5 className="heading-tag heading-text position-relative text-blue mb-4">
              {Title ? Title : ""}</h5>
          </div>
        </div>

        <div className="row career-awaits-c-row">
          {Videos ?
            Videos.map((item, index) =>
              <React.Fragment key={index + item.$id}>
                <div onClick={() => setPlaying(index)} key={index + index} className="col-sm-6 col-lg-3 px-lg-1 px-3 overlay_container career-awaits-col" data-id={item.$id}>
                  <div className="position-relative w-100 video-bg-pre" onClick={() => setPlaying(index)}>
                    <div className="videoWrapper-inner video-rwd videoWrapper-rmd">
                      <ReactPlayer
                        className="react-player"
                        onClick={() => setPlaying(index)}
                        url={item.Url}
                        playing={index === playing}
                        muted={!mobile}
                        controls={true}
                        playIcon={<span></span>}
                      />
                    </div>
                    <figure
                      hidden={index === playing}
                      onClick={() => setPlaying(index)}
                      className="mb-0 career-overlay" data-id={item.$id}
                    >
                      <img src={`${process.env.base_url}${item.Thumbnail}`} className="w-100" alt="client-logo" />
                    </figure>
                  </div>
                  <div
                    id="caption"
                    className={index === playing
                      ? "video-caption overlay overlay--blue d-flex align-items-center v-playing"
                      : "video-caption overlay overlay--blue d-flex align-items-center"}
                  >
                    <h6 className="heading-tag heading-text position-relative text-white text-uppercase career-video-title w-100 px-3">
                      {item.Caption}
                    </h6>
                  </div>

                  <div className="modal fade video-mem-popup" id={item.$id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                      <div className="modal-content border-0">
                        <div className="modal-header border-0">
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body px-2 py-0">
                          <div id="videoWrapper" className="videoWrapper">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
            : null}
        </div>
      </div>
    </section>
  )
};

export default CareerAwaits;
