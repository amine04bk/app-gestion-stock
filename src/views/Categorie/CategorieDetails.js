import React, { useEffect, useState, useCallback, useRef } from "react";
import Select from "react-select";
import validator from "validator";
// react-bootstrap componentslogin
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getCategorieById} from "../../Redux/categorieReduce";

function DetailCategorie() {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [code, setCode] = React.useState("");
  const [libelle, setLibelle] = React.useState("");
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;
  
 
  const fetchCategorie = useCallback(async () => {
    var response = await dispatch(getCategorieById(id));
    var data = await (response.payload.data);
    setCode(data.code);
    setLibelle(data.libelle);

  }, [dispatch]);

  useEffect(() => {
    fetchCategorie();
  }, []);

  function listeCategorie() {
    navigate.push('/categorie/list');
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
                  onClick={listeCategorie}
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
                           {"Détail Categorie"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Code* </label>
                            <Form.Control
                              readOnly
                              defaultValue={code}
                              name="code"
                              className="required"
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Libelle* </label>
                            <Form.Control
                              readOnly
                              defaultValue={libelle}
                             name="libelle"
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

export default DetailCategorie;
