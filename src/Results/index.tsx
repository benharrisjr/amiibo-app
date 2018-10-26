import * as React from 'react';
import { Col, Row } from 'react-flexbox-grid';

 export const SearchResults = (props :any) => {
  return (
    <Row>
      {props.amiiboList.map((amiibo :any, index :number) => {
        return (
          <Col xs={12} md={4} lg={3} key={index}>
            <button
              style={{ border: 'none', cursor: 'pointer', background: 'none' }}
              onClick={() => props.setModalDetails(amiibo)}
            >
              <p>{amiibo.name}</p>
              <img style={{ maxHeight: '400px' }} src={amiibo.image} />
            </button>
          </Col>
        );
      })}
    </Row>);
}