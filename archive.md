---
layout: default
title: Projects Archive
---

<div class="projects-container">

  <!-- INSA Portfolio Section -->
  <h2 class="portfolio-title">INSA Portfolio</h2>
  {% assign insaPosts = site.posts | where: "categories", "INSA" %}
  {% assign insaPostsByYearMonth = insaPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in insaPostsByYearMonth %}
    <h3 class="year-month">{{ yearMonth.name }}</h3>
    <div class="projects-grid">
      {% for post in yearMonth.items %}
        <div class="project-card">
          <a href="{{ post.url }}" class="project-link">
            <div class="project-image">
              {% if post.image %}
                <img src="{{ post.image }}" alt="{{ post.title }} image" class="thumbnail">
              {% endif %}
            </div>
            <div class="project-info">
              <h3>{{ post.title }}</h3>
              {% if post.description %}
                <p class="description">{{ post.description | truncate: 150 }}</p>
              {% endif %}
              {% if post.technologies %}
                <div class="technologies">
                  {% for tech in post.technologies %}
                    <span class="tech-badge">{{ tech }}</span>
                  {% endfor %}
                </div>
              {% endif %}
              <span class="view-more">View Project &rarr;</span>
            </div>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}

  <!-- Personal Portfolio Section -->
  <h2 class="portfolio-title">Personal Portfolio</h2>
  {% assign personalPosts = site.posts | reject: "categories", "INSA" %}
  {% assign personalPostsByYearMonth = personalPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in personalPostsByYearMonth %}
    <h3 class="year-month">{{ yearMonth.name }}</h3>
    <div class="projects-grid">
      {% for post in yearMonth.items %}
        <div class="project-card">
          <a href="{{ post.url }}" class="project-link">
            <div class="project-image">
              {% if post.image %}
                <img src="{{ post.image }}" alt="{{ post.title }} image" class="thumbnail">
              {% endif %}
            </div>
            <div class="project-info">
              <h3>{{ post.title }}</h3>
              {% if post.description %}
                <p class="description">{{ post.description | truncate: 150 }}</p>
              {% endif %}
              {% if post.technologies %}
                <div class="technologies">
                  {% for tech in post.technologies %}
                    <span class="tech-badge">{{ tech }}</span>
                  {% endfor %}
                </div>
              {% endif %}
              <span class="view-more">View Project &rarr;</span>
            </div>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}
  
</div>

<!-- CSS Styling -->
<style>
  .portfolio-title {
    font-size: 2.5rem;
    margin-top: 40px;
    color: #ffffff;
  }

  .year-month {
    margin-top: 20px;
    font-size: 1.75rem;
    color: #f1f1f1;
  }

  body {
    background-color: #000; /* Set background to black */
    color: #f1f1f1; /* Light text for contrast */
  }

  .projects-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .year-month {
    margin-top: 40px;
    font-size: 2rem;
    color: #f1f1f1; /* Light text */
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .project-card {
    background: rgba(255, 255, 255, 0.1); /* Translucent background */
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px); /* Glass effect */
    border-radius: 16px;
    overflow: hidden;
    padding: 20px;
    transition: background-color 0.3s ease; /* Smooth background color transition */
  }

  .project-card:hover {
    border-color: #7cc6fe; 
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
  }

  .project-link {
    text-decoration: none;
    color: inherit;
    display: block;
    position: relative;
  }

  .project-image img.thumbnail {
      width: 100%;
      height: 142px; 
      display: block;
      border-radius: 12px;
      object-fit: cover;
  }


  .project-info {
    padding: 15px;
  }

  .project-info h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #ffffff;
  }

  .description {
    margin: 10px 0;
    font-size: 1rem;
    color: #d3d3d3;
  }

  .technologies {
    margin-bottom: 10px;
  }

  .tech-badge {
    background-color: rgba(255, 255, 255, 0.2);
    color: #f1f1f1;
    font-size: 0.875rem;
    padding: 5px 10px;
    border-radius: 12px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .view-more {
    display: inline-block;
    color: #ffff;
    font-weight: bold;
    margin-top: 10px;
  }
  </style>
