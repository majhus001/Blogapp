"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      router.push("/login");
    } else {
      setUser(currentUser);
      // Simulate loading delay for better UX
      setTimeout(() => {
        const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
        setBlogs(storedBlogs);
        setIsLoading(false);
      }, 800);
    }
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const updated = blogs.filter((b) => b.id !== id);
      setBlogs(updated);
      localStorage.setItem("blogs", JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user.role === "admin" ? <RiAdminLine size={24} /> : <FiUser size={24} />}
          </div>
          <div className={styles.userInfo}>
            <h3>{user.username}</h3>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, {user.username}!
          </h1>
          {user.role === "admin" && (
            <button
              className={styles.addBtn}
              onClick={() => router.push("/add-blog")}
            >
              <FiPlus size={18} />
              Add New Blog
            </button>
          )}
        </header>

        <div className={styles.contentSection}>
          <h2 className={styles.subtitle}>
            {user.role === "admin" ? "Manage Blogs" : "Available Blogs"}
          </h2>
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              <img src="/empty-state.svg" alt="No blogs" width={200} />
              <h3>No blogs {user.role === "admin" ? "created yet" : "available"}</h3>
              <p>
                {user.role === "admin" 
                  ? "Get started by adding your first blog post" 
                  : "Check back later for new content"}
              </p>
              {user.role === "admin" && (
                <button
                  className={styles.addBtn}
                  onClick={() => router.push("/add-blog")}
                >
                  <FiPlus size={18} />
                  Create Your First Blog
                </button>
              )}
            </div>
          ) : (
            <div className={styles.blogGrid}>
              {blogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className={styles.blogCard}
                  onClick={() => user.role !== "admin" && router.push(`/blog/${blog.id}`)}
                >
                  <div className={styles.blogImage}>
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        {blog.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <h3>{blog.title}</h3>
                    <p className={styles.blogExcerpt}>
                      {blog.content.slice(0, 120)}...
                    </p>
                    <div className={styles.blogMeta}>
                      <span className={styles.blogDate}>
                        {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {user.role === "admin" && (
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-blog/${blog.id}`);
                        }}
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button 
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(blog.id);
                        }}
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}