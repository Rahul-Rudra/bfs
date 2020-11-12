import React from 'react'
import { Col, Row,Container} from 'react-bootstrap';
export default function Footer() {
  return (
    <footer className="jobs-footer py-4">
      <Container>
        <Row className="text-center">
          <Col md={12}>
            <p className="mb-0 text-white">© 2020 Ceridian HCM, Inc. All Rights Reserved. <a href="#" target="_blank" className="text-white">Privacy Policy</a></p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
