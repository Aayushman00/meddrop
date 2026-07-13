import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../services/api";
import useForm from "../hooks/useForm";
import Button from "../components/Button";
import Input from "../components/Input";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formValidation = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      errors.email = "Please enter a valid email address";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const {
    values: { email, password },
    handleChange,
    resetForm,
    validate,
    errors,
  } = useForm(
    {
      email: "",
      password: "",
    },
    formValidation,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form using useForm validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // Set the first error to display in the UI
      const firstError = Object.values(validationErrors)[0];
      setError(firstError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authApi.login({
        email,
        password,
      });

      // Assuming the API returns { token, user }
      const { token, user } = response.data;
      // Store token and user data in localStorage or context
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      navigate("/medicines");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleChange(e, "email")}
          error={errors.email ? "Email is required" : ""}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => handleChange(e, "password")}
          error={errors.password ? "Password is required" : ""}
          required
        />

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
