// Login.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store"; // Import the Zustand store
import { useNavigate } from "react-router-dom";

// Mock API function
const mockAdminLoginApi = (
  adminId: string,
  password: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (adminId === "admin123" && password === "password123") {
        resolve("Login Successful");
      } else {
        reject("Invalid Admin ID or Password");
      }
    }, 1000);
  });
};

export default function Login() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuthStore(); // Use Zustand store

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mockAdminLoginApi(adminId, password);
      console.log(response);
      login(adminId); // Set login state
      navigate("/");
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <div className="space-y-4">
          <div>
            <Label htmlFor="adminId">Admin ID</Label>
            <Input
              id="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              disabled={isLoading}
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
