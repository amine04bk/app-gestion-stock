import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  ressourceDeleted,
  getRessources,
} from "../../Redux/ressourceReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
// core components
function ListRessource() {
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i className="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else
      toast.error(
        <strong>
          <i className="fas fa-exclamation-circle"></i>
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
      header: "libellé",
      accessorKey: "name",
    },
    {
      header: "Prix",
      accessorKey: "price",
    },
    {
      header: "Categorie",
      accessorKey: "categorie.libelle",
    },
     {
      header: "Emplacement",
      accessorKey: "emplacement.libelle",
    },
   
    {
      accessorKey: "id",
      header: "actions",
      Cell: ({ cell, row }) => (
        <div className="actions-right block_action">
          <Button
            onClick={() => {
              navigate.push("/ressource/update/" + cell.row.original.id);
            }}
            variant="warning"
            size="sm"
            className="text-warning btn-link edit"
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
              navigate.push("/ressource/detail/" + cell.row.original.id);
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
    navigate.push("/ressource/add");
  }

  const fetchRessources = useCallback(async () => {
    var response = await dispatch(getRessources());
    var data = await (response.payload.data)
    setEntities(data);
  }, [dispatch]);

  function deleteRessource(id) {
    dispatch(ressourceDeletedeted(id))
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          setTimeout(async () => {
            notify(1, "Supression avec succes")
            fetchRessources();
            hideAlert();
          }, 1000);
        }
      })
      .catch((error) => {
        /* console.error('Delete user error:', error); */
        if (error && error.status) {
          const jsonObject = JSON.parse(error.error);
          notify(2, jsonObject.message);
          setTimeout(async () => {
            hideAlert();
          }, 1000);
        } else {
          notify(2, 'An unexpected error occurred.');
        }
      });
  }
  const hideAlert = () => {
    setAlert(null);
  };
  const confirmMessage = (id, e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime ce ressource ?"
        onConfirm={() => deleteRessource(id, e)}
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
  useEffect(() => {
    fetchRessources();
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
      <Container fluid>
        <ToastContainer />
        {alert}
        <Row>
          <Col md="8">
            <Button
              id="saveBL"
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un ressource
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des ressources</h4>
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

export default ListRessource;
