import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAdmin } from "../../services/adminService";
import { getAdminUrl } from "../adminPaths";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      await registerAdmin(formData);
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate(getAdminUrl("login")), 900);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Admin Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create admin account with email and password.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              value={formData.password}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              value={formData.confirmPassword}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to={getAdminUrl("login")} className="text-primary underline">
            Go to admin login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
