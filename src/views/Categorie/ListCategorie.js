import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  categorieDeleted,
  getCategories,
} from "../../Redux/categorieReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
// core components
function ListCategorie() {
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
      header: "libelle",
      accessorKey: "libelle",
    },
    {
      accessorKey: "id",
      header: "actions",
      Cell: ({ cell, row }) => (
        <div className="actions-right block_action">
          <Button
            onClick={() => {
              navigate.push("/categorie/update/" + cell.row.original.id);
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
              navigate.push("/categorie/detail/" + cell.row.original.id);
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
    navigate.push("/categorie/add");
  }

  const fetchCategories = useCallback(async () => {
    var response = await dispatch(getCategories());
    var data = await (response.payload.data)
    setEntities(data);
  }, [dispatch]);

  
  function deleteCategorie(id) {
    dispatch(categorieDeleted(id))
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          setTimeout(async () => {
            notify(1, "Supression avec succes")
            fetchCategories();
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
        title="Vous éte sure de supprime cette categorie?"
        onConfirm={() => deleteCategorie(id, e)}
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
    fetchCategories();
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
              classcode="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span classcode="btn-label">
                <i classcode="fas fa-plus"></i>
              </span>
              Ajouter un Categorie
            </Button>
          </Col>
          <Col md="12">
            <h4 classcode="title">Liste des Categories</h4>
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

export default ListCategorie;
