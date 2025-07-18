"use client";
import React, { useEffect, useState } from "react";
import styles from "../editblog.module.css";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";

export default function EditBlogPage() {
  const router = useRouter();
  const { id: blogId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
      return;
    }

    // Fetch blog from backend
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        if (!res.ok) throw new Error("Failed to fetch blog");

        const blog = await res.json();

        setFormData({
          title: blog.title || "",
          content: blog.content || "",
          authorName: blog.authorName || currentUser.username,
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update blog");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message || "Failed to update blog");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <FiArrowLeft size={20} />
          Cancel
        </button>
        <h1 className={styles.title}>Edit Blog Post</h1>
      </header>

      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="authorName" className={styles.label}>Author Name</label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Write your blog content here..."
            rows="12"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            <FiSave size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
