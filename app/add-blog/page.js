"use client";
import React, { useEffect, useState } from "react";
import styles from "./addblog.module.css";
import { useRouter } from "next/navigation";

export default function AddBlogPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    content: "",
    authorName: "",
    category: "",
    tags: "",
    isPublished: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    if (currentUser) {
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        authorName: currentUser.username || ""
      }));
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(tag => tag),
      authorId: user?._id,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to create blog");
      }
    } catch (err) {
      setError("Failed to add blog. Please try again.");
      console.error("Failed to add blog", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create New Blog Post</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your blog content here..."
              value={formData.content}
              onChange={handleChange}
              className={styles.textarea}
              rows={8}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="authorName" className={styles.label}>Author Name</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              placeholder="Author name"
              value={formData.authorName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>Category</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g. Technology, Lifestyle"
              value={formData.category}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags" className={styles.label}>Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Comma separated tags (e.g. react, javascript)"
              value={formData.tags}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="isPublished" className={styles.checkboxLabel}>
              Publish immediately
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>
              Create Blog Post
            </button>
            <button 
              type="button" 
              className={styles.cancelBtn}
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}