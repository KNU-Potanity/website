/**
 * 미니게임 이미지 슬라이더를 동적으로 로드하는 스크립트
 * 각 미니게임의 이미지를 순차적으로 로드하고, 모두 완료되면 이벤트를 발생시킵니다.
 */

document.addEventListener('DOMContentLoaded', function () {
    const minigameItems = document.querySelectorAll('.minigame-item');
    const totalMinigames = minigameItems.length;
    let completedMinigames = 0;

    // 각 미니게임 아이템에 대해 이미지 로딩 처리
    minigameItems.forEach(loadMinigameImages);

    /**
     * 미니게임 이미지 로딩 함수
     * @param {Element} item - 미니게임 아이템 요소
     * @param {number} index - 미니게임 인덱스
     */
    function loadMinigameImages(item, index) {
        const gameNumber = index + 1;
        const sliderContainer = item.querySelector('.slider-container');

        if (!sliderContainer) return;

        // 슬라이더 컨테이너 초기화
        sliderContainer.innerHTML = '';

        // 미니게임 이미지 로딩 시작
        loadImagesSequentially(gameNumber, sliderContainer, onMinigameComplete);
    }

    /**
     * 이미지를 순차적으로 로딩하는 함수
     * @param {number} gameNumber - 미니게임 번호
     * @param {Element} container - 이미지를 추가할 컨테이너
     * @param {Function} onComplete - 로딩 완료 시 호출할 콜백
     */
    function loadImagesSequentially(gameNumber, container, onComplete) {
        const MAX_IMAGES = 10;  // 최대 이미지 시도 개수
        let pendingImages = MAX_IMAGES;
        let loadedCount = 0;

        // 각 이미지 로드 시도
        for (let i = 1; i <= MAX_IMAGES; i++) {
            loadImage(
                `images/minigame${gameNumber}-${i}.png`,
                `미니게임 ${gameNumber} 이미지 ${i}`,
                i === 1,  // 첫 번째 이미지만 active 클래스 추가
                onImageLoad
            );
        }

        /**
         * 단일 이미지 로드 함수
         * @param {string} src - 이미지 경로
         * @param {string} alt - 이미지 대체 텍스트
         * @param {boolean} isActive - active 클래스 적용 여부
         * @param {Function} callback - 로드 완료 시 콜백
         */
        function loadImage(src, alt, isActive, callback) {
            const img = new Image();
            img.src = src;
            img.alt = alt;
            if (isActive) img.className = 'active';

            img.onload = function () {
                container.appendChild(img);
                loadedCount++;
                callback(true);
            };

            img.onerror = function () {
                callback(false);
            };
        }

        /**
         * 이미지 로드 결과 처리 콜백
         * @param {boolean} success - 로드 성공 여부
         */
        function onImageLoad(success) {
            pendingImages--;

            // 모든 이미지 요청이 완료된 경우
            if (pendingImages === 0) {
                onComplete(loadedCount > 0);
            }
        }
    }

    /**
     * 미니게임 이미지 로딩 완료 처리
     * @param {boolean} hasImages - 로드된 이미지가 있는지 여부
     */
    function onMinigameComplete(hasImages) {
        completedMinigames++;

        // 모든 미니게임 이미지 로딩이 완료된 경우
        if (completedMinigames === totalMinigames) {
            // 이미지 로딩 완료 이벤트 발생
            document.dispatchEvent(new Event('imagesLoaded'));
        }
    }
});
