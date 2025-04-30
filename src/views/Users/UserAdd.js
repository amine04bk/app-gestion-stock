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

function AjouterUser() {
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
  const [password, setPassword] = React.useState("");
  const [id] = useState(isNaN(location.id) === false ? location.id : null);
  //required
  const [nomRequired] = React.useState(true);
  const [emailRequired] = React.useState(true);
  const [passwordRequired] = React.useState(true);

  const [role, setRole] = useState(null); // State to store selected role IDs
  const roleClassRef = useRef(null);
  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Role",
      isDisabled: true,
    },
  ]);
  async function submitForm(event) {
    event.preventDefault(); // Prevent form from submitting normally

    var required = document.getElementsByClassName("required");
    var testPassword = true;
    for (var i = 0; i < required.length; i++) {
      if (required[i] !== undefined) {
        document.getElementsByClassName("error")[i].innerHTML = "";
        required[i].style.borderColor = "#ccc";
        // condition required      
        if (validator.isEmpty(required[i].value) && required[i].name !== "Password") {
          required[i].style.borderColor = "red";
          document.getElementsByClassName("error")[i].innerHTML = required[i].name + " est obligatoire";
          notify(2, required[i].name + " doit etre non vide");
        }
        // condition email
        else if (required[i].name === "Email" && !validator.isEmail(required[i].value)) {
          notify(2, "E-mail invalide");
          document.getElementsByClassName("error")[i].innerHTML = "E-mail invalide";
        }
        // condition password
        else if ((required[i].name === "Password" && isNaN(location.id) === true) ||
          (required[i].name === "Password" && !validator.isEmpty(required[i].value) && isNaN(location.id) === false)) {
          if (!validator.isLength(required[i].value, { min: 6, max: 20 })) {
            testPassword = false;
            notify(2, "Password doit etre minimum 6 charactére");
            document.getElementsByClassName("error")[i].innerHTML = "Password doit etre minimum 6 charactére";
          }
        }
      }
    }

    if (role === null) {
      notify(2, "Il faut séléctionez un role");
    }
    if (!validator.isEmpty(username) && validator.isEmail(email) && testPassword === true && role) {
      dispatch(addUser({
        username,
        email,
        password,
        role: role.role,
        id,
        //etat
      })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          if (isNaN(location.id) === true)
            notify(1, "Insertion avec succes")
          else
            notify(1, "Modifier avec succes");
          setTimeout(async () => {
            listeUser();
          }, 1500);
          // You can add additional logic here, such as redirecting the user or clearing the form
        } else if (action.meta.requestStatus === 'rejected') {
          // Handle the error message

          notify(2, action.payload.message || 'Une erreur est survenue');
        }
      });
    }
  }

  const fetchRole = useCallback(async (id) => {
    var response = await dispatch(getRoles());
    var data = await (response.payload.data);
    var arrayOption = [];
    data.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.name, role: e });
    });
    setOptions(arrayOption);
  }, [dispatch]);

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
    fetchRole(id);
    if (id) {
      fetchUser();
    }
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
                          {typeof location.id == "undefined"
                            ? "Ajouter utilisateur"
                            : "Modifier utilisateur"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom et Prenom* </label>
                            <Form.Control
                              defaultValue={username}
                              placeholder="username"
                              name="username"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setUsername(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                          {nomRequired ? null : (
                            <label className="error">
                              Nom est obligatoire.
                            </label>
                          )}
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>E-mail* </label>
                            <Form.Control
                              defaultValue={email}
                              placeholder="E-mail"
                              name="Email"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setEmail(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                          {emailRequired ? null : (
                            <label className="error">
                              Email est obligatoire.
                            </label>
                          )}
                        </Col>



                      </Row> 

                      <Row>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Password* </label>
                            <Form.Control
                              defaultValue={password}
                              placeholder="Password"
                              className="required"
                              name="Password"
                              type="password"
                              onChange={(value) => {
                                setPassword(value.target.value);
                              }}
                            ></Form.Control>
                            <div className="error"></div>
                            {passwordRequired ? null : (
                              <label className="error">
                                Password est obligatoire.
                              </label>
                            )}
                          </Form.Group>
                        </Col>

                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass" ref={roleClassRef}>
                            <label>Role* </label>
                            <Select
                              placeholder="Sélectionner un rôle"
                              value={role}

                              onChange={(value) => {
                                setRole(value);
                              }}
                              options={options}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
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

export default AjouterUser;
