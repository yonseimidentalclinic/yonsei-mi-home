// 현재 연도 자동 업데이트
document.getElementById('currentYear').textContent = new Date().getFullYear();

// --- 모바일 메뉴 토글 ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
const mobileMenuOverlay = document.getElementById('mobile-menu'); // 전체 오버레이
const mobileMenuPanel = mobileMenuOverlay.querySelector('div'); // 실제 메뉴 패널

// 메뉴 열기 함수
function openMobileMenu() {
    mobileMenuOverlay.classList.remove('menu-closed');
    mobileMenuOverlay.classList.add('menu-open');
    mobileMenuPanel.classList.remove('menu-closed-panel');
    mobileMenuPanel.classList.add('menu-open-panel');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 메뉴 닫기 함수
function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('menu-open');
    mobileMenuOverlay.classList.add('menu-closed');
    mobileMenuPanel.classList.remove('menu-open-panel');
    mobileMenuPanel.classList.add('menu-closed-panel');
    document.body.style.overflow = ''; // 스크롤 복원
}

mobileMenuButton.addEventListener('click', openMobileMenu);
closeMobileMenuButton.addEventListener('click', closeMobileMenu);
// 오버레이 클릭 시 닫기 (선택 사항)
mobileMenuOverlay.addEventListener('click', (event) => {
    if (event.target === mobileMenuOverlay) { // 패널 외부 클릭 시
        closeMobileMenu();
    }
});


// 모바일 메뉴 링크 클릭 시 메뉴 닫기
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
        // 부드러운 스크롤은 아래의 '부드러운 스크롤' 로직에서 처리
    });
});


// --- 부드러운 스크롤 (네비게이션 링크) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // href="#" 이거나 외부 링크가 아닌 경우에만 기본 동작 막고 스크롤 처리
        if (targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault(); 
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.getElementById('main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        } else if (targetId === '#') {
            e.preventDefault(); // 홈으로 가는 # 링크의 기본 동작 방지 (페이지 맨 위로 점프)
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        // 외부 링크는 기본 동작대로 작동
    });
});

// --- 스크롤에 따른 헤더 스타일 변경 (선택 사항) ---
// window.addEventListener('scroll', function() {
//     const header = document.getElementById('main-header');
//     if (window.scrollY > 50) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
// });

// --- 페이지 로드 시 URL 해시에 따라 스크롤 (새로고침 시 위치 유지) ---
window.addEventListener('load', () => {
    if (window.location.hash && window.location.hash.length > 1) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = document.getElementById('main-header').offsetHeight;
            // const elementPosition = targetElement.getBoundingClientRect().top; // getBoundingClientRect는 현재 뷰포트 기준
            // const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // getBoundingClientRect() 대신 offsetTop 사용 (페이지 상단 기준 절대 위치)
            const offsetPosition = targetElement.offsetTop - headerOffset;


            // 약간의 딜레이를 주어 DOM 렌더링 후 스크롤
            setTimeout(() => {
                 window.scrollTo({
                    top: offsetPosition,
                    behavior: "auto" // 페이지 로드 시에는 부드러운 스크롤 비활성화
                });
            }, 100); // 딜레이를 100ms로 조정
        }
    }

    // 예약 희망일 기본값 오늘 이후로 설정
    const appointmentDateInput = document.getElementById('appointment-date');
    if (appointmentDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const dd = String(today.getDate()).padStart(2, '0');
        appointmentDateInput.min = `${yyyy}-${mm}-${dd}`;
    }
});

// --- 온라인 예약 모달 처리 ---
const showAppointmentFormButton = document.getElementById('show-appointment-form-button');
const appointmentModal = document.getElementById('appointment-modal');
const appointmentFormContainer = document.getElementById('appointment-form-container');
const closeAppointmentModalButton = document.getElementById('close-appointment-modal-button');
const onlineAppointmentForm = document.getElementById('online-appointment-form');
const appointmentSuccessMessage = document.getElementById('appointment-success-message');

if (showAppointmentFormButton && appointmentModal && closeAppointmentModalButton && onlineAppointmentForm) {
    showAppointmentFormButton.addEventListener('click', () => {
        appointmentModal.classList.remove('hidden');
        setTimeout(() => { // 애니메이션을 위한 약간의 딜레이
            appointmentModal.classList.add('open');
            appointmentFormContainer.style.transform = 'scale(1)';
            appointmentFormContainer.style.opacity = '1';
        }, 10);
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    });

    function closeAppointmentModal() {
        appointmentFormContainer.style.transform = 'scale(0.95)';
        appointmentFormContainer.style.opacity = '0';
        setTimeout(() => {
            appointmentModal.classList.add('hidden');
            appointmentModal.classList.remove('open');
        }, 300); // CSS transition 시간과 일치
        document.body.style.overflow = ''; // 스크롤 복원
        appointmentSuccessMessage.classList.add('hidden'); // 성공 메시지 숨기기
        onlineAppointmentForm.reset(); // 폼 초기화
    }

    closeAppointmentModalButton.addEventListener('click', closeAppointmentModal);

    appointmentModal.addEventListener('click', (event) => {
        if (event.target === appointmentModal) {
            closeAppointmentModal();
        }
    });

    onlineAppointmentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // 실제 서버로 데이터 전송 로직은 여기에 구현합니다.
        // 예시: FormData를 사용한 데이터 수집
        // const formData = new FormData(onlineAppointmentForm);
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
        console.log('온라인 예약 폼 제출됨'); // Korean: 온라인 예약 폼 제출됨
        appointmentSuccessMessage.classList.remove('hidden');
        // 폼 제출 후 자동으로 닫히게 하려면 아래 주석 해제
        // setTimeout(() => {
        //     closeAppointmentModal();
        // }, 3000); // 3초 후 닫기
    });
}


// --- 온라인 문의 폼 처리 ---
const contactForm = document.getElementById('contact-form');
const contactSuccessMessage = document.getElementById('contact-success-message');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // 실제 서버로 데이터 전송 로직은 여기에 구현합니다.
        // 예시:
        // const formData = new FormData(contactForm);
        // fetch('/api/contact', { method: 'POST', body: formData })
        //   .then(response => response.json())
        //   .then(data => {
        //      console.log('Success:', data);
        //      contactSuccessMessage.classList.remove('hidden');
        //      contactForm.reset();
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //     alert('문의 접수 중 오류가 발생했습니다.'); // Korean: 문의 접수 중 오류가 발생했습니다.
        //   });
        console.log('온라인 문의 폼 제출됨'); // Korean: 온라인 문의 폼 제출됨
        contactSuccessMessage.classList.remove('hidden');
        contactForm.reset();

        setTimeout(() => {
            contactSuccessMessage.classList.add('hidden');
        }, 5000); // 5초 후 성공 메시지 숨김
    });
}


// --- Kakao Map API ---
// 중요: YOUR_KAKAO_APP_KEY를 실제 발급받은 키로 교체해야 합니다.
const KAKAO_APP_KEY = 'YOUR_KAKAO_APP_KEY'; // 여기에 실제 카카오 JavaScript 앱 키를 입력하세요.

function initKakaoMap() {
    const mapContainer = document.getElementById('kakaomap');
    const mapFallbackImage = document.getElementById('map-fallback-image');

    if (!mapContainer) {
        console.error("지도 컨테이너를 찾을 수 없습니다."); // Korean: 지도 컨테이너를 찾을 수 없습니다.
        if (mapFallbackImage) mapFallbackImage.classList.remove('hidden');
        return;
    }
    
    // 카카오 SDK 로드 확인
    if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
        console.error("카카오 지도 SDK가 로드되지 않았습니다. 앱 키를 확인하거나 SDK URL을 확인해주세요."); // Korean: 카카오 지도 SDK가 로드되지 않았습니다. 앱 키를 확인하거나 SDK URL을 확인해주세요.
        if (mapFallbackImage) mapFallbackImage.classList.remove('hidden'); // SDK 로드 실패 시 대체 이미지 표시
        return;
    }


    const mapOption = {
        center: new kakao.maps.LatLng(37.558984, 126.935268), // 예시: 신촌역 부근 (연세미치과 위치로 변경 필요)
        level: 3 // 지도의 확대 레벨
    };

    try {
        const map = new kakao.maps.Map(mapContainer, mapOption);

        // 마커가 표시될 위치입니다
        const markerPosition  = new kakao.maps.LatLng(37.558984, 126.935268); // 병원 실제 위치로 변경

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

        // 인포윈도우에 표출될 내용입니다 (HTML 형식)
        const iwContent = '<div style="padding:5px;font-size:12px;text-align:center;">연세미치과<br><a href="https://map.kakao.com/link/map/연세미치과,37.558984,126.935268" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/연세미치과,37.558984,126.935268" style="color:blue" target="_blank">길찾기</a></div>', // Korean: 연세미치과, 큰지도보기, 길찾기
              iwPosition = new kakao.maps.LatLng(37.558984, 126.935268); // 인포윈도우 표시 위치입니다

        // 인포윈도우를 생성합니다
        const infowindow = new kakao.maps.InfoWindow({
            position : iwPosition,
            content : iwContent
        });

        // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
        infowindow.open(map, marker);

        // 지도 타입 컨트롤을 생성하고 지도 위에 표시합니다
        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤을 생성하고 지도 위에 표시합니다
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 생성 성공 시 대체 이미지 숨김
        if (mapFallbackImage) mapFallbackImage.classList.add('hidden');


    } catch (error) {
        console.error("카카오 지도 생성 중 오류 발생:", error); // Korean: 카카오 지도 생성 중 오류 발생:
        if (mapFallbackImage) mapFallbackImage.classList.remove('hidden'); // 오류 발생 시 대체 이미지 표시
    }
}

// Kakao SDK가 로드된 후 지도를 초기화합니다.
// YOUR_KAKAO_APP_KEY가 설정되어 있고, kakao 객체가 존재할 때만 실행
if (KAKAO_APP_KEY && KAKAO_APP_KEY !== 'YOUR_KAKAO_APP_KEY' && typeof kakao !== 'undefined' && typeof kakao.maps !== 'undefined') {
    kakao.maps.load(initKakaoMap);
} else if (KAKAO_APP_KEY === 'YOUR_KAKAO_APP_KEY') {
    console.warn("카카오 지도: JavaScript 앱 키를 설정해주세요. (YOUR_KAKAO_APP_KEY)"); // Korean: 카카오 지도: JavaScript 앱 키를 설정해주세요. (YOUR_KAKAO_APP_KEY)
    const mapFallbackImage = document.getElementById('map-fallback-image');
    if (mapFallbackImage) mapFallbackImage.classList.remove('hidden');
} else {
    // SDK 로드가 안된 경우를 대비해 window.onload 에서 한번 더 시도하거나,
    // 또는 SDK script 태그에 onload 콜백을 사용하는 것을 고려할 수 있습니다.
    // 여기서는 KAKAO_APP_KEY가 유효하지 않거나 kakao 객체가 없는 경우를 포괄적으로 처리합니다.
    console.warn("카카오 지도 SDK가 준비되지 않았거나 앱 키가 유효하지 않습니다."); // Korean: 카카오 지도 SDK가 준비되지 않았거나 앱 키가 유효하지 않습니다.
    const mapFallbackImage = document.getElementById('map-fallback-image');
    if (mapFallbackImage) mapFallbackImage.classList.remove('hidden');
}

// 히어로 배경 이미지 로딩 실패 시 대체 처리
const heroSection = document.getElementById('home');
if (heroSection) {
    const heroBgImageUrl = window.getComputedStyle(heroSection).backgroundImage.slice(4, -1).replace(/"/g, "").replace(/'/g, ""); // 작은따옴표도 제거
    if (heroBgImageUrl && heroBgImageUrl !== 'none' && heroBgImageUrl !== 'initial' && heroBgImageUrl !== 'inherit') {
        const img = new Image();
        img.src = heroBgImageUrl;
        img.onerror = function() {
            heroSection.style.backgroundImage = 'none'; // 이미지 제거
            // heroSection.style.backgroundColor = '#e0f2fe'; // CSS에서 이미 처리됨
            console.warn('히어로 배경 이미지 로딩 실패. 대체 배경색이 적용됩니다.'); // Korean: 히어로 배경 이미지 로딩 실패. 대체 배경색이 적용됩니다.
        };
    }
}
