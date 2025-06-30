/**
 * style-toggle.js
 * 
 * 스타일 토글 기능 - 현재 디자인과 미니멀 디자인 간 전환
 */

// 스타일 상태 관리
let isMinimalStyle = false;

// 토글 버튼 요소들
const styleToggleHeader = document.getElementById('style-toggle-header');

// 전체 웹사이트 요소들
const body = document.body;
const header = document.querySelector('header');
const headerControls = document.querySelector('.header-controls-center');
const langSwitch = document.querySelector('.lang-switch');
const container = document.querySelector('.container');
const sections = document.querySelectorAll('.section');
const activityPhotosSection = document.querySelector('.activity-photos-section');
const activityGallery = document.querySelector('.activity-gallery');
const activityPhotoBoxes = document.querySelectorAll('.activity-photo-box');
const minigamesSection = document.querySelector('.minigames-section');
const minigameItems = document.querySelectorAll('.minigame-item');
const minigameContents = document.querySelectorAll('.minigame-content');
const gamePlayContainer = document.querySelector('.game-play-button-container');
const gamePlayButton = document.querySelector('.game-play-button');
const footer = document.querySelector('footer');
const textDanger = document.querySelectorAll('.text-danger');
const textLarge = document.querySelectorAll('.text-large');

/**
 * 미니멀 스타일로 전환
 */
function enableMinimalStyle() {
    // 전체 웹사이트에 미니멀 클래스 추가
    if (body) body.classList.add('minimal');
    if (header) header.classList.add('minimal');
    if (headerControls) headerControls.classList.add('minimal');
    if (langSwitch) langSwitch.classList.add('minimal');
    if (container) container.classList.add('minimal');
    
    // 모든 섹션에 미니멀 클래스 추가
    sections.forEach(section => section.classList.add('minimal'));
    
    // 활동 사진 섹션
    if (activityPhotosSection) activityPhotosSection.classList.add('minimal');
    if (activityGallery) activityGallery.classList.add('minimal');
    if (activityPhotoBoxes) activityPhotoBoxes.forEach(box => box.classList.add('minimal'));
    
    // 미니게임 섹션
    if (minigamesSection) minigamesSection.classList.add('minimal');
    minigameItems.forEach(item => item.classList.add('minimal'));
    minigameContents.forEach(content => content.classList.add('minimal'));
    
    // 게임 플레이 버튼
    if (gamePlayContainer) gamePlayContainer.classList.add('minimal');
    if (gamePlayButton) gamePlayButton.classList.add('minimal');
    
    // 푸터
    if (footer) footer.classList.add('minimal');
    
    // 유틸리티 클래스
    textDanger.forEach(element => element.classList.add('minimal'));
    textLarge.forEach(element => element.classList.add('minimal'));
    
    // 토글 버튼 업데이트
    if (styleToggleHeader) {
        styleToggleHeader.classList.add('minimal');
        styleToggleHeader.textContent = '현재 스타일';
    }
    
    isMinimalStyle = true;
    
    // 로컬 스토리지에 상태 저장
    localStorage.setItem('activityStyle', 'minimal');
}

/**
 * 현재 스타일로 전환
 */
function enableCurrentStyle() {
    // 전체 웹사이트에서 미니멀 클래스 제거
    if (body) body.classList.remove('minimal');
    if (header) header.classList.remove('minimal');
    if (headerControls) headerControls.classList.remove('minimal');
    if (langSwitch) langSwitch.classList.remove('minimal');
    if (container) container.classList.remove('minimal');
    
    // 모든 섹션에서 미니멀 클래스 제거
    sections.forEach(section => section.classList.remove('minimal'));
    
    // 활동 사진 섹션
    if (activityPhotosSection) activityPhotosSection.classList.remove('minimal');
    if (activityGallery) activityGallery.classList.remove('minimal');
    if (activityPhotoBoxes) activityPhotoBoxes.forEach(box => box.classList.remove('minimal'));
    
    // 미니게임 섹션
    if (minigamesSection) minigamesSection.classList.remove('minimal');
    minigameItems.forEach(item => item.classList.remove('minimal'));
    minigameContents.forEach(content => content.classList.remove('minimal'));
    
    // 게임 플레이 버튼
    if (gamePlayContainer) gamePlayContainer.classList.remove('minimal');
    if (gamePlayButton) gamePlayButton.classList.remove('minimal');
    
    // 푸터
    if (footer) footer.classList.remove('minimal');
    
    // 유틸리티 클래스
    textDanger.forEach(element => element.classList.remove('minimal'));
    textLarge.forEach(element => element.classList.remove('minimal'));
    
    // 토글 버튼 업데이트
    if (styleToggleHeader) {
        styleToggleHeader.classList.remove('minimal');
        styleToggleHeader.textContent = '미니멀 스타일';
    }
    
    isMinimalStyle = false;
    
    // 로컬 스토리지에 상태 저장
    localStorage.setItem('activityStyle', 'current');
}

/**
 * 스타일 토글 함수
 */
function toggleStyle() {
    if (isMinimalStyle) {
        enableCurrentStyle();
    } else {
        enableMinimalStyle();
    }
}

/**
 * 페이지 로드 시 스타일 초기화
 */
function initializeStyle() {
    // 로컬 스토리지에서 저장된 스타일 불러오기
    const savedStyle = localStorage.getItem('activityStyle');
    
    if (savedStyle === 'minimal') {
        enableMinimalStyle();
    } else {
        enableCurrentStyle();
    }
}

/**
 * 이벤트 리스너 등록
 */
function setupEventListeners() {
    if (styleToggleHeader) {
        styleToggleHeader.addEventListener('click', toggleStyle);
    }
}

/**
 * 페이지 로드 시 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    // 약간의 지연을 두어 DOM이 완전히 로드된 후 실행
    setTimeout(() => {
        initializeStyle();
        setupEventListeners();
    }, 100);
});

// 전역 함수로 노출 (디버깅용)
window.toggleActivityStyle = toggleStyle;
window.enableMinimalStyle = enableMinimalStyle;
window.enableCurrentStyle = enableCurrentStyle; 