---
layout: default
title: Projects
permalink: /projects/
---

<head>
    <style>
        /* Styles de base cohérents avec l'exemple */
        body {
            font-family: "Georgia", serif;
            line-height: 1.7;
            margin: 0;
            padding: 0 1rem;
        }

        main {
            max-width: 900px;
            margin: auto;
        }

        .page-header {
            text-align: center;
            margin: 3rem 0;
        }

        h1 {
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #111;
            padding-bottom: 0.3em;
            margin: 0 auto 2rem;
            font-size: 2.2rem;
            display: inline-block;
        }

        /* Grille de projets */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            padding-bottom: 4rem;
        }

        /* Carte de projet */
        .project-card {
            background: white;
            padding: 1.5rem;
            border: 1px solid #e0e0e0;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            position: relative;
            overflow: hidden;
            cursor: pointer;
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .project-card:hover::before {
            opacity: 1;
        }

        .project-title {
            font-size: 1.4rem;
            margin: 0 0 1rem 0;
            position: relative;
            transition: color 0.3s ease;
        }

        .project-card:hover .project-title {
            color: #111;
        }

        .project-description {
            color: #444;
            margin-bottom: 1.2rem;
            transition: color 0.3s ease;
        }

        .project-card:hover .project-description {
            color: #333;
        }

        .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .project-tag {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
            background: #f0f0f0;
            border-radius: 2px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
        }

        .project-card:hover .project-tag {
            background: #e0e0e0;
        }

        /* Animation d'entrée */
        .project-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }

        .project-card.visible {
            opacity: 1;
            transform: none;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }

        .cool-title {
         font-size: 2em;
         }
    </style>
</head>
<body>
    <main>
        <div class="page-header">
            <p class="cool-title">Engineering Projects</p>
            <p>
            Here you can find some of my main engineering projects, both finished and still in progress. This page is different from the Posts page because it only shows selected important projects. If you want to see more, including smaller or test projects, you can check the <a href="{{ site.baseurl }}/archive">Posts archive</a>.</p>
            
            </div>

      

        <div class="projects-grid">
            <!-- Les projets seront injectés par JS -->
        </div>
    </main>

<script>
    // Données des projets
    const projects = [
        {
            title: "Autonomous Flying Wing",
            description: "Flying Wing and Computer Vision",
            tags: ["Embedded AI", "Aerospace", "Computer Vision"]
        },
        {
            title: "Water Leak Detection",
            description: "Distributed water leak detection based on harmonic analysis.",
            tags: ["Signal Processing", "ML - SVM", "Embedded systems"]
        },
    ];

    // Génération des projets
    const generateProjects = () => {
        const grid = document.querySelector('.projects-grid');
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            `;
            grid.appendChild(card);
        });
    };

    // Observer pour animations
    const initObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    };

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        generateProjects();
        setTimeout(initObserver, 100); // Laisse le temps au DOM de se charger
    });
</script>
</body>