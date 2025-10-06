import React from 'react';
import './Blog.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Perfect Pizza Dough",
      excerpt: "Learn the secrets behind creating the perfect pizza dough that's crispy on the outside and soft on the inside.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      date: "March 15, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Sustainable Sourcing: Our Commitment",
      excerpt: "Discover how we partner with local farmers to bring you the freshest ingredients while supporting our community.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      date: "March 10, 2024",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Wine Pairing Guide for Italian Cuisine",
      excerpt: "Expert tips on selecting the perfect wine to complement your favorite Italian dishes.",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400",
      date: "March 5, 2024",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="container">
          <h1>Epicurean Blog</h1>
          <p>Discover recipes, cooking tips, and stories from our kitchen</p>
        </div>
      </div>

      <div className="blog-content">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button className="blog-read-more">Read More</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;