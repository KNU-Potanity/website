/**
 * Minimal Image Loader - CSS-First Approach
 * 
 * Only handles dynamic image loading for CSS-only sliders
 * All animations and interactions are handled by CSS
 */

class MinimalImageLoader {
    constructor() {
        this.MAX_IMAGES = 10;
        this.loadedImages = new Map();
        this.init();
    }

    init() {
        try {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadAllMinigameImages();
            });
        } catch (error) {
            // Silent fail - placeholders will remain visible
        }
    }

    loadAllMinigameImages() {
        const sliders = document.querySelectorAll('.css-image-slider[data-game]');
        
        sliders.forEach(slider => {
            const gameNumber = slider.dataset.game;
            if (gameNumber) {
                this.loadGameImages(parseInt(gameNumber), slider);
            }
        });
    }

    async loadGameImages(gameNumber, sliderElement) {
        const track = sliderElement.querySelector('.slider-track');
        const placeholder = sliderElement.querySelector('.image-placeholder');
        
        if (!track) return;

        const loadPromises = [];
        let loadedCount = 0;

        // Try to load up to MAX_IMAGES for this game
        for (let i = 1; i <= this.MAX_IMAGES; i++) {
            const promise = this.loadSingleImage(gameNumber, i)
                .then(img => {
                    if (img) {
                        track.appendChild(img);
                        loadedCount++;
                        
                        // Hide placeholder after first successful load
                        if (loadedCount === 1 && placeholder) {
                            placeholder.style.display = 'none';
                        }
                    }
                })
                .catch(() => {
                    // Silent fail for missing images
                });
            
            loadPromises.push(promise);
        }

        // Wait for all attempts to complete
        await Promise.allSettled(loadPromises);

        // Update radio button visibility based on loaded images
        this.updateSliderControls(sliderElement, loadedCount);
    }

    loadSingleImage(gameNumber, imageIndex) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imagePath = `images/minigames/minigame${gameNumber}-${imageIndex}.png`;
            
            img.onload = () => {
                img.alt = `미니게임 ${gameNumber} 이미지 ${imageIndex}`;
                img.loading = 'lazy';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                img.style.opacity = imageIndex === 1 ? '1' : '0';
                img.style.transition = 'opacity 0.3s ease';
                this.loadedImages.set(imagePath, true);
                resolve(img);
            };
            
            img.onerror = () => {
                this.loadedImages.set(imagePath, false);
                reject();
            };
            
            img.src = imagePath;
        });
    }

    updateSliderControls(sliderElement, imageCount) {
        const controls = sliderElement.querySelector('.slider-controls');
        const radioInputs = sliderElement.querySelectorAll('input[type="radio"]');
        const dots = sliderElement.querySelectorAll('.slider-dot');

        if (!controls || imageCount === 0) return;

        // Hide excess radio buttons and dots
        radioInputs.forEach((radio, index) => {
            if (index >= imageCount) {
                radio.style.display = 'none';
            }
        });

        dots.forEach((dot, index) => {
            if (index >= imageCount) {
                dot.style.display = 'none';
            }
        });

        // Hide controls if only one image
        if (imageCount <= 1) {
            controls.style.display = 'none';
        }
    }

    // Public method to get load status (for debugging)
    getLoadStatus() {
        return Object.fromEntries(this.loadedImages);
    }
}

// Initialize the minimal loader
new MinimalImageLoader();

// Export for potential use by other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinimalImageLoader;
}