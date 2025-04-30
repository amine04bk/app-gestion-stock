import { useState } from "react";

function useCrud(deleteRecord:(recordId: number) => void) {
  const [dialogOpenDelete, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);

  const handleDeleteClick = (rowId: number) => {
    setSelectedRowId(rowId);
    setDialogOpen(true);
  };
  const handleDialogDeleteClose = () => {
    setDialogOpen(false);
    setSelectedRowId(0);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEditClick = (rowData: any) => {
    setSelectedRow(rowData);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };
  const handleConfirmDelete = () => {
    deleteRecord(selectedRowId);
    handleDialogDeleteClose();
  };
  return {
    handleDialogDeleteClose,
    selectedRowId,
    handleAddClick,
    selectedRow,
    dialogOpenDelete,
    addModalOpen,
    setAddModalOpen,
    setEditModalOpen,
    editModalOpen,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete
  };
}
export default useCrud;
