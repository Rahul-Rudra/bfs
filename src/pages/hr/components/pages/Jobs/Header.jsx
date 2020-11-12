import React from 'react'
import { Row, Container } from 'react-bootstrap'
import bfspng from '../../../img/bfs.png'
export default function Header() {
  return (
    <header>
      <div className="topbar navbar-dark">
        <nav className="navbar navbar-dark bg-theme" >
          <Container>
            <Row className="w-100">
              <div className="ml-auto text-white">English(United States)</div>
            </Row>
          </Container>
        </nav>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Container>
          <Row className="w-100">
            <a className="navbar-brand" href="#"><img src={bfspng} className="jobs-h-img" alt="jobs-h-img" /></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item mr-4 active">
                  <a className="nav-link" href="#">Job Search</a>
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-primary btn-custom-primary">Sign In</button>
                </li>
              </ul>
            </div>
          </Row>
        </Container>
      </nav>
    </header>
  )
}
