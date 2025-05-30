/**
 * 게임 플레이 버튼 및 모달 작동 관리 스크립트
 */
document.addEventListener('DOMContentLoaded', () => {
    // 필요한 DOM 요소
    const gamePlayLink = document.getElementById('game-play-link');
    const universalModal = document.getElementById('universal-modal');
    const modalMessage = document.getElementById('universal-modal-message');
    const modalCancelBtn = document.getElementById('universal-modal-cancel');
    const modalContinueBtn = document.getElementById('universal-modal-continue');

    // 모달을 표시하는 함수
    function showModal(content, continueCallback = null) {
        // 모달 내용 설정
        modalMessage.innerHTML = content;

        // 계속 버튼 설정 (콜백이 있을 경우)
        if (continueCallback) {
            modalContinueBtn.style.display = 'block';
            modalContinueBtn.onclick = () => {
                hideModal();
                continueCallback();
            };
            modalContinueBtn.focus();
        } else {
            modalContinueBtn.style.display = 'none';
        }

        // 모달 표시
        universalModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 스크롤 잠금

        // 애니메이션 클래스 추가
        setTimeout(() => {
            universalModal.classList.add('active');
        }, 10);
    }

    // 모달을 숨기는 함수
    function hideModal() {
        universalModal.classList.remove('active');
        setTimeout(() => {
            universalModal.style.display = 'none';
            document.body.style.overflow = ''; // 스크롤 잠금 해제
        }, 300);
    }

    // 취소 버튼 이벤트 리스너
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
    universalModal.addEventListener('click', (e) => {
        if (e.target === universalModal) {
            hideModal();
        }
    });

    // 게임 플레이 링크 이벤트 핸들러
    if (gamePlayLink) {
        gamePlayLink.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 동작 방지

            // 시스템 체크 (WebGPU 지원 등)을 수행한 후 게임으로 이동하거나 경고 표시
            // 브라우저 체크 함수가 있는지 확인 후 실행
            if (typeof checkBrowserCompatibility === 'function') {
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
            } else {
                // 브라우저 체크 함수가 없으면 그냥 게임으로 이동
                window.location.href = gamePlayLink.getAttribute('href');
            }
        });
    }
});
