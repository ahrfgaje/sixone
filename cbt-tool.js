
(() => {
    if (window.CBTX) return;
    window.CBTX = true;

    const d = document;

    // ==========================================
    // 1. ANTI-CHEAT & HELPER FUNCTIONS
    // ==========================================
    window.handleAntiCheatViolation = function () {};

    [
        'contextmenu',
        'copy',
        'cut',
        'paste',
        'keydown',
        'visibilitychange',
        'blur'
    ].forEach(ev => {
        window.addEventListener(ev, e => e.stopImmediatePropagation(), true);
    });

    const mc = d.getElementById('cheat-modal');
    if (mc) mc.classList.add('hidden');

    const Q = () =>
        (typeof examQuestions !== 'undefined' &&
         examQuestions[currentQuestionIndex]) ||
        (typeof CBTToolsData !== 'undefined' &&
         CBTToolsData.questions[CBTToolsData.index]);

    const O = () =>
        d.querySelectorAll(
            '#options-container label, #options-container .option-card'
        );

    const X = () =>
        d.querySelectorAll('#options-container .category-row');

    // ==========================================
    // 2. CSS & BOTTOM SHEET
    // ==========================================
    const style = d.createElement('style');

    style.textContent = `
        .cbtxg {
            border-color: #22c55e !important;
            background: #f0fdf4 !important;
        }

        #cbtx-overlay {
            position: fixed;
            inset: 0;
            z-index: 2147483645;
            background: rgba(15, 23, 42, .38);
            opacity: 0;
            visibility: hidden;
            transition: opacity .25s ease, visibility .25s ease;
        }

        #cbtx-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        #cbtx-modal {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: auto;
            z-index: 2147483646;
            box-sizing: border-box;
            width: 100%;
            max-width: 560px;

            /* Tinggi panel: 45% layar */
            height: 45vh;
            height: 45dvh;
            max-height: 45vh;
            max-height: 45dvh;

            overflow-y: auto;
            overscroll-behavior: contain;
            background: #fff;
            color: #1e293b;

            padding: 12px 18px calc(20px + env(safe-area-inset-bottom));

            border-radius: 28px 28px 0 0;
            box-shadow: 0 -10px 40px rgba(15,23,42,.18);

            font-family: system-ui, -apple-system,
                BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

            transform: translateY(110%);
            visibility: hidden;

            transition:
                transform .32s cubic-bezier(.16, 1, .3, 1),
                visibility .32s;
        }

        #cbtx-modal.active {
            transform: translateY(0);
            visibility: visible;
        }

        #cbtx-modal * {
            box-sizing: border-box;
        }

        #cbtx-modal .cbtx-handle {
            width: 48px;
            height: 5px;
            border-radius: 20px;
            background: #cbd5e1;
            margin: 0 auto 16px;
        }

        #cbtx-modal .cbtx-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 12px;
        }

        #cbtx-modal .cbtx-card {
            min-width: 0;
            padding: 16px 14px;
            border: 1px solid;
            border-radius: 20px;
            cursor: pointer;
            text-align: left;
            font: inherit;
            transition: transform .15s, background-color .2s;
        }

        #cbtx-modal .cbtx-card:active {
            transform: scale(.98);
        }

        #cbtx-modal .cbtx-mark {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #1d4ed8;
        }

        #cbtx-modal .cbtx-auto {
            background: #f5f3ff;
            border-color: #ddd6fe;
            color: #6d28d9;
        }

        #cbtx-modal .cbtx-icon {
            font-size: 22px;
            margin-bottom: 6px;
        }

        #cbtx-modal .cbtx-title {
            font-weight: 700;
            font-size: 14px;
            line-height: 1.3;
        }

        #cbtx-modal .cbtx-subtitle {
            font-size: 11px;
            margin-top: 4px;
            opacity: .75;
            line-height: 1.3;
        }

        #cbtx-modal .cbtx-kkm {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 12px 14px;
            margin-bottom: 12px;
            border: 1px solid #a7f3d0;
            border-radius: 20px;
            background: #ecfdf5;
            transition: background-color .2s;
        }

        #cbtx-modal .cbtx-kkm-info {
            min-width: 0;
            cursor: pointer;
            flex: 1;
        }

        #cbtx-modal .cbtx-kkm-title {
            color: #047857;
            font-weight: 700;
            font-size: 13px;
        }

        #cbtx-modal .cbtx-kkm-sub {
            color: #059669;
            font-size: 11px;
            margin-top: 2px;
        }

        #cbtx-modal .cbtx-stepper {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border: 1px solid #d1fae5;
            background: #fff;
            border-radius: 12px;
            flex-shrink: 0;
        }

        #cbtx-modal .cbtx-stepper button {
            width: 26px;
            height: 26px;
            border: 0;
            border-radius: 6px;
            background: #e2e8f0;
            color: #334155;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
        }

        #cbtx-modal #kkm-value {
            min-width: 22px;
            text-align: center;
            color: #047857;
            font-weight: 700;
            font-size: 13px;
        }

        #cbtx-modal .cbtx-key {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
            padding: 12px 14px;
            margin-bottom: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            background: #f8fafc;
            color: #334155;
            font: inherit;
            cursor: pointer;
        }

        #cbtx-modal .cbtx-key-title {
            font-size: 13px;
            font-weight: 700;
        }

        #cbtx-modal .cbtx-key-sub {
            margin-top: 2px;
            font-size: 11px;
            color: #64748b;
        }

        #cbtx-modal .cbtx-status {
            padding: 10px 12px;
            border-radius: 14px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #334155;
            font-size: 11px;
            line-height: 1.5;
            white-space: pre-line;
            max-height: 100px;
            overflow-y: auto;
        }

        @media (min-width: 600px) {
            #cbtx-modal {
                left: 50%;
                right: auto;
                width: min(560px, 100%);
                transform: translate(-50%, 110%);
            }

            #cbtx-modal.active {
                transform: translate(-50%, 0);
            }
        }
    `;

    d.head.appendChild(style);

    // ==========================================
    // 3. OVERLAY & PANEL
    // ==========================================
    const overlay = d.createElement('div');
    overlay.id = 'cbtx-overlay';

    const panel = d.createElement('section');
    panel.id = 'cbtx-modal';

    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    // Header robot, judul, status dan tombol X dihapus.
    panel.innerHTML = `
        <div class="cbtx-handle"></div>

        <div class="cbtx-grid">
            <button type="button"
                class="cbtx-card cbtx-mark"
                id="btn-mark">

                <div class="cbtx-icon">🎯</div>
                <div class="cbtx-title">Jawab Soal Ini</div>
                <div class="cbtx-subtitle">Tandai soal aktif</div>
            </button>

            <button type="button"
                class="cbtx-card cbtx-auto"
                id="btn-auto">

                <div class="cbtx-icon">⚡</div>
                <div class="cbtx-title">Kerjakan Semua</div>
                <div class="cbtx-subtitle">30 soal otomatis</div>
            </button>
        </div>

        <div class="cbtx-kkm" id="btn-kkm-box">
            <div class="cbtx-kkm-info" id="btn-kkm">
                <div class="cbtx-kkm-title">
                    🏆 Auto di atas KKM
                </div>
                <div class="cbtx-kkm-sub">
                    Skor sedikit di atas target
                </div>
            </div>

            <div class="cbtx-stepper">
                <button type="button" id="kkm-minus">-</button>
                <span id="kkm-value">75</span>
                <button type="button" id="kkm-plus">+</button>
            </div>
        </div>

        <button type="button" class="cbtx-key" id="btn-key">
            <span style="font-size:18px">🔑</span>

            <div style="flex:1;">
                <div class="cbtx-key-title">Lihat Kunci</div>
                <div class="cbtx-key-sub">
                    Tampilkan kunci jawaban
                </div>
            </div>

            <span style="font-size:14px;color:#64748b">➡️</span>
        </button>

        <pre class="cbtx-status" id="cbtx-status"></pre>
    `;

    d.body.append(overlay, panel);

    // ==========================================
    // 4. BUKA / TUTUP PANEL
    // ==========================================
    function openPanel() {
        overlay.classList.add('active');
        panel.classList.add('active');
    }

    function closePanel() {
        overlay.classList.remove('active');
        panel.classList.remove('active');
    }

    // Tutup jika area di luar panel ditekan.
    overlay.onclick = closePanel;

    // Escape tetap berfungsi untuk menutup panel.
    d.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
    });

    // Ikon toga sebagai pemicu pembuka jika tersedia.
    const cap = d.querySelector('.fa-graduation-cap');

    if (cap && cap.parentElement) {
        const pr = cap.parentElement;
        pr.style.cursor = 'pointer';
        pr.title = 'Buka panel';

        pr.onclick = openPanel;
    }

    // ==========================================
    // 5. STATUS & PENGATURAN KKM
    // ==========================================
    const s = panel.querySelector('#cbtx-status');
    const kkmValSpan = panel.querySelector('#kkm-value');

    let targetKKM = 75;

    panel.querySelector('#kkm-plus').onclick = e => {
        e.stopPropagation();

        if (targetKKM < 95) targetKKM += 5;

        kkmValSpan.textContent = targetKKM;
    };

    panel.querySelector('#kkm-minus').onclick = e => {
        e.stopPropagation();

        if (targetKKM > 40) targetKKM -= 5;

        kkmValSpan.textContent = targetKKM;
    };

    // ==========================================
    // 6. KUNCI JAWABAN
    // ==========================================
    function key() {
        const q = Q();

        if (!q) {
            s.textContent = 'Data soal tidak ditemukan.';
            return;
        }

        const c = q.correct;

        if (q.type === 'category') {
            s.textContent = c
                .map((v, i) =>
                    (i + 1) + '. ' + (v ? 'Benar' : 'Salah')
                )
                .join('\n');
        } else {
            s.textContent = 'Kunci: ' +
                (Array.isArray(c)
                    ? c.map(i => String.fromCharCode(65 + i)).join(', ')
                    : String.fromCharCode(65 + c));
        }
    }

    // ==========================================
    // 7. PENANDA OPSI
    // ==========================================
    function mark() {
        d.querySelectorAll('.cbtxg').forEach(e => {
            e.classList.remove('cbtxg');
        });

        const q = Q();

        if (!q) {
            s.textContent = 'Data soal tidak ditemukan.';
            return;
        }

        const c = q.correct;

        if (q.type === 'category') {
            X().forEach((r, j) => {
                [...r.querySelectorAll('label')].forEach(l => {
                    const v =
                        l.querySelector('input')?.value === 'true';

                    if (v === c[j]) {
                        l.classList.add('cbtxg');
                    }
                });
            });
        } else {
            const opts = O();
            const correctArr = Array.isArray(c) ? c : [c];

            correctArr.forEach(j => {
                if (opts[j]) opts[j].classList.add('cbtxg');
            });
        }

        s.textContent = 'Jawaban benar telah ditandai.';
    }

    // ==========================================
    // 8. PEMILIHAN OPSI
    // ==========================================
    function ans(shouldBeCorrect = true) {
        const q = Q();

        if (!q) {
            s.textContent = 'Data soal tidak ditemukan.';
            return;
        }

        const c = q.correct;
        const correctArr = Array.isArray(c) ? c : [c];
        const radio = d.querySelectorAll(
            '#options-container input[type="radio"]'
        );

        let targetIndex = correctArr[0];

        if (!shouldBeCorrect && radio.length > 1) {
            targetIndex = (correctArr[0] + 1) % radio.length;
        }

        if (radio.length > 0) {
            if (radio[targetIndex]) {
                radio[targetIndex].click();
            }
        } else {
            const opts = O();

            if (opts[targetIndex]) {
                opts[targetIndex].click();
            }
        }
    }

    // ==========================================
    // 9. STATUS PROSES
    // ==========================================
    let isAutoRunning = false;
    let isKKMRunning = false;

    // Kontrol otomatis dan pengaturan target KKM
    // dipertahankan dari implementasi awal.
    panel.querySelector('#btn-auto').onclick = () => {
        if (isAutoRunning) {
            isAutoRunning = false;

            panel.querySelector('#btn-auto')
                .style.background = '#f5f3ff';

            s.textContent = 'Proses otomatis dihentikan.';
            return;
        }

        if (isKKMRunning) return;

        isAutoRunning = true;

        panel.querySelector('#btn-auto')
            .style.background = '#ddd6fe';

        s.textContent =
            'Proses otomatis berjalan. Klik lagi untuk berhenti.';

        (function n() {
            if (!isAutoRunning) return;

            ans(true);

            setTimeout(() => {
                let idx =
                    typeof currentQuestionIndex !== 'undefined'
                        ? currentQuestionIndex
                        : (typeof CBTToolsData !== 'undefined'
                            ? CBTToolsData.index
                            : 0);

                if (idx < 29 && isAutoRunning) {
                    if (typeof nextQuestion === 'function') {
                        nextQuestion();
                    } else if (
                        typeof CBTToolsAPI !== 'undefined' &&
                        CBTToolsAPI.next
                    ) {
                        CBTToolsAPI.next();
                    }

                    setTimeout(n, 450);
                } else {
                    isAutoRunning = false;

                    panel.querySelector('#btn-auto')
                        .style.background = '#f5f3ff';

                    mark();
                    s.textContent = 'Proses selesai.';
                }
            }, 550);
        })();
    };

    panel.querySelector('#btn-kkm').onclick = () => {
        if (isKKMRunning) {
            isKKMRunning = false;

            panel.querySelector('#btn-kkm-box')
                .style.background = '#ecfdf5';

            s.textContent = 'Proses KKM dihentikan.';
            return;
        }

        if (isAutoRunning) return;

        isKKMRunning = true;

        panel.querySelector('#btn-kkm-box')
            .style.background = '#a7f3d0';

        s.textContent = `Target KKM: ${targetKKM}`;

        const totalSoal = 30;
        const targetBenar =
            Math.ceil((targetKKM / 100) * totalSoal) + 1;

        (function loopKKM(currentIndex = 0) {
            if (!isKKMRunning) return;

            const shouldBeCorrect = currentIndex < targetBenar;

            ans(shouldBeCorrect);

            setTimeout(() => {
                const idx =
                    typeof currentQuestionIndex !== 'undefined'
                        ? currentQuestionIndex
                        : (typeof CBTToolsData !== 'undefined'
                            ? CBTToolsData.index
                            : 0);

                if (idx < totalSoal - 1 && isKKMRunning) {
                    if (typeof nextQuestion === 'function') {
                        nextQuestion();
                    } else if (
                        typeof CBTToolsAPI !== 'undefined' &&
                        CBTToolsAPI.next
                    ) {
                        CBTToolsAPI.next();
                    }

                    setTimeout(() => loopKKM(idx + 1), 450);
                } else {
                    isKKMRunning = false;

                    panel.querySelector('#btn-kkm-box')
                        .style.background = '#ecfdf5';

                    mark();

                    s.textContent =
                        `Proses KKM selesai. Target: ${targetKKM}.`;
                }
            }, 550);
        })();
    };

    panel.querySelector('#btn-key').onclick = key;
    panel.querySelector('#btn-mark').onclick = mark;

    // ==========================================
    // 10. TAMPILKAN PANEL SAAT SCRIPT DIMUAT
    // ==========================================
    openPanel();
})();
