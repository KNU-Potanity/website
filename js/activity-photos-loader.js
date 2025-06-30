/**
 * activity-photos-loader.js
 * 
 * 활동 사진을 동적으로 로드하는 스크립트
 * 이미지와 코멘트를 키-값 쌍으로 관리하는 간단한 갤러리
 */

// 활동 사진 데이터 - 이미지 경로와 코멘트를 키-값 쌍으로 관리
// 실제 존재하는 이미지만 포함
const activityPhotosData = [
    {
        image: 'images/activities/photo-1.jpg',
        title: '정기 스터디',
        description: 'Unity와 게임 개발에 대한 깊이 있는 학습을 진행하는 모습입니다.'
    },
    {
        image: 'images/activities/photo-2.jpg',
        title: '피자데이',
        description: '매월 진행되는 피자데이! 맛있는 피자와 함께 즐거운 시간을 보냅니다.'
    }
    // 추가 이미지는 실제 파일이 있을 때 여기에 추가하세요
];

/**
 * 이미지 로드 상태를 추적하는 객체
 */
const imageLoadStatus = {};

/**
 * 이미지를 로드하고 슬라이더에 추가하는 함수
 * @param {string} imagePath - 이미지 경로
 * @param {HTMLElement} container - 이미지를 추가할 컨테이너
 * @param {number} index - 이미지 인덱스
 */
function loadActivityImage(imagePath, container, index) {
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `활동 사진 ${index + 1}`;
    img.className = index === 0 ? 'active' : '';
    img.dataset.index = index;
    
    // 이미지 로드 완료 시 처리
    img.onload = function() {
        container.appendChild(img);
        imageLoadStatus[imagePath] = 'loaded';
        console.log(`Image loaded successfully: ${imagePath}`);
    };
    
    // 이미지 로드 실패 시 처리
    img.onerror = function() {
        console.warn(`Failed to load image: ${imagePath}`);
        imageLoadStatus[imagePath] = 'failed';
        
        // 로드 실패 시 기본 이미지 또는 플레이스홀더 표시
        const placeholder = document.createElement('div');
        placeholder.className = `image-placeholder ${index === 0 ? 'active' : ''}`;
        placeholder.dataset.index = index;
        placeholder.textContent = `이미지를 불러올 수 없습니다\n${imagePath}`;
        container.appendChild(placeholder);
    };
}

/**
 * 활동 사진 갤러리를 초기화하는 함수
 */
function initializeActivityGallery() {
    console.log('Initializing activity gallery...');
    
    const sliderContainer = document.querySelector('.activity-gallery .slider-container');
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');
    
    console.log('Slider container:', sliderContainer);
    console.log('Image title:', imageTitle);
    console.log('Image description:', imageDescription);
    
    if (!sliderContainer || !imageTitle || !imageDescription) {
        console.error('Gallery elements not found');
        return;
    }
    
    console.log('Activity photos data:', activityPhotosData);
    
    if (activityPhotosData.length === 0) {
        // 이미지 데이터가 없는 경우 기본 플레이스홀더 표시
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder active';
        placeholder.textContent = '이미지 준비 중...\nImages coming soon...';
        sliderContainer.appendChild(placeholder);
        return;
    }
    
    // 기존 내용 정리
    sliderContainer.innerHTML = '';
    
    // 이미지들을 컨테이너에 로드
    activityPhotosData.forEach((photoData, index) => {
        console.log(`Loading image ${index + 1}:`, photoData.image);
        loadActivityImage(photoData.image, sliderContainer, index);
    });
    
    // 첫 번째 이미지의 코멘트 표시
    if (activityPhotosData.length > 0) {
        updateImageComment(0);
    }
    
    // 슬라이더 네비게이션 초기화
    initializeSliderNavigation(activityPhotosData.length);
}

/**
 * 이미지 코멘트를 업데이트하는 함수
 * @param {number} index - 이미지 인덱스
 */
function updateImageComment(index) {
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');
    
    if (activityPhotosData[index]) {
        const photoData = activityPhotosData[index];
        imageTitle.textContent = photoData.title;
        imageDescription.textContent = photoData.description;
        
        // 부드러운 페이드 효과
        imageTitle.style.opacity = '0';
        imageDescription.style.opacity = '0';
        
        setTimeout(() => {
            imageTitle.style.opacity = '1';
            imageDescription.style.opacity = '1';
        }, 150);
        
        console.log(`Updated comment for image ${index}:`, photoData.title);
    }
}

/**
 * 슬라이더 네비게이션을 초기화하는 함수
 * @param {number} totalImages - 총 이미지 개수
 */
function initializeSliderNavigation(totalImages) {
    console.log('Initializing slider navigation for', totalImages, 'images');
    
    const prevBtn = document.querySelector('.activity-gallery .slider-nav.prev');
    const nextBtn = document.querySelector('.activity-gallery .slider-nav.next');
    const dotsContainer = document.querySelector('.activity-gallery .slider-dots');
    
    console.log('Navigation elements:', { prevBtn, nextBtn, dotsContainer });
    
    if (!prevBtn || !nextBtn || !dotsContainer) {
        console.error('Navigation elements not found');
        return;
    }
    
    // 기존 도트 정리
    dotsContainer.innerHTML = '';
    
    let currentIndex = 0;
    
    // 도트 생성
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            showImage(i);
        });
        dotsContainer.appendChild(dot);
    }
    
    // 이미지 표시 함수
    function showImage(index) {
        console.log('Showing image:', index);
        
        const images = document.querySelectorAll('.activity-gallery .slider-container img, .activity-gallery .slider-container .image-placeholder');
        const dots = dotsContainer.querySelectorAll('.dot');
        
        // 모든 이미지 숨기기
        images.forEach(img => img.classList.remove('active'));
        
        // 모든 도트 비활성화
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 현재 이미지와 도트 활성화
        if (images[index]) {
            images[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentIndex = index;
        
        // 이미지 코멘트 업데이트
        updateImageComment(index);
        
        // 네비게이션 버튼 상태 업데이트
        updateNavigationButtons();
    }
    
    // 네비게이션 버튼 상태 업데이트
    function updateNavigationButtons() {
        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex === totalImages - 1 ? '0.5' : '1';
    }
    
    // 이전 버튼 이벤트
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                showImage(currentIndex - 1);
            }
        });
    }
    
    // 다음 버튼 이벤트
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalImages - 1) {
                showImage(currentIndex + 1);
            }
        });
    }
    
    // 초기 네비게이션 버튼 상태 설정
    updateNavigationButtons();
}

/**
 * 페이지 로드 시 활동 사진 갤러리 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing activity gallery...');
    // 약간의 지연을 두어 DOM이 완전히 로드된 후 실행
    setTimeout(() => {
        initializeActivityGallery();
    }, 100);
});

/**
 * 이미지 로드 상태 확인 함수
 */
function getImageLoadStatus() {
    return imageLoadStatus;
}

// 전역 함수로 노출 (디버깅용)
window.getActivityPhotoLoadStatus = getImageLoadStatus; 