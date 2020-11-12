import instance from './instance';

export const fetchInternsPage = () => instance.get('/umbraco/api/InternsPage/PageContents');

export const fetchCareersPage = () => instance.get('/umbraco/api/AmazingCareersPage/PageContents');

export const fetchBuildersPage = () => instance.get('/umbraco/api/WhyBuildersPage/PageContents');

export const fetchVeteransPage = () => instance.get('/umbraco/api/VeteransPage/PageContents');

export const fetchNavigation = () => instance.get('/umbraco/api/Navigation/GetAll');

export const fetchHeader = () => instance.get('/umbraco/api/Content/GetMenus');

export const fetchFooter = () => instance.get('/umbraco/api/footer-logos');

export const fetchAllJobs = () => instance.get('/umbraco/api/JobFeed/GetAlljobs');
