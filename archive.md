---
layout: default
title: Projects Archive
---

<div class="projects-container">

  <!-- Personal Portfolio Section -->
  <p class="portfolio-title">✧ Personal Portfolio</p>
  {% assign personalPosts = site.posts | where: "categories", "Personnal" %}
  {% assign personalPostsByYearMonth = personalPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in personalPostsByYearMonth %}
    <p class="year-month fade-in">{{ yearMonth.name }}</p>
    <div class="projects-list">
      {% for post in yearMonth.items %}
        <div class="project-item fade-in" style="animation-delay: {{ forloop.index | times: 0.1 }}s;">
          <a href="{{ post.url }}" class="project-link">
            <h3 class="project-title">{{ post.title }}</h3>
            <p class="project-description">
              {% if post.description %}
                {{ post.description | truncate: 150 }}
              {% else %}
                {{ post.content | strip_html | truncate: 150 }}
              {% endif %}
            </p>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}

  <!-- INSA Portfolio Section -->
  <p class="portfolio-title">✧ INSA Portfolio</p>
  {% assign insaPosts = site.posts | where: "categories", "INSA" %}
  {% assign insaPostsByYearMonth = insaPosts | group_by_exp: "post", "post.date | date: '%B %Y'" %}
  {% for yearMonth in insaPostsByYearMonth %}
    <p class="year-month fade-in">{{ yearMonth.name }}</p>
    <div class="projects-list">
      {% for post in yearMonth.items %}
        <div class="project-item fade-in" style="animation-delay: {{ forloop.index | times: 0.1 }}s;">
          <a href="{{ post.url }}" class="project-link">
            <h3 class="project-title">{{ post.title }}</h3>
            <p class="project-description">
              {% if post.description %}
                {{ post.description | truncate: 150 }}
              {% else %}
                {{ post.content | strip_html | truncate: 150 }}
              {% endif %}
            </p>
          </a>
        </div>
      {% endfor %}
    </div>
  {% endfor %}

</div>

<!-- CSS Styling -->
<style>
  /* General */
  .projects-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .portfolio-title {
    font-size: 2rem;
    margin-top: 20px;
  }

  .year-month {
    font-size: 1.5rem;
    margin-top: 30px;
  }

  /* Projects List */
  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  .project-item {
    padding: 15px 20px;
    border: 1px solid var(--border-color, #444);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
    transition: background-color 0.3s, border-color 0.3s;
  }

  .project-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #7cc6fe;
  }

  .project-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .project-title {
    font-size: 1.4rem;
    margin: 0 0 8px;
    font-weight: 600;
  }

  .project-description {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  /* Fade-in Animation */
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
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

  /* Responsive */
  @media (max-width: 600px) {
    .projects-container {
      padding: 15px;
    }

    .project-title {
      font-size: 1.2rem;
    }

    .project-description {
      font-size: 0.95rem;
    }
  }
</style>
