import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom"; 
const initialValues = {
  username: "",
  password: "",
};

const loginSchema = yup.object().shape({
  // email: yup.string().email("Invalid email").required("Required"),
  username: yup.string().required("Required"), // শুধু টেক্সট হিসেবে নেবে, ইমেইল চেক করবে না
  password: yup.string().min(6, "Password must be at least 6 characters").required("Required"),
});

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); 

  const handleFormSubmit = async (values, actions) => {
    try {
      console.log("Sending Data:", values); 
      
      const response = await fetch("http://localhost:5166/api/Auth/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error("Login failed!");
      }
  
      // Parse the response JSON
      const data = await response.json();
      console.log("Login Success:", data);
  
      // Assuming the token is returned in the response body as `data.token`
      const token = data.token;
  
      if (token) {
        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem("jwtToken", token);  // You can also use sessionStorage.setItem
  
        // Reset form values
        actions.resetForm({ values: initialValues });
  
        // Navigate to the dashboard or desired page after successful login
        navigate("/dashboard");
      } else {
        // If no token, redirect to the login page
        alert("Login failed: Token not received.");
        navigate("/login");
      }
  
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred: " + error.message); 
    }
  };

  return (
    <Box m="20px" display="flex" flexDirection="column" alignItems="center">
      <h2>Login</h2>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={loginSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} style={{ width: isNonMobile ? "400px" : "100%" }}>
            <Box display="flex" flexDirection="column" gap="20px">
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="user Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="primary" variant="contained">
                Login
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
