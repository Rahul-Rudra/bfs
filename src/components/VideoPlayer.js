import React, { Component } from 'react';
import { globalVar } from '../config';
import PropTypes from 'prop-types';
import Player from '@vimeo/player';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
  }

  pause = () => {
    var iframe = document.querySelector('iframe');
    var player = new Player(iframe);
    player.getPaused().then(function(paused) {
      !paused && player.pause();
    });
  };
  play = () => {
    var iframe = document.querySelector('iframe');
    var player = new Player(iframe);
    player.getPaused().then(function(paused) {
      paused ? player.play() : player.pause();
    });
  };
  render() {
    return (
      <iframe
        src={this.props.src}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay"
      ></iframe>
    );
  }
}

export default VideoPlayer;

/**
 * Define the proptype
 */
VideoPlayer.propTypes = {
  item: PropTypes.any,
};
