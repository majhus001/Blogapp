"use client";
import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if logged in via next-auth
  useEffect(() => {
    if (session) {
      const { user } = session;

      const currentUser = {
        id: user?.email || user?.name || "social-user", // fallback ID
        username: user?.name || "Guest",
        email: user?.email,
        role: "user",
        from: "social",
      };

      localStorage.setItem("CurrentUser", JSON.stringify(currentUser));
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "login",
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      localStorage.setItem("CurrentUser", JSON.stringify(data.user));

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    signIn(provider);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Please enter your details to sign in
          </p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.rememberForgot}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={isLoading}>
            {isLoading ? <span className={styles.spinner}></span> : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>OR</span>
          <span className={styles.dividerLine}></span>
        </div>

        <div className={styles.socialSection}>
          <button
            className={`${styles.socialBtn} ${styles.google}`}
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <span className={styles.socialIcon}>G</span>
            Continue with Google
          </button>
          <button
            className={`${styles.socialBtn} ${styles.github}`}
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
          >
            <span className={styles.socialIcon}>Git</span>
            Continue with GitHub
          </button>
          <button
            className={`${styles.socialBtn} ${styles.facebook}`}
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
          >
            <span className={styles.socialIcon}>f</span>
            Continue with Facebook
          </button>
        </div>

        <p className={styles.signupLink}>
          Dont have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
