/**
 * 이미지 슬라이더 기능을 처리하는 스크립트
 * 동적으로 로드된 이미지에 대해 슬라이더 기능을 적용합니다.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 이미지 로딩 완료 시 슬라이더 초기화
    document.addEventListener('imagesLoaded', initAllSliders);

    // 대체 타이머 (3초 후 실행)
    const fallbackTimer = setTimeout(initAllSliders, 3000);
    document.addEventListener('imagesLoaded', () => clearTimeout(fallbackTimer));

    /**
     * 모든 슬라이더 초기화
     */
    function initAllSliders() {
        document.querySelectorAll('.image-slider').forEach(setupSlider);
    }

    /**
     * 개별 슬라이더 설정
     */
    function setupSlider(slider) {
        const container = slider.querySelector('.slider-container');
        const images = container.querySelectorAll('img');
        const prevBtn = slider.querySelector('.slider-nav.prev');
        const nextBtn = slider.querySelector('.slider-nav.next');
        const dotsContainer = slider.querySelector('.slider-dots');

        // 이미지가 1개 이하면 네비게이션 숨김
        if (images.length <= 1) {
            [prevBtn, nextBtn, dotsContainer].forEach(el => el.style.display = 'none');
            return;
        }

        let currentIndex = 0;

        // 도트 생성
        dotsContainer.innerHTML = '';
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showImage(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        // 네비게이션 버튼 설정
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        // 터치 이벤트 설정
        setupTouchEvents();

        /**
         * 이전 이미지 표시
         */
        function showPrevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        }

        /**
         * 다음 이미지 표시
         */
        function showNextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        /**
         * 특정 인덱스 이미지 표시
         */
        function showImage(index) {
            images.forEach((img, i) => img.classList.toggle('active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            currentIndex = index;
        }

        /**
         * 터치 스와이프 이벤트 설정
         */
        function setupTouchEvents() {
            let touchStartX = 0;

            container.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].screenX;
                const threshold = 50;
                const swipeDistance = touchStartX - touchEndX;

                if (Math.abs(swipeDistance) > threshold) {
                    swipeDistance > 0 ? showNextImage() : showPrevImage();
                }
            }, { passive: true });
        }
    }
});
