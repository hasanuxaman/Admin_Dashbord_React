import { useEffect, useState } from "react";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const API_URL = "http://localhost:5166"; 

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  contact: yup.string().required("Contact is required"),
  position: yup.string().required("Position is required"),
});

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await axios.get(API_URL+'/api/AppFunction/GetAll');
    setEmployees(response.data);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editingEmployee) {
      await axios.put(`${API_URL}/${editingEmployee.id}`, values);
    } else {
      await axios.post(API_URL, values);
    }
    fetchEmployees();
    setEditingEmployee(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEmployees();
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  return (
    <Box p={3}>
      <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>
      <Formik
        initialValues={editingEmployee || { name: "", email: "", contact: "", position: "" }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                label="Contact"
                name="contact"
                value={values.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contact && Boolean(errors.contact)}
                helperText={touched.contact && errors.contact}
              />
              <TextField
                label="Position"
                name="position"
                value={values.position}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.position && Boolean(errors.position)}
                helperText={touched.position && errors.position}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary">
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </form>
        )}
      </Formik>

      <h2>Employee List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.contact}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEdit(employee)}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDelete(employee.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeForm;
