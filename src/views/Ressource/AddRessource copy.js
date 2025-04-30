

import React, { useCallback, useEffect, useState, useRef  } from "react";
import Select from "react-select";
import validator from "validator";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addRessource, getRessourceById } from "../../Redux/ressourceReduce";
import { getCategories } from "../../Redux/categorieReduce";
import { getEmplacements } from "../../Redux/emplacementReduce";


function AddRessource() {
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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categorie, setCategorie] = useState([]);
  const [emplacement, setEmplacement] = useState([]);
  const typeClassRef = useRef(null)
  
  const submitForm = async () => {
    if (!validator.isEmpty(name) && !validator.isEmpty(price)  && categorie && emplacement ) {
      try {
        await dispatch(addRessource({ price, name, description , categorie: categorie.categorie, emplacement: emplacement.emplacement, id  }));
        notify(1, isNaN(paramId) ? "Insertion avec succès" : "Modification avec succès");
        setTimeout(() => listeRessource(), 1500);
      } catch (error) {
        notify(2, "An error occurred");
      }
    }
  };

   const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Categorie",
      isDisabled: true,
    },
  ]);

  const [optionsEmp, setOptionsEmp] = React.useState([
    {
      value: "",
      label: "Emplacement",
      isDisabled: true,
    },
  ]);
 
   const fetchRessource = useCallback(async () => {
    var response = await dispatch(getRessourceById(id));
    var data = await (response.payload.data);
    setName(data.name);
    setPrice(data.price);
    setDescription(data.description);
    if (data.Categorie) {
      const cat = {
        value: data.Categorie.id,
        label: data.Categorie.libelle,
        categorie: data.Categorie,
      };
      setCategorie(cat);
    }
    
    if (data.Emplacement) {
      const emp = {
        value: data.Emplacement.id,
        label: data.Emplacement.libelle,
        emplacement: data.Emplacement, 
      };
      setEmplacement(emp);
    }
    
  }, [dispatch]);
 

  const fetchCategorie = useCallback(async (id) => {
    var response = await dispatch(getCategories());
    var data = await (response.payload.data);
    var arrayOption = [];
    data.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle, categorie: e });
    });
    setOptions(arrayOption);
  }, [dispatch]);

  
 const fetchEmplacement = useCallback(async (id) => {
    var response = await dispatch(getEmplacements());
    var data = await (response.payload.data);
    var arrayOption = [];
    data.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle, emplacement: e });
    });
    setOptionsEmp(arrayOption);
  }, [dispatch]); 

  useEffect(() => {
    async function fetchAll() {
      await fetchCategorie();
      await fetchEmplacement();
      if (id) {
        await fetchRessource();
      }
    }
  
    fetchAll();
  }, [id, fetchCategorie, fetchEmplacement, fetchRessource]);
  
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
                        {typeof location.id == "undefined"
                          ? "Ajouter ressource"
                          : "Modifier ressource"}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Libellé* </label>
                            <Form.Control
                              value={name}
                              placeholder="Libellé"
                              onChange={(value) => {
                                setName(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Prix* </label>
                            <Form.Control
                              value={price}
                              placeholder="Prix"
                              onChange={(value) => {
                                setPrice(value.target.value);
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                       <Col className="pl-1" md="6">
                          <Form.Group id="typeClass" ref={typeClassRef}>
                            <label>Categorie*</label>
                            <Select
                              placeholder="Sélectionner Categorie"
                              value={categorie}
                              onChange={setCategorie}
                              options={options}
                            />
                          </Form.Group>
                          </Col> 
                          <Col className="pl-1" md="6">
                          <Form.Group id="typeClass" ref={typeClassRef}>
                            <label>Emplacement*</label>
                            <Select
                            placeholder="Sélectionner Emplacement"
                            value={optionsEmp.find(opt => opt.value === emplacement?.value) || null}
                            onChange={(selectedOption) => setEmplacement(selectedOption || { value: "", label: "Sélectionner un emplacement" })}
                            options={optionsEmp}
                            getOptionLabel={(e) => e.label.toString()} 
                            getOptionValue={(e) => e.value.toString()}
                            />
                          </Form.Group>
                        </Col>
                        
                        </Row> 
                       
                       
                        <Row>
                        <Col className="pr-1" md="12">
                     <Form.Group>
                     <label>Description* </label>
                     <Form.Control
                     as="textarea" // Changer l'input en textarea
                     rows={3} // Définir le nombre de lignes (facultatif)
                     value={description}
                     placeholder="Description"
                     onChange={(value) => {
                     setDescription(value.target.value);
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

export default AddRessource;
