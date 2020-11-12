import {instance} from './instance';

export const fetchProducts = () => instance.get('/umbraco/api/productitems/');

export const fetchProductsHeader = () => instance.get('/umbraco/api/productpageheader/');

export const fetchServices = () => instance.get('/umbraco/api/serviceitems/');

export const fetchServicesHeader = () => instance.get('/umbraco/api/servicepageheader/');

export const fetchLocalBuilders = () => instance.get('/umbraco/api/home');

export const fetchServiceDetails = ({serviceId}) => instance.get(`/umbraco/api/serviceitem/${serviceId}`);

export const fetchProductDetails = ({productId}) => instance.get(`/umbraco/api/productitem/${productId}`);

export const fetchLocationProducts = ({locationName}) => instance.get(`/umbraco/api/locationitem/${locationName}`);

export const fetchLocationHeader = () => instance.get('/umbraco/api/locationpageheader/');

export const fetchClosestStore = (data) => instance.post('/umbraco/api/LocationData/GetClosestStore', data);
