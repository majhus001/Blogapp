"use client";
import React, { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = storedUsers.find(
      (u) =>
        u.username === formData.username && u.password === formData.password
    );

    if (matchedUser) {
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try again!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btn}>
          Login
        </button>
      </form>
    </div>
  );
}
