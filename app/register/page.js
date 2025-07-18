"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user", // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some((u) => u.username === formData.username);

    if (userExists) {
      setError("Username already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: formData.username,
      password: formData.password,
      role: formData.role,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      <form className={styles.form} onSubmit={handleRegister}>
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

        <select name="role" onChange={handleChange} className={styles.select}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.btn}>
          Register
        </button>
      </form>
    </div>
  );
}
