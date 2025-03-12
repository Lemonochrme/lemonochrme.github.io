---
layout: default
title: Gallery
---
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beautiful Photo Gallery</title>
    <style>
        /* General Page Styles */
        body {
            color: #fff;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .gallery-container {
            max-width: 1200px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }

        /* Photo Card */
        .photo-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s ease-in-out;
        }

        .photo-card:hover {
            border-color: #7cc6fe; 
            transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }

        .photo-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            display: block;
        }

        /* Skeleton Loader */
        .skeleton {
            width: 100%;
            height: 250px;
            background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite linear;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* Lightbox */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out;
        }

        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }

        .lightbox img {
            max-width: 90%;
            max-height: 80%;
            border-radius: 16px;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 600px) {
            .gallery-container {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            }
        }
    </style>
</head>
<body>

    <div class="gallery-container" id="gallery">
        <!-- Images will be inserted dynamically -->
    </div>

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
        <span class="close-btn" onclick="closeLightbox()">&times;</span>
        <img id="lightbox-img" src="" alt="">
    </div>

    <script>
        const gallery = document.getElementById('gallery');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');

        // Sample Image URLs 
        const imageUrls = [
            'https://picsum.photos/1280/720?random=1',
            'https://picsum.photos/1280/720?random=2',
            'https://picsum.photos/1280/720?random=3',
            'https://picsum.photos/1280/720?random=4',
            'https://picsum.photos/1280/720?random=5',
            'https://picsum.photos/1280/720?random=6',
            'https://picsum.photos/1280/720?random=7',
            'https://picsum.photos/1280/720?random=8'
        ];



        // Load Images with Skeleton Effect
        function loadGallery() {
            imageUrls.forEach(url => {
                const card = document.createElement('div');
                card.classList.add('photo-card');

                const skeleton = document.createElement('div');
                skeleton.classList.add('skeleton');

                const img = document.createElement('img');
                img.src = url;
                img.alt = "Gallery Image";
                img.style.display = "none"; // Hide until loaded

                // Show image when loaded
                img.onload = () => {
                    skeleton.remove();
                    img.style.display = "block";
                };

                card.appendChild(skeleton);
                card.appendChild(img);
                gallery.appendChild(card);

                // Lightbox Functionality
                card.addEventListener('click', () => {
                    lightbox.classList.add('active');
                    lightboxImg.src = img.src;
                });
            });
        }

        // Close Lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
        }

        // Load Gallery on Page Load
        window.onload = loadGallery;
    </script>

</body>