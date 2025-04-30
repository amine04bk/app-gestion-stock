import React, { useEffect, useState, useCallback } from "react";
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
import { ToastContainer } from "react-toastify";
import { getCommandeWithLigneCommandes } from "../../Redux/commandeReduce";
import { getRessources } from "../../Redux/ressourceReduce";
import { getFournisseurs } from "../../Redux/fournisseurReduce";


import jspdf from "jspdf";
import html2canvas from "html2canvas";

function DetailCommande() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`; // Example format: "2024-08-30"
  const [date, setDate] = useState(dateString);

  const dispatch = useDispatch();
  const navigate = useHistory();
  const { id: paramId } = useParams();
  const id = !isNaN(paramId) ? paramId : null;

  const [ligneCommandes, setLigneCommandes] = useState([
    { ressourceId: "", qte: 0, mnt: 0, pu: 0 },
  ]);
  const [num, setNum] = useState("");
  const [ressources, setRessources] = useState([]);

  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null); // State to store selected fournisseur
  const [mntTotalHT, setMntTotalHT] = useState(0);
  const [mntTotalTVA, setMntTotalTVA] = useState(0);
  const [mntTotalTTC, setMntTotalTTC] = useState(0);
  const [typeCommande] = useState(1);

  const calculateTotals = useCallback((updatedLigneCommandes) => {
    let totalHT = updatedLigneCommandes.reduce((total, lf) => total + lf.mnt, 0);
    const tva = totalHT * 0.19;
    setMntTotalHT(totalHT);
    setMntTotalTVA(tva);
    setMntTotalTTC(totalHT + tva);
  }, []);

  // Fetch fournisseurs, Ressources, and projects on component load
  useEffect(() => {
    const fetchData = async () => {
      const [frsRes, ressourceRes] = await Promise.all([
        dispatch(getFournisseurs()),
        dispatch(getRessources()),
     
      ]);
      setFournisseurs(frsRes.payload.data);
      setRessources(ressourceRes.payload.data);
 
    };
    fetchData();
  }, [dispatch]);

  // Fetch commande with ligneCommandes when editing
  useEffect(() => {
    if (id) {
      const fetchCommande = async () => {
        const response = await dispatch(getCommandeWithLigneCommandes(id));
        const { num, date, ligneCommandes, fournisseur } = response.payload;
        setNum(num);
        setDate(date);
        setFournisseur(fournisseur.name);
        setLigneCommandes(
          ligneCommandes.map((lf) => ({
            ressourceId: lf.ressourceId ? lf.ressourceId : "",
            qte: lf.qte,
            pu: lf.pu,
            mnt: lf.pu * lf.qte,
          }))
        );
      };
      fetchCommande();
    }
  }, [id, dispatch]);

  useEffect(() => {
    calculateTotals(ligneCommandes);
  }, [calculateTotals, ligneCommandes]);

  function exportPdf() {
    var input1 = document.getElementById("capture");
    html2canvas(input1, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jspdf("p", "mm", "a4");
      var date1 = new Date();
      var date = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Commande " + date + ".pdf");
    });
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
                  onClick={() => navigate.push("/commande/list")}
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
                    {/* <Card.Header>
                      <Card.Title as="h4">{"Détail Commande"}</Card.Title>
                    </Card.Header> */}
                    <Card.Body>
                      <Row>
                        <Col md="12">
                          <Button
                            className="btn-wd btn-outline mr-1 float-end"
                            type="button"
                            variant="success"
                            onClick={exportPdf}
                          >
                            <span className="btn-label">
                              <i class="fa-solid fa-file-pdf"></i>
                            </span>
                            Export PDF
                          </Button>
                        </Col>
                      </Row>
                      <div id="capture">
                        <h4>{"Détail Commande"}</h4>
                        <Row>
                          <Col md="4">
                            <Form.Group>
                              <label>Numéro* </label>
                              <Form.Control
                                value={num}
                                placeholder="num"
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col md="4">
                            <Form.Group>
                              <label>Date Création* </label>
                              <Form.Control
                                readOnly
                                value={date}
                                placeholder="date"
                              />
                            </Form.Group>
                          </Col>
                          <Col md="4">
                            <Form.Group>
                              <label>fournisseur* </label>
                              <Form.Control
                                readOnly
                                value={fournisseur}
                                placeholder="date"
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
                            {ligneCommandes.map((ligneCommandes, index) => (
                              <tr key={index}>
                                <td>
                                  {
                                    ressources.find(
                                      (p) => p.id === ligneCommandes.ressourceId
                                    )?.name
                                  }
                                </td>
                               {/*  <td>
                                  {
                                    projects.find(
                                      (p) => p.id === ligneCommande.projetId
                                    )?.libelle
                                  }
                                </td> */}
                                <td>{ligneCommandes.pu}</td>
                                <td>{ligneCommandes.qte}</td>
                                <td>{ligneCommandes.mnt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                       
                      </div>
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

export default DetailCommande;
