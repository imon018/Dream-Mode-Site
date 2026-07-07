import { useState } from "react";
import { register } from "../services/authService";
import { successToast, errorToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setDebug("Register button clicked...");

    try {
      const result = await register(email, password);
      setDebug(
        "SUCCESS. Auth UID: " +
          result.user.uid +
          " | Email: " +
          result.user.email
      );
      successToast("Account Created Successfully");
    } catch (err) {
      setDebug(
        "ERROR CODE: " + (err.code || "unknown") +
          " | MESSAGE: " + err.message
      );
      errorToast(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full">Register</Button>
      </form>

      {debug && (
        <pre className="mt-6 p-3 bg-black text-green-400 text-xs rounded-xl whitespace-pre-wrap break-words">
          {debug}
        </pre>
      )}
    </div>
  );
}
