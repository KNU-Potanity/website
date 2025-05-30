/**
 * 브라우저 호환성 체크 및 WebGPU 지원 확인 스크립트
 */

// 브라우저 호환성 체크 함수
function checkBrowserCompatibility() {
    let isCompatible = true;
    let warningContent = '';

    // WebGPU 지원 확인
    const hasWebGPU = 'gpu' in navigator;

    if (!hasWebGPU) {
        isCompatible = false;
        const template = document.getElementById('webgpu-not-supported-template');
        warningContent = template ? template.innerHTML : '이 게임은 WebGPU를 사용하며, 현재 브라우저에서는 지원되지 않습니다.';
    }

    // WebGL 하드웨어 가속 확인 (WebGPU가 지원되지 않을 경우)
    if (!hasWebGPU) {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    // 소프트웨어 렌더러 감지 (하드웨어 가속이 꺼져있는 경우)
                    if (renderer.includes('SwiftShader') ||
                        renderer.includes('llvmpipe') ||
                        renderer.includes('Software') ||
                        renderer.includes('Mesa')) {

                        isCompatible = false;
                        const template = document.getElementById('webgl-no-hwaccel-template');
                        warningContent = template ? template.innerHTML : 'WebGL 하드웨어 가속이 비활성화되어 있습니다.';
                    }
                }
            }
        } catch (e) {
            console.error('WebGL 상태 확인 중 오류:', e);
        }
    }

    return {
        isCompatible,
        warningContent
    };
}

// 모달 관련 함수들
function showModal(content, continueCallback = null) {
    const universalModal = document.getElementById('universal-modal');
    const modalMessage = document.getElementById('universal-modal-message');
    const modalContinueBtn = document.getElementById('universal-modal-continue');

    // 모달 내용 설정
    modalMessage.innerHTML = content;

    // 계속 버튼 설정
    if (continueCallback) {
        modalContinueBtn.style.display = 'block';
        modalContinueBtn.onclick = () => {
            hideModal();
            continueCallback();
        };
    } else {
        modalContinueBtn.style.display = 'none';
    }

    // 모달 표시
    universalModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function hideModal() {
    const universalModal = document.getElementById('universal-modal');
    universalModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// 페이지 로드 시 초기화 작업
document.addEventListener('DOMContentLoaded', () => {
    console.log('브라우저 호환성 체크 스크립트가 로드되었습니다.');

    // 게임 플레이 링크 이벤트 핸들러
    const gamePlayLink = document.getElementById('game-play-link');
    const modalCancelBtn = document.getElementById('universal-modal-cancel');
    const universalModal = document.getElementById('universal-modal');

    if (gamePlayLink) {
        gamePlayLink.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 동작 방지

            // 브라우저 호환성 체크
            const checkResult = checkBrowserCompatibility();

            if (checkResult.isCompatible) {
                // 호환성 문제가 없으면 게임으로 이동
                window.location.href = gamePlayLink.getAttribute('href');
            } else {
                // 문제가 있으면 경고 모달 표시
                showModal(checkResult.warningContent, () => {
                    // '계속하기'를 누르면 그래도 게임으로 이동
                    window.location.href = gamePlayLink.getAttribute('href');
                });
            }
        });
    }

    // 모달 닫기 버튼 이벤트 리스너
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', hideModal);
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && universalModal.style.display === 'flex') {
            hideModal();
        }
    });

    // 모달 바깥 영역 클릭 시 닫기
    if (universalModal) {
        universalModal.addEventListener('click', (e) => {
            if (e.target === universalModal) {
                hideModal();
            }
        });
    }
});
