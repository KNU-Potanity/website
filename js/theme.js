/**
 * 웹사이트 테마(다크/라이트 모드) 관리 스크립트
 * 사용자 설정 및 시스템 설정에 따라 테마를 적용합니다.
 */
const bodyElement = document.body;
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const THEME_STORAGE_KEY = 'potanity-theme-preference';

/**
 * 테마를 적용하는 함수
 * @param {string} theme - 적용할 테마 ('dark' 또는 'light')
 * @param {boolean} savePreference - 사용자 선택을 저장할지 여부
 */
function applyTheme(theme, savePreference = false) {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        bodyElement.classList.remove('light-mode');
        if (savePreference) {
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        }
        updateThemeToggleIcon('dark');
    } else {
        bodyElement.classList.add('light-mode');
        bodyElement.classList.remove('dark-mode');
        if (savePreference) {
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
        updateThemeToggleIcon('light');
    }
}

/**
 * 테마 토글 아이콘 업데이트
 * @param {string} theme - 현재 적용된 테마
 */
function updateThemeToggleIcon(theme) {
    const toggleIcon = document.getElementById('theme-toggle-icon');
    if (toggleIcon) {
        toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggleIcon.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }
}

/**
 * 테마를 토글하는 함수
 */
function toggleTheme() {
    const isDarkMode = bodyElement.classList.contains('dark-mode');
    applyTheme(isDarkMode ? 'light' : 'dark', true);
}

/**
 * 초기 테마를 설정하는 함수
 * 사용자 선택, 로컬 스토리지, 시스템 설정 순으로 확인
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme) {
        // 저장된 사용자 선택이 있을 경우
        applyTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        // 사용자 선택이 없고, 시스템 설정이 다크 모드인 경우
        applyTheme('dark');
    } else {
        // 기본값은 라이트 모드
        applyTheme('light');
    }
}

// 시스템 테마 변경 이벤트 리스너 (사용자가 직접 선택한 경우가 아닐 때만 적용)
prefersDarkScheme.addEventListener('change', (event) => {
    // 사용자 선택이 저장되어 있지 않은 경우에만 시스템 설정을 따름
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});

// 페이지 로드 시 테마 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // 테마 토글 버튼 이벤트 리스너 등록
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});
