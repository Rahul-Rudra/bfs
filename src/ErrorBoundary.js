import React from 'react';
import {withRouter, Link} from 'react-router-dom';

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  componentDidUpdate(prevProps) {
    this.checkLocationChanged(prevProps, this.props);
  }

  componentDidCatch(error) {
    this.setState({hasError: true});
    console.log(error);
  }

  checkLocationChanged(prevProps, currProps) {
    const {location: {pathname: prevPath}} = prevProps;
    const {location: {pathname: currPath}} = currProps;

    if (prevPath !== currPath) {
      this.setState({hasError: false});
    }
  }

  render() {
    const {hasError} = this.state;
    const {children, location: {pathname}} = this.props;

    if (hasError) {
      return (
        <div className='error-boundary'>
          <div className='error-boundary__header'>
            Something went wrong :(
          </div>
          <div className='error-boundary__buttons'>
            <a href={pathname}>
              Reload page
            </a>
            <span>or</span>
            <Link to={pathname.includes('decking') ? '/decking' : '/'} rel='nofollow'>
              Go to home page
            </Link>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default withRouter(ErrorBoundary);
