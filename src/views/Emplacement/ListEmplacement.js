import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  deleteEmplacement,
  getEmplacements,
} from "../../Redux/emplacementReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
// core components
function ListEmplacement() {
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i classcode="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else
      toast.error(
        <strong>
          <i classcode="fas fa-exclamation-circle"></i>
          {msg}
        </strong>
      );
  };
  const [alert, setAlert] = React.useState(null);
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [columns] = React.useState([
    //column definitions...
    {
      header: "Code",
      accessorKey: "code",
    },
   
    {
      header: "Libellé",
      accessorKey: "libelle",
    },
    {
      header: "Adresse",
      accessorKey: "adresse",
    },
    
    {
      accessorKey: "id",
      header: "actions",
      Cell: ({ cell, row }) => (
        <div className="actions-right block_action">
          <Button
            onClick={() => {
              navigate.push("/emplacement/update/" + cell.row.original.id);
            }}
            variant="warning"
            size="sm"
            classcode="text-warning btn-link edit"
          >
            <i className="fa fa-edit" />
          </Button>

          <Button
            id={"idLigne_" + cell.row.original.id}
            onClick={(e) => {
              confirmMessage(cell.row.original.id, e);
            }}
            variant="danger"
            size="sm"
            className="text-danger btn-link delete"
          >
            <i className="fa fa-trash" id={"idLigne_" + cell.row.original.id} />
          </Button>
          <Button
            onClick={() => {
              navigate.push("/emplacement/detail/" + cell.row.original.id);
            }}
            variant="info"
            size="sm"
            className="text-info btn-link edit"
          >
            <i className="fa fa-eye" />
          </Button>
        </div>
      ),
    },
    //end
  ]);
  function ajouter() {
    navigate.push("/emplacement/add");
  }

  const fetchEmplacements = useCallback(async () => {
    var response = await dispatch(getEmplacements());
    var data = await (response.payload.data)
    setEntities(data);
  }, [dispatch]);

  
  function EmplacementDelete(id, e) {
    dispatch(deleteEmplacement({ id })).then((val) => {
      notify(1 , "Emplacement supprimer avec succes");    
      fetchEmplacements();
      hideAlert();
    });
  }

  const confirmMessage = (id, e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cet emplacement?"
        onConfirm={() => EmplacementDelete(id, e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  useEffect(() => {
    fetchEmplacements();
  }, []);

  function ListTable({ list }) {
    return (
      <MaterialReactTable
        columns={columns}
        data={list}
        enableColumnActions={true}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: false }}
      />
    );
  }

  return (
    <>
    {alert}
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="8">
            <Button
              id="saveBL"
              classcode="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span classcode="btn-label">
                <i classcode="fas fa-plus"></i>
              </span>
              Ajouter un emplacement
            </Button>
          </Col>
          <Col md="12">
            <h4 classcode="title">Liste des emplacements</h4>
            <Card>
              <Card.Body>
                <ListTable list={entities}></ListTable>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListEmplacement;
