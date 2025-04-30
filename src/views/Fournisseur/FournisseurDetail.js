import React, { useCallback, useEffect, useState } from "react";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getFournisseurById } from "../../Redux/fournisseurReduce";

function DetailFournisseur() {

  const dispatch = useDispatch();
  const navigate = useHistory();
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [tel, setTel] = useState("");


  const fetchFournisseur = useCallback(async () => {
    var response = await dispatch(getFournisseurById(id));
    var data = await (response.payload.data);
    setAdress(data.adress);
    setEmail(data.email);
    setTel(data.tel);
    setName(data.name);
  }, [dispatch]);

  useEffect(() => {
      fetchFournisseur();
  }, []);

  function listeFournisseur() {
    navigate.push('/fournisseur/list');
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
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={listeFournisseur}
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
                <Form className="form">
                  <Card>
                    <Card.Header>
                      <Card.Title as="h4">
                      {"Détail Fournisseur"}
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group> 
                            <label>Name* </label>
                            <Form.Control
                             readOnly
                              value={name}
                               className="required"
                              type="text"
                            
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Email* </label>
                            <Form.Control
                              readOnly
                              value={email}
                               className="required"
                           
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Adress* </label>
                            <Form.Control
                             readOnly
                              value={adress}
                              className="required"
                             
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Tel* </label>
                            <Form.Control
                             readOnly
                              value={tel}
                              className="required"
                             
                            />
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

export default DetailFournisseur;
