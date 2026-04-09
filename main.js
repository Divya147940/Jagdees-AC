// AC Technician Website Delhi - Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Delhi AC Repair Service - Ready to Cool!');

    // HAMBURGER MENU TOGGLE
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // MULTI-LANGUAGE TOGGLE LOGIC
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('jagdeeshLang') || 'en';

    function updateLanguage(lang) {
        const translateElements = document.querySelectorAll('[data-en][data-hi]');
        translateElements.forEach(el => {
            el.innerHTML = el.getAttribute(`data-${lang}`);
        });
        
        // Update toggle button text
        if (lang === 'en') {
            langToggle.innerText = 'हिन्दी';
        } else {
            langToggle.innerText = 'English';
        }
        
        localStorage.setItem('jagdeeshLang', lang);
        currentLang = lang;
    }

    // Initialize Language
    if (langToggle) {
        updateLanguage(currentLang);
        langToggle.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'hi' : 'en';
            updateLanguage(nextLang);
        });
    }

    // Simple fade-in effect on scroll for elements with 'fade-in' class
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => observer.observe(el));

    // FETCH DYNAMIC GALLERY
    const galleryContainer = document.getElementById('dynamicGallery');
    if (galleryContainer) {
        galleryContainer.innerHTML = '<div class="loader"></div>';
        fetchGallery();
    }

    async function fetchGallery() {
        try {
            const response = await fetch('/api/gallery');
            const data = await response.json();
            
            let dynamicContent = '';
            if (data && data.length > 0) {
                data.forEach(item => {
                    const html = `
                        <div class="gallery-item" onclick="openLightbox('${item.path}', '${item.type}')">
                            <div class="new-badge">RECENTLY ADDED</div>
                            <div class="type-badge">
                                <i class="fas ${item.type === 'video' ? 'fa-video' : 'fa-camera'}"></i> 
                                ${item.type === 'video' ? 'Video' : 'Photo'}
                            </div>
                            ${item.type === 'video' ? 
                                `<video src="${item.path}" style="width:100%; height:100%; object-fit:cover;"></video>` : 
                                `<img src="${item.path}" alt="${item.caption}">`}
                            <div class="gallery-caption">${item.caption}</div>
                        </div>
                    `;
                    dynamicContent += html;
                });
            }
            
            const staticContent = `
                <div class="gallery-item" onclick="openLightbox('assets/jagdeesh_workshop_1.png', 'image')">
                    <div class="type-badge"><i class="fas fa-camera"></i> Photo</div>
                    <img src="assets/jagdeesh_workshop_1.png" alt="Jagdeesh at Workshop">
                    <div class="gallery-caption">Direct from Workshop</div>
                </div>
                <div class="gallery-item" onclick="openLightbox('assets/jagdeesh_workshop_2.jpg', 'image')">
                    <div class="type-badge"><i class="fas fa-camera"></i> Photo</div>
                    <img src="assets/jagdeesh_workshop_2.jpg" alt="AC Unit Maintenance">
                    <div class="gallery-caption">AC Units Ready for Install</div>
                </div>
            `;
            
            galleryContainer.innerHTML = dynamicContent + staticContent;
        } catch (err) {
            console.error('Failed to fetch gallery:', err);
        }
    }
});

// Lightbox Logic (Global Scope)
function openLightbox(src, type) {
    const lightbox = document.getElementById('lightbox');
    const mediaContainer = document.getElementById('lightboxMedia');
    if (!lightbox || !mediaContainer) return;

    if (type === 'video') {
        mediaContainer.innerHTML = `<video src="${src}" controls autoplay class="lightbox-content"></video>`;
    } else {
        mediaContainer.innerHTML = `<img src="${src}" class="lightbox-content">`;
    }
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

// Global Event Listeners for Lightbox
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeLightbox');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const mediaContainer = document.getElementById('lightboxMedia');
            lightbox.style.display = 'none';
            mediaContainer.innerHTML = '';
            document.body.style.overflow = 'auto';
        });
    }

    const lightboxModal = document.getElementById('lightbox');
    if (lightboxModal) {
        window.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
                document.getElementById('lightboxMedia').innerHTML = '';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

window.onload = () => {
    console.log('%c Jagdeesh | Refrigeration & AC Repair Delhi ', 'background: #023E8A; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
};
