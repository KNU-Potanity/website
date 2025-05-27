/**
 * 웹사이트 테마(다크/라이트 모드) 관리 스크립트
 * 시스템 설정에 따라 자동으로 테마를 적용합니다.
 */
const bodyElement = document.body;
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 테마를 적용하는 함수
 * @param {string} theme - 적용할 테마 ('dark' 또는 'light')
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        bodyElement.classList.remove('light-mode');
    } else {
        bodyElement.classList.add('light-mode');
        bodyElement.classList.remove('dark-mode');
    }
}

/**
 * 초기 테마를 설정하는 함수
 * 사용자 시스템 설정에 기반하여 다크 또는 라이트 모드 적용
 */
function initializeTheme() {
    if (prefersDarkScheme.matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

// 시스템 테마 변경 이벤트 리스너
prefersDarkScheme.addEventListener('change', (event) => {
    if (event.matches) {
        applyTheme('dark');  // 다크 모드로 전환
    } else {
        applyTheme('light'); // 라이트 모드로 전환
    }
});

// 페이지 로드 시 테마 초기화
initializeTheme();
