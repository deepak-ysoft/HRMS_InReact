import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/FormFieldComponent/InputComponent";
import { LoginFormFields } from "../../types/ILogin";

const initialLoginData: LoginFormFields = {
  username: "",
  password: "",
  remember: false,
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormFields>(initialLoginData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormFields, string>>
  >({});

  const validate = (): typeof errors => {
    const newErrors: typeof errors = {};
    if (!form.username) newErrors.username = "Username is required.";
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(form.password)
    ) {
      newErrors.password =
        "Password must have at least 8 characters, including uppercase, lowercase, number, and special character.";
    }
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Logged in:", form);
      navigate("/add-candidate");
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-base-100 rounded-lg shadow space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <a href="/" className="flex items-center gap-2">
          <img src="/assets/img/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold hidden lg:block">
            NiceAdmin
          </span>
        </a>
      </div>

      {/* Heading */}
      <div className="text-center">
        <h5 className="text-xl font-semibold">Login to Your Account</h5>
        <p className="text-sm text-gray-500">
          Enter your username & password to login
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <CustomInput
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          error={errors.username}
          placeholder="Your username"
        />
        <CustomInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          error={errors.password}
          placeholder="Your password"
        />
        <CustomInput
          label="Remember Me"
          name="remember"
          type="checkbox"
          value={form.remember}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>

        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="link link-primary">
            Create an account
          </a>
        </p>
      </form>

      <div className="text-center text-xs text-gray-500">
        Designed by{" "}
        <a
          href="https://bootstrapmade.com/"
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          BootstrapMade
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
