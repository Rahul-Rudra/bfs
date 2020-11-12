import React, {Component} from 'react';
import {globalVar} from '../config';
import axios from 'axios';

class CovidComponent extends Component {
  state = {
    content: {
      data: null,
      fetching: false,
    },
  };

  componentDidMount() {
    this.fetchContent();
  }

  fetchContent = async () => {
    this.setState({ content: { data: null, fetching: true } });

    try {
      const { data } = await axios.get(`${globalVar.base_url}umbraco/api/Content/Get?id=14512`);

      this.setState({ content: { data, fetching: false } });
    } catch (error) {
      this.setState({ content: { data: null, fetching: false } });

      console.error(error);
    }
  };

  render() {
    const {content} = this.state;

    return content.data && (
      <div className='container midcontent'>
        <div className='col-12'>
          <h2>{content.data.Properties.pageTitle}</h2>
          <div dangerouslySetInnerHTML={{__html: content.data.Properties.content}} />
        </div>
      </div>
    )
  }
}

export default CovidComponent;
