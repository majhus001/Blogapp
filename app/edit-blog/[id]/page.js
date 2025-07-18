"use client";
import React, { useEffect, useState } from "react";
import styles from "../editblog.module.css";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft, FiSave, FiImage, FiTrash2 } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = parseInt(params.id);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    content: "",
    image: "",
    authorName: ""
  });
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
      return;
    }
    setUser(currentUser);

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const blog = blogs.find((b) => b.id === blogId);
    if (!blog) {
      router.push("/dashboard");
      return;
    }

    setFormData({ 
      title: blog.title || "", 
      content: blog.content || "",
      image: blog.image || "",
      authorName: blog.authorName || currentUser.username
    });
    
    if (blog.image) {
      setPreviewImage(blog.image);
    }
    
    setLoading(false);
  }, [blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const updatedBlogs = blogs.map((b) =>
      b.id === blogId ? { 
        ...b, 
        title: formData.title, 
        content: formData.content,
        image: formData.image,
        authorName: formData.authorName,
        updatedAt: new Date().toISOString()
      } : b
    );
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    router.push("/dashboard");
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
          <label className={styles.label}>Featured Image</label>
          <div className={styles.imageUploadContainer}>
            {previewImage ? (
              <div className={styles.imagePreviewWrapper}>
                <img src={previewImage} alt="Preview" className={styles.imagePreview} />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className={styles.removeImageButton}
                >
                  <FiTrash2 size={16} />
                  Remove
                </button>
              </div>
            ) : (
              <label className={styles.imageUploadArea}>
                <FiImage size={24} />
                <span>Click to upload an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.imageInput}
                />
              </label>
            )}
          </div>
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