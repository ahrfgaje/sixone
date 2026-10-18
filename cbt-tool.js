(() => {
    if (window.CBTX) return;
    window.CBTX = 1;

    // Bypass Anti-Cheat
    window.handleAntiCheatViolation = function () {};
    ['contextmenu', 'copy', 'cut', 'paste', 'keydown', 'visibilitychange', 'blur'].forEach(ev => {
        window.addEventListener(ev, e => e.stopImmediatePropagation(), true);
    });
    const mc = document.getElementById('cheat-modal');
    if (mc) mc.classList.add('hidden');

    const d = document,
          Q = () => examQuestions[currentQuestionIndex] || CBTToolsData.questions[CBTToolsData.index],
          O = () => d.querySelectorAll('#options-container label, #options-container .option-card'),
          X = () => d.querySelectorAll('#options-container .category-row');

    // Tambahkan CSS Keyframes untuk Animasi Slide Up dari Bawah

let st = d.createElement('style');

st.textContent = `
    @keyframes cbtxSlideUp {
        from {
            transform: translateY(100%);
            opacity: 0.7;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes cbtxSlideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0.7;
        }
    }

    #cbtx-modal {
        position: fixed !important;
        top: auto !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;

        width: 100% !important;
        max-width: none !important;
        max-height: 85dvh !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;

        padding: 24px 20px;
        padding-bottom: max(24px, env(safe-area-inset-bottom));

        background: #fff;
        border-radius: 26px 26px 0 0;
        box-shadow: 0 -8px 35px rgba(0,0,0,.18);

        transform: none !important;
        z-index: 2147483647;
        font-family: system-ui, sans-serif;
        -webkit-overflow-scrolling: touch;
    }

    #cbtx-modal .cbtx-handle {
        width: 42px;
        height: 5px;
        border-radius: 999px;
        background: #d1d5db;
        margin: -12px auto 20px;
    }

    .cbtxg {
        border-color: #22c55e !important;
        background: #f0fdf4 !important;
    }
`;

d.head.append(st);


    // Buat Panel Modal Asisten AI dengan Tampilan Baru & Animasi
    let p = d.createElement('div');
    p.id = 'cbtx-modal';
    p.style = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#fff;width:90%;max-width:380px;padding:20px;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,0.2);font-family:system-ui,sans-serif;animation:slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);';
    p.innerHTML = `

<div class="cbtx-handle"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
            <div id="btn-mark" style="background:#eff6ff;border:1px solid #bfdbfe;padding:14px;border-radius:16px;cursor:pointer;">
                <div style="color:#2563eb;font-size:18px;margin-bottom:6px;">🎯</div>
                <div style="font-weight:bold;font-size:13px;color:#1e40af;">Jawab Soal Ini</div>
                <div style="font-size:11px;color:#60a5fa;">Tandai soal aktif</div>
            </div>
            <div id="btn-auto" style="background:#f5f3ff;border:1px solid #ddd6fe;padding:14px;border-radius:16px;cursor:pointer;">
                <div style="color:#7c3aed;font-size:18px;margin-bottom:6px;">⚡</div>
                <div style="font-weight:bold;font-size:13px;color:#6d28d9;">Kerjakan Semua</div>
                <div style="font-size:11px;color:#a78bfa;">30 soal otomatis</div>
            </div>
        </div>
        <!-- FITUR BARU: AUTO DI ATAS KKM -->
        <div id="btn-kkm-box" style="background:#ecfdf5;border:1px solid #a7f3d0;padding:12px 14px;border-radius:16px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
            <div id="btn-kkm" style="cursor:pointer;flex-grow:1;">
                <div style="font-weight:bold;font-size:13px;color:#047857;">🏆 Auto di atas KKM</div>
                <div style="font-size:11px;color:#059669;">Skor sedikit di atas target</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;background:#fff;padding:4px 8px;border-radius:10px;border:1px solid #d1fae5;">
                <button id="kkm-minus" style="border:none;background:#e2e8f0;width:24px;height:24px;border-radius:6px;font-weight:bold;cursor:pointer;">-</button>
                <span id="kkm-value" style="font-weight:bold;font-size:13px;color:#047857;min-width:20px;text-align:center;">75</span>
                <button id="kkm-plus" style="border:none;background:#e2e8f0;width:24px;height:24px;border-radius:6px;font-weight:bold;cursor:pointer;">+</button>
            </div>
        </div>
        <div id="btn-key" style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px 14px;border-radius:16px;cursor:pointer;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
            <div>
                <div style="font-weight:bold;font-size:13px;color:#334155;">🔑 Lihat Kunci</div>
                <div style="font-size:11px;color:#64748b;">Tampilkan kunci jawaban</div>
            </div>
            <span style="font-size:16px;">➡️</span>
        </div>
        <pre id="cbtx-status" style="background:#f8fafc;padding:10px;border-radius:12px;font-size:11px;color:#334155;max-height:100px;overflow-y:auto;white-space:pre-line;margin:0;"></pre>
    `;
    d.body.append(p);

    // Hubungkan dengan ikon topi toga di pojok kiri atas header
    const cap = d.querySelector('.fa-graduation-cap');
    if (cap && cap.parentElement) {
        let pr = cap.parentElement;
        pr.style.position = 'relative';
        pr.style.cursor = 'pointer';
        pr.title = 'Klik untuk buka Asisten AI';
        pr.onclick = () => p.style.display = p.style.display === 'block' ? 'none' : 'block';
    }

    p.querySelector('#cbtx-close').onclick = () => p.style.display = 'none';
    let s = p.querySelector('#cbtx-status');

    // Logika Pengaturan Nilai KKM (+ dan -)
    let targetKKM = 75;
    const kkmValSpan = p.querySelector('#kkm-value');
    p.querySelector('#kkm-plus').onclick = (e) => {
        e.stopPropagation();
        if (targetKKM < 95) targetKKM += 5;
        kkmValSpan.textContent = targetKKM;
    };
    p.querySelector('#kkm-minus').onclick = (e) => {
        e.stopPropagation();
        if (targetKKM > 40) targetKKM -= 5;
        kkmValSpan.textContent = targetKKM;
    };

    function key() {
        let q = Q(), c = q.correct;
        if (q.type === 'category') s.textContent = c.map((v, i) => i + 1 + '. ' + (v ? 'Benar' : 'Salah')).join('\n');
        else s.textContent = 'Kunci: ' + (Array.isArray(c) ? c.map(i => String.fromCharCode(65 + i)).join(', ') : String.fromCharCode(65 + c));
    }

    function mark() {
        d.querySelectorAll('.cbtxg').forEach(e => e.classList.remove('cbtxg'));
        let q = Q(), c = q.correct;
        if (q.type === 'category') {
            X().forEach((r, j) => [...r.querySelectorAll('label')].forEach(l => {
                let v = l.querySelector('input')?.value === 'true';
                if (v === c[j]) l.classList.add('cbtxg');
            }));
        } else {
            let opts = O();
            let correctArr = Array.isArray(c) ? c : [c];
            correctArr.forEach(j => { if (opts[j]) opts[j].classList.add('cbtxg'); });
        }
        s.textContent = 'Jawaban benar telah ditandai.';
    }

    function ans(shouldBeCorrect = true) {
        let q = Q(), c = q.correct;
        let correctArr = Array.isArray(c) ? c : [c];
        let radio = d.querySelectorAll('#options-container input[type="radio"]');
        
        let targetIndex = correctArr[0];
        if (!shouldBeCorrect && radio.length > 1) {
            // Pilih opsi yang sengaja salah agar skor pas di atas KKM
            targetIndex = (correctArr[0] + 1) % radio.length;
        }

        if (radio.length > 0) {
            if (radio[targetIndex]) radio[targetIndex].click();
        } else {
            let opts = O();
            if (opts[targetIndex]) opts[targetIndex].click();
        }
    }

function openCBTXPanel() {
    p.style.display = 'block';
}

function closeCBTXPanel() {
    p.style.display = 'none';
}

p.querySelector('#cbtx-close').onclick = closeCBTXPanel;

const cap = d.querySelector('.fa-graduation-cap');

if (cap && cap.parentElement) {
    const trigger = cap.parentElement;

    trigger.style.cursor = 'pointer';
    trigger.title = 'Buka panel';

    trigger.onclick = openCBTXPanel;
}

openCBTXPanel();

    // Variabel kontrol status Auto (bisa di-stop saat diklik lagi)
    let isAutoRunning = false;
    let isKKMRunning = false;

    p.querySelector('#btn-auto').onclick = () => {
        if (isAutoRunning) {
            isAutoRunning = false;
            p.querySelector('#btn-auto').style.background = '#f5f3ff';
            s.textContent = "Proses otomatis dihentikan.";
            return;
        }
        if (isKKMRunning) return;

        isAutoRunning = true;
        p.querySelector('#btn-auto').style.background = '#ddd6fe';
        s.textContent = "Menjalankan auto 30 soal (Klik lagi untuk berhenti)...";

        (function n() {
            if (!isAutoRunning) return;
            ans(true);
            setTimeout(() => {
                let idx = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : (typeof CBTToolsData !== 'undefined' ? CBTToolsData.index : 0);
                if (idx < 29 && isAutoRunning) {
                    if (typeof nextQuestion === 'function') nextQuestion();
                    else if (typeof CBTToolsAPI !== 'undefined' && CBTToolsAPI.next) CBTToolsAPI.next();
                    setTimeout(n, 450);
                } else {
                    isAutoRunning = false;
                    p.querySelector('#btn-auto').style.background = '#f5f3ff';
                    mark();
                    s.textContent = "Selesai otomatis!";
                }
            }, 550);
        })();
    };

    // Logika Eksekusi Tombol "Auto di atas KKM"
    p.querySelector('#btn-kkm').onclick = () => {
        if (isKKMRunning) {
            isKKMRunning = false;
            p.querySelector('#btn-kkm-box').style.background = '#ecfdf5';
            s.textContent = "Proses KKM dihentikan.";
            return;
        }
        if (isAutoRunning) return;

        isKKMRunning = true;
        p.querySelector('#btn-kkm-box').style.background = '#a7f3d0';
        s.textContent = `Menjalankan auto target KKM ${targetKKM}...`;

        let totalSoal = 30; // Umumnya 30 soal
        let targetBenar = Math.ceil((targetKKM / 100) * totalSoal) + 1; // Dilebihkan 1 soal agar aman di atas KKM

        (function loopKKM(currentIndex = 0) {
            if (!isKKMRunning) return;

            // Tentukan apakah soal ini harus dijawab benar atau salah berdasarkan target KKM
            let shouldBeCorrect = currentIndex < targetBenar;
            ans(shouldBeCorrect);

            setTimeout(() => {
                let idx = typeof currentQuestionIndex !== 'undefined' ? currentQuestionIndex : (typeof CBTToolsData !== 'undefined' ? CBTToolsData.index : 0);
                if (idx < totalSoal - 1 && isKKMRunning) {
                    if (typeof nextQuestion === 'function') nextQuestion();
                    else if (typeof CBTToolsAPI !== 'undefined' && CBTToolsAPI.next) CBTToolsAPI.next();
                    setTimeout(() => loopKKM(idx + 1), 450);
                } else {
                    isKKMRunning = false;
                    p.querySelector('#btn-kkm-box').style.background = '#ecfdf5';
                    mark();
                    s.textContent = `Selesai! Skor disesuaikan di atas KKM ${targetKKM}.`;
                }
            }, 550);
        })();
    };

    p.querySelector('#btn-key').onclick = key;
    p.querySelector('#btn-mark').onclick = mark;

    // Otomatis langsung buka panel dengan animasi saat script dimuat
    p.style.display = 'block';
})();
