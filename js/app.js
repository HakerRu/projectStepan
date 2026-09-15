var API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {

    // ===== МОБИЛЬНОЕ МЕНЮ =====
    var burger = document.querySelector('.burger-menu');
    var nav = document.querySelector('.nav');
    if (burger && nav) {
        burger.removeAttribute('onclick');
        var overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:998;display:none;';
        document.body.appendChild(overlay);

        function openMenu() {
            nav.classList.add('active');
            nav.style.right = '0';
            overlay.style.display = 'block';
            burger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            nav.classList.remove('active');
            nav.style.right = '-100%';
            overlay.style.display = 'none';
            burger.classList.remove('active');
            document.body.style.overflow = '';
        }

        burger.addEventListener('click', function() {
            nav.classList.contains('active') ? closeMenu() : openMenu();
        });
        overlay.addEventListener('click', closeMenu);
        nav.querySelectorAll('.nav__link').forEach(function(l) {
            l.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // ===== ФОРМА КОНТАКТОВ =====
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                alert('Подтвердите согласие на обработку данных');
                return;
            }

            var btn = this.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            fetch(API_URL + '/save-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    name: document.getElementById('name').value,
                    company: document.getElementById('company').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    status: 'new'
                })
            })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success) {
                        showToast('✅ Заявка отправлена! Свяжемся в ближайшее время.');
                        contactForm.reset();
                    } else {
                        showToast('❌ Ошибка: ' + (data.error || 'попробуйте ещё раз'), 'error');
                    }
                })
                .catch(function() {
                    showToast('❌ Ошибка сети. Попробуйте ещё раз.', 'error');
                })
                .finally(function() {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }

    // ===== ФОРМА БЫСТРОГО РАСЧЁТА (на главной) =====
    var quickForm = document.getElementById('quickCalcForm');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var btn = this.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            fetch(API_URL + '/save-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'quick_calc',
                    productType: this.querySelector('[name="productType"]').value,
                    area: this.querySelector('[name="area"]').value,
                    phone: this.querySelector('[name="phone"]').value,
                    status: 'new'
                })
            })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success) {
                        showToast('✅ Расчёт отправлен! Перезвоним в течение 15 минут.');
                        quickForm.reset();
                    } else {
                        showToast('❌ Ошибка: ' + (data.error || 'попробуйте ещё раз'), 'error');
                    }
                })
                .catch(function() {
                    showToast('❌ Ошибка сети. Попробуйте ещё раз.', 'error');
                })
                .finally(function() {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }

    // ===== FAQ АККОРДЕОН =====
    document.querySelectorAll('.faq-question').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var item = this.parentElement;
            document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('active'); });
            item.classList.toggle('active');
        });
    });

    // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('animated');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) { observer.observe(el); });

    // ===== ХЕДЕР ПРИ СКРОЛЛЕ =====
    var header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }

    // ===== СЛАЙДЕР =====
    document.querySelectorAll('.slider').forEach(function(slider) {
        var track = slider.querySelector('.slider-track');
        var slides = slider.querySelectorAll('.slider-slide');
        var prevBtn = slider.querySelector('.slider-btn.prev');
        var nextBtn = slider.querySelector('.slider-btn.next');
        var dotsContainer = slider.querySelector('.slider-dots');
        if (!track || slides.length === 0) return;
        var index = 0;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach(function(_, i) {
                var dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', function() { goTo(i); });
                dotsContainer.appendChild(dot);
            });
        }

        function update() {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.slider-dot').forEach(function(d, i) {
                    d.classList.toggle('active', i === index);
                });
            }
        }

        function goTo(i) { index = i; update(); }
        function next() { index = (index + 1) % slides.length; update(); }
        function prev() { index = (index - 1 + slides.length) % slides.length; update(); }
        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);
        setInterval(next, 5000);
    });

    // ===== ГОД В ФУТЕРЕ =====
    var yearSpan = document.querySelector('.current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// ===== КНОПКА "ЗАКАЗАТЬ ЗВОНОК" =====
function openCallback() {
    var phone = prompt('📞 Введите ваш номер телефона:');
    if (phone && phone.trim()) {
        fetch(API_URL + '/save-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'callback', phone: phone.trim(), status: 'new' })
        })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) alert('✅ Спасибо! Мы перезвоним вам.');
                else alert('❌ Ошибка. Попробуйте ещё раз.');
            })
            .catch(function() { alert('❌ Ошибка сети.'); });
    }
}

// ===== ТОСТ =====
function showToast(msg, type) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:20px;right:20px;padding:20px 30px;border-radius:8px;z-index:9999;font-weight:600;color:white;box-shadow:0 8px 25px rgba(0,0,0,0.2);background:' + (type === 'error' ? '#EF4444' : '#10B981') + ';';
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
}

// ===== ОВЕРЛЕЙ УСПЕХА =====
function showSuccessOverlay() {
    var overlay = document.getElementById('successOverlay');
    if (!overlay) return;

    overlay.classList.add('active');

    // Автозакрытие через 3 секунды
    setTimeout(function() {
        overlay.classList.remove('active');
    }, 3000);

    // Закрытие по клику
    overlay.onclick = function() {
        overlay.classList.remove('active');
    };
}

// ===== КАЛЬКУЛЯТОР (для calculator.html) =====
document.addEventListener('DOMContentLoaded', function() {
    var typeSelect = document.getElementById('productType');
    var paramsContainer = document.getElementById('productParams');
    var resultContainer = document.getElementById('calcResult');
    var calcForm = document.getElementById('calculatorForm');

    if (!typeSelect || !paramsContainer) return;

    typeSelect.addEventListener('change', function() {
        var type = this.value;
        var html = '';

        if (type === 'sandwich') {
            html = `
                <div class="form-group">
                    <label>Наполнитель</label>
                    <select name="filler" required>
                        <option value="">Выберите наполнитель</option>
                        <option value="mineral_wool">Минвата</option>
                        <option value="pir">PIR</option>
                        <option value="eps">Пенополистирол</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Толщина панели (мм)</label>
                    <select name="thickness" required>
                        <option value="">Выберите толщину</option>
                        <option value="50">50 мм</option>
                        <option value="80">80 мм</option>
                        <option value="100">100 мм</option>
                        <option value="120">120 мм</option>
                        <option value="150">150 мм</option>
                        <option value="200">200 мм</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Площадь (м²)</label>
                    <input type="number" name="area" required min="1" placeholder="Например: 500">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__">
                </div>
            `;
        } else if (type === 'proflist') {
            html = `
                <div class="form-group">
                    <label>Тип профлиста</label>
                    <select name="product" required>
                        <option value="">Выберите тип</option>
                        <option value="C8">C8</option>
                        <option value="C21">C21</option>
                        <option value="HC35">HC35</option>
                        <option value="H60">H60</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Толщина металла (мм)</label>
                    <select name="metalThickness" required>
                        <option value="">Выберите толщину</option>
                        <option value="0.4">0.4 мм</option>
                        <option value="0.5">0.5 мм</option>
                        <option value="0.7">0.7 мм</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Покрытие</label>
                    <select name="coating" required>
                        <option value="">Выберите покрытие</option>
                        <option value="zinc">Оцинковка</option>
                        <option value="polyester">Полиэстер</option>
                        <option value="pural">Пурал</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Цвет (RAL)</label>
                    <select name="color" required>
                        <option value="">Выберите цвет</option>
                        <option value="9003">RAL 9003 — Белый</option>
                        <option value="7024">RAL 7024 — Графит</option>
                        <option value="3005">RAL 3005 — Красное вино</option>
                        <option value="6005">RAL 6005 — Зелёный мох</option>
                        <option value="5005">RAL 5005 — Синий</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Площадь (м²)</label>
                    <input type="number" name="area" required min="1" placeholder="Например: 500">
                </div>
                <div class="form-group">
                    <label>Телефон</label>
                    <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__">
                </div>
            `;
        }

        paramsContainer.innerHTML = html;
        resultContainer.innerHTML = '';
    });

    if (calcForm) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            var data = {
                type: 'quick_calc',
                status: 'new'
            };
            formData.forEach(function(value, key) {
                data[key] = value;
            });

            var btn = this.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            fetch(API_URL + '/save-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (res.success) {
                        showSuccessOverlay();
                        calcForm.reset();
                        paramsContainer.innerHTML = '';
                    } else {
                        showToast('❌ ' + (res.error || 'Ошибка'), 'error');
                    }
                })
                .catch(function() {
                    showToast('❌ Ошибка сети', 'error');
                })
                .finally(function() {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }
});

// ===== ГЛОБАЛЬНАЯ toggleMenu =====
function toggleMenu() {
    var burger = document.querySelector('.burger-menu');
    if (burger) burger.click();
}