---
layout: default
title: Projects Archive
---

<div class="projects-container">

  <!-- INSA Portfolio Section -->
  <h2 class="portfolio-title">INSA Portfolio</h2>
  {% assign insaPosts = site.posts | where: "categories", "INSA" %}
  <ul>
    {% for post in insaPosts %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>

  <!-- Personal Portfolio Section -->
  <h2 class="portfolio-title">Personal Portfolio</h2>
  {% assign personalPosts = site.posts | where: "categories", "Personnal" %}
  <ul>
    {% for post in personalPosts %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
  
</div>

<!-- CSS Styling -->
<style>
  .portfolio-title {
    font-size: 2.5rem;
    margin-top: 40px;
    color: #ffffff;
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

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 10px 0;
  }

  a {
    color: #7cc6fe;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
