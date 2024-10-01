// Login.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://edc-pict.site";

export default function Login() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuthStore();

  // Hardcoded login function for testing
  // const handleLogin = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   // Simulate successful login without backend interaction
  //   const validAdminId = "admin";
  //   const validPassword = "password";

  //   if (adminId === validAdminId && password === validPassword) {
  //     console.log("Login successful!");
  //     const token = adminId; // Simulating token as adminId for simplicity
  //     localStorage.setItem("token", token); // Save the token locally
  //     login(adminId); // Update auth store with adminId
  //     navigate("/"); // Navigate to home page
  //   } else {
  //     setError("Invalid Admin ID or Password");
  //   }

  //   setIsLoading(false);
  // };

  // Original login function (commented out)
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies (including JWT token) are sent/received
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        const token = adminId; // Get the token from your API response
        localStorage.setItem("token", token); // Save the token (or adminId here for simplicity)
        login(token);
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="w-full p-4 bg-white">
        <div className="space-y-4">
          <div>
            <Label htmlFor="adminId">Admin ID</Label>
            <Input
              id="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleLogin}
            variant="default"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
