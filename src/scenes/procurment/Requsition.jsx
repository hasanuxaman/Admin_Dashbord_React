import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Header } from "../../components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  getRequisitions,
  createRequisition,
  updateRequisition,
  deleteRequisition,
  addItemToRequisition,
  deleteItemFromRequisition
} from '../../services/requisitionService';

const Requisition = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [modalState, setModalState] = useState({ open: false, type: "", data: { items: [] } });
  const [item, setItem] = useState({ product: "", unit: "", quantity: "", unitPrice: "", totalPrice: "" });

  // Fetch requisitions from API
  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const requisitions = await getRequisitions();
        setRows(requisitions);
      } catch (error) {
        console.error("Error fetching requisitions:", error);
      }
    };
    fetchRequisitions();
  }, []);

  const handleModalOpen = (type, data = {}) => {
    setModalState({
      open: true,
      type,
      data: {
        ...data,
        items: data.items || [], // Ensure 'items' is always an array
      },
    });
  };

  const handleModalClose = () => setModalState({ open: false, type: "", data: { items: [] } });

  const handleChange = (e) =>
    setModalState({ ...modalState, data: { ...modalState.data, [e.target.name]: e.target.value } });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value, totalPrice: item.quantity * item.unitPrice });
  };

  // Add Item function
  const addItem = async () => {
    if (!item.product || !item.unit || item.quantity <= 0 || item.unitPrice <= 0) {
      alert("Enter valid item details.");
      return;
    }

    console.log("Adding Item:", item);  // Debug log for item

    try {
      const addedItem = await addItemToRequisition(modalState.data.id, item);

      console.log("Added Item Response:", addedItem);  // Debug log for API response

      if (addedItem) {
        setModalState({
          ...modalState,
          data: { ...modalState.data, items: [...modalState.data.items, addedItem] },
        });
        setItem({ product: "", unit: "", quantity: "", unitPrice: "", totalPrice: "" });
      } else {
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred while adding the item.");
    }
  };

  const removeItem = async (index) => {
    try {
      const itemId = modalState.data.items[index].id;
      await deleteItemFromRequisition(modalState.data.id, itemId);
      const updatedItems = modalState.data.items.filter((_, idx) => idx !== index);
      setModalState({ ...modalState, data: { ...modalState.data, items: updatedItems } });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSave = async () => {
    if (!modalState.data.department || !modalState.data.vendor || !modalState.data.date) {
      alert("Please enter valid details.");
      return;
    }

    try {
      if (modalState.type === "add") {
        const newRequisition = await createRequisition(modalState.data);
        setRows([...rows, newRequisition]);
      } else {
        const updatedRequisition = await updateRequisition(modalState.data.id, modalState.data);
        setRows(rows.map((row) => (row.id === updatedRequisition.id ? updatedRequisition : row)));
      }
      handleModalClose();
    } catch (error) {
      console.error("Error saving requisition:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequisition(id);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting requisition:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="REQUISITION MANAGEMENT" subtitle="Manage Requisitions" />

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleModalOpen("add")}
          sx={{ backgroundColor: colors.blueAccent[700] }}
        >
          Add Requisition
        </Button>
      </Box>

      {/* Modal for Requisition details */}
      <Dialog open={modalState.open} onClose={handleModalClose}>
        <DialogTitle>{modalState.type === "add" ? "Add Requisition" : "Edit Requisition"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={modalState.data.department || ""}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Vendor"
            name="vendor"
            value={modalState.data.vendor || ""}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={modalState.data.date || ""}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modalState.data.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell>{item.totalPrice}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeItem(index)}>
                        <RemoveIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TextField
            label="Product"
            name="product"
            value={item.product}
            onChange={handleItemChange}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Unit"
            name="unit"
            value={item.unit}
            onChange={handleItemChange}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={item.quantity}
            onChange={handleItemChange}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Unit Price"
            name="unitPrice"
            type="number"
            value={item.unitPrice}
            onChange={handleItemChange}
            sx={{ marginBottom: 1 }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: colors.greenAccent[700], marginTop: 2 }}
            onClick={addItem}
          >
            Add Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* DataGrid Component with Pagination */}
      <Box mt={4}>
        <DataGrid
          rows={rows}
          columns={[
            { field: "id", headerName: "ID", width: 150 },
            { field: "department", headerName: "Department", width: 180 },
            { field: "vendor", headerName: "Vendor", width: 180 },
            { field: "date", headerName: "Date", width: 180 },
            { field: "expireDate", headerName: "Expire Date", width: 180 },
            { field: "remark", headerName: "Remark", width: 180 },
            { field: "status", headerName: "Status", width: 180 },
            {
              field: "actions",
              headerName: "Actions",
              width: 200,
              renderCell: (params) => (
                <>
                  <IconButton onClick={() => handleModalOpen("edit", params.row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(params.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ),
            },
          ]}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50, 100]} // Added 100 here
          pagination
        />
      </Box>
    </Box>
  );
};

export default Requisition;
