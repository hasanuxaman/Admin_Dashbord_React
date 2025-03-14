import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

const RequisitionForm = () => {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    vendor: "",
    requestedBy: "",
    requestedDate: "",
    requiredDate: "",
    expireDate: "",
    items: [],
  });
  const [newItem, setNewItem] = useState({
    productName: "",
    unit: "",
    unitPrice: "",
    quantity: "",
  });
  const [editingRequisitionId, setEditingRequisitionId] = useState(null);

  const handleOpenDialog = (requisitionId = null) => {
    setEditingRequisitionId(requisitionId);
    setOpenDialog(true);
    if (requisitionId) {
      const requisition = rows.find((row) => row.id === requisitionId);
      setFormData({
        ...requisition,
        requestedDate: requisition.requestedDate || "",
        requiredDate: requisition.requiredDate || "",
        expireDate: requisition.expireDate || ""
      });
    } else {
      setFormData({
        vendor: "",
        requestedBy: "",
        requestedDate: "",
        requiredDate: "",
        expireDate: "",
        items: [],
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRequisitionId(null);
    setFormData({
      vendor: "",
      requestedBy: "",
      requestedDate: "",
      requiredDate: "",
      expireDate: "",
      items: [],
    });
    setNewItem({
      productName: "",
      unit: "",
      unitPrice: "",
      quantity: "",
    });
  };

  const handleSaveRequisition = () => {
    if (editingRequisitionId) {
      setRows(
        rows.map((row) =>
          row.id === editingRequisitionId
            ? { ...row, ...formData }
            : row
        )
      );
    } else {
      const newRequisition = {
        id: rows.length + 1,
        ...formData,
      };
      setRows([...rows, newRequisition]);
    }
    handleCloseDialog();
  };

  const handleSaveItem = () => {
    if (!newItem.productName || !newItem.unit || !newItem.unitPrice || !newItem.quantity) return;

    const unitPrice = parseFloat(newItem.unitPrice);
    const quantity = parseInt(newItem.quantity, 10);

    if (isNaN(unitPrice) || isNaN(quantity)) return;

    const totalPrice = unitPrice * quantity;
    const newItemWithTotalPrice = {
      id: formData.items.length + 1,
      ...newItem,
      totalPrice
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItemWithTotalPrice],
    });

    setNewItem({
      productName: "",
      unit: "",
      unitPrice: "",
      quantity: "",
    });
  };

  const handleDeleteRequisition = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDeleteProduct = (itemId) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const requisitionColumns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 100 },
    { field: "vendor", headerName: "Vendor", flex: 1, minWidth: 150 },
    { field: "requestedBy", headerName: "Requested By", flex: 1, minWidth: 150 },
    { field: "requestedDate", headerName: "Requested Date", flex: 1, minWidth: 150 },
    { field: "requiredDate", headerName: "Required Date", flex: 1, minWidth: 150 },
    { field: "expireDate", headerName: "Expire Date", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenDialog(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteRequisition(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const productColumns = [
    { field: "productName", headerName: "Product Name", flex: 1, minWidth: 200 },
    { field: "unit", headerName: "Unit", flex: 1, minWidth: 100 },
    { field: "unitPrice", headerName: "Unit Price", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100 },
    { field: "totalPrice", headerName: "Total Price", flex: 1, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteProduct(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const calculateTotalPrice = () => {
    return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const buttonStyles = {
    primaryButton: {
      bgcolor: "#007bff", // Blue
      "&:hover": { bgcolor: "#0056b3" },
    },
    secondaryButton: {
      bgcolor: "#28a745", // Green
      "&:hover": { bgcolor: "#218838" },
    },
    cancelButton: {
      bgcolor: "#f8f9fa", // Light gray for cancel
      "&:hover": { bgcolor: "#e2e6ea" },
    },
  };

  return (
    <Box m="20px" sx={{ backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "20px" }}>
      {/* Header Section */}
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#343a40", marginBottom: "20px" }}>
        Requisition Form
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: "30px", color: "#6c757d" }}>
        Manage procurement requests and product details in a streamlined way.
      </Typography>

      {/* Add New Requisition Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            ...buttonStyles.primaryButton,
            fontWeight: "600",
            borderRadius: "5px",
            padding: "10px 20px",
            textTransform: "none",
          }}
        >
          Add New Requisition
        </Button>
      </Box>

      {/* Requisitions Table */}
      <Box mt="20px">
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#343a40" }}>
          Requisitions List
        </Typography>
        <div style={{ height: 400, width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={rows}
            columns={requisitionColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            sx={{
              boxShadow: 3,
              borderRadius: "8px",
              border: "none",
              "& .MuiDataGrid-columnHeader": {
                fontWeight: "bold",
                backgroundColor: "#007bff",
                color: "#fff",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f1f1",
              },
            }}
          />
        </div>
      </Box>

      {/* Requisition Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"  // Use "md" for larger screens
        fullWidth={true}  // Ensure full width on smaller screens
        sx={{
          '@media (max-width: 600px)': {
            maxWidth: '90%',  // Make the modal smaller on mobile
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px", textAlign: "center" }}>
          {editingRequisitionId ? "Edit Requisition" : "Add Requisition"}
        </DialogTitle>
        <DialogContent>
          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Vendor"
                fullWidth
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Requested By"
                fullWidth
                value={formData.requestedBy}
                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Requested Date"
                fullWidth
                value={formData.requestedDate}
                onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Required Date"
                fullWidth
                value={formData.requiredDate}
                onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                type="date"
                label="Expire Date"
                fullWidth
                value={formData.expireDate}
                onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Product Items Section */}
              <Box mt="20px">
                <Typography variant="h6">Products</Typography>
                <Box mb={2} display="flex" gap={2}>
                  <TextField
                    label="Product Name"
                    value={newItem.productName}
                    onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    fullWidth
                    sx={{ backgroundColor: "#fff" }}
                  />
                  <TextField
                    label="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    fullWidth
                    sx={{ backgroundColor: "#fff" }}
                  />
                  <TextField
                    label="Unit Price"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                    fullWidth
                    type="number"
                    sx={{ backgroundColor: "#fff" }}
                  />
                  <TextField
                    label="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    fullWidth
                    type="number"
                    sx={{ backgroundColor: "#fff" }}
                  />
                  <Button
                    variant="contained"
                    sx={buttonStyles.secondaryButton}
                    onClick={handleSaveItem}
                    startIcon={<AddIcon />}
                    disabled={!newItem.productName || !newItem.unit || !newItem.unitPrice || !newItem.quantity}
                  >
                    Add Product
                  </Button>
                </Box>
                {/* Product Table */}
                <div style={{ height: 200, width: "100%" }}>
                  <DataGrid
                    rows={formData.items}
                    columns={productColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    sx={{
                      boxShadow: 3,
                      borderRadius: "8px",
                      border: "none",
                      "& .MuiDataGrid-columnHeader": {
                        fontWeight: "bold",
                        backgroundColor: "#007bff",
                        color: "#fff",
                      },
                      "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  />
                </div>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={buttonStyles.cancelButton}>
            Cancel
          </Button>
          <Button onClick={handleSaveRequisition} sx={buttonStyles.primaryButton}>
            Save Requisition
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequisitionForm;
