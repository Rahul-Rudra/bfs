import React from 'react'
import {Col, FormControl, Form} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

export default function AdvancedSearch({apiType, setApiType, apiQuery, setApiQuery, date, setDate, typeChange}) {
  return (
    <>
      <Col className='col-md-3 selectBox col-12'>
        <Form.Group controlId='exampleForm.SelectCustom' className='mb-0'>
          <Form.Control
            as='select'
            onClick={e => typeChange(e.currentTarget.value, setApiType, setApiQuery)}
            className='custom_input_Select border-0'
          >
            <option disabled defaultValue value={null}>Choose Query Type</option>
            <option value='state'>By State</option>
            <option value='title'>By Title</option>
            <option value='site'>By Site Name</option>
            <option value='postal'>By Postal Code</option>
            <option value='zip'>By Zip Code</option>
            <option value='companyName'>By Company Name</option>
            <option value='lastModified'>By Last Modified</option>
            <option value='description'>By Description</option>
          </Form.Control>
        </Form.Group>
      </Col>

      <Col className='col-md-6 col-lg-7 col-12 border-left'>
        <FormControl
          className='custom_input_Select border-0'
          hidden={apiType === 'lastModified'}
          onChange={event => setApiQuery(event.target.value)}
          value={apiQuery}
          placeholder='Query For Advanced Search'
          aria-label='Username'
          aria-describedby='basic-addon1'
        />
        <div className='date-Picker' hidden={apiType !== 'lastModified'}>
          <DatePicker
            className='border-0'
            selected={date}
            onChange={setDate}
          />
        </div>
      </Col>
    </>
  );
}
