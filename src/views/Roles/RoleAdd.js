import React, { useCallback, useEffect, useState } from "react";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addRole, getRoleById } from "../../Redux/roleReduce";

function addrole() {
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

  const submitForm = async () => {
    if (!validator.isEmpty(name)) {
      try {
        await dispatch(addRole({ name,id }));
        notify(1, isNaN(paramId) ? "Insertion avec succès" : "Modification avec succès");
        setTimeout(() => listeRole(), 1500);
      } catch (error) {
        notify(2, "An error occurred");
      }
    }
  };

  const fetchRole = useCallback(async () => {
    console.log(id)
    var response = await dispatch(getRoleById({id}));
    var data = await (response.payload.data);
    setName(data.name);
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      fetchRole();
    }
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
                <Form className="form">
                  <Card>
                    <Card.Header>
                      <Card.Title as="h4">
                        {isNaN(paramId)
                          ? "Ajouter role"
                          : "Modifier role"}</Card.Title>
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

export default addrole;
