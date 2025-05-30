/**
 * 브라우저 호환성 체크 및 WebGPU/WebGL 지원 확인 스크립트
 */

/**
 * 브라우저 호환성을 체크하고 WebGPU, WebGL 지원 여부를 확인하는 함수
 * @returns {Promise<Object>} 브라우저 호환성 상태 객체
 */
async function checkBrowserCompatibility() {
    // 기본 상태 객체 정의
    let status = {
        hasWebGPU: false,
        hasWebGPUAdapter: false,
        hasWebGL: false,
        hasHWAccel: false,
        isCompatible: false,
        templateId: null,
        continueText: '',
        isMobile: false,
        step: 'checkAPI' // 초기 단계: API 체크 (WebGPU vs WebGL)
    };

    // 모바일 기기 확인
    status.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // 1단계: WebGPU 또는 WebGL 지원 여부 확인
    status.hasWebGPU = 'gpu' in navigator;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    status.hasWebGL = !!gl;

    // 2단계: 하드웨어 가속 확인 준비
    if (status.hasWebGPU) {
        try {
            const adapter = await navigator.gpu.requestAdapter();
            status.hasWebGPUAdapter = !!adapter;
            if (adapter) adapter.destroy();
        } catch (e) {
            console.error('WebGPU 어댑터 확인 중 오류:', e);
            status.hasWebGPUAdapter = false;
        }
    }

    if (status.hasWebGL && gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            status.hasHWAccel = !(
                renderer.includes('SwiftShader') ||
                renderer.includes('llvmpipe') ||
                renderer.includes('Software') ||
                renderer.includes('Mesa')
            );
        }
    }

    // 첫 번째 단계: WebGPU vs WebGL 확인
    if (!status.hasWebGPU && !status.hasWebGL) {
        // 둘 다 지원하지 않는 경우
        status.isCompatible = false;
        status.templateId = 'browser-not-supported-template';
        status.continueText = "그래도 시도하기";
        status.step = 'finished';
    } else if (status.hasWebGPU) {
        // WebGPU 지원됨 - 하드웨어 가속 체크 단계로 진행
        status.step = 'checkHWAccel';
    } else {
        // WebGL만 지원됨 - WebGPU 지원 안 됨 경고
        status.isCompatible = false;
        status.templateId = 'webgpu-not-supported-template';
        status.continueText = "WebGL 모드로 계속하기";
        status.step = 'continueWithWebGL';
    }

    // 브라우저 상태 표시 업데이트
    updateBrowserStatusDisplay(status);

    return status;
}

/**
 * 브라우저 상태 화면에 표시
 * @param {Object} status - 브라우저 호환성 상태 객체
 */
function updateBrowserStatusDisplay(status) {
    const webGPUStatusEl = document.getElementById('webgpu-status');
    const hwAccelStatusEl = document.getElementById('hwaccel-status');

    if (!webGPUStatusEl || !hwAccelStatusEl) return;

    // WebGPU 상태 표시
    if (status.hasWebGPU) {
        webGPUStatusEl.textContent = 'WebGPU: 지원됨';
        webGPUStatusEl.classList.add('supported');
    } else {
        webGPUStatusEl.textContent = 'WebGPU: 지원되지 않음';
        webGPUStatusEl.classList.add('not-supported');
    }

    // 하드웨어 가속 상태 표시
    if (status.isMobile) {
        hwAccelStatusEl.textContent = '하드웨어 가속: 모바일(확인 생략)';
        hwAccelStatusEl.classList.add('warning');
    } else if (status.hasWebGPU && status.hasWebGPUAdapter) {
        hwAccelStatusEl.textContent = '하드웨어 가속: 활성화됨';
        hwAccelStatusEl.classList.add('supported');
    } else if (status.hasWebGL && status.hasHWAccel) {
        hwAccelStatusEl.textContent = '하드웨어 가속: 활성화됨(WebGL)';
        hwAccelStatusEl.classList.add('supported');
    } else {
        hwAccelStatusEl.textContent = '하드웨어 가속: 비활성화됨';
        hwAccelStatusEl.classList.add('not-supported');
    }
}

/**
 * 하드웨어 가속 상태를 확인하는 함수
 * @param {Object} status - 브라우저 호환성 상태 객체
 * @returns {Promise<Object>} 업데이트된 상태 객체
 */
async function checkHardwareAcceleration(status) {
    // 모바일에서는 하드웨어 가속 체크 생략
    if (status.isMobile) {
        status.isCompatible = true;
        status.step = 'finished';
        return status;
    }

    // API에 따라 하드웨어 가속 체크
    if (status.hasWebGPU && !status.hasWebGPUAdapter) {
        // WebGPU는 지원하지만 하드웨어 가속 없음
        status.isCompatible = false;
        status.templateId = 'webgpu-no-adapter-template';
        status.continueText = "하드웨어 가속 없이 계속하기";
        status.step = 'finished';
    } else if (status.hasWebGL && !status.hasHWAccel) {
        // WebGL은 지원하지만 하드웨어 가속 없음
        status.isCompatible = false;
        status.templateId = 'webgl-no-hwaccel-template';
        status.continueText = "하드웨어 가속 없이 계속하기";
        status.step = 'finished';
    } else {
        // 하드웨어 가속 정상
        status.isCompatible = true;
        status.step = 'finished';
    }

    // 상태 업데이트 후 화면에도 표시 갱신
    updateBrowserStatusDisplay(status);

    return status;
}

/**
 * 모달 창을 표시하는 함수
 * @param {string} templateId - 모달 내용에 사용할 HTML 템플릿의 ID
 * @param {Function|null} continueCallback - '계속하기' 버튼 클릭 시 실행할 콜백 함수
 * @param {string} buttonText - '계속하기' 버튼의 텍스트
 */
function showModal(templateId, continueCallback = null, buttonText = "계속하기") {
    const universalModal = document.getElementById('universal-modal');
    const modalMessage = document.getElementById('universal-modal-message');
    const modalContinueBtn = document.getElementById('universal-modal-continue');
    const modalCancelBtn = document.getElementById('universal-modal-cancel');

    if (!universalModal || !modalMessage || !modalContinueBtn || !modalCancelBtn) {
        console.error('모달 요소를 찾을 수 없습니다.');
        return;
    }

    // 템플릿에서 내용 가져오기
    const template = document.getElementById(templateId);
    if (template) {
        modalMessage.innerHTML = template.innerHTML;
    } else {
        console.error('템플릿을 찾을 수 없음:', templateId);
        modalMessage.textContent = '브라우저 호환성 문제가 발생했습니다.';
    }

    // 계속 버튼 설정
    if (continueCallback) {
        modalContinueBtn.style.display = 'block';
        modalContinueBtn.textContent = buttonText;
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

    // 취소 버튼에 포커스
    modalCancelBtn.focus();
}

/**
 * 모달 창을 숨기는 함수
 */
function hideModal() {
    const universalModal = document.getElementById('universal-modal');
    if (universalModal) {
        universalModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// 페이지 로드 시 초기화 작업
document.addEventListener('DOMContentLoaded', async () => {
    console.log('브라우저 호환성 체크 스크립트가 로드되었습니다.');

    // 페이지 로드 시 바로 호환성 확인 (버튼 클릭 전에 상태 표시)
    await checkBrowserCompatibility();

    // 게임 플레이 링크 이벤트 핸들러
    const gamePlayLink = document.getElementById('game-play-link');
    const modalCancelBtn = document.getElementById('universal-modal-cancel');
    const universalModal = document.getElementById('universal-modal');

    if (gamePlayLink) {
        gamePlayLink.addEventListener('click', async (e) => {
            e.preventDefault(); // 기본 링크 동작 방지

            // 단계적 체크 프로세스 시작
            let status = await checkBrowserCompatibility();

            // WebGPU/WebGL 체크 결과에 따른 처리
            if (status.step === 'finished') {
                // 이미 완료된 경우 (에러 등)
                if (status.isCompatible) {
                    window.location.href = gamePlayLink.getAttribute('href');
                } else {
                    showModal(status.templateId, () => {
                        window.location.href = gamePlayLink.getAttribute('href');
                    }, status.continueText);
                }
            } else if (status.step === 'continueWithWebGL') {
                // WebGL로 계속 진행 여부 묻기
                showModal(status.templateId, async () => {
                    // WebGL로 계속 진행 확인 후 하드웨어 가속 체크
                    status = await checkHardwareAcceleration(status);

                    if (status.isCompatible) {
                        window.location.href = gamePlayLink.getAttribute('href');
                    } else {
                        showModal(status.templateId, () => {
                            window.location.href = gamePlayLink.getAttribute('href');
                        }, status.continueText);
                    }
                }, status.continueText);
            } else if (status.step === 'checkHWAccel') {
                // 하드웨어 가속 체크 단계
                status = await checkHardwareAcceleration(status);

                if (status.isCompatible) {
                    window.location.href = gamePlayLink.getAttribute('href');
                } else {
                    showModal(status.templateId, () => {
                        window.location.href = gamePlayLink.getAttribute('href');
                    }, status.continueText);
                }
            }
        });
    }

    // 모달 닫기 버튼 이벤트 리스너
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', hideModal);
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && universalModal && universalModal.style.display === 'flex') {
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
