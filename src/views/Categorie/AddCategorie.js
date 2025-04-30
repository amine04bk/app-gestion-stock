

import React, { useCallback, useEffect, useState } from "react";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addCategorie , getCategorieById } from "../../Redux/categorieReduce";

function AddCategorie() {
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

  const [code, setCode] = useState("");
  const [libelle, setLibelle] = useState("");
  
  const submitForm = async () => {
    if (!validator.isEmpty(code) && !validator.isEmpty(libelle)) {
      try {
        await dispatch(addCategorie({ code, libelle, id }));
        notify(1, isNaN(paramId) ? "Insertion avec succès" : "Modification avec succès");
        setTimeout(() => listeCategorie(), 1500);
      } catch (error) {
        notify(2, "An error occurred");
      }
    }
  };

  const fetchCategorie = useCallback(async () => {
    var response = await dispatch(getCategorieById(id));
    var data = await (response.payload.data);
    setCode(data.code);
    setLibelle(data.libelle);
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      fetchCategorie();
    }
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
                <Form className="form">
                  <Card>
                    <Card.Header>
                      <Card.Title as="h4">
                        {typeof location.id == "undefined"
                          ? "Ajouter categorie"
                          : "Modifier categorie"}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Code* </label>
                            <Form.Control
                              value={code}
                              placeholder="Code"
                              onChange={(value) => {
                                setCode(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>libelle* </label>
                            <Form.Control
                              value={libelle}
                              placeholder="Libelle"
                              onChange={(value) => {
                                setLibelle(value.target.value);
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

export default AddCategorie;
