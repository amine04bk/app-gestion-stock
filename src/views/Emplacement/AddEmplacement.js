import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addEmplacement, getEmplacementById } from "../../Redux/emplacementReduce";

function AddEmplacement() {
  const notify = (type, msg) => {
    toast(
      <strong>
        <i
          className={`fas ${
            type === 1 ? "fa-check-circle" : "fa-exclamation-circle"
          }`}
        ></i>
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
  const [adresse, setAdresse] = useState("");
  
  const submitForm = async () => {
    if (!validator.isEmpty(code) && !validator.isEmpty(libelle) && !validator.isEmpty(adresse) ) {
      try {
        await dispatch(
          addEmplacement({
            code,
            libelle,
            adresse, 
            id,
          })
        );
        notify(
          1,
          isNaN(paramId) ? "Insertion avec succès" : "Modification avec succès"
        );
        setTimeout(() => listeEmplacement(), 1500);
      } catch (error) {
        notify(2, "An error occurred");
      }
    }
  };

  const fetchEmplacement = useCallback(async () => {
    var response = await dispatch(getEmplacementById(id));
    var data = await response.payload.data;
    setCode(data.code);
    setLibelle(data.libelle);
    setAdresse(data.adresse);
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      fetchEmplacement();
    }
  }, []);

  function listeEmplacement() {
    navigate.push("/emplacement/list");
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
                  onClick={listeEmplacement}
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
                        {isNaN(paramId) ? "Ajouter Emplacement" : "Modifier Emplacement"}
                      </Card.Title>
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
                            <label>Libelle* </label>
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

                      <Row>
                          <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Adresse* </label>
                            <Form.Control
                              value={adresse}
                              placeholder="Adresse"
                              onChange={(value) => {
                                setAdresse(value.target.value);
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

export default AddEmplacement;
