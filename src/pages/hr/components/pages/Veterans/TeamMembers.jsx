import React, { useEffect, useState } from 'react';
import { Youtube } from '../../../js/LoaderJS'
import ReactPlayer from 'react-player'
const TeamMembers = ({ data: { Title, Url, Thumbnail } }) => {
  useEffect(() => {
    Youtube();
  });
  const [playing, setPlaying] = useState(false);
  const mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
  // let Url = "https://vimeo.com/226753029"
  return (
    <section className="team-member-sec mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h5 className="heading-tag heading-text position-relative text-blue mb-4 text-uppercase">
              {Title ? Title : ""}</h5>
          </div>
        </div>
      </div>
      <div className="container">

        <div className="row">
          <div className="col-12" data-id="exampleModal1">
            {/*  vimeo */}
            <div className="position-relative w-100 video-bg-pre"
              onClick={() => setPlaying(true)}>
              <div className="video-rwd team-members-video videoWrapper-rmd"
                onClick={() => setPlaying(true)}>
                <ReactPlayer
                  className="react-player"
                  onClick={() => setPlaying(true)}
                  url={Url}
                  playing={playing === true}
                  muted={mobile ? false : true}
                  controls={true}
                  // light={process.env.base_url + Video.Thumbnail}
                  playIcon={<span></span>}
                />
              </div>
              <figure
                hidden={playing}
                className="mb-0 team-members-bg team-members-overlay" data-id="exampleModal1">
                <img src={`${process.env.base_url}${Thumbnail}`} className="img-fluid cursor-pointer team-members-img" alt="team-members-bg.jpg" />
              </figure>
            </div>
          </div>


        </div>


      </div>
    </section>)
};

export default TeamMembers;
