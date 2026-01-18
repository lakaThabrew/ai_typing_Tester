import React from "react";
import { Zap } from "lucide-react";

const LoginScreen = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  authError,
  setAuthError,
  handleAuth,
  isModal = false,
}) => {
  const containerClass = isModal
    ? ""
    : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TypeIQ</h1>
          <p className="text-gray-600">
            Master your typing skills with AI-powered practice
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setAuthMode("login");
              setAuthError("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              authMode === "login"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setAuthError("");
            }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              authMode === "register"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {authError}
          </div>
        )}

        <div className="space-y-4">
          {authMode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {authMode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
