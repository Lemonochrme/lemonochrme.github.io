---
layout: default
title: Projects Archive
---

<div class="projects-container">

  <!-- Personal Portfolio Section -->
  <h2 class="portfolio-title">❖ Personal Portfolio</h2>
  {% assign personalPosts = site.posts | where: "categories", "Personnal" %}
  {% assign personalPostsByYearMonth = personalPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in personalPostsByYearMonth %}
    <h3 class="year-month fade-in">{{ yearMonth.name }}</h3>
    <div class="projects-grid">
      {% for post in yearMonth.items %}
        <div class="project-card fade-in" style="animation-delay: {{ forloop.index | times: 0.15 }}s;">
          <a href="{{ post.url }}" class="project-link">
            <div class="project-content">
              <div class="project-image skeleton-wrapper">
                <div class="skeleton-loader"></div>
                {% if post.image %}
                  <img src="{{ post.image }}" alt="{{ post.title }} image" class="thumbnail" onload="removeSkeleton(this)">
                {% endif %}
              </div>
              <div class="project-info">
                <h3>{{ post.title }}</h3>
                <p class="description">
                  {% if post.description %}
                    {{ post.description | truncate: 150 }}
                  {% else %}
                    {{ post.content | strip_html | truncate: 150 }}
                  {% endif %}
                </p>
                {% if post.technologies %}
                  <div class="technologies">
                    {% for tech in post.technologies %}
                      <span class="tech-badge">{{ tech }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
              </div>
            </div>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}

  <!-- INSA Portfolio Section -->
  <h2 class="portfolio-title">❖ INSA Portfolio</h2>
  {% assign insaPosts = site.posts | where: "categories", "INSA" %}
  {% assign insaPostsByYearMonth = insaPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in insaPostsByYearMonth %}
    <h3 class="year-month fade-in">{{ yearMonth.name }}</h3>
    <div class="projects-grid">
      {% for post in yearMonth.items %}
        <div class="project-card fade-in" style="animation-delay: {{ forloop.index | times: 0.15 }}s;">
          <a href="{{ post.url }}" class="project-link">
            <div class="project-content">
              <div class="project-image skeleton-wrapper">
                <div class="skeleton-loader"></div>
                {% if post.image %}
                  <img src="{{ post.image }}" alt="{{ post.title }} image" class="thumbnail" onload="removeSkeleton(this)">
                {% endif %}
              </div>
              <div class="project-info">
                <h3>{{ post.title }}</h3>
                <p class="description">
                  {% if post.description %}
                    {{ post.description | truncate: 150 }}
                  {% else %}
                    {{ post.content | strip_html | truncate: 150 }}
                  {% endif %}
                </p>
                {% if post.technologies %}
                  <div class="technologies">
                    {% for tech in post.technologies %}
                      <span class="tech-badge">{{ tech }}</span>
                    {% endfor %}
                  </div>
                {% endif %}
              </div>
            </div>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}

</div>

<!-- CSS Styling -->
<style>
  /* General Styling */
  body {
  }

  .projects-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .portfolio-title {
    font-size: 2.5rem;
    margin-top: 40px;
  }

  .year-month {
    font-size: 1.75rem;
    margin-top: 40px;
  }

  /* Grid and Card Styling */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .project-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    overflow: hidden;
    padding: 20px;
    transition: background-color 0.3s ease-in-out;
    display: flex;
    align-items: center;
    gap: 20px;
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
    width: 100%;
  }

  .project-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  /* Skeleton Loader Effect */
  .skeleton-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 12px;
    background: #2b2b2b;
    flex-shrink: 0;
  }

  .skeleton-loader {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite linear;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Image Fade-in Effect */
  .thumbnail {
    width: 150px;
    height: 150px; 
    display: block;
    border-radius: 12px;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  /* Animation for Fade-in */
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-in-out forwards;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<!-- JavaScript -->
<script>
  function removeSkeleton(img) {
    img.style.opacity = "1"; // Fade in image
    const skeleton = img.parentElement.querySelector('.skeleton-loader');
    if (skeleton) {
      skeleton.remove(); // Remove skeleton when image loads
    }
  }
</script>

