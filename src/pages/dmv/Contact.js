import React, {Component} from 'react';
import axios from 'axios';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import {store} from 'react-notifications-component';
import {globalVar} from '../../config';
import $ from 'jquery';

class Contact extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loadingdata: true,
      isloading: false,
      firstName: '',
      lastName: '',
      phoneNo: '',
      emailAddr: '',
      businessName: '',
      location: '',
      planning: '',
      confirmation: false,
      projectItem: [],
      businessname: '',
      buildingplan: '',
      materialItem: [],
      serviceItem: [],
      banner: '',
      title: '',
      bodytext: '',
      firstNameError: '',
      lastNameError: '',
      phoneError: '',
      emailError: '',
      projectError: '',
      businessError: '',
      locationError: '',
      planningError: '',
      materialError: '',
      serviceError: '',
      fields: [],
    };
  }

  getContactPageData() {
    let base = globalVar.base_url;
    axios
      .get(base + '/umbraco/api/contact', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => {
        let obj = response.data.Form.Fields;
        let data = [];
        for (var key in obj) {
          data.push(obj[key]);
        }
        this.setState({
          banner: {
            image: response.data.Banner.Images[0].Url,
            alt: response.data.Banner.Images[0].Name,
          },
          title: response.data.Title,
          bodytext: response.data.BodyText,
          fields: data,
          loadingdata: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  backtoForm() {
    this.setState({
      confirmation: false,
      isloading: false,
      firstName: '',
      lastName: '',
      phoneNo: '',
      emailAddr: '',
      businessName: '',
      location: '',
      buildingplan: '',
      materialItem: [],
      serviceItem: [],
      projectItem: [],
    });
  }

  componentDidMount() {
    this.getContactPageData();
  }

  onToggleProject(index, e) {
    let newItems = this.state.project.slice();
    newItems[index].checked = !newItems[index].checked;
    this.setState({
      projectItem: newItems,
    });
  }

  onToggleService(index, e) {
    let newItems = this.state.services.slice();
    newItems[index].checked = !newItems[index].checked;
    this.setState({
      serviceItem: newItems,
    });
  }

  onToggleMaterials(index, e) {
    let newItems = this.state.materials.slice();
    newItems[index].checked = !newItems[index].checked;
    this.setState({
      materialItem: newItems,
    });
  }

  handleChange = event => {
    if (event.target.getAttribute('data-type') === 'PhoneNo') {
      var regex = /[^0-9]/gi;
      event.target.value = event.target.value.replace(regex, '');
    }
    let data = this.state.fields;
    if (event.target.getAttribute('checkboxattr')) {
      for (let i = 0; i < data.length; i++) {
        if (event.target.getAttribute('typeattr') === data[i].Label) {
          for (let j = 0; j < data[i].Checkboxes.length; j++) {
            if (event.target.id.replace(/[0-9]/g, '') === data[i].Checkboxes[j].Label) {
              data[i].Checkboxes[j].Checked = true;
            }
          }
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (event.target.getAttribute('labelattr') === data[i].Label) {
          let obj = data[i];
          obj['Value'] = event.target.value;
        }
      }
    }
    this.setState({
      fields: data,
    });
  };

  validateEmail(email) {
    let re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    return re.test(email);
  }

  numberOnlyPhone(event) {
    var element = document.getElementById('Phone');
    var regex = /[^0-9]/gi;
    element.value = element.value.replace(regex, '');
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    $('html,body').animate({scrollTop: 250}, 200);

    let obj = {};
    let emailfield = '';
    let re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    for (let i = 0; i < this.state.fields.length; i++) {
      if (this.state.fields[i].Checkboxes) {
        obj[this.state.fields[i].Name] = this.state.fields[i].Checkboxes;
      } else {
        obj[this.state.fields[i].Name] = this.state.fields[i].Value;
      }

      if (this.state.fields[i].Type === 'Email') {
        emailfield = this.state.fields[i].Value;
      }
    }

    if (emailfield && !re.test(emailfield)) {
      store.addNotification({
        message: 'Email address you have entered is not valid!',
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],
        width: 300,
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
      return false;
    }

    this.setState({confirmation: true});

    this.setState({isloading: true});
    let base = globalVar.base_url;
    axios
      .post(base + '/umbraco/api/contactform/submit', obj, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          confirmation: true,
        });
        store.addNotification({
          message: 'Contact form has been submitted successfully',
          type: 'default',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          width: 300,
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      })
      .catch(error => {
        this.setState({isloading: false});
        store.addNotification({
          message: 'Something went wrong',
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          width: 300,
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      });
  }

  render() {
    let self = this;
    if (this.state.fields && this.state.fields.length > 0) {
      var fields = this.state.fields.map(function (element, i) {
        if (element.Checkboxes && element.Checkboxes.length > 0) {
          return (
            <div key={i} className="col-12 p-0">
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="font-weight-semi-bold font-mont">
                    {element.Label}
                    {element.IsRequired ? (
                      <sup className="error errorrep">*</sup>
                    ) : null}
                  </h6>
                  <p className="font-weight-normal mb-4 ">
                    {element.Description}
                  </p>
                </div>
                {element.Checkboxes.map((item, i) => (
                  <div key={i} className="col-12 col-md-6">
                    <label className="theme-checkbox ">
                      {item.Label}
                      <input
                        data-type={element.Type}
                        id={i + item.Label}
                        onChange={e => {
                          self.handleChange(e);
                        }}
                        checkboxattr="checkbox"
                        typeattr={element.Label}
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (element.Items && element.Items.length > 0) {
          return (
            <div key={i} className="col-12 col-md-6 mb-4 p-0">
              <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                {element.Label}
                {element.IsRequired ? (
                  <sup className="error errorrep">*</sup>
                ) : null}
              </label>
              <div className="w-100 d-block">
                {element.IsRequired ? (
                  <select
                    data-type={element.Type}
                    labelattr={element.Label}
                    required
                    onChange={e => {
                      self.handleChange(e);
                    }}
                    className="form-control mb-1"
                  >
                    {element.Items.map((item, i) => (
                      <option key={i} value={item.Value}>
                        {item.Label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    data-type={element.Type}
                    labelattr={element.Label}
                    onChange={e => {
                      self.handleChange(e);
                    }}
                    className="form-control mb-1"
                  >
                    {element.Items.map((item, i) => (
                      <option key={i} value={item.Value}>
                        {item.Label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          );
        } else if (element.Rows) {
          return (
            <div key={i} className="row mb-5">
              <div className="col-12">
                <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                  {element.Label}
                  {element.IsRequired ? (
                    <sup className="error errorrep">*</sup>
                  ) : null}
                </label>
                <div className="w-100 d-block">
                  {element.IsRequired ? (
                    <textarea
                      data-type={element.Type}
                      labelattr={element.Label}
                      required
                      id={element.Label}
                      onChange={e => {
                        self.handleChange(e);
                      }}
                      className="w-100 form-control shadow-sm resize-none mb-1"
                      name={element.Name}
                      rows={element.Rows}
                    ></textarea>
                  ) : (
                    <textarea
                      data-type={element.Type}
                      labelattr={element.Label}
                      id={element.Label}
                      onChange={e => {
                        self.handleChange(e);
                      }}
                      className="w-100 form-control shadow-sm resize-none mb-1"
                      name={element.Name}
                      rows={element.Rows}
                    ></textarea>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      });

      var textfield = this.state.fields.map(function (element, i) {
        if (!element.Checkboxes && !element.Items && !element.Rows && element.Name) {
          return (
            <div key={i} className="col-12 col-md-6 mb-4">
              <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                {element.Label}
                {element.IsRequired ? (
                  <sup className="error errorrep">*</sup>
                ) : null}
              </label>
              <div className="w-100 d-block">
                {element.IsRequired ? (
                  <input
                    data-type={element.Type}
                    labelattr={element.Label}
                    required
                    maxLength={element.Maxlength}
                    onChange={e => {
                      self.handleChange(e);
                    }}
                    id={element.Label}
                    className="w-100 form-control shadow-sm mb-1"
                    type="text"
                    name={element.Name}
                    placeholder={element.Placeholder}
                  />
                ) : (
                  <input
                    data-type={element.Type}
                    labelattr={element.Label}
                    maxLength={element.Maxlength}
                    onChange={e => {
                      self.handleChange(e);
                    }}
                    id={element.Label}
                    className="w-100 form-control shadow-sm mb-1"
                    type="text"
                    name={element.Name}
                    placeholder={element.Placeholder}
                  />
                )}
              </div>
            </div>
          );
        } else {
          return null;
        }
      });
    }

    if (
      this.state.fields &&
      this.state.fields.length > 0 &&
      this.state.confirmation
    ) {
      var confirmationfields = this.state.fields.map(function (element, i) {
        if (element.Checkboxes && element.Checkboxes.length > 0) {
          return (
            <div key={i} className="col-12 p-0">
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="font-weight-semi-bold font-mont">
                    {element.Label}
                    {element.IsRequired ? (
                      <sup className="error errorrep">*</sup>
                    ) : null}
                  </h6>
                </div>
                {element.Checkboxes.map((item, i) => item.Checked && (
                  <div key={i} className="col-12 col-md-3">
                    <label className="theme-checkbox ">{item.Label}</label>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (element.Items && element.Items.length > 0 && element.Value) {
          return (
            <div key={i} className="col-12 col-md-6 mb-4 p-0">
              <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                {element.Label}
                {element.IsRequired ? (
                  <sup className="error errorrep">*</sup>
                ) : null}
              </label>
              <div className="w-100 d-block">
                {element.Value}
              </div>
            </div>
          );
        } else if (element.Rows && element.Value) {
          return (
            <div key={i} className="row mb-5">
              <div className="col-12">
                <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                  {element.Label}
                  {element.IsRequired ? (
                    <sup className="error errorrep">*</sup>
                  ) : null}
                </label>
                <div className="w-100 d-block" style={{whiteSpace: 'pre-line'}}>{element.Value}</div>
              </div>
            </div>
          );
        } else {
          return null;
        }
      });

      var confirmationtextfield = this.state.fields.map(function (element, i) {
        if (
          !element.Checkboxes &&
          !element.Items &&
          !element.Rows &&
          element.Value
        ) {
          return (
            <div key={i} className="col-12 col-md-6 mb-4">
              <label className="w-100 d-block font-13 font-weight-semi-bold font-mont">
                {element.Label}
                {element.IsRequired ? (
                  <sup className="error errorrep">*</sup>
                ) : null}
              </label>
              <div className="w-100 d-block">{element.Value}</div>
            </div>
          );
        } else {
          return '';
        }
      });
    }


    return (
      <div>
        {!this.state.confirmation ? (
          <div className="withoutConfirmation">
            <ReactNotification/>
            <div className="contact-hero-image">
              <div className="position-relative h-100 ct-image">
                {this.state.banner ? (
                  <img
                    alt={this.state.banner.alt}
                    className="w-100"
                    src={globalVar.base_url + this.state.banner.image}
                  />
                ) : null}
              </div>
            </div>
            <div className="pb-4">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="bg-relative bg-white contact-section pt-5 px-md-5">
                      {this.state.title ? (
                        <h2 className="font-weight-bold line-height-normal">
                          {this.state.title}
                        </h2>
                      ) : null}
                      {this.state.bodytext ? (
                        <h5 className="font-mont color-light font-weight-light mb-5">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: this.state.bodytext,
                            }}
                          ></span>
                        </h5>
                      ) : null}
                      <div className="col-12 p-0">
                        <form onSubmit={this.handleSubmit} ref="form">
                          <div className="row">{textfield}</div>
                          {fields}

                          {!this.state.loadingdata ? (
                            <div className="col-12 p-0">
                              <div className="row mb-4 pt-5">
                                <div className="col-md-12 text-center">
                                  <button
                                    type="submit"
                                    className="btn btn-primary text-uppercase theme-btn  px-5 btn_load_more d-inline-block"
                                  >
                                    {this.state.isloading ? (
                                      <span className="pr-2">
                                        <i className="fa fa-refresh fa-spin"></i>
                                      </span>
                                    ) : null}
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="withConfirmation">
            <ReactNotification/>
            <div className="contact-hero-image">
              <div className="position-relative h-100 ct-image">
                {this.state.banner ? (
                  <img
                    alt={this.state.banner.alt}
                    className="w-100"
                    src={globalVar.base_url + this.state.banner.image}
                  />
                ) : null}
              </div>
            </div>
            <div className="pb-4">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="bg-relative bg-white contact-section pt-5 px-md-5">
                      <h2 className="font-weight-bold line-height-normal">
                        Thank you for contacting us!
                      </h2>
                      <h5 className="font-mont color-light font-weight-light mb-5">
                        We have received the information below:
                      </h5>
                      <div className="col-12 p-0">
                        <div className="row">{confirmationtextfield}</div>
                        {confirmationfields}
                        {!this.state.loadingdata ? (
                          <div className="col-12 p-0">
                            <div className="row mb-4 pt-5">
                              <div className="col-md-12 text-center">
                                <button
                                  onClick={() => {
                                    this.backtoForm();
                                  }}
                                  type="button"
                                  className="btn btn-primary text-uppercase theme-btn  px-5 btn_load_more d-inline-block"
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Contact;
