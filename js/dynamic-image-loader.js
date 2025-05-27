/**
 * 미니게임 이미지 슬라이더를 동적으로 로드하는 스크립트
 */

document.addEventListener('DOMContentLoaded', function () {
    // 각 미니게임 슬라이더 컨테이너를 찾아서 처리
    const minigameItems = document.querySelectorAll('.minigame-item');

    minigameItems.forEach((item, index) => {
        const gameIndex = index + 1; // 미니게임 번호 (1부터 시작)
        const sliderContainer = item.querySelector('.slider-container');

        if (!sliderContainer) return;

        // 슬라이더 컨테이너를 비우고 동적으로 이미지 로드
        sliderContainer.innerHTML = '';

        // 이미지 로드 최대 시도 횟수
        const maxImages = 10;
        let loadedImages = 0;

        // 이미지 로드 시도
        for (let i = 1; i <= maxImages; i++) {
            const imgPath = `images/minigame${gameIndex}-${i}.png`;

            // 이미지 존재 여부 확인
            const img = new Image();
            img.src = imgPath;
            img.alt = `미니게임 ${gameIndex} 이미지 ${i}`;
            img.className = i === 1 ? 'active' : ''; // 첫 번째 이미지는 활성화

            img.onload = function () {
                // 이미지가 성공적으로 로드됨
                sliderContainer.appendChild(img);
                loadedImages++;

                // 이미지가 로드된 후 슬라이더 닷 업데이트
                if (i === 1 || i === maxImages || this.complete) {
                    updateSliderDots(item);
                }
            };

            img.onerror = function () {
                // 해당 번호의 이미지가 없으면 제거
                this.remove();
            };
        }
    });
});

/**
 * 슬라이더 닷을 업데이트하는 함수
 */
function updateSliderDots(minigameItem) {
    const sliderContainer = minigameItem.querySelector('.slider-container');
    const sliderDots = minigameItem.querySelector('.slider-dots');

    if (!sliderContainer || !sliderDots) return;

    // 모든 이미지가 로드된 후에 닷 업데이트
    const images = sliderContainer.querySelectorAll('img');
    if (!images.length) return;

    // 닷 컨테이너 비우기
    sliderDots.innerHTML = '';

    // 각 이미지에 대한 닷 생성
    images.forEach((img, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (img.classList.contains('active')) {
            dot.classList.add('active');
        }

        // 닷 클릭 이벤트 처리
        dot.addEventListener('click', function () {
            // 모든 이미지 비활성화
            images.forEach(image => image.classList.remove('active'));
            // 모든 닷 비활성화
            sliderDots.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

            // 선택한 이미지와 닷 활성화
            images[index].classList.add('active');
            this.classList.add('active');
        });

        sliderDots.appendChild(dot);
    });
}
