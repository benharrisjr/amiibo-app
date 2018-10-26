import * as React from 'react';
import { Col, Row } from 'react-flexbox-grid';


 export const DetailsModal = (props :any) => {
  //Really basic modal functionality for details view
  return (
    <section style={{
      position: 'fixed',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }}>
      <section style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '1px solid rgb(204, 204, 204)',
          background: 'rgb(255, 255, 255)',
          overflow: 'auto',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px'
          }}>
        <Row>
          <Col xs={6} md={11}>
            <h3>{props.modalDetails.name}</h3>
          </Col>
          <Col xs={6} md={1}><button onClick={props.closeModal}>x</button></Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <img style={{ maxHeight: '400px' }} src={props.modalDetails.image} />
          </Col>
          <Col xs={12} md={8} style={{ textAlign: 'left' }}>
            {Object.keys(props.modalDetails).map((key :string) => {
              if (key === 'image') {
                return;
              }
              if (key === 'release') {
                return (
                  <section style={{ paddingBottom: '12px' }}>
                    <Row>
                      <Col style={{ fontWeight: 'bold' }} md={2}>NA Release:</Col>
                      <Col md={6}>{props.modalDetails.release.na}</Col>
                    </Row>
                    <Row>
                      <Col style={{ fontWeight: 'bold' }} md={2}>AU Release:</Col>
                      <Col md={6}>{props.modalDetails.release.au}</Col>
                    </Row>
                    <Row>
                      <Col style={{ fontWeight: 'bold' }} md={2}>EU Release:</Col>
                      <Col md={6}>{props.modalDetails.release.eu}</Col>
                    </Row>
                    <Row>
                      <Col style={{ fontWeight: 'bold' }} md={2}>JP Release:</Col>
                      <Col md={6}>{props.modalDetails.release.jp}</Col>
                    </Row>
                </section>);
              }
              return (
                <Row style={{ paddingBottom: '12px' }}>
                  <Col md={2} style={{ fontWeight: 'bold' }}>{key}:</Col>
                  <Col md={6}>{props.modalDetails[key]}</Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </section>
    </section>
  )
}