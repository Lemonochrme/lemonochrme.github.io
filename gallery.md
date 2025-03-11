---
layout: default
title: Gallery
---
 
WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP WIP 

Work in progress...


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Photo Gallery</title>
    <style>
        .gallery-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .gallery-title {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        /* Responsive Grid Layout */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
            padding: 10px;
        }

        /* Photo Card */
        .photo-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            transition: transform 0.3s ease-in-out;
        }

        .photo-card:hover {
            transform: scale(1.05);
        }

        /* Skeleton Loader */
        .skeleton {
            width: 100%;
            height: 200px;
            background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite linear;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Image Styling */
        .photo {
            width: 100%;
            height: 200px;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }

        .fade-in {
            opacity: 1;
        }
    </style>
</head>
<body>

    <div class="gallery-container">
        <h1 class="gallery-title">Modern Photo Gallery</h1>
        <div class="gallery-grid">
            <!-- Images will be added dynamically using JavaScript -->
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const galleryGrid = document.querySelector(".gallery-grid");

            const unsplashUrls = [
                "https://picsum.photos/400/300?random=1",
                "https://picsum.photos/400/300?random=2",
                "https://picsum.photos/400/300?random=3",
                "https://picsum.photos/400/300?random=4",
                "https://picsum.photos/400/300?random=5",
                "https://picsum.photos/400/300?random=6",
                "https://picsum.photos/400/300?random=7",
                "https://picsum.photos/400/300?random=8",
                "https://picsum.photos/400/300?random=9"
            ];

            unsplashUrls.forEach(url => {
                const card = document.createElement("div");
                card.classList.add("photo-card");

                // Skeleton loader
                const skeleton = document.createElement("div");
                skeleton.classList.add("skeleton");

                // Image
                const img = document.createElement("img");
                img.classList.add("photo");
                img.src = url;
                img.alt = "Gallery Image";
                img.onload = () => {
                    img.classList.add("fade-in");
                    skeleton.remove(); // Remove skeleton once loaded
                };

                card.appendChild(skeleton);
                card.appendChild(img);
                galleryGrid.appendChild(card);
            });
        });
    </script>

</body>
