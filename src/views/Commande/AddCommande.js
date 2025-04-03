import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import validator from "validator";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  addCommandeWithLigneCommandes,
  updateCommandeWithLigneCommandes,
  getCommandeWithLigneCommandes,
} from "../../Redux/commandeReduce";
import { getRessources } from "../../Redux/ressourceReduce";
import { getFournisseurs } from "../../Redux/fournisseurReduce";
import { getProjets } from "../../Redux/emplacementReduce";

function AddCommande() {
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

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  const [date, setDate] = useState(dateString);

  const dispatch = useDispatch();
  const navigate = useHistory();
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;

  const [productLines, setProductLines] = useState([]);
  const [projectLines, setProjectLines] = useState([]);
  const [num, setNum] = useState("");
  const [ressources, setRessources] = useState([]);
 /*  const [projects, setProjects] = useState([]); */
  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);
  const [mntTotalHT, setMntTotalHT] = useState(0);
  const [mntTotalTVA, setMntTotalTVA] = useState(0);
  const [mntTotalTTC, setMntTotalTTC] = useState(0);
  const [typeCommande] = useState(1);

  const calculateTotals = useCallback(() => {
    let totalHT = productLines.reduce((total, lf) => total + lf.mnt, 0);
    totalHT += projectLines.reduce((total, lf) => total + lf.mnt, 0);
    const tva = totalHT * 0.19;
    setMntTotalHT(totalHT);
    setMntTotalTVA(tva);
    setMntTotalTTC(totalHT + tva);
  }, [productLines, projectLines]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [fournisseurRes, ressourceRes] = await Promise.all([
                dispatch(getFournisseurs()),
                dispatch(getRessources()),
                /* dispatch(getProjets()), */
            ]);

            console.log("Fournisseurs chargés :", fournisseurRes.payload.data);
            console.log("Ressources chargées :", ressourceRes.payload.data);
            /* console.log("Projets chargés :", projectRes.payload.data); */

            setFournisseurs(fournisseurRes.payload.data);
            setRessources(ressourceRes.payload.data);
            /* setProjects(projectRes.payload.data); */
        } catch (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    };

    fetchData();
}, [dispatch]);

  useEffect(() => {
    if (id) {
      const fetchCommande = async () => {
        const response = await dispatch(getCommandeWithLigneCommandes(id));
        const { num, date, ligneCommandes, fournisseur } = response.payload;
        setNum(num);
        setDate(date);
        setFournisseur({
          value: fournisseur.id,
          label: fournisseur.name,
          fournisseur: fournisseur,
        });

        setProductLines(
          ligneCommandes
            .filter((lf) => lf.ressourceId)
            .map((lf) => ({
              ressourceId: lf.ressourceId,
              qte: lf.qte,
              pu: lf.pu,
              mnt: lf.pu * lf.qte,
            }))
        );

      /*   setProjectLines(
          ligneCommandes
            .filter((lf) => lf.projectId)
            .map((lf) => ({
              projetId: lf.projectId,
              pu: lf.pu,
              qte: lf.qte,
              mnt: lf.pu * lf.qte,
            }))
        );*/
      }; 
      fetchCommande();
    }
  }, [id, dispatch]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Function to handle product line changes
  const handleProductLineChange = (index, field, value) => {
    const newProductLines = productLines.map((line, i) => {
      if (i === index) {
        const updatedLine = { ...line, [field]: value };
  
        // When the resource is selected, ensure produit contains the correct object
        if (field === "ressourceId") {
          const selectedProduct = ressources.find((p) => p.id === value);
          updatedLine.pu = selectedProduct ? parseFloat(selectedProduct.price) : 0;
          updatedLine.produit = selectedProduct ? { id: selectedProduct.id } : null; // Ensure produit is an object
        }
  
        updatedLine.mnt = updatedLine.pu * updatedLine.qte;
        return updatedLine;
      }
      return line;
    });
  
    setProductLines(newProductLines);
    calculateTotals();
  };
  
  
  

  // Function to handle project line changes
 /*  const handleProjectLineChange = (index, field, value) => {
    const newProjectLines = projectLines.map((line, i) => {
      if (i === index) {
        const updatedLine = { ...line, [field]: value };

        // Automatically set pu when a project is selected
        if (field === "projetId") {
          const selectedProject = projects.find((p) => p.id === value);
          updatedLine.pu = selectedProject ? selectedProject.price : 0; // Use the pu from the selected project
        }

        updatedLine.mnt = updatedLine.pu * updatedLine.qte; // Calculate the amount
        return updatedLine;
      }
      return line;
    });
    setProjectLines(newProjectLines);
    calculateTotals();
  }; */

  const handleAddProductLine = () => {
    setProductLines([
      ...productLines,
      { ressourceId: "", qte: 0, mnt: 0, pu: 0 },
    ]);
  };

 /*  const handleAddProjectLine = () => {
    setProjectLines([...projectLines, { projetId: "", pu: 0, qte: 0, mnt: 0 }]);
  }; */

  const handleRemoveProductLine = (index) => {
    const newProductLines = productLines.filter((_, i) => i !== index);
    setProductLines(newProductLines);
    calculateTotals();
  };

 /*  const handleRemoveProjectLine = (index) => {
    const newProjectLines = projectLines.filter((_, i) => i !== index);
    setProjectLines(newProjectLines);
    calculateTotals();
  }; */

  const submitForm = async () => {
    // Validate form
    if (validator.isEmpty(num)) {
      notify(2, "Numéro de commande est obligatoire");
      return;
    }
    if (!fournisseur) {
      notify(2, "Fournisseur est obligatoire");
      return;
    }

    const ligneCommandes = [
      ...productLines.map((line) => ({
        produit: line.ressourceId,
        qte: line.qte,
        pu: line.pu,
        mnt: line.mnt,
      })),
      ...projectLines.map((line) => ({
       /*  projetId: line.projetId, */
        qte: line.qte,
        pu: line.pu,
        mnt: line.mnt,
      })),
    ];

    if (ligneCommandes.length === 0) {
      notify(2, "Au moins une ligne de ressource");
      return;
    }

    try {
      console.log(id);
      
      if (id) {
        const commande = {
          id,
          fournisseur: fournisseur.fournisseur,
          num,
          date,
          ligneCommandes,
          mntTotalHT,
          mntTotalTVA,
          mntTotalTTC
        };
        await dispatch(updateCommandeWithLigneCommandes(commande));

        notify(1, "Commande mise à jour avec succès");
        setTimeout(() => navigate.push("/commande/list"), 1500);
      } else {
        
        const commande = {
          fournisseur: fournisseur.fournisseur,
          num,
          date,
          ligneCommandes,
          mntTotalHT,
          mntTotalTVA,
          mntTotalTTC,
          typeCommande,
        };
        
        await dispatch(addCommandeWithLigneCommandes(commande));
        notify(1, "Commande ajoutée avec succès");
        setTimeout(() => navigate.push("/commande/list"), 1500);
      }
    } catch (error) {
      notify(2, "Erreur lors de l'enregistrement de la commande");
    }
  };

  return (
    <Container fluid>
      <ToastContainer />
      <Row>
        <Col md="12">
          <Button
            className="btn-wd btn-outline mr-1 float-left"
            type="button"
            variant="info"
            onClick={() => navigate.push("/commande/list")}
          >
            <span className="btn-label">
              <i className="fas fa-list"></i>
            </span>
            Retour à la liste
          </Button>
        </Col>
      </Row>
      <Form className="form">
        <Card>
          <Card.Header>
            <Card.Title as="h4">
              {isNaN(paramId) ? "Ajouter commande" : "Modifier commande"}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md="6">
                <Form.Group>
                  <label>Numéro* </label>
                  <Form.Control
                    value={num}
                    placeholder="num"
                    onChange={(e) => setNum(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group>
                  <label>Date Création* </label>
                  <Form.Control
                    readOnly
                    value={date}
                    placeholder="date"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group>
                  <label>Fournisseur* </label>
                  <Select
                    placeholder="Fournisseur"
                    value={fournisseur}
                    options={fournisseurs.map((fournisseur) => ({
                      label: fournisseur.name,
                      value: fournisseur.id,
                      fournisseur: fournisseur,
                    }))}
                    onChange={(e) => setFournisseur(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br></br>
            {/* Product Lines */}
            <Row>
              <Col md="12">
                <Button
                  variant="success"
                  onClick={handleAddProductLine}
                  className="mb-3"
                >
                  Ajouter ressource
                </Button>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Ressource</th>
                      <th>Quantité</th>
                      <th>Prix Unitaire</th>
                      <th>Montant</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productLines.map((line, index) => (
                      <tr key={index}>
                        <td>
                          <Select
                            placeholder="ressource"
                            value={ressources
                              .map((p) => ({
                                label: p.name,
                                value: p.id,
                              }))
                              .find((p) => p.value === line.ressourceId)}
                            options={ressources.map((ressource) => ({
                              label: ressource.name,
                              value: ressource.id,
                            }))}
                            onChange={(e) =>
                              handleProductLineChange(
                                index,
                                "ressourceId",
                                e.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={line.qte}
                            type="number"
                            onChange={(e) =>
                              handleProductLineChange(
                                index,
                                "qte",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            value={line.pu}
                            type="number"
                            onChange={(e) =>
                              handleProductLineChange(
                                index,
                                "pu",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>{line.mnt}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveProductLine(index)}
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            {/* Project Lines */}
            <Row>
              <Col md="12">
              </Col>
            </Row>

          </Card.Body>
          <Card.Footer>
            <Button
              className="btn-wd btn-outline mr-1 float-left"
              variant="info"
              onClick={submitForm}
            >
              {isNaN(paramId) ? "Enregistrer" : "Modifier"}
            </Button>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
}

export default AddCommande;
