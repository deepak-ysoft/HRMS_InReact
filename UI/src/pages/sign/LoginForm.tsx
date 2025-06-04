import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginFormFields } from "../../types/ILogin";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../services/Auth/Login.query";
import { toast } from "react-toastify";
import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";

const initialLoginData: LoginFormFields = {
  email: "Deepaksysoft@gmail.com",
  password: "Deepak123@",
  remember: false,
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    defaultValues: initialLoginData,
  });

  const { mutate: loginMutate } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token.result);
      localStorage.setItem("UserId", data.data.empId);
      toast.success(data.message);
      navigate("/dashboard");
    },
  });

  const onSubmit = (data: LoginFormFields) => {
    loginMutate(data);
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
          Enter your email & password to login
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          type="email"
          label="Email"
          name="email"
          placeholder="Your email"
          register={register}
          registerOptions={{ required: "Email is required" }}
          error={errors.email}
        />
        <FormField
          type="password"
          label="Password"
          name="password"
          placeholder="Your password"
          register={register}
          registerOptions={{
            required: "Password is required",
            pattern: {
              value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/,
              message:
                "Password must have at least 8 characters, including uppercase, lowercase, number, and special character.",
            },
          }}
          error={errors.password}
        />
        <FormField
          type="checkbox"
          label="Remember Me"
          name="remember"
          register={register}
        />

        <Button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
          text={isSubmitting ? "Logging in..." : "Login"}
        />

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
