import React, { useEffect, useState, useCallback, useRef } from "react";
import Select from "react-select";
import validator from "validator";
// react-bootstrap componentslogin
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  getRoleById
} from "../../Redux/roleReduce";

function DetailRole() {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [name, setName] = React.useState("");
 
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;
  const getRole = useCallback(async (id) => {
    var response = await dispatch(getRoleById({ id: id }));
    var data = await response.payload.data;    
    setName(data.name);
   
  }, [dispatch]);
  useEffect(() => {
    if (id !== 0)
      getRole(id);
  }, []);
  function listeRole() {
    navigate.push('/role/list');
  }
  return (
    <>
      <Container fluid>
        <ToastContainer />
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={listeRole}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  Retour à la liste
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">
                           {"Détail role"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Name* </label>
                            <Form.Control
                              readOnly
                              defaultValue={name}
                              name="name"
                              className="required"
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      
                      </Row>
                      <div className="clearfix"></div>
                    </Card.Body>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default DetailRole;
