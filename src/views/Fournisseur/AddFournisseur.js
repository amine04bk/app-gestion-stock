import React, { useCallback, useEffect, useState } from "react";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addFournisseur, getFournisseurById } from "../../Redux/fournisseurReduce";

function AddFournisseur() {
  const notify = (type, msg) => {
    toast(
      <strong>
        <i className={`fas ${type === 1 ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
        {msg}
      </strong>,
      { type: type === 1 ? toast.TYPE.SUCCESS : toast.TYPE.ERROR }
    );
  };

  const dispatch = useDispatch();
  const navigate = useHistory();
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [tel, setTel] = useState("");

  const submitForm = async () => {
    if (!validator.isEmpty(name) && !validator.isEmpty(email)) {
      try {
        await dispatch(addFournisseur({ tel, adress, name, email, id }));
        notify(1, isNaN(paramId) ? "Insertion avec succès" : "Modification avec succès");
        setTimeout(() => listeFournisseur(), 1500);
      } catch (error) {
        notify(2, "An error occurred");
      }
    }
  };

  const fetchFournisseur = useCallback(async () => {
    var response = await dispatch(getFournisseurById(id));
    var data = await (response.payload.data);
    setAdress(data.adress);
    setEmail(data.email);
    setTel(data.tel);
    setName(data.name);
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      fetchFournisseur();
    }
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
                        {!id ? "Ajouter fournisseur" : "Modifier fournisseur"}
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Name* </label>
                            <Form.Control
                              value={name}
                              placeholder="Name"
                              onChange={(value) => {
                                setName(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Email* </label>
                            <Form.Control
                              value={email}
                              placeholder="Email"
                              onChange={(value) => {
                                setEmail(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Adress* </label>
                            <Form.Control
                              value={adress}
                              placeholder="Adress"
                              onChange={(value) => {
                                setAdress(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Tel* </label>
                            <Form.Control
                              value={tel}
                              placeholder="Tel"
                              onChange={(value) => {
                                setTel(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        className="btn-fill pull-right"
                        variant="info"
                        onClick={submitForm}
                      >
                        Enregistrer
                      </Button>
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

export default AddFournisseur;
