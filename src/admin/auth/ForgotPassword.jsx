import { useState } from "react";
import { Link } from "react-router-dom";
import { requestAdminPasswordReset } from "../../services/adminService";
import { getAdminUrl } from "../adminPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await requestAdminPasswordReset({ email });
      setSuccess(response.message || "Reset link sent if email exists.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter admin email to receive a reset link.
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          <Link to={getAdminUrl("login")} className="text-primary underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
