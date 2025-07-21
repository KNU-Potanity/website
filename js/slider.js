/**
 * Simple Image Slider with Navigation
 */

class ImageSlider {
    constructor() {
        this.sliders = new Map();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadAllSliders();
        });
    }

    loadAllSliders() {
        const sliderElements = document.querySelectorAll('.image-slider[data-game]');
        
        sliderElements.forEach(sliderElement => {
            const gameNumber = parseInt(sliderElement.dataset.game);
            if (gameNumber) {
                this.initializeSlider(sliderElement, gameNumber);
            }
        });
    }

    async initializeSlider(sliderElement, gameNumber) {
        const track = sliderElement.querySelector('.slider-track');
        const dotsContainer = sliderElement.querySelector('.slider-dots');
        const placeholder = sliderElement.querySelector('.image-placeholder');
        
        if (!track || !dotsContainer) {
            console.log(`Slider elements not found for game ${gameNumber}`);
            return;
        }

        try {
            // Load images
            const images = await this.loadImages(gameNumber, track, placeholder);
            
            if (images.length === 0) {
                console.log(`No images loaded for game ${gameNumber}`);
                if (placeholder) {
                    placeholder.innerHTML = '<span>이미지를 찾을 수 없습니다</span>';
                }
                return;
            }

            console.log(`Loaded ${images.length} images for game ${gameNumber}`);

            // Initialize slider data
            const sliderData = {
                element: sliderElement,
                images: images,
                currentIndex: 0,
                dotsContainer: dotsContainer
            };

            this.sliders.set(sliderElement, sliderData);

            // Create dots
            this.createDots(sliderData);
            
            // Show first image
            this.showImage(sliderData, 0);

            // Hide/show navigation based on image count
            this.updateNavigationVisibility(sliderData);
            
        } catch (error) {
            console.error(`Error initializing slider for game ${gameNumber}:`, error);
            if (placeholder) {
                placeholder.innerHTML = '<span>이미지 로딩 오류</span>';
            }
        }
    }

    async loadImages(gameNumber, track, placeholder) {
        const images = [];
        const MAX_IMAGES = 10;
        let consecutiveFailures = 0;

        for (let i = 1; i <= MAX_IMAGES; i++) {
            try {
                const img = await this.loadSingleImage(gameNumber, i);
                if (img) {
                    track.appendChild(img);
                    images.push(img);
                    consecutiveFailures = 0; // Reset failure count
                    
                    // Hide placeholder after first image loads
                    if (images.length === 1 && placeholder) {
                        placeholder.style.display = 'none';
                    }
                }
            } catch (error) {
                consecutiveFailures++;
                // Stop after 3 consecutive failures
                if (consecutiveFailures >= 3) {
                    break;
                }
            }
        }

        return images;
    }

    loadSingleImage(gameNumber, imageIndex) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imagePath = `images/minigames/minigame${gameNumber}-${imageIndex}.png`;
            
            // Set a timeout for loading
            const timeout = setTimeout(() => {
                reject(new Error('Image loading timeout'));
            }, 5000);
            
            img.onload = () => {
                clearTimeout(timeout);
                img.alt = `미니게임 ${gameNumber} 이미지 ${imageIndex}`;
                img.className = 'slider-image';
                resolve(img);
            };
            
            img.onerror = () => {
                clearTimeout(timeout);
                console.log(`Failed to load: ${imagePath}`);
                reject(new Error(`Failed to load ${imagePath}`));
            };
            
            img.src = imagePath;
        });
    }

    createDots(sliderData) {
        const { images, dotsContainer } = sliderData;
        
        dotsContainer.innerHTML = '';
        
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            dot.onclick = () => this.showImage(sliderData, index);
            dotsContainer.appendChild(dot);
        });
    }

    showImage(sliderData, index) {
        const { images, dotsContainer } = sliderData;
        
        // Hide all images
        images.forEach((img, i) => {
            img.classList.remove('active');
            img.style.opacity = '0';
            img.style.zIndex = '1';
        });
        
        // Show selected image
        if (images[index]) {
            images[index].classList.add('active');
            images[index].style.opacity = '1';
            images[index].style.zIndex = '2';
        }

        // Update dots
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        sliderData.currentIndex = index;
    }

    changeSlide(sliderElement, direction) {
        const sliderData = this.sliders.get(sliderElement);
        if (!sliderData) return;

        const { images, currentIndex } = sliderData;
        let newIndex = currentIndex + direction;

        // Wrap around
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }

        this.showImage(sliderData, newIndex);
    }

    updateNavigationVisibility(sliderData) {
        const { element, images } = sliderData;
        const prevBtn = element.querySelector('.prev-btn');
        const nextBtn = element.querySelector('.next-btn');
        const dotsContainer = element.querySelector('.slider-dots');

        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
        }
    }
}

// Global function for onclick handlers
function changeSlide(buttonElement, direction) {
    const sliderElement = buttonElement.closest('.image-slider');
    if (sliderElement && window.imageSlider) {
        window.imageSlider.changeSlide(sliderElement, direction);
    }
}

// Initialize slider
window.imageSlider = new ImageSlider();