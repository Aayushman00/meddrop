import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../services/api";
import useForm from "../hooks/useForm";
import Button from "../components/Button";
import Input from "../components/Input";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 number, 1 special character
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const formValidation = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    if (!values.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      errors.email = "Email is invalid";
    if (!values.password) errors.password = "Password is required";
    else if (!validatePassword(values.password))
      errors.password =
        "Password must be at least 8 characters and include an uppercase letter, a number, and a special character";
    if (!values.confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const {
    values: { name, email, password, confirmPassword },
    handleChange,
    resetForm,
    validate,
    errors,
  } = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

      await authApi.register({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-1000">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Input
          type="text"
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => handleChange(e, "name")}
          error={errors.name ? "Name is required" : ""}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => handleChange(e, "email")}
          error={errors.email ? "Please enter a valid email" : ""}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => handleChange(e, "password")}
          error={
            errors.password
              ? "Password must be at least 8 characters and include an uppercase letter, a number, and a special character"
              : ""
          }
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => handleChange(e, "confirmPassword")}
          error={errors.confirmPassword ? "Please confirm your password" : ""}
          required
        />

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
