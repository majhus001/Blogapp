"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  }, [path]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        📝 BlogZone
      </Link>

      <div className={styles.links}>
        {!user ? (
          <>
            <Link href="/login" className={styles.link}>Login</Link>
            <Link href="/register" className={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <span className={styles.username}>Hi, {user.username}</span>
            <Link href="/dashboard" className={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} className={styles.logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
