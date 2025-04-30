import React, { useCallback, useEffect, useState, useRef } from "react";
import Select from "react-select";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getRessourceById } from "../../Redux/ressourceReduce";
import { getCategories } from "../../Redux/categorieReduce";

function DetailRessource() {
  const dispatch = useDispatch();
  const navigate = useHistory();
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categorie, setCategorie] = useState(""); 
  const [emplacement, setEmplacement] = useState(""); 
  const typeClassRef = useRef(null);
   /* const [options, setOptions] = React.useState([
    {
      value: "",
      label: "categorie",
      isDisabled: true,
    },
  ]);  */
   const fetchCategorie = useCallback(async (id) => {
    var response = await dispatch(getCategories());
    var data = await (response.payload.data);
    var arrayOption = [];
    data.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle, categorie: e });
    });
    setOptions(arrayOption);
  }, [dispatch]);
 

  const fetchRessource = useCallback(async () => {
    var response = await dispatch(getRessourceById(id));
    var data = await (response.payload.data);
    setPrice(data.price);
    setDescription(data.description);
    setName(data.name);
    setCategorie({
      "value": data.categorie.id,
      "label": data.categorie.libelle,
      "categorie": data.categorie

    }) 
    setEmplacement({
      "value": data.emplacement.id,
      "label": data.emplacement.libelle,
      "categorie": data.emplacement

    }) 
  }, [dispatch]);

  useEffect(() => {
    fetchCategorie(id) ;
    fetchEmplacement(id) 
    if (id) {
      fetchRessource();
    }
  }, []);

  function listeRessource() {
    navigate.push('/ressource/list');
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
                  onClick={listeRessource}
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
                        {"Détail ressource"}
                          </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Libellé* </label>
                            <Form.Control
                              readOnly
                              value={name}
                           className="required"

                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Prix* </label>
                            <Form.Control
                              readOnly
                              value={price}
                               className="required"
                            
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                       <Row>
                       <Col className="pl-1" md="6">
                       <Form.Group>
                       <label>Categorie* </label>
                      <Form.Control
                      readOnly
                      defaultValue={categorie?categorie.label:""}
                      placeholder="Categorie"
                      className="required"
                      type="text"
                      ></Form.Control>
                      </Form.Group>
                       </Col>
                       <Col className="pl-1" md="6">
                       <Form.Group>
                       <label>Emplacement* </label>
                      <Form.Control
                      readOnly
                      defaultValue={emplacement?emplacement.label:""}
                      placeholder="Emplacement"
                      className="required"
                      type="text"
                      ></Form.Control>
                      </Form.Group>
                       </Col>
                        </Row> 
                     {/*  <Row>
                        <Col className="pr-1" md="12">
                     <Form.Group>
                     <label>Description* </label>
                     <Form.Control
                     as="textarea" 
                     rows={3} 
                     value={description}
                     placeholder="Description"
                     onChange={(value) => {
                     setDescription(value.target.value);
                    }}
                      />
                    </Form.Group>
                      </Col>
                        </Row> */}
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

export default DetailRessource;
