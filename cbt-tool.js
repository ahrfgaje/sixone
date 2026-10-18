(() => {
    if (window.CBTX) return;
    window.CBTX = true;

    const d = document;

    // ==========================================
    // 1. HELPER FUNCTIONS
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

    const Q = () => {
        try {
            if (
                typeof examQuestions !== 'undefined' &&
                Array.isArray(examQuestions) &&
                examQuestions[currentQuestionIndex]
            ) {
                return examQuestions[currentQuestionIndex];
            }
        } catch (_) {}

        try {
            if (
                typeof CBTToolsData !== 'undefined' &&
                Array.isArray(CBTToolsData.questions)
            ) {
                return CBTToolsData.questions[CBTToolsData.index];
            }
        } catch (_) {}

        return null;
    };

    // ==========================================
    // 2. JUMLAH SOAL OTOMATIS
    // ==========================================
    const getTotalQuestions = () => {
        try {
            if (
                typeof examQuestions !== 'undefined' &&
                Array.isArray(examQuestions) &&
                examQuestions.length > 0
            ) {
                return examQuestions.length;
            }
        } catch (_) {}

        try {
            if (
                typeof activeQuestions !== 'undefined' &&
                Array.isArray(activeQuestions) &&
                activeQuestions.length > 0
            ) {
                return activeQuestions.length;
            }
        } catch (_) {}

        try {
            if (
                typeof CBTToolsData !== 'undefined' &&
                Array.isArray(CBTToolsData.questions) &&
                CBTToolsData.questions.length > 0
            ) {
                return CBTToolsData.questions.length;
            }
        } catch (_) {}

        const grid = d.querySelectorAll(
            '#question-grid button, [id^="grid-btn-"]'
        );

        if (grid.length > 0) return grid.length;

        const questionCards = d.querySelectorAll(
            '[data-question-index], .question-item'
        );

        return questionCards.length;
    };

    const getCurrentIndex = () => {
        try {
            if (typeof currentQuestionIndex !== 'undefined') {
                return Number(currentQuestionIndex) || 0;
            }
        } catch (_) {}

        try {
            if (typeof CBTToolsData !== 'undefined') {
                return Number(CBTToolsData.index) || 0;
            }
        } catch (_) {}

        return 0;
    };

    const O = () => d.querySelectorAll(
        '#options-container label, #options-container .option-card'
    );

    const X = () => d.querySelectorAll(
        '#options-container .category-row'
    );

    // ==========================================
    // 3. NAVIGASI SOAL
    // ==========================================
    const setCurrentQuestion = index => {
        try {
            if (typeof loadQuestion === 'function') {
                loadQuestion(index);
                return true;
            }
        } catch (_) {}

        try {
            if (
                typeof CBTToolsAPI !== 'undefined' &&
                typeof CBTToolsAPI.goTo === 'function'
            ) {
                CBTToolsAPI.goTo(index);
                return true;
            }
        } catch (_) {}

        return false;
    };

    const goNextQuestion = () => {
        const total = getTotalQuestions();
        const nextIndex = getCurrentIndex() + 1;

        if (nextIndex < total) {
            try {
                if (typeof loadQuestion === 'function') {
                    loadQuestion(nextIndex);
                    return true;
                }
            } catch (_) {}

            try {
                if (
                    typeof CBTToolsAPI !== 'undefined' &&
                    typeof CBTToolsAPI.goTo === 'function'
                ) {
                    CBTToolsAPI.goTo(nextIndex);
                    return true;
                }
            } catch (_) {}
        }

        try {
            if (
                typeof CBTToolsAPI !== 'undefined' &&
                typeof CBTToolsAPI.next === 'function'
            ) {
                CBTToolsAPI.next();
                return true;
            }
        } catch (_) {}

        return false;
    };

    // ==========================================
    // 4. CSS PANEL
    // ==========================================
    const style = d.createElement('style');

    style.textContent = `
        .cbtxg {
            border: 2px solid #22c55e !important;
            background: #f0fdf4 !important;
            color: #166534 !important;
            box-shadow: inset 0 0 0 1px #22c55e !important;
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
    // 5. PANEL & TOMBOL
    // ==========================================
    const overlay = d.createElement('div');
    overlay.id = 'cbtx-overlay';

    const panel = d.createElement('section');
    panel.id = 'cbtx-modal';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    panel.innerHTML = `
        <div class="cbtx-handle"></div>

        <div class="cbtx-grid">
            <button type="button"
                class="cbtx-card cbtx-mark"
                id="btn-mark">
                <div class="cbtx-icon">🎯</div>
                <div class="cbtx-title">Jawab Soal Ini</div>
                <div class="cbtx-subtitle">
                    Pilih jawaban dan tandai
                </div>
            </button>

            <button type="button"
                class="cbtx-card cbtx-auto"
                id="btn-auto">
                <div class="cbtx-icon">⚡</div>
                <div class="cbtx-title">Kerjakan Semua</div>
                <div class="cbtx-subtitle"
                    id="cbtx-auto-subtitle">
                    Memuat jumlah soal…
                </div>
            </button>
        </div>

        <div class="cbtx-kkm" id="btn-kkm-box">
            <div class="cbtx-kkm-info" id="btn-kkm">
                <div class="cbtx-kkm-title">
                    🏆 Auto di atas KKM
                </div>
                <div class="cbtx-kkm-sub">
                    Target nilai minimal yang dipilih
                </div>
            </div>

            <div class="cbtx-stepper">
                <button type="button"
                    id="kkm-minus"
                    aria-label="Kurangi KKM">−</button>

                <span id="kkm-value">65</span>

                <button type="button"
                    id="kkm-plus"
                    aria-label="Tambah KKM">+</button>
            </div>
        </div>

        <button type="button" class="cbtx-key" id="btn-key">
            <span style="font-size:18px">🔑</span>
            <div style="flex:1">
                <div class="cbtx-key-title">Lihat Kunci</div>
                <div class="cbtx-key-sub">
                    Tampilkan kunci soal aktif
                </div>
            </div>
            <span style="font-size:14px;color:#64748b">➡️</span>
        </button>

        <pre class="cbtx-status"
            id="cbtx-status"
            aria-live="polite"></pre>
    `;

    d.body.append(overlay, panel);

    // ==========================================
    // 6. BUKA / TUTUP PANEL
    // ==========================================
    function openPanel() {
        overlay.classList.add('active');
        panel.classList.add('active');
        updateQuestionCountLabel();
    }

    function closePanel() {
        overlay.classList.remove('active');
        panel.classList.remove('active');
    }

    overlay.addEventListener('click', closePanel);

    panel.addEventListener('click', e => {
        e.stopPropagation();
    });

    d.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePanel();
    });

    const cap = d.querySelector('.fa-graduation-cap');

    if (cap && cap.parentElement) {
        const trigger = cap.parentElement;
        trigger.style.cursor = 'pointer';
        trigger.title = 'Buka panel';
        trigger.addEventListener('click', openPanel);
    }

    // ==========================================
    // 7. PENGATURAN KKM
    // ==========================================
    const s = panel.querySelector('#cbtx-status');
    const kkmValSpan = panel.querySelector('#kkm-value');
    const autoSubtitle = panel.querySelector(
        '#cbtx-auto-subtitle'
    );

    let targetKKM = 65;

    function updateQuestionCountLabel() {
        const total = getTotalQuestions();

        autoSubtitle.textContent = total > 0
            ? `${total} soal otomatis`
            : 'Jumlah soal belum terdeteksi';
    }

    panel.querySelector('#kkm-plus').onclick = e => {
        e.stopPropagation();

        if (targetKKM < 100) {
            targetKKM = Math.min(100, targetKKM + 5);
        }

        kkmValSpan.textContent = targetKKM;
    };

    panel.querySelector('#kkm-minus').onclick = e => {
        e.stopPropagation();

        if (targetKKM > 40) {
            targetKKM = Math.max(40, targetKKM - 5);
        }

        kkmValSpan.textContent = targetKKM;
    };

    // ==========================================
    // 8. LIHAT KUNCI
    // ==========================================
    function key() {
        const q = Q();

        if (!q) {
            s.textContent =
                'Data soal tidak ditemukan. Buka soal terlebih dahulu.';
            return;
        }

        const c = q.correct;

        if (q.type === 'category' && Array.isArray(c)) {
            s.textContent = c.map((v, i) =>
                `${i + 1}. ${v ? 'Benar' : 'Salah'}`
            ).join('\n');
        } else {
            const correctArr = Array.isArray(c) ? c : [c];

            s.textContent = 'Kunci: ' + correctArr.map(i =>
                typeof i === 'number'
                    ? String.fromCharCode(65 + i)
                    : String(i)
            ).join(', ');
        }
    }

    // ==========================================
    // 9. JAWAB SOAL INI: PILIH + TANDAI
    // ==========================================
    function mark() {
        const q = Q();

        if (!q) {
            s.textContent =
                'Data soal tidak ditemukan. Buka soal terlebih dahulu.';
            return;
        }

        d.querySelectorAll(
            '#options-container .cbtxg'
        ).forEach(el => {
            el.classList.remove('cbtxg');
        });

        const c = q.correct;

        // Soal kategori benar/salah
        if (q.type === 'category' && Array.isArray(c)) {
            X().forEach((row, rowIndex) => {
                [...row.querySelectorAll('label')].forEach(label => {
                    const input = label.querySelector('input');

                    if (!input) return;

                    const value = input.value === 'true';

                    if (value === c[rowIndex]) {
                        label.classList.add('cbtxg');
                    }
                });
            });

            s.textContent =
                'Jawaban benar pada soal aktif sudah ditandai.';
            return;
        }

        const correctArr = Array.isArray(c) ? c : [c];

        const radios = d.querySelectorAll(
            '#options-container input[type="radio"]'
        );

        // Pilih jawaban melalui fungsi halaman bila tersedia.
        if (radios.length && correctArr.length === 1) {
            const answerIndex = Number(correctArr[0]);

            try {
                if (typeof selectAnswer === 'function') {
                    selectAnswer(answerIndex);
                } else {
                    const radio = [
                        ...d.querySelectorAll(
                            '#options-container input[type="radio"]'
                        )
                    ].find(input =>
                        Number(input.value) === answerIndex
                    );

                    if (radio) {
                        radio.checked = true;
                        radio.dispatchEvent(
                            new Event('change', { bubbles: true })
                        );
                    }
                }
            } catch (_) {}
        }

        // Cari ulang elemen setelah kemungkinan render ulang.
        const options = O();

        correctArr.forEach(index => {
            const option = options[Number(index)];

            if (option) {
                option.classList.add('cbtxg');
            }
        });

        s.textContent =
            'Jawaban benar dipilih dan ditandai hijau.';
    }

    // ==========================================
    // 10. PEMILIHAN OPSI
    // ==========================================
    function ans(shouldBeCorrect = true) {
        const q = Q();

        if (!q) return false;

        const correct = q.correct;
        const correctArr = Array.isArray(correct)
            ? correct
            : [correct];

        const radios = [
            ...d.querySelectorAll(
                '#options-container input[type="radio"]'
            )
        ];

        if (radios.length > 0) {
            const correctIndex = Number(correctArr[0]);
            let targetIndex = correctIndex;

            if (!shouldBeCorrect && radios.length > 1) {
                targetIndex = (correctIndex + 1) % radios.length;
            }

            const radio = radios.find(input =>
                Number(input.value) === targetIndex
            );

            if (!radio) return false;

            radio.click();
            return true;
        }

        const options = O();

        let targetIndex = Number(correctArr[0]);

        if (!shouldBeCorrect && options.length > 1) {
            targetIndex = (targetIndex + 1) % options.length;
        }

        if (options[targetIndex]) {
            options[targetIndex].click();
            return true;
        }

        return false;
    }

    // ==========================================
    // 11. PROSES OTOMATIS & KKM DINAMIS
    // ==========================================
    let isAutoRunning = false;
    let isKKMRunning = false;
    let runToken = 0;

    const autoBtn = panel.querySelector('#btn-auto');
    const kkmBox = panel.querySelector('#btn-kkm-box');

    function resetAutoButton() {
        autoBtn.style.background = '#f5f3ff';
    }

    function resetKKMBox() {
        kkmBox.style.background = '#ecfdf5';
    }

    function stopAll() {
        isAutoRunning = false;
        isKKMRunning = false;
        runToken++;

        resetAutoButton();
        resetKKMBox();
    }

    function runSequence(mode) {
        const total = getTotalQuestions();

        if (total <= 0) {
            s.textContent =
                'Jumlah soal tidak ditemukan. Pastikan soal sudah dimuat.';
            return;
        }

        if (!setCurrentQuestion(0)) {
            s.textContent =
                'Navigasi ke soal pertama tidak tersedia.';
            return;
        }

        const thisRun = ++runToken;

        const targetCorrect = mode === 'kkm'
            ? Math.ceil((targetKKM / 100) * total)
            : total;

        if (mode === 'kkm') {
            isKKMRunning = true;
            kkmBox.style.background = '#a7f3d0';

            s.textContent =
                `Target KKM: ${targetKKM}\n` +
                `Jumlah soal: ${total}\n` +
                `Minimal jawaban benar: ${targetCorrect}/${total}\n` +
                `Nilai minimal yang dapat dicapai: ` +
                `${Math.round(targetCorrect / total * 10000) / 100}`;
        } else {
            isAutoRunning = true;
            autoBtn.style.background = '#ddd6fe';

            s.textContent =
                `Proses otomatis: 0/${total} soal`;
        }

        function stillRunning() {
            return thisRun === runToken &&
                (mode === 'kkm'
                    ? isKKMRunning
                    : isAutoRunning);
        }

        function finish(message) {
            if (mode === 'kkm') {
                isKKMRunning = false;
                resetKKMBox();
            } else {
                isAutoRunning = false;
                resetAutoButton();
            }

            s.textContent = message;
        }

        function step(processed) {
            if (!stillRunning()) return;

            const shouldBeCorrect = mode === 'kkm'
                ? processed < targetCorrect
                : true;

            if (!ans(shouldBeCorrect)) {
                finish(
                    'Tidak bisa memilih opsi pada soal ini. ' +
                    'Struktur opsi mungkin berbeda.'
                );
                return;
            }

            s.textContent = mode === 'kkm'
                ? `Proses KKM: ${processed + 1}/${total}\n` +
                  `Target benar: ${targetCorrect}/${total}`
                : `Proses otomatis: ${processed + 1}/${total} soal`;

            setTimeout(() => {
                if (!stillRunning()) return;

                if (processed + 1 >= total) {
                    finish(
                        mode === 'kkm'
                            ? `Proses KKM selesai.\n` +
                              `Target KKM: ${targetKKM}\n` +
                              `Target benar: ${targetCorrect} dari ${total} soal.`
                            : `Proses selesai: ${total} soal diproses.`
                    );

                    return;
                }

                if (!goNextQuestion()) {
                    finish(
                        'Tidak bisa berpindah ke soal berikutnya. ' +
                        'Fungsi navigasi tidak ditemukan.'
                    );

                    return;
                }

                setTimeout(() => {
                    step(processed + 1);
                }, 450);
            }, 550);
        }

        step(0);
    }

    autoBtn.onclick = () => {
        if (isAutoRunning) {
            stopAll();
            s.textContent = 'Proses otomatis dihentikan.';
            return;
        }

        if (isKKMRunning) return;

        runSequence('all');
    };

    panel.querySelector('#btn-kkm').onclick = () => {
        if (isKKMRunning) {
            stopAll();
            s.textContent = 'Proses KKM dihentikan.';
            return;
        }

        if (isAutoRunning) return;

        runSequence('kkm');
    };

    panel.querySelector('#btn-key').onclick = key;
    panel.querySelector('#btn-mark').onclick = mark;

    // ==========================================
    // 12. TAMPILKAN PANEL
    // ==========================================
    updateQuestionCountLabel();
    openPanel();
})();
