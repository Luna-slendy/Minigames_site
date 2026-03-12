import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Signup({ onSuccess, goToLogin }) {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = signup(email, password);
    if (res.success) {
      onSuccess(); 
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-page ca">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="holo"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="holo"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="holo tier1" type="submit">
          Create Account
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <button className="holo tier3" onClick={goToLogin}>
        Go to Login
      </button>
    </div>
  );
}
