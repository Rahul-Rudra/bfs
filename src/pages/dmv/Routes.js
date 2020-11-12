import React, {useEffect} from 'react';
import {Switch} from 'react-router-dom';

import AppliedRoute from './AppliedRouting';
import Home from './Home';
import Location from './Location';
import Project from './Project';
import ProjectDetail from './ProjectDetail';
import Contact from './Contact';
import ProductDetail from './ProductDetail';
import Product from './Product';
import Service from './Service';
import ServiceDetail from './ServiceDetail'

import './css/style.css';
import './css/materialdesignicons.css';
import './css/loader.css';


const Route = ({childProps}) =>  (
  <Switch>
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking'
      component={Home}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/locations/:locationname'
      component={Location}
    />
    {/*<AppliedRoute*/}
      {/*childProps={childProps}*/}
      {/*exact*/}
      {/*path='/decking/project/:projectname'*/}
      {/*component={Project}*/}
    {/*/>*/}
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/project/:projectname/:detailname/:id'
      component={ProjectDetail}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/contact'
      component={Contact}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/product'
      component={Product}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/product/:productId'
      component={ProductDetail}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/product/:productId/:locationName'
      component={ProductDetail}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/service/:serviceId'
      component={ServiceDetail}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='/decking/service'
      component={Service}
    />
    <AppliedRoute
      childProps={childProps}
      exact
      path='*'
      component={Home}
    />
  </Switch>
);

export default Route;
