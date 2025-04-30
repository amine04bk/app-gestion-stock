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
  addFactureWithLigneFactures,
  updateFactureWithLigneFactures,
  getFactureWithLigneFactures,
} from "../../Redux/factureReduce";
import { getFournisseurs } from "../../Redux/fournisseurReduce";
import { getRessources } from "../../Redux/ressourceReduce";
import {
  getCommandes,
  getCommandeWithLigneCommandes,
} from "../../Redux/commandeReduce";
import jspdf from "jspdf";
import html2canvas from "html2canvas";

function AddFacture() {
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
  const id = !isNaN(paramId) ? Number(paramId) : null;

  const [ligneFactures, setLigneFactures] = useState([
    { ressourceId: "", ressourceName: "", qte: 0, mnt: 0, pu: 0 },
  ]);
  const [num, setNum] = useState("");
  const [ressources, setRessources] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [commande, setCommande] = useState(null);
  const [mntTotalHT, setMntTotalHT] = useState(0);
  const [mntTotalTVA, setMntTotalTVA] = useState(0);
  const [mntTotalTTC, setMntTotalTTC] = useState(0);
  const [typeFacture] = useState(1);

  const calculateTotals = useCallback((updatedLigneFactures) => {
    let totalHT = updatedLigneFactures.reduce((total, lf) => total + lf.mnt, 0);
    const tva = totalHT * 0.19;
    setMntTotalHT(totalHT);
    setMntTotalTVA(tva);
    setMntTotalTTC(totalHT + tva);
  }, []);

  // Fetch fournisseurs, ressources, and commandes on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fournisseurRes, ressourceRes, commandeRes] = await Promise.all([
          dispatch(getFournisseurs()),
          dispatch(getRessources()),
          dispatch(getCommandes()),
        ]);
        setFournisseurs(fournisseurRes.payload?.data || []);
        setRessources(ressourceRes.payload?.data || []);
        setCommandes(commandeRes.payload?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        notify(2, "Error loading data");
      }
    };
    fetchData();
  }, [dispatch]);

  // Fetch facture with ligneFactures when editing
  useEffect(() => {
    if (id) {
      const fetchFacture = async () => {
        try {
          const response = await dispatch(getFactureWithLigneFactures(id));
          const {
            num,
            date,
            fournisseur,
            commandeId,
            commandeName,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC,
          } = response.payload;

          setNum(num || "");
          setDate(date || dateString);

          setFournisseur(
            fournisseur
              ? {
                  value: fournisseur.id,
                  label: fournisseur.name,
                  fournisseur: fournisseur,
                }
              : null
          );

          setCommande(
            commandeId
              ? {
                  value: commandeId,
                  label: commandeName,
                  commande: { id: commandeId, num: commandeName },
                }
              : null
          );

          // Set totals from the facture payload
          setMntTotalHT(mntTotalHT || 0);
          setMntTotalTVA(mntTotalTVA || 0);
          setMntTotalTTC(mntTotalTTC || 0);

          // Fetch ligneCommandes data using commandeId
          if (commandeId) {
            await fetchCommandeDetails(commandeId);
          }
        } catch (error) {
          console.error("Error fetching facture:", error);
          notify(2, "Error loading facture data");
        }
      };
      fetchFacture();
    }
  }, [id, dispatch, ressources]);

  // Only calculate totals when ligneFactures changes and we're not editing (id is null)
  useEffect(() => {
    if (!id) {
      calculateTotals(ligneFactures);
    }
  }, [id, calculateTotals, ligneFactures]);

  const submitForm = async () => {
    if (!fournisseur) {
      notify(2, "Il faut sélectionner un fournisseur");
      return;
    }

    if (!commande) {
      notify(2, "Il faut sélectionner une commande");
      return;
    }

    if (validator.isEmpty(num)) {
      notify(2, "Le numéro est obligatoire");
      return;
    }

    if (ligneFactures.some((lf) => !lf.ressourceId || lf.qte <= 0)) {
      notify(2, "Veuillez vérifier les lignes de facture");
      return;
    }

    try {
      const action = !id
        ? addFactureWithLigneFactures({
            fournisseur: fournisseur.fournisseur,
            commande: commande.commande,
            num,
            date,
            ligneFactures,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC,
            typeFacture,
          })
        : updateFactureWithLigneFactures({
            id,
            fournisseur: fournisseur.fournisseur,
            commande: commande.commande,
            num,
            date,
            ligneFactures,
            mntTotalHT,
            mntTotalTVA,
            mntTotalTTC,
            typeFacture,
          });

      await dispatch(action);
      notify(1, !id ? "Insertion avec succès" : "Mise à jour avec succès");
      setTimeout(() => navigate.push("/facture/list"), 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      notify(2, "Une erreur est survenue");
    }
  };

  const handleLigneFactureChange = (index, field, value) => {
    const newLigneFactures = ligneFactures.map((ligneFacture, i) => {
      if (i === index) {
        if (field === "ressourceId") {
          const selectedRess = ressources.find((p) => p.id === value);
          const pu = selectedRess?.price || ligneFacture.pu;
          const mnt = pu * ligneFacture.qte;
          const ressourceName = selectedRess?.name || ligneFacture.ressourceName;

          return { ...ligneFacture, [field]: value, pu, mnt, ressourceName };
        } else if (field === "pu") {
          const qte = ligneFacture.qte;
          const mnt = qte * Number(value);
          return { ...ligneFacture, [field]: Number(value), mnt };
        } else if (field === "qte") {
          const pu = ligneFacture.pu;
          const mnt = pu * Number(value);
          return { ...ligneFacture, [field]: Number(value), mnt };
        }
      }
      return ligneFacture;
    });

    setLigneFactures(newLigneFactures);
    if (!id) {
      calculateTotals(newLigneFactures);
    }
  };

  function exportPdf() {
    const input1 = document.getElementById("capture");
    if (!input1) {
      console.error("Element with id 'capture' not found");
      return;
    }

    html2canvas(input1, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jspdf("p", "mm", "a4");
      const date1 = new Date();
      const date = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Facture ${date}.pdf`);
    });
  }

  const fetchCommandeDetails = async (commandeId) => {
    try {
      const response = await dispatch(getCommandeWithLigneCommandes(commandeId));
      const commandeData = response.payload;

      const updatedLigneFactures = commandeData.ligneCommandes.map((lc) => {
        const matchingRessource = ressources.find(
          (ressource) => ressource.id === lc.produitId
        );

        return {
          ressourceId: lc.produitId,
          ressourceName: matchingRessource ? matchingRessource.name : "Unknown",
          qte: lc.qte,
          pu: lc.pu || 0,
          mnt: (lc.pu || 0) * lc.qte,
        };
      });

      setLigneFactures(updatedLigneFactures);
      if (!id) {
        calculateTotals(updatedLigneFactures);

        // Automatically set fournisseur based on the selected commande
        if (commandeData.fournisseur) {
          setFournisseur({
            value: commandeData.fournisseur.id,
            label: commandeData.fournisseur.name,
            fournisseur: commandeData.fournisseur,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching commande details:", error);
      notify(2, "Error loading commande details");
    }
  };

  const handleCommandeChange = (selectedOption) => {
    setCommande(selectedOption);
    if (selectedOption) {
      fetchCommandeDetails(selectedOption.value);
    } else {
      setLigneFactures([{ ressourceId: "", ressourceName: "", qte: 0, mnt: 0, pu: 0 }]);
      setFournisseur(null); // Reset fournisseur when commande is cleared
      if (!id) {
        calculateTotals([{ ressourceId: "", ressourceName: "", qte: 0, mnt: 0, pu: 0 }]);
      }
    }
  };

  // Custom styles for the Commande Select to color options based on confirmation
  const commandeSelectStyles = {
    option: (provided, state) => {
      const commande = commandes.find((c) => c.id === state.data.value);
      const isConfirmed = commande?.confirmation === 1;
      return {
        ...provided,
        color: isConfirmed ? "green" : "red",
      };
    },
  };

  return (
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
                onClick={() => navigate.push("/facture/list")}
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
                      {!id ? "Ajouter Facture" : "Modifier Facture"}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md="12">
                        {/* Removed export PDF button as it wasn't in the original UI */}
                      </Col>
                    </Row>
                    <div id="capture">
                      <Row>
                        <Col md="6">
                          <Form.Group>
                            <label>Numéro* </label>
                            <Form.Control
                              value={num}
                              placeholder="num"
                              onChange={(e) => setNum(e.target.value)}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>Date Création* </label>
                            <Form.Control
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <Form.Group>
                            <label>Fournisseur* </label>
                            <Select
                              value={fournisseur}
                              options={fournisseurs.map((c) => ({
                                value: c.id,
                                label: c.name,
                                fournisseur: c,
                              }))}
                              onChange={setFournisseur}
                              isClearable
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>Commande Confirmée* </label>
                            <Select
                              value={commande}
                              options={commandes.map((c) => ({
                                value: c.id,
                                label: c.num,
                                commande: c,
                              }))}
                              onChange={handleCommandeChange}
                              isClearable
                              required
                              styles={commandeSelectStyles} // Apply custom styles for coloring
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Ressource</th>
                            <th>PU</th>
                            <th>Quantity</th>
                            <th>Montant total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ligneFactures.map((ligneFacture, index) => (
                            <tr key={index}>
                              <td>
                                <Form.Control
                                  readOnly
                                  value={ligneFacture.ressourceName || ""}
                                  placeholder="ressourceName"
                                  type="text"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  readOnly
                                  value={ligneFacture.pu || 0}
                                  placeholder="pu"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  readOnly
                                  value={ligneFacture.qte || 0}
                                  placeholder="qte"
                                  type="number"
                                  min="0"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  readOnly
                                  value={(ligneFacture.mnt || 0).toFixed(2)}
                                  placeholder="montant"
                                  type="number"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Row>
                        <Col md="4">
                          <Form.Group>
                            <label>Total HT</label>
                            <Form.Control
                              value={mntTotalHT.toFixed(2)}
                              placeholder="Total HT"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group>
                            <label>Total TVA</label>
                            <Form.Control
                              value={mntTotalTVA.toFixed(2)}
                              placeholder="Total TVA"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Form.Group>
                            <label>Total TTC</label>
                            <Form.Control
                              value={mntTotalTTC.toFixed(2)}
                              placeholder="Total TTC"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      className="btn-wd btn-outline mr-1 float-left"
                      variant="info"
                      onClick={submitForm}
                    >
                      {!id ? "Enregistrer" : "Modifier"}
                    </Button>
                  </Card.Footer>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
}

export default AddFacture;