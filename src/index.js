import 'react-app-polyfill/ie9';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import {Router, Switch, Route} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { globalVar } from './config';

import App from './App';
import DMV from './pages/dmv';
import ErrorBoundary from './ErrorBoundary';

import './assets/css/bootstrap.css';
import './assets/css/index.css';
import 'react-notifications/lib/notifications.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

let browserHistory = createBrowserHistory();
browserHistory.listen((location) => {
  ReactGA.initialize(globalVar.googleAnalyticsKey);
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
  <Router history={browserHistory}>
    <ErrorBoundary>
      <Switch>
        <Route path='/decking' component={DMV} />
        <Route path='*' component={App} />
      </Switch>
    </ErrorBoundary>
  </Router>,
  document.getElementById('root')
);
