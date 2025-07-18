"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    // Handle user state management
    const initializeUser = () => {
      try {
        if (status === "authenticated") {
          setUser({
            ...session.user,
            role: session.user.role || "user" // Ensure role exists
          });
        } else {
          const storedUser = localStorage.getItem("CurrentUser");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            router.push("/login"); // Redirect if no user found
          }
        }
      } catch (error) {
        console.error("User initialization error:", error);
        router.push("/login");
      }
    };

    initializeUser();
  }, [session, status, router]);

  useEffect(() => {
    // Fetch blogs only if user is authenticated
    if (user) {
      const fetchBlogs = async () => {
        try {
          setIsLoading(true);
          const res = await fetch("/api/blogs");
          if (!res.ok) throw new Error("Failed to fetch blogs");
          const data = await res.json();
          setBlogs(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Blog fetch error:", err);
          setBlogs([]); // Ensure blogs is always an array
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogs();
    }
  }, [user]); // Only depend on user

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete blog");
      }

      setBlogs(prev => prev.filter(blog => blog._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete blog");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("CurrentUser");
    localStorage.removeItem("token");
    signOut({ callbackUrl: "/login" });
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user.role === "admin" ? (
              <RiAdminLine size={24} />
            ) : (
              <FiUser size={24} />
            )}
          </div>
          <div className={styles.userInfo}>
            <h3>{user.name || user.username || "User"}</h3>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={18} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, {user.name || user.username || "User"}!
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
              <h3>
                No blogs {user.role === "admin" ? "created yet" : "available"}
              </h3>
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
                  key={blog._id}
                  className={styles.blogCard}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  <div className={styles.blogImage}>
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className={styles.blogImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        {blog.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <h3>{blog.title}</h3>
                    <p className={styles.blogExcerpt}>
                      {blog.content.substring(0, 120)}...
                    </p>
                    <div className={styles.blogMeta}>
                      <span className={styles.blogDate}>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {user.role === "admin" && (
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-blog/${blog._id}`);
                        }}
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(blog._id);
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