import React from 'react';
import ReactPlayer from 'react-player'
const TeamMembers = ({ data: { Title, Video }, playing, setPlaying }) => {
  const mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
  // Video.Url = "https://www.youtube.com/watch?v=lKooLHWbz-8"

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
          <div className="col-12" data-id="exampleModal1" onClick={() => setPlaying(11)}>
            {/*  vimeo */}
            <div
              onClick={() => setPlaying(11)}
              className="position-relative w-100 video-bg-pre" >
              <div className="video-rwd team-members-video videoWrapper-rmd">
                <ReactPlayer
                  className="react-player"
                  onClick={() => setPlaying(11)}
                  url={Video.Url}
                  playing={playing === 11}
                  muted={mobile ? false : true}
                  controls={true}
                  // light={process.env.base_url + Video.Thumbnail}
                  playIcon={<span></span>}
                />
              </div>
              <figure
                hidden={playing === 11}
                className="mb-0 team-members-bg team-members-overlay" data-id="exampleModal1">
                <img
                  src={`${process.env.base_url}${Video.Thumbnail}`}
                  className="img-fluid cursor-pointer team-members-img"
                  alt="team-members-bg.jpg"
                />
              </figure>
            </div>
          </div>

        </div>



      </div>

    </section>


  )
};

export default TeamMembers;
