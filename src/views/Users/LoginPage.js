import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

// react-bootstrap components
import { Button, Card, Form, Container, Col, Row } from "react-bootstrap";
import backgroundImage from "../../assets/img/login-bg.jpg";
import { useDispatch } from "react-redux";
import { loginFetch, addUser } from "../../Redux/usersReduce";
import validator from "validator";
import Select from "react-select";
import { getRoles } from "../../Redux/roleReduce";

function LoginPage() {
  const dispatch = useDispatch();
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
  };
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i className="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else if (type === 2)
      toast.error(
        <strong>
          <i className="fas fa-exclamation-circle"></i>
          {msg}
        </strong>
      );
    else if (type === 3)
      toast.warn(
        <strong>
          <i className="fa-solid fa-triangle-exclamation"></i>
          {msg}
        </strong>
      );
  };

  const [cardClasses, setCardClasses] = useState("card-hidden");

  const [role, setRole] = useState(null); // State to store selected role IDs
  const roleClassRef = useRef(null);
  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Role",
      isDisabled: true,
    },
  ]);
  const id = null;
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [testLogin, setTestLogin] = useState(0);
  useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 1000);
  });
  function loginChange(event) {
    setEmail(event.target.value);
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }
  function enterKeyPressed(event) {
    if (event.charCode === 13) {
      submitForm();
      return true;
    } else {
      return false;
    }
  }

  async function submitForm(event) {
    /* window.location.replace("/formulaires/list"); */
    dispatch(loginFetch({ email: email, password: password })).then((val) => {
      try {
        var data = val.payload.data;
        var status = val.payload.status;
        if (status === 200) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("email", data.email);
          localStorage.setItem("id", data.id);
          localStorage.setItem("roles", data.roles);
          localStorage.setItem("dateExpiration", data.dateExpiration);
          if (parseInt(data.roles[0]) === 3) {
            window.location.replace("/profile");
          } else {
            window.location.replace("/user/list");
          }
          /* const result = roles.filter(obj => obj.name === "ROLE_ADMIN_USER");
          if (result.length === 0) {
            notify(3, "Login failure");
          } else {
            setTimeout(async () => {
              localStorage.setItem("x-access-token", accessToken);
              localStorage.setItem("refreshToken", refreshToken);
              window.location.replace("/profile");
            }, 1000);
          } */
        } else {
          notify(2, "Please check your email and password and try again");
        }
      } catch (error) {
        notify(3, "Problem connection");
      }
    });
  }
  async function submitFormInscription(event) {
    /* console.log(password, login,nom,tel,email,prenom); */

    var required = document.getElementsByClassName("required");
    var testPassword = true;
    for (var i = 0; i < required.length + 1; i++) {
      if (required[i] !== undefined) {
        document.getElementsByClassName("error")[i].innerHTML = "";
        required[i].style.borderColor = "#ccc";
        //condition required
        if (
          validator.isEmpty(required[i].value) &&
          required[i].name !== "Password"
        ) {
          required[i].style.borderColor = "red";
          document.getElementsByClassName("error")[i].innerHTML =
            required[i].name + " est obligatoire";
          notify(2, required[i].name + " est obligatoire");
        }
        //condition email
        else if (
          required[i].name === "Email" &&
          !validator.isEmail(required[i].value)
        ) {
          notify(2, "E-mail invalide");
          document.getElementsByClassName("error")[i].innerHTML =
            "E-mail invalide";
        }
        //condition password
        else if (
          (required[i].name === "Password" && isNaN(location.id) === true) ||
          (required[i].name === "Password" &&
            !validator.isEmpty(required[i].value) &&
            isNaN(location.id) === false)
        ) {
          if (!validator.isLength(required[i].value, { min: 6, max: 20 })) {
            testPassword = false;
            notify(2, "Password doit etre minimum 6 charactére");
            document.getElementsByClassName("error")[i].innerHTML =
              "Password doit etre minimum 6 charactére";
          }
        }
      }
    }

    if (role === null) {
      notify(2, "Il faut séléctionez un role");
    }
    if (!validator.isEmpty(username) && validator.isEmail(email) && role) {
      dispatch(
        addUser({
          username,
          email,
          password,
          role: role.role,
          id,
        })
      ).then((data) => {
        if (data.payload) {
          notify(1, "Insertion avec succes");
          setTimeout(async () => {
            submitForm();
          }, 1500);
        } else {
          notify(2, "Problème de connexion");
        }
      });
    }
  }

  const fetchRole = useCallback(async () => {
    var response = await dispatch(getRoles());
    var data = await response.payload.data;
    var arrayOption = [];
    data.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.name, role: e });
    });
    setOptions(arrayOption);
  }, [dispatch]);

  useEffect(() => {
    fetchRole();
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="full-page">
        <div
          className="content login-page full-gray section-image"
          data-color="black"
        >
          <Container>
            {testLogin === 0 ? (
              <div className="block-log">
                <Row>
                  <Col className="mx-auto" lg="4" md="8" sm="10" xs="8">
                    <Form
                      action=""
                      className="form"
                      method=""
                      onSubmit={submitForm}
                    >
                      <Card className={"card-login " + cardClasses}>
                        <Card.Header>
                          <h3 className="header text-center">Login</h3>
                          <br></br>
                          <p className="header text-center">
                            Log in to access your space
                          </p>
                        </Card.Header>
                        <Card.Body>
                          <Form.Group>
                            <label>Login</label>
                            {/* <button onClick={notify}>Notify!</button> */}
                            <Form.Control
                              onKeyPress={enterKeyPressed}
                              placeholder="Login"
                              type="text"
                              onChange={loginChange}
                            ></Form.Control>
                          </Form.Group>
                          <Form.Group>
                            <label>Password</label>
                            <Form.Control
                              placeholder="Password"
                              onKeyPress={enterKeyPressed}
                              onChange={passwordChange}
                              type="password"
                            ></Form.Control>
                          </Form.Group>
                        </Card.Body>
                        <Card.Footer className="ml-auto mr-auto">
                          <Button
                            className="btn-wd"
                            type="button"
                            variant="success"
                            onClick={submitForm}
                            /* style={{ float: 'left' }} */
                          >
                            Connexion
                          </Button>
                          <div className="span-login">
                            Vous n'avez pas de compte ?
                            <a
                              onClick={() => {
                                setTestLogin(1);
                                setEmail("");
                                setPassword("");
                              }}
                            >
                              S'inscrire
                            </a>
                          </div>
                          {/* <Button
                          className="btn-wd"
                          type="button"
                          variant="info"
                          onClick={() => {
                            setTestLogin(1);
                            setLogin("");
                            setPassword("");
                          }}
                          style={{ float: 'right' }}
                        >
                          S'inscrire
                        </Button> */}
                        </Card.Footer>
                      </Card>
                    </Form>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="block-log">
                <Row>
                  <Col className="mx-auto" lg="4" md="8" sm="10" xs="8">
                    <Form
                      action=""
                      className="form"
                      method=""
                      onSubmit={submitFormInscription}
                    >
                      <Card className={"card-login " + cardClasses}>
                        <Card.Header>
                          <h3 className="header text-center">S'inscrire</h3>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col className="pr-1" md="12">
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

                                <div className="error"></div>
                              </Form.Group>
                            </Col>
                            <Col className="pr-1" md="12">
                              <Form.Group>
                                <label>E-mail* </label>
                                <Form.Control
                                  defaultValue={email}
                                  placeholder="E-mail"
                                  name="Email"
                                  className="required"
                                  type="text"
                                  onChange={(value) => {
                                    setEmail(event.target.value);
                                  }}
                                ></Form.Control>

                                <div className="error"></div>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col className="pl-1" md="12">
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
                              </Form.Group>

                              <div className="error"></div>
                            </Col>
                            <Col className="pl-1" md="12">
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
                        </Card.Body>
                        <Card.Footer className="ml-auto mr-auto">
                          <Button
                            className="btn-wd"
                            type="button"
                            variant="success"
                            onClick={submitFormInscription}
                            /* style={{ float: 'left' }} */
                          >
                            Enregistrer
                          </Button>
                          <div className="span-login">
                            Vous avez déjà un compte ?
                            <a
                              onClick={() => {
                                setTestLogin(0);
                                setEmail("");
                                setPassword("");
                              }}
                            >
                              se connecter
                            </a>
                          </div>
                          {/* <Button
                          className="btn-wd"
                          type="button"
                          variant="info"
                          onClick={() => {
                            setTestLogin(0);
                            setLogin("");
                            setPassword("");
                          }}
                          style={{ float: 'right' }}
                        >
                          Login
                        </Button> */}
                        </Card.Footer>
                      </Card>
                    </Form>
                  </Col>
                </Row>
              </div>
            )}
          </Container>
        </div>
        <div className="full-page-background" style={divStyle}></div>
      </div>
    </>
  );
}

export default LoginPage;
