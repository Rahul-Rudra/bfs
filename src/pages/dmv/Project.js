import React, {Component} from 'react';
import facebook from './img/facebook-black.svg';
import twitter from './img/twitter-black.svg';
import pinterest from './img/pinterest-black.svg';
import Masonry from 'react-masonry-component';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {globalVar} from '../../config';

const imagesLoadedOptions = {background: '.my-bg-image-el'}
const masonryOptions = {
    transitionDuration: 0
};


class Project extends Component {

    constructor() {
        super();
        this.state = {
            locationname: '',
            jsondata: [],
            isloading: true,
            locationData: [],
            facebooklink: '',
            twitterlink: '',
            pinterestlink: ''
        }
    }

    getProjectData() {
        let urlname = this.props.match.params.projectname
        this.setState({
            isloading: true
        });
        let base = globalVar.base_url;
        axios.get(base + '/umbraco/api/project/' + urlname, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            this.setState({
                locationname: response.data.Location,
                jsondata: response.data.ProjectItems,
                isloading: false,

            })
        }).catch((error) => {
            console.log(error);
        });

        axios.get(base + '/umbraco/api/projectitem/1074/2', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }


    redirect(url) {
        this.props.history.push('dmvdeck' + url);
    }

    componentDidMount() {
        this.getProjectData();

    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.projectname !== prevProps.match.params.projectname) {
            this.getProjectData();
        }
    }

    render() {
        //let self = this;
        const childElements = this.state?.jsondata.map(function (element, i) {
            return (
                <div key={i} className="col-lg-4 col-md-6 col-sm-6 mt-4 pt-2 mt-4 pt-2">
                    <div className="bg-white box-shadow recent_project">
                        <div
                            className="prj-thumbnail"> {element?.ThumbnailImage ? (
                            <img alt="portfolio" className="img-fluid"
                                 src={globalVar.base_url + element?.ThumbnailImage?.Url}/>) : null}</div>
                        <div className="px-4 py-4">
                            <div className="p-2">
                                {element?.Builders ? (
                                    <h6 className="text-uppercase font-13 font-weight-medium swett_const text-truncate">builder: {element?.Builders}</h6>) : null}
                                <h5 className="font-weight-semi-bold line-height-normal text-capitalize clamp ">{element?.Name}
                                </h5>
                                {element?.SalesRepresentative ? (<p className="sales_represent">Sales
                                    Representative: <span> {element?.SalesRepresentative}</span></p>) : null}
                                {element?.Summary ? (<p className="font-13 font-open-sans">{element?.Summary}
                                </p>) : null}
                                <div className="d-flex align-items-center mt-4 mb-2">
                                    <div className="">
                                        <Link to={'/decking' + element?.Url + element?.Id}
                                              className="btn btn-danger  theme-btn py-2 font-weight-normal px-4">Read
                                            More</ Link>
                                    </div>
                                    <div className="ml-auto mt-lg-0 mt-2">
                                        {element?.FacebookLink || element?.TwitterLink || element?.PinterestLink ? (
                                            <ul className="list-unstyled list-width-0 mb-0">
                                                <li className="list-inline-item fon-14 text-share font-13 text-black font-weight-semi-bold"> Share:</li>
                                                {element?.FacebookLink ? (
                                                    <li className="list-inline-item mr-2"><a target="_blank"
                                                                                             href={element?.FacebookLink}><img
                                                        alt="facebook" src={facebook}/></a></li>) : null}
                                                {element?.PinterestLink ? (
                                                    <li className="list-inline-item mr-2"><a target="_blank"
                                                                                             href={element?.TwitterLink}><img
                                                        alt="twitter" src={twitter}/></a></li>) : null}
                                                {element?.PinterestLink ? (
                                                    <li className="list-inline-item"><a target="_blank"
                                                                                        href={element?.PinterestLink}><img
                                                        alt="pinterest" src={pinterest}/></a></li>) : null}
                                            </ul>) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <section className="Recent_Bfs_Project pt-5 pb-5 bg-gray-theme">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <h1 className="text-center">{this.state.locationname}</h1>
                        </div>
                    </div>
                    {
                        !this.state.isloading ? (
                            <Masonry
                                className={'row'}
                                elementType={'div'}
                                options={masonryOptions}
                                disableImagesLoaded={false}
                                updateOnEachImageLoad={false}
                                imagesLoadedOptions={imagesLoadedOptions}
                            >
                                {childElements}
                            </Masonry>
                        ) : (
                            <Masonry
                                className={'row'}
                                elementType={'div'}
                                options={masonryOptions}
                                disableImagesLoaded={false}
                                updateOnEachImageLoad={false}
                                imagesLoadedOptions={imagesLoadedOptions}
                            >
                                <div className="col-12 col-sm-4">
                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-12 col-sm-4">

                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">

                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <div className="ph-item">
                                        <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                            <div className="ph-row">
                                                <div className="ph-col-4"></div>
                                                <div className="ph-col-8 empty"></div>
                                                <div className="ph-col-12"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="ph-row">
                                                <div className="ph-col-12"></div>
                                                <div className="ph-col-2"></div>
                                                <div className="ph-col-10 empty"></div>
                                                <div className="ph-col-8 big"></div>
                                                <div className="ph-col-4 big empty"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Masonry>
                        )
                    }
                    {/*<div className="row my-5 text-center">
                            <div className="col-md-12">
                                <button type="button" className="btn btn-primary btn-read-more  theme-btn load-more ">Load More</button>
                            </div>
                     </div>*/}
                </div>
            </section>
        )
    }

}

export default Project
