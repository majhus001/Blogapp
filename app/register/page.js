"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "register", // 👈 indicate to backend it's a registration
        }),
      });

      const data = await res.json();
      console.log(data.user)
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      
      localStorage.setItem("CurrentUser", JSON.stringify(data.user));
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className={styles.input}
        />
        <select name="role" onChange={handleChange} className={styles.select}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btn} type="submit">Register</button>
      </form>
    </div>
  );
}
