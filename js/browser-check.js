/**
 * 브라우저 기능 검사 및 게임 호환성 확인 스크립트
 * 사용자 브라우저의 WebGPU 지원 여부와 하드웨어 가속 상태를 확인합니다.
 */
document.addEventListener('DOMContentLoaded', function () {
    const gamePlayLink = document.getElementById('game-play-link');
    if (!gamePlayLink) return;

    /**
     * 모달 창을 닫는 함수
     */
    function closeModal() {
        const modal = document.getElementById('universal-modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    /**
     * 모바일 기기 여부를 확인하는 함수
     * @returns {boolean} 모바일 기기 여부
     */
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * WebGL 소프트웨어 렌더링 여부를 확인하는 함수
     * @returns {Object} 소프트웨어 렌더링 여부와 렌더러 정보
     */
    function isWebGLSoftwareRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                let renderer = '';
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) {
                    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                } else if (gl.getParameter(gl.RENDERER)) {
                    renderer = gl.getParameter(gl.RENDERER);
                }
                console.log('[WebGL Renderer 감지]', renderer);
                const isSoftware = /basic render|software|microsoft|llvmpipe|swiftshader|angle/i.test(renderer);
                return { isSoftware, renderer };
            }
        } catch (e) { }
        return { isSoftware: false, renderer: '' };
    }

    /**
     * 지정된 템플릿을 모달 메시지 영역에 설정
     * @param {Element} modalMsg - 메시지를 표시할 요소
     * @param {string} templateId - 템플릿 ID
     */
    function setModalTemplate(modalMsg, templateId) {
        modalMsg.textContent = '';
        const template = document.getElementById(templateId);
        if (template && template.content) {
            modalMsg.appendChild(template.content.cloneNode(true));
        }
    }

    /**
     * 모달 템플릿을 표시하는 함수
     * @param {string} templateId - 템플릿 ID
     * @param {Object} options - 모달 옵션 (텍스트, 콜백 등)
     */
    function showModalTemplate(templateId, options = {}) {
        const modal = document.getElementById('universal-modal');
        const msg = document.getElementById('universal-modal-message');
        const cancelBtn = document.getElementById('universal-modal-cancel');
        const continueBtn = document.getElementById('universal-modal-continue');
        setModalTemplate(msg, templateId);

        // 렌더러 정보 표시 (있는 경우)
        if (options.rendererInfo) {
            const rendererElement = document.createElement('p');
            rendererElement.textContent = options.rendererInfo;
            msg.appendChild(rendererElement);
        }

        // 버튼 설정
        cancelBtn.textContent = options.cancelText || '창 닫기';
        cancelBtn.type = 'button';
        cancelBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            if (options.onCancel) options.onCancel();
        };

        // 계속하기 버튼 표시 여부
        if (options.continueText) {
            continueBtn.style.display = '';
            continueBtn.textContent = options.continueText;
            continueBtn.type = 'button';
            continueBtn.onclick = () => {
                closeModal();
                if (options.onContinue) options.onContinue();
            };
        } else {
            continueBtn.style.display = 'none';
        }

        // 모달 창 외부 클릭시 닫기
        modal.onclick = function (e) {
            if (e.target === modal) closeModal();
        };

        // ESC 키 누를 때 모달 닫기
        window.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                closeModal();
                window.removeEventListener('keydown', escListener);
            }
        });

        // 모달 표시
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // 게임 플레이 버튼 클릭 이벤트
    gamePlayLink.addEventListener('click', async function (event) {
        event.preventDefault();
        let webgpuSupported = !!navigator.gpu;
        let webgpuAdapter = null;
        const mobile = isMobile();
        const webglInfo = isWebGLSoftwareRenderer();

        // WebGPU 어댑터 요청 (지원되는 경우)
        if (webgpuSupported) {
            try {
                webgpuAdapter = await navigator.gpu.requestAdapter();
            } catch (e) { }
        }

        // 브라우저 호환성 검사 및 안내
        // 분기: 우선순위대로 안내
        if (!webgpuSupported) {
            // WebGPU 미지원: 상세 안내
            showModalTemplate('webgpu-not-supported-template', {
                continueText: 'WebGL로 플레이하기',
                rendererInfo: `그래픽: ${webglInfo.renderer}`,
                onContinue: function () {
                    // WebGL로 플레이하기(무시): WebGL 하드웨어 가속 확인
                    if (!mobile && webglInfo.isSoftware) {
                        showModalTemplate('webgl-no-hwaccel-template', {
                            continueText: '무시하고 플레이',
                            rendererInfo: `그래픽: ${webglInfo.renderer}`,
                            onContinue: function () { window.location.href = gamePlayLink.href; }
                        });
                    } else {
                        window.location.href = gamePlayLink.href;
                    }
                }
            });
            return;
        }
        if (!webgpuAdapter) {
            // WebGPU 지원, 어댑터 없음: 하드웨어 가속 안내
            showModalTemplate('webgpu-no-adapter-template', {
                continueText: '무시하고 플레이',
                rendererInfo: `그래픽: ${webglInfo.renderer}`,
                onContinue: function () { window.location.href = gamePlayLink.href; }
            });
            return;
        }
        if (!mobile && webglInfo.isSoftware) {
            showModalTemplate('webgl-no-hwaccel-template', {
                continueText: '무시하고 플레이',
                rendererInfo: `그래픽: ${webglInfo.renderer}`,
                onContinue: function () { window.location.href = gamePlayLink.href; }
            });
            return;
        }
        // 모두 통과: 바로 게임 플레이
        window.location.href = gamePlayLink.href;
    });
});
