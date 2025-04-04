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
    { id: 1, batchNumber: "BATCH001", product: "Laptop", quantity: 50, warehouse: "Main Warehouse", receivedBy: "John Doe", status: "Received", date: "2024-03-14" },
    { id: 2, batchNumber: "BATCH002", product: "Office Chair", quantity: 30, warehouse: "Storage Unit A", receivedBy: "Jane Smith", status: "Pending", date: "2024-03-12" },
];

const GoodsReceived = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [rows, setRows] = useState(initialData);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [newData, setNewData] = useState({
        batchNumber: "",
        product: "",
        quantity: "",
        warehouse: "",
        receivedBy: "",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
    });

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);

    const handleEditOpen = (row) => {
        setFormData(row);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleNewChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value });

    const handleAdd = () => {
        if (!newData.batchNumber || !newData.product || !newData.quantity || !newData.warehouse || !newData.receivedBy) {
            alert("Please fill all fields.");
            return;
        }
        const newEntry = {
            id: rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1,
            ...newData,
        };
        setRows([...rows, newEntry]);
        setAddOpen(false);
        setNewData({ batchNumber: "", product: "", quantity: "", warehouse: "", receivedBy: "", status: "Pending", date: new Date().toISOString().split("T")[0] });
    };

    const handleUpdate = () => {
        setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
        setEditOpen(false);
    };

    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "batchNumber", headerName: "Batch Number", flex: 1 },
        { field: "product", headerName: "Product", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
        { field: "warehouse", headerName: "Warehouse", flex: 1 },
        { field: "receivedBy", headerName: "Received By", flex: 1 },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Typography color={params.row.status === "Received" ? colors.greenAccent[500] : colors.redAccent[500]}>
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
            <Header title="GOODS RECEIVED" subtitle="Manage Finished Goods Inventory" />

            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen} sx={{ backgroundColor: colors.blueAccent[700] }}>
                    Add Entry
                </Button>
            </Box>

            <Box mt="20px" height="55vh">
                <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 25]} disableRowSelectionOnClick />
            </Box>

            {/* Add Modal */}
            <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add Finished Goods Entry</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Batch Number" name="batchNumber" value={newData.batchNumber} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Product Name" name="product" value={newData.product} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Quantity" name="quantity" type="number" value={newData.quantity} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Warehouse" name="warehouse" value={newData.warehouse} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Received By" name="receivedBy" value={newData.receivedBy} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={newData.status}
                        onChange={handleNewChange}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Received">Received</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Date" name="date" type="date" value={newData.date} onChange={handleNewChange} sx={{ mb: 2 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose}>Cancel</Button>
                    <Button onClick={handleAdd} variant="contained" sx={{ backgroundColor: colors.blueAccent[600], color: "#fff" }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Finished Goods Entry</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Batch Number" name="batchNumber" value={formData.batchNumber || ""} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Product Name" name="product" value={formData.product || ""} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Warehouse" name="warehouse" value={formData.warehouse || ""} onChange={handleChange} sx={{ mb: 2 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: colors.blueAccent[600], color: "#fff" }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GoodsReceived;
