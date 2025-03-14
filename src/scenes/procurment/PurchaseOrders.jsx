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
    MenuItem,
  } from "@mui/material";
  import { DataGrid } from "@mui/x-data-grid";
  import { tokens } from "../../theme";
  import { Header } from "../../components";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/DeleteOutlined";
  import AddIcon from "@mui/icons-material/Add";
  import { useState } from "react";
  
  const initialOrders = [
    { id: 1, supplier: "ABC Corp", item: "Laptop", quantity: 2, price: 1000, status: "Pending", date: "2024-03-12" },
    { id: 2, supplier: "XYZ Ltd", item: "Office Chair", quantity: 5, price: 200, status: "Approved", date: "2024-03-10" },
  ];
  
  const PurchaseOrderForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState(initialOrders);
    const [modalState, setModalState] = useState({ open: false, type: "", data: {} });
    
    const handleModalOpen = (type, data = {}) => setModalState({ open: true, type, data });
    const handleModalClose = () => setModalState({ open: false, type: "", data: {} });
  
    const handleChange = (e) =>
      setModalState({ ...modalState, data: { ...modalState.data, [e.target.name]: e.target.value } });
  
    const handleSave = () => {
      if (!modalState.data.supplier || !modalState.data.item || modalState.data.quantity <= 0 || modalState.data.price <= 0) {
        alert("Please enter valid details.");
        return;
      }
  
      if (modalState.type === "add") {
        const newOrder = { ...modalState.data, id: rows.length + 1, date: new Date().toISOString().split("T")[0] };
        setRows([...rows, newOrder]);
      } else {
        setRows(rows.map((row) => (row.id === modalState.data.id ? modalState.data : row)));
      }
  
      handleModalClose();
    };
  
    const handleDelete = (id) => setRows(rows.filter((row) => row.id !== id));
  
    const columns = [
      { field: "id", headerName: "ID", flex: 0.3 },
      { field: "supplier", headerName: "Supplier", flex: 1 },
      { field: "item", headerName: "Item", flex: 1 },
      { field: "quantity", headerName: "Quantity", flex: 0.5 },
      { field: "price", headerName: "Price ($)", flex: 0.5 },
      { field: "status", headerName: "Status", flex: 1 },
      { field: "date", headerName: "Date", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.5,
        renderCell: (params) => (
          <>
            <IconButton aria-label="edit" onClick={() => handleModalOpen("edit", params.row)}>
              <EditIcon sx={{ color: colors.blueAccent[300] }} />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon sx={{ color: colors.redAccent[500] }} />
            </IconButton>
          </>
        ),
      },
    ];
  
    return (
      <Box m="20px">
        <Header title="PURCHASE ORDER FORM" subtitle="Manage Purchase Orders" />
  
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleModalOpen("add")}
            sx={{ backgroundColor: colors.blueAccent[700] }}>
            Add Order
          </Button>
        </Box>
  
        <Box mt="20px" height="55vh">
          <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 25]} disableRowSelectionOnClick />
        </Box>
  
        {/* Add/Edit Modal */}
        <Dialog open={modalState.open} onClose={handleModalClose} maxWidth="sm" fullWidth>
          <DialogTitle>{modalState.type === "add" ? "Add Purchase Order" : "Edit Purchase Order"}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Supplier" name="supplier" value={modalState.data.supplier || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Item" name="item" value={modalState.data.item || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Quantity" name="quantity" type="number" value={modalState.data.quantity || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Price ($)" name="price" type="number" value={modalState.data.price || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField select fullWidth label="Status" name="status" value={modalState.data.status || "Pending"} onChange={handleChange} sx={{ mb: 2 }}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], color: "#fff" }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default PurchaseOrderForm;
  