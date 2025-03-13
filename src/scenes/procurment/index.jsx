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
  
  const initialData = [
    { id: 1, item: "Laptop", quantity: 2, requestedBy: "John Doe", status: "Pending", date: "2024-03-12" },
    { id: 2, item: "Office Chair", quantity: 5, requestedBy: "Jane Smith", status: "Approved", date: "2024-03-10" },
  ];
  
  const RequisitionForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState(initialData);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [newData, setNewData] = useState({
      item: "",
      quantity: "",
      requestedBy: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  
    // Open Add Modal
    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);
  
    // Open Edit Modal
    const handleEditOpen = (row) => {
      setFormData(row);
      setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);
  
    // Handle Input Change
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleNewChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value });
  
    // Add New Requisition
    const handleAdd = () => {
      if (!newData.item || !newData.quantity || !newData.requestedBy) {
        alert("Please fill all fields.");
        return;
      }
  
      const newRequisition = {
        id: rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1, // Generate unique ID
        ...newData,
      };
  
      setRows([...rows, newRequisition]); // Add new item to state
      setAddOpen(false);
      setNewData({ item: "", quantity: "", requestedBy: "", status: "Pending", date: new Date().toISOString().split("T")[0] }); // Reset Form
    };
  
    // Update Requisition
    const handleUpdate = () => {
      setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
      setEditOpen(false);
    };
  
    // Delete Item
    const handleDelete = (id) => {
      setRows(rows.filter((row) => row.id !== id));
    };
  
    const columns = [
      { field: "id", headerName: "ID", flex: 0.5 },
      { field: "item", headerName: "Item Name", flex: 1 },
      { field: "quantity", headerName: "Quantity", flex: 1 },
      { field: "requestedBy", headerName: "Requested By", flex: 1 },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
          <Typography color={params.row.status === "Approved" ? colors.greenAccent[500] : colors.redAccent[500]}>
            {params.row.status}
          </Typography>
        ),
      },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        renderCell: (params) =>
          new Date(params.row.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.5,
        renderCell: (params) => (
          <>
            <IconButton aria-label="edit" onClick={() => handleEditOpen(params.row)}>
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
        <Header title="REQUISITION FORM" subtitle="Manage Procurement Requests" />
  
        {/* Add Request Button */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen} sx={{ backgroundColor: colors.blueAccent[700] }}>
            Add Request
          </Button>
        </Box>
  
        {/* Master Table */}
        <Box mt="20px" height="55vh">
          <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 25]} disableRowSelectionOnClick />
        </Box>
  
        {/* Add Modal */}
        <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add Requisition</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Item Name" name="item" value={newData.item} onChange={handleNewChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Quantity" name="quantity" type="number" value={newData.quantity} onChange={handleNewChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Requested By" name="requestedBy" value={newData.requestedBy} onChange={handleNewChange} sx={{ mb: 2 }} />
            <TextField select fullWidth label="Status" name="status" value={newData.status} onChange={handleNewChange} sx={{ mb: 2 }}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button onClick={handleAdd} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], color: "#fff" }}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Edit Modal */}
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Requisition</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Item Name" name="item" value={formData.item || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Requested By" name="requestedBy" value={formData.requestedBy || ""} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField select fullWidth label="Status" name="status" value={formData.status || "Pending"} onChange={handleChange} sx={{ mb: 2 }}>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: colors.greenAccent[600], color: "#fff" }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default RequisitionForm;
  