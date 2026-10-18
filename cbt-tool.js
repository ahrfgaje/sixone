
(() => {
    if (window.CBTX) return;
    window.CBTX = 1;

    const d = document;

    const st = d.createElement('style');
    st.textContent = `
        @keyframes cbtxSlideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        #cbtx-modal {
            display: none;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            top: auto;
            width: 100%;
            max-width: none;
            max-height: 85dvh;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 20px 20px max(24px, env(safe-area-inset-bottom));
            background: #fff;
            border-radius: 26px 26px 0 0;
            box-shadow: 0 -8px 35px rgba(0,0,0,.18);
            z-index: 2147483647;
            font-family: system-ui, sans-serif;
            animation: cbtxSlideUp .3s ease-out;
            -webkit-overflow-scrolling: touch;
        }

        #cbtx-modal .cbtx-handle {
            width: 42px;
            height: 5px;
            border-radius: 999px;
            background: #d1d5db;
            margin: 0 auto 18px;
        }

        #cbtx-modal .cbtx-card {
            padding: 14px;
            border-radius: 16px;
            cursor: pointer;
            user-select: none;
        }

        #cbtx-modal button {
            cursor: pointer;
            touch-action: manipulation;
        }

        #cbtx-modal .cbtx-status {
            background: #f8fafc;
            padding: 10px;
            border-radius: 12px;
            font-size: 12px;
            color: #334155;
            white-space: pre-line;
            overflow-wrap: anywhere;
            margin: 12px 0 0;
        }

        #cbtx-modal .cbtxg {
            border-color: #22c55e !important;
            background: #f0fdf4 !important;
        }
    `;
    d.head.append(st);

    const p = d.createElement('div');
    p.id = 'cbtx-modal';

    p.innerHTML = `
        <div class="cbtx-handle"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
            <div id="btn-mark" class="cbtx-card"
                style="background:#eff6ff;border:1px solid #bfdbfe">
                <div style="font-size:20px;margin-bottom:6px">🎯</div>
                <div style="font-weight:bold;font-size:14px;color:#1e40af">
                    Tandai Soal
                </div>
                <div style="font-size:12px;color:#60a5fa">
                    Soal yang sedang aktif
                </div>
            </div>

            <div id="btn-info" class="cbtx-card"
                style="background:#f5f3ff;border:1px solid #ddd6fe">
                <div style="font-size:20px;margin-bottom:6px">ℹ️</div>
                <div style="font-weight:bold;font-size:14px;color:#6d28d9">
                    Informasi
                </div>
                <div style="font-size:12px;color:#a78bfa">
                    Status panel
                </div>
            </div>
        </div>

        <div id="btn-kkm-box"
            style="background:#ecfdf5;border:1px solid #a7f3d0;
            padding:12px 14px;border-radius:16px;margin-bottom:12px;
            display:flex;align-items:center;justify-content:space-between;gap:8px">

            <div style="flex:1">
                <div style="font-weight:bold;font-size:14px;color:#047857">
                    🏆 Target KKM
                </div>
                <div style="font-size:12px;color:#059669">
                    Atur nilai target
                </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;
                background:#fff;padding:5px 8px;border-radius:10px;
                border:1px solid #d1fae5">

                <button id="kkm-minus"
                    style="border:0;background:#e2e8f0;width:30px;
                    height:30px;border-radius:8px;font-weight:bold">−</button>

                <span id="kkm-value"
                    style="font-weight:bold;font-size:14px;color:#047857;
                    min-width:26px;text-align:center">75</span>

                <button id="kkm-plus"
                    style="border:0;background:#e2e8f0;width:30px;
                    height:30px;border-radius:8px;font-weight:bold">+</button>
            </div>
        </div>

        <div id="cbtx-status" class="cbtx-status">
            Panel siap digunakan.
        </div>
    `;

    d.body.append(p);

    const $ = selector => p.querySelector(selector);
    const status = $('#cbtx-status');

    let targetKKM = 75;

    function openPanel() {
        p.style.display = 'block';
    }

    function closePanel() {
        p.style.display = 'none';
    }

    $('#cbtx-close').addEventListener('click', closePanel);

    // Hubungkan ikon toga jika tersedia.
    const cap = d.querySelector('.fa-graduation-cap');

    if (cap && cap.parentElement) {
        const trigger = cap.parentElement;
        trigger.style.cursor = 'pointer';
        trigger.title = 'Buka panel';

        trigger.addEventListener('click', openPanel);
    }

    // Pengaturan KKM.
    $('#kkm-plus').addEventListener('click', e => {
        e.stopPropagation();

        if (targetKKM < 95) targetKKM += 5;

        $('#kkm-value').textContent = targetKKM;
        status.textContent = `Target KKM diatur ke ${targetKKM}.`;
    });

    $('#kkm-minus').addEventListener('click', e => {
        e.stopPropagation();

        if (targetKKM > 40) targetKKM -= 5;

        $('#kkm-value').textContent = targetKKM;
        status.textContent = `Target KKM diatur ke ${targetKKM}.`;
    });

    // Menandai soal aktif tanpa mengubah jawabannya.
    $('#btn-mark').addEventListener('click', () => {
        const question = d.querySelector(
            '#question-container, #question-text, .question-container'
        );

        if (!question) {
            status.textContent =
                'Penanda belum dipasang: elemen soal aktif tidak ditemukan.';
            return;
        }

        question.style.outline = '2px solid #60a5fa';
        question.style.outlineOffset = '4px';

        status.textContent = 'Soal aktif berhasil ditandai.';
    });

    $('#btn-info').addEventListener('click', () => {
        status.textContent =
            `Panel aktif.\nTarget KKM: ${targetKKM}.\n` +
            'Pengaturan tampilan tersedia.';
    });

    // Tampilkan panel ketika skrip dijalankan.
    openPanel();
})();
