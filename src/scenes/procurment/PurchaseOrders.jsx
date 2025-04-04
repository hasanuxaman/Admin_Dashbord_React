import React, { useState } from "react";
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

const initialPurchaseOrders = [
  { id: 1, vendor: "Vendor A", date: "2024-03-12", status: "Pending", items: [] },
  { id: 2, vendor: "Vendor B", date: "2024-03-10", status: "Approved", items: [] },
];

const PurchaseOrder = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState(initialPurchaseOrders);
  const [modalState, setModalState] = useState({ open: false, type: "", data: { items: [] } });
  const [item, setItem] = useState({ product: "", unit: "", quantity: "", unitPrice: "", totalPrice: "" });

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

  const addItem = () => {
    if (!item.product || !item.unit || item.quantity <= 0 || item.unitPrice <= 0) {
      alert("Enter valid item details.");
      return;
    }
    setModalState({
      ...modalState,
      data: { ...modalState.data, items: [...modalState.data.items, item] },
    });
    setItem({ product: "", unit: "", quantity: "", unitPrice: "", totalPrice: "" });
  };

  const handleSave = () => {
    if (!modalState.data.vendor || !modalState.data.date) {
      alert("Please enter valid details.");
      return;
    }

    if (modalState.type === "add") {
      const newPurchaseOrder = { ...modalState.data, id: rows.length + 1 };
      setRows([...rows, newPurchaseOrder]);
    } else {
      setRows(rows.map((row) => (row.id === modalState.data.id ? modalState.data : row)));
    }

    handleModalClose();
  };

  const handleDelete = (id) => setRows(rows.filter((row) => row.id !== id));

  return (
    <Box m="20px">
      <Header title="PURCHASE ORDER " subtitle="Manage Purchase Orders" />

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleModalOpen("add")}
          sx={{ backgroundColor: colors.blueAccent[700] }}>
          Add Purchase Order
        </Button>
      </Box>

      <Dialog open={modalState.open} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle>{modalState.type === "add" ? "Add Purchase Order" : "Edit Purchase Order"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Vendor" name="vendor" value={modalState.data.vendor || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Adress" name="Adress" value={modalState.data.address || ""} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Purchase Order Date" name="date" type="date" value={modalState.data.date || ""} onChange={handleChange} sx={{ mb: 2 }} />
          
          <Typography variant="h6" mt={2}>Items</Typography>
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Product Name" name="product" value={item.product} onChange={handleItemChange} />
            <TextField label="Unit" name="unit" value={item.unit} onChange={handleItemChange} />
            <TextField label="Quantity" name="quantity" type="number" value={item.quantity} onChange={handleItemChange} />
            <TextField label="Unit Price" name="unitPrice" type="number" value={item.unitPrice} onChange={handleItemChange} />
            <Button onClick={addItem} variant="contained">Add</Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(modalState.data.items || []).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice}</TableCell>
                    <TableCell>{item.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], color: "#fff" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* DataGrid Component with Pagination */}
      <Box mt={8}>
        <DataGrid
          rows={rows}
          columns={[
            { field: "id", headerName: "ID", width: 150 },
            { field: "vendor", headerName: "Vendor", width: 180 },
            { field: "Address", headerName: "Address", width: 380 },
            { field: "date", headerName: "Date", width: 380 },
            { field: "status", headerName: "Status", width: 280 },
            {
              field: "actions",
              headerName: "Actions",
              width: 50,
              renderCell: (params) => (
                <>
                  <IconButton onClick={() => handleModalOpen("edit", params.row)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(params.id)}><DeleteIcon /></IconButton>
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

export default PurchaseOrder;
