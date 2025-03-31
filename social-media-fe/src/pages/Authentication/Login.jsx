import { Button, TextField } from "@mui/material";
import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../../redux/Auth/auth.action";
import { useLocation, useNavigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Select only the auth part of the state
  const { token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const handleSubmit = (values) => {
    dispatch(loginUserAction({ data: values }));
  };

  return (
    <div>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}
      >
        <Form className="space-y-5">
          <div className="space-y-5">
            <div>
              <Field
                as={TextField}
                name="email"
                placeholder="Email"
                type="email"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>

            <div style={{ paddingTop: "1rem" }}>
              <Field
                as={TextField}
                name="password"
                placeholder="Password"
                type="password"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
          </div>

          <div style={{ paddingTop: "1rem" }}>
            <Button
              sx={{ padding: ".8rem 0" }}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            {error && (
              <div className="text-red-500 text-center mt-2">
                {typeof error === "string" ? error : "Login failed"}
              </div>
            )}
          </div>
        </Form>
      </Formik>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "1rem",
        }}
      >
        <p style={{ margin: 0 }}>If you don't have an account?</p>
        <Button onClick={() => navigate("/register")}>Register</Button>
      </div>
    </div>
  );
};

export default Login;
