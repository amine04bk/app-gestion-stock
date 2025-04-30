import React, { useEffect, useState } from "react";
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
import { getRessources } from "../../Redux/ressourceReduce";
import { getFournisseurs } from "../../Redux/fournisseurReduce";
import jspdf from "jspdf";
import html2canvas from "html2canvas";

function DetailFacture() {
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

  const [ligneFactures, setLigneFactures] = useState([
    { ressourceId: "", ressourceName: "", qte: 0, mnt: 0, pu: 0 },
  ]);
  const [num, setNum] = useState("");
  const [ressources, setRessources] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);
  const [mntTotalHT, setMntTotalHT] = useState(0);
  const [mntTotalTVA, setMntTotalTVA] = useState(0);
  const [mntTotalTTC, setMntTotalTTC] = useState(0);
  const [typeFacture] = useState(1);

  // Fetch fournisseurs and ressources
  useEffect(() => {
    const fetchData = async () => {
      const [fournisseurRes, ressourceRes] = await Promise.all([
        dispatch(getFournisseurs()),
        dispatch(getRessources()),
      ]);
      setFournisseurs(fournisseurRes.payload?.data || []);
      setRessources(ressourceRes.payload?.data || []);
    };
    fetchData();
  }, [dispatch]);

  // Fetch facture with ligneFactures when viewing details
  useEffect(() => {
    if (id) {
      const fetchFacture = async () => {
        try {
          const response = await dispatch(getFactureWithLigneFactures(id));
          console.log(response);
          const { num, date, ligneFactures, fournisseur, mntTotalHT, mntTotalTVA, mntTotalTTC } = response.payload;

          setNum(num);
          setDate(date);
          setMntTotalHT(mntTotalHT || 0);
          setMntTotalTVA(mntTotalTVA || 0);
          setMntTotalTTC(mntTotalTTC || 0);

          setFournisseur({
            value: fournisseur.id,
            label: fournisseur.name,
            fournisseur: fournisseur,
          });

          const updatedLigneFactures = ligneFactures.map((lf) => {
            const matchingRessource = ressources.find(
              (ressource) => ressource.id === lf.ressourceId
            );
            return {
              ressourceId: lf.ressourceId || "",
              ressourceName: matchingRessource ? matchingRessource.name : "Unknown",
              qte: lf.qte || 0,
              pu: lf.pu || 0,
              mnt: lf.mnt || (lf.pu || 0) * (lf.qte || 0),
            };
          });

          setLigneFactures(updatedLigneFactures);
        } catch (error) {
          console.error("Error fetching facture:", error);
          toast.error("Error loading facture data");
        }
      };
      fetchFacture();
    }
  }, [id, dispatch, ressources]);

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
      pdf.save(`Facture_${date}.pdf`);
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
                      <Card.Title as="h4">Détail Facture</Card.Title>
                    </Card.Header>
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
                              <i className="fa-solid fa-file-pdf"></i>
                            </span>
                            Export PDF
                          </Button>
                        </Col>
                      </Row>
                      <div
                        id="capture"
                        className="p-4 bg-white"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "#000",
                        }}
                      >
                        <Row className="mb-4">
                          <Col md="6">
                            <h5>
                              <strong>MonEntreprise BAT</strong>
                            </h5>
                            <p>
                              Rue Majida Boulila
                              <br />
                              3000 Sfax, Tunisie
                              <br />
                              contact@monentreprise.tn
                            </p>
                          </Col>
                          <Col md="6" className="text-end">
                            <h4>
                              <strong>FACTURE</strong>
                            </h4>
                            <p>
                              <strong>Numéro :</strong> {num || "N/A"}
                              <br />
                              <strong>Date :</strong> {date || "N/A"}
                              <br />
                              <strong>Frs :</strong>{" "}
                              {fournisseur?.fournisseur?.name || "N/A"}
                              <br />
                              <strong>Email :</strong>{" "}
                              {fournisseur?.fournisseur?.email || "N/A"}
                            </p>
                          </Col>
                        </Row>

                        <Table striped bordered>
                          <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                              <th>Ressource</th>
                              <th>Prix Unitaire (TND)</th>
                              <th>Quantité</th>
                              <th>Total (TND)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ligneFactures.map((ligneFacture, index) => (
                              <tr key={index}>
                                <td>{ligneFacture.ressourceName || "N/A"}</td>
                                <td>{ligneFacture.pu || 0}</td>
                                <td>{ligneFacture.qte || 0}</td>
                                <td>{mntTotalTTC.toFixed(2)}</td> {/* Updated to use mntTotalTTC */}
                              </tr>
                            ))}
                          </tbody>
                        </Table>

                        <Row className="mt-4">
                          <Col md="6">
                            <p>
                              <strong>Conditions de paiement :</strong>
                              <br />
                              Paiement à réception - Virement bancaire
                            </p>
                          </Col>
                          <Col md="6">
                            <Table borderless>
                              <tbody>
                                <tr>
                                  <td>
                                    <strong>Total HT :</strong>
                                  </td>
                                  <td>{mntTotalHT.toFixed(2)} TND</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>TVA :</strong>
                                  </td>
                                  <td>{mntTotalTVA.toFixed(2)} TND</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Total TTC :</strong>
                                  </td>
                                  <td>
                                    <strong>{mntTotalTTC.toFixed(2)} TND</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
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

export default DetailFacture;