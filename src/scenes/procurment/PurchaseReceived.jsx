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
    { id: 1, poNumber: "PO1234", supplier: "ABC Supplies", item: "Laptop", quantity: 2, receivedBy: "John Doe", status: "Received", date: "2024-03-12" },
    { id: 2, poNumber: "PO1235", supplier: "XYZ Corp", item: "Office Chair", quantity: 5, receivedBy: "Jane Smith", status: "Pending", date: "2024-03-10" },
];

const PurchaseReceived = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [rows, setRows] = useState(initialData);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [newData, setNewData] = useState({
        poNumber: "",
        supplier: "",
        item: "",
        quantity: "",
        receivedBy: "",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
    });

    // Open & Close Handlers
    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = () => setAddOpen(false);
    const handleEditOpen = (row) => {
        setFormData({ ...row }); // Ensure form fills with selected row data
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    // Form Handlers
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleNewChange = (e) => setNewData({ ...newData, [e.target.name]: e.target.value });

    // Add New Entry
    const handleAdd = () => {
        if (!newData.poNumber || !newData.supplier || !newData.item || !newData.quantity || !newData.receivedBy) {
            alert("Please fill all fields.");
            return;
        }
        const newEntry = {
            id: rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1,
            ...newData,
        };
        setRows([...rows, newEntry]);
        setAddOpen(false);
        setNewData({ poNumber: "", supplier: "", item: "", quantity: "", receivedBy: "", status: "Pending", date: new Date().toISOString().split("T")[0] });
    };

    // Update Existing Entry
    const handleUpdate = () => {
        if (!formData.poNumber || !formData.supplier || !formData.item || !formData.quantity || !formData.receivedBy) {
            alert("Please fill all fields.");
            return;
        }
        setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
        setEditOpen(false);
    };

    // Delete Entry
    const handleDelete = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    // Table Columns
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "poNumber", headerName: "PO Number", flex: 1 },
        { field: "supplier", headerName: "Supplier", flex: 1 },
        { field: "item", headerName: "Item Name", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
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
            <Header title="PURCHASE RECEIVED FORM" subtitle="Manage Received Goods" />

            {/* Add Button */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen} sx={{ backgroundColor: colors.blueAccent[700] }}>
                    Add Entry
                </Button>
            </Box>

            {/* Data Table */}
            <Box mt="20px" height="55vh">
                <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 25]} disableRowSelectionOnClick />
            </Box>

            {/* Add Modal */}
            <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add Purchase Received Entry</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="PO Number" name="poNumber" value={newData.poNumber} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Supplier" name="supplier" value={newData.supplier} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Item Name" name="item" value={newData.item} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Quantity" name="quantity" type="number" value={newData.quantity} onChange={handleNewChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Received By" name="receivedBy" value={newData.receivedBy} onChange={handleNewChange} sx={{ mb: 2 }} />
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
    <DialogTitle>Edit Purchase Received Entry</DialogTitle>
    <DialogContent>
        <TextField fullWidth label="PO Number" name="poNumber" value={formData.poNumber || ""} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Supplier" name="supplier" value={formData.supplier || ""} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Item Name" name="item" value={formData.item || ""} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Received By" name="receivedBy" value={formData.receivedBy || ""} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status || "Pending"}
            onChange={handleChange}
            sx={{ mb: 2 }}
        >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Received">Received</MenuItem>
        </TextField>
        <TextField fullWidth label="Date" name="date" type="date" value={formData.date || ""} onChange={handleChange} sx={{ mb: 2 }} />
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

export default PurchaseReceived;
