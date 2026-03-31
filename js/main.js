/* =============================================
   참빛 미네랄 수소수기 - FINAL VERSION
   - HTML 구조 100% 대응
   - 값 누락 방지
   - 추천코드 충돌 제거
   ============================================= */

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjq4v2MLhzQZRCf5bCJKmO_tremdzalIgler3yg4zaq4E8bwHEoSvq4Xq0x87EpTE/exec";

/* ===== 공통 함수 ===== */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/* ===== 추천코드 처리 ===== */
window.addEventListener('DOMContentLoaded', function () {
  const ref = (getQueryParam('ref') || '').trim();

  const refInput = document.getElementById('referralCode');
  const refDisplay = document.getElementById('refCodeDisplay');

  if (refInput) refInput.value = ref;
  if (refDisplay) refDisplay.textContent = ref || '없음';

  /* ===== 전화번호 자동 포맷 ===== */
  const phone = document.getElementById('phone');
  if (phone) {
    phone.addEventListener('input', function () {
      const num = this.value.replace(/\D/g, '').slice(0, 11);

      if (num.length <= 3) {
        this.value = num;
      } else if (num.length <= 7) {
        this.value = num.slice(0, 3) + '-' + num.slice(3);
      } else {
        this.value =
          num.slice(0, 3) + '-' +
          num.slice(3, 7) + '-' +
          num.slice(7);
      }
    });
  }
});

/* ===== 폼 제출 ===== */
const form = document.getElementById('consultationForm');
const btn = document.getElementById('submitBtn');
const btnText = document.getElementById('submitBtnText');
const btnLoading = document.getElementById('submitBtnLoading');
const successBox = document.getElementById('formSuccess');
const resetBtn = document.getElementById('formResetBtn');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: getValue('name'),
      phone: getValue('phone'),
      email: '', // 없음
      region: getValue('region'),
      storeType: getValue('consultType'),
      installTarget: getValue('installTarget'),
      purpose: getValue('purpose'),
      ref: getValue('referralCode'),
      message: '' // 없음
    };

    console.log("전송 데이터:", data);

    if (!data.name) {
      alert('이름을 입력하세요');
      return;
    }

    if (!data.phone) {
      alert('연락처를 입력하세요');
      return;
    }

    if (!data.storeType) {
      alert('상담 유형을 선택하세요');
      return;
    }

    try {
      btn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';

      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("응답:", result);

      if (result.success) {
        form.style.display = 'none';
        successBox.style.display = 'block';
      } else {
        alert(result.message || '오류 발생');
      }

    } catch (err) {
      console.error(err);
      alert('전송 실패');
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline-flex';
      btnLoading.style.display = 'none';
    }
  });
}

/* ===== 폼 초기화 ===== */
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    form.reset();

    const ref = (getQueryParam('ref') || '').trim();

    document.getElementById('referralCode').value = ref;
    document.getElementById('refCodeDisplay').textContent = ref || '없음';

    form.style.display = 'block';
    successBox.style.display = 'none';
  });
}

/* ===== 상단 버튼 ===== */
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
