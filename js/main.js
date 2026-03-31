/* =============================================
   참빛 미네랄 수소수기 - Main JavaScript
   최종 안정화 버전
   - 추천코드는 URL ?ref= 값이 있을 때만 자동 입력
   - localStorage 사용 안 함
   - 구글 Apps Script로만 저장
   ============================================= */

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjq4v2MLhzQZRCf5bCJKmO_tremdzalIgler3yg4zaq4E8bwHEoSvq4Xq0x87EpTE/exec";

/* ── 추천코드 URL 파라미터 읽기 ── */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/* ── 헤더 스크롤 효과 ── */
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── 상단 이동 버튼 ── */
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 모바일 메뉴 ── */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenuBtn.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

/* ── 페이지 로드 시 추천코드 반영 ── */
window.addEventListener('DOMContentLoaded', function () {
  const refFromUrl = (getQueryParam('ref') || '').trim();

  const refInput = document.getElementById('referralCode');
  const refDisplay = document.getElementById('refCodeDisplay');

  if (refInput) {
    refInput.value = refFromUrl;
  }

  if (refDisplay) {
    refDisplay.textContent = refFromUrl || '없음';
  }

  /* ── 전화번호 자동 포맷 ── */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      const digits = this.value.replace(/\D/g, '').slice(0, 11);

      if (digits.length <= 3) {
        this.value = digits;
      } else if (digits.length <= 7) {
        this.value = digits.slice(0, 3) + '-' + digits.slice(3);
      } else {
        this.value =
          digits.slice(0, 3) + '-' +
          digits.slice(3, 7) + '-' +
          digits.slice(7);
      }
    });
  }

  /* ── 스크롤 진입 애니메이션 ── */
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.why-card, .recommend-item, .generation-card, ' +
      '.feature-item, .research-card, .price-card'
    );

    targets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition =
        `opacity 0.55s ease ${i % 4 * 0.08}s, ` +
        `transform 0.55s ease ${i % 4 * 0.08}s`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
  }
});

/* ── 폼 제출 ── */
const consultationForm = document.getElementById('consultationForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnLoading = document.getElementById('submitBtnLoading');
const formSuccess = document.getElementById('formSuccess');
const formResetBtn = document.getElementById('formResetBtn');

if (consultationForm) {
  consultationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name')?.value.trim() || '',
      phone: document.getElementById('phone')?.value.trim() || '',
      email: document.getElementById('email')?.value.trim() || '',
      region: document.getElementById('region')?.value.trim() || '',
      type: document.getElementById('consultType')?.value || '',
      ref: document.getElementById('referralCode')?.value.trim() || '',
      memo: document.getElementById('message')?.value.trim() || ''
    };

    if (!formData.name) {
      alert('이름을 입력해 주세요.');
      return;
    }

    if (!formData.phone) {
      alert('연락처를 입력해 주세요.');
      return;
    }

    try {
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.style.display = 'none';
      if (submitBtnLoading) submitBtnLoading.style.display = 'inline-flex';

      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        consultationForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        alert('접수 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
      }

    } catch (error) {
      console.error(error);
      alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitBtnText) submitBtnText.style.display = 'inline-flex';
      if (submitBtnLoading) submitBtnLoading.style.display = 'none';
    }
  });
}

if (formResetBtn) {
  formResetBtn.addEventListener('click', () => {
    if (consultationForm) {
      consultationForm.reset();

      const refFromUrl = (getQueryParam('ref') || '').trim();
      const refInput = document.getElementById('referralCode');
      const refDisplay = document.getElementById('refCodeDisplay');

      if (refInput) refInput.value = refFromUrl;
      if (refDisplay) refDisplay.textContent = refFromUrl || '없음';

      consultationForm.style.display = 'block';
    }

    if (formSuccess) {
      formSuccess.style.display = 'none';
    }
  });
}
