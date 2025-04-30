import React, { useEffect, useState, useCallback, useRef } from "react";
import Select from "react-select";
import validator from "validator";
// react-bootstrap componentslogin
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  addUser,
  getUserById,
} from "../../Redux/usersReduce";
import { getRoles } from "../../Redux/roleReduce";

function UserDetail() {
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(<strong><i className="fas fa-check-circle"></i>{msg}</strong>);
    else
      toast.error(<strong><i className="fas fa-exclamation-circle"></i>{msg}</strong>);
  }
  const dispatch = useDispatch();
  const navigate = useHistory();
  var token = localStorage.getItem("x-access-token");
  const location = useParams();
  //input
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState(""); 
  const [id] = useState(isNaN(location.id) === false ? location.id : null); 

  const [role, setRole] = useState(null); // State to store selected role IDs  

  const fetchUser = useCallback(async () => {
    var response = await dispatch(getUserById(id));
    var data = await (response.payload.data);
    setEmail(data.email);
    setUsername(data.username);
    setRole({
      "value": data.role.id,
      "label": data.role.name,
      "role": data.role
    }) 
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, []);

  function listeUser() {
    navigate.push('/user/list');
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
                  onClick={listeUser}
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
                          Détail utilisateur
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom et Prenom* </label>
                            <Form.Control
                              readOnly
                              defaultValue={username}
                              placeholder="username"
                              name="username"
                              className="required"
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                         
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>E-mail* </label>
                            <Form.Control
                              readOnly
                              defaultValue={email}
                              placeholder="E-mail"
                              name="Email"
                              className="required"
                              type="text"
                           
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                      </Row>

                      <Row>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Role* </label>
                            <Form.Control
                              readOnly
                              defaultValue={role?role.label:""}
                              placeholder="Role"
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

export default UserDetail;
