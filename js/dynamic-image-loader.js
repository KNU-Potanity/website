/**
 * 미니게임 이미지 슬라이더를 동적으로 로드하는 스크립트
 * 각 미니게임의 이미지를 로드하고, 완료 시 이벤트를 발생시킵니다.
 */
document.addEventListener('DOMContentLoaded', () => {
    const minigameItems = document.querySelectorAll('.minigame-item');
    const totalMinigames = minigameItems.length;
    let completedMinigames = 0;

    // 각 미니게임에 대해 이미지 로딩 시작
    minigameItems.forEach(loadMinigameImages);

    /**
     * 미니게임 이미지 로딩 처리
     */
    function loadMinigameImages(item, index) {
        const gameNumber = index + 1;
        const sliderContainer = item.querySelector('.slider-container');

        if (!sliderContainer) return;

        sliderContainer.innerHTML = '';

        const MAX_IMAGES = 10;
        let pendingImages = MAX_IMAGES;
        let loadedCount = 0;

        // 각 이미지 로드 시도
        for (let i = 1; i <= MAX_IMAGES; i++) {
            const img = new Image();
            img.src = `images/minigame${gameNumber}-${i}.png`;
            img.alt = `미니게임 ${gameNumber} 이미지 ${i}`;
            img.className = i === 1 ? 'active' : '';

            img.onload = () => {
                sliderContainer.appendChild(img);
                loadedCount++;
                checkImageComplete();
            };

            img.onerror = checkImageComplete;
        }

        /**
         * 이미지 로드 완료 확인
         */
        function checkImageComplete() {
            pendingImages--;

            if (pendingImages === 0) {
                completedMinigames++;

                if (completedMinigames === totalMinigames) {
                    document.dispatchEvent(new Event('imagesLoaded'));
                }
            }
        }
    }
});
