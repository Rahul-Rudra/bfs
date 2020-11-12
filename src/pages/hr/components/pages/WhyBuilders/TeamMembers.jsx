import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'
import { whyBuilders } from '../../../js/LoaderJS.js';
const TeamMembers = ({ teamMember }) => {
  const mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
  let query = "";
  mobile ? query = "?color=ed174c&title=0&byline=0&portrait=0" : query = "?color=ed174c&title=0&byline=0&portrait=0&muted=1"
  useEffect(() => {
    whyBuilders();
  })
  const [playing, setPlaying] = useState(false);
  // teamMember.Video.Url = "https://www.youtube.com/watch?v=lKooLHWbz-8";
  if (teamMember) {
    return (
      <section className="team-member-sec mt-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h5 className="heading-tag heading-text position-relative text-blue mb-4 text-uppercase">
                {teamMember ? teamMember.Title : ""}</h5>
            </div>
          </div>
        </div>
        <div className="container">

          <div className="row">
            <div className="col-12" data-id="exampleModal1">
              {/*  vimeo */}
              <div className="position-relative w-100 video-bg-pre" onClick={() => setPlaying(true)}>
                <div className="video-rwd team-members-video videoWrapper-rmd"
                  onClick={() => setPlaying(true)}>
                  <ReactPlayer
                    className="react-player"
                    onClick={() => setPlaying(true)}
                    url={teamMember.Video.Url}
                    playing={playing === true}
                    muted={mobile ? false : true}
                    controls={true}
                    // light={process.env.base_url + Video.Thumbnail}
                    playIcon={<span></span>}
                  />
                </div>
                <figure
                  hidden={playing}
                  onClick={() => setPlaying(true)}
                  className="mb-0 team-members-bg team-members-overlay" data-id="exampleModal1">
                  <img src={`${process.env.base_url}${teamMember.Video.Thumbnail}`} className="img-fluid cursor-pointer team-members-img" alt="team-members-bg.jpg" />
                </figure>
              </div>
            </div>


          </div>


        </div>
      </section>
    )
  }
  else {
    return (null)
  }
}
export default TeamMembers;
