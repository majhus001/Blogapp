"use client";
import React, { useEffect, useState } from "react";
import styles from "../blogview.module.css";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit2, FiTrash2, FiClock, FiUser } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

export default function BlogViewPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = parseInt(params.id);
  const [blog, setBlog] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    // Simulate loading for better UX
    setTimeout(() => {
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const found = blogs.find((b) => b.id === blogId);

      if (!found) {
        router.push("/dashboard");
      } else {
        setBlog(found);
        // Get 3 random blogs as "related" (excluding current)
        const otherBlogs = blogs.filter(b => b.id !== blogId);
        const shuffled = [...otherBlogs].sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      }
      setIsLoading(false);
    }, 800);
  }, [blogId]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
      const updated = blogs.filter((b) => b.id !== blogId);
      localStorage.setItem("blogs", JSON.stringify(updated));
      router.push("/dashboard");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className={styles.container}>
      {/* Header with back button */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <FiArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        {currentUser?.role === "admin" && (
          <div className={styles.adminActions}>
            <button 
              onClick={() => router.push(`/edit-blog/${blog.id}`)}
              className={styles.editButton}
            >
              <FiEdit2 size={18} />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className={styles.deleteButton}
            >
              <FiTrash2 size={18} />
              Delete
            </button>
          </div>
        )}
      </header>

      {/* Blog Content */}
      <article className={styles.blogContent}>
        <div className={styles.blogHeader}>
          <h1 className={styles.title}>{blog.title}</h1>
          
          <div className={styles.metaData}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {blog.authorName?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className={styles.authorDetails}>
                <p className={styles.authorName}>
                  {blog.authorName || "Anonymous Author"}
                  {currentUser?.role === "admin" && (
                    <span className={styles.adminBadge}>
                      <RiAdminLine size={14} />
                      Admin
                    </span>
                  )}
                </p>
                <div className={styles.dateInfo}>
                  <FiClock size={14} />
                  <span>
                    {formatDate(blog.createdAt)}
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <span className={styles.updatedText}> (updated {formatDate(blog.updatedAt)})</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {blog.image && (
          <div className={styles.featuredImageContainer}>
            <img 
              src={blog.image} 
              alt={blog.title} 
              className={styles.featuredImage}
            />
          </div>
        )}

        <div className={styles.content}>
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
          ))}
        </div>
      </article>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>You might also like</h2>
          <div className={styles.relatedBlogs}>
            {relatedBlogs.map((relatedBlog) => (
              <div 
                key={relatedBlog.id} 
                className={styles.relatedCard}
                onClick={() => router.push(`/blog/${relatedBlog.id}`)}
              >
                {relatedBlog.image && (
                  <div className={styles.relatedImage}>
                    <img src={relatedBlog.image} alt={relatedBlog.title} />
                  </div>
                )}
                <div className={styles.relatedContent}>
                  <h3>{relatedBlog.title}</h3>
                  <div className={styles.relatedMeta}>
                    <span className={styles.relatedAuthor}>
                      <FiUser size={12} />
                      {relatedBlog.authorName || "Anonymous"}
                    </span>
                    <span className={styles.relatedDate}>
                      {formatDate(relatedBlog.createdAt)}
                    </span>
                  </div>
                  <p className={styles.relatedExcerpt}>
                    {relatedBlog.content.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}