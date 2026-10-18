
(() => {
    if (window.CBTX_UI) return;
    window.CBTX_UI = true;

    const d = document;

    // =========================
    // 1. CSS DAN ANIMASI
    // =========================
    const style = d.createElement("style");

    style.textContent = `
        #cbtx-overlay {
            position: fixed;
            inset: 0;
            z-index: 2147483645;
            background: rgba(15, 23, 42, .38);
            opacity: 0;
            visibility: hidden;
            transition: opacity .25s ease,
                        visibility .25s ease;
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
            max-height: 85vh;
            max-height: 85dvh;
            overflow-y: auto;
            overscroll-behavior: contain;
            background: #fff;
            color: #1e293b;
            padding: 12px 18px
                calc(20px + env(safe-area-inset-bottom));
            border-radius: 28px 28px 0 0;
            box-shadow: 0 -10px 40px rgba(15,23,42,.18);
            font-family: system-ui, sans-serif;
            box-sizing: border-box;
            transform: translateY(110%);
            visibility: hidden;
            transition: transform .32s
                cubic-bezier(.16, 1, .3, 1),
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
            margin: 0 auto 22px;
        }

        #cbtx-modal .cbtx-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 12px;
        }

        #cbtx-modal .cbtx-card {
            min-width: 0;
            padding: 17px 14px;
            border: 1px solid;
            border-radius: 20px;
            cursor: pointer;
            text-align: left;
            font: inherit;
            transition: transform .15s, filter .15s;
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
            font-size: 25px;
            margin-bottom: 10px;
        }

        #cbtx-modal .cbtx-title {
            font-weight: 750;
            font-size: 14px;
            line-height: 1.4;
        }

        #cbtx-modal .cbtx-subtitle {
            font-size: 12px;
            margin-top: 5px;
            opacity: .72;
            line-height: 1.4;
        }

        #cbtx-modal .cbtx-kkm {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 14px;
            margin-bottom: 12px;
            border: 1px solid #a7f3d0;
            border-radius: 20px;
            background: #ecfdf5;
        }

        #cbtx-modal .cbtx-kkm-info {
            min-width: 0;
            cursor: pointer;
            flex: 1;
        }

        #cbtx-modal .cbtx-kkm-title {
            color: #047857;
            font-weight: 750;
            font-size: 14px;
        }

        #cbtx-modal .cbtx-kkm-sub {
            color: #059669;
            font-size: 12px;
            margin-top: 4px;
        }

        #cbtx-modal .cbtx-stepper {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px;
            border: 1px solid #d1fae5;
            background: white;
            border-radius: 13px;
            flex-shrink: 0;
        }

        #cbtx-modal .cbtx-stepper button {
            width: 30px;
            height: 30px;
            border: 0;
            border-radius: 9px;
            background: #e2e8f0;
            color: #334155;
            font-size: 19px;
            font-weight: 750;
            cursor: pointer;
        }

        #cbtx-modal #kkm-value {
            min-width: 25px;
            text-align: center;
            color: #047857;
            font-weight: 800;
        }

        #cbtx-modal .cbtx-key {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: left;
            padding: 15px;
            margin-bottom: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            background: #f8fafc;
            color: #334155;
            font: inherit;
            cursor: pointer;
        }

        #cbtx-modal .cbtx-key-main {
            flex: 1;
        }

        #cbtx-modal .cbtx-key-title {
            font-size: 15px;
            font-weight: 750;
        }

        #cbtx-modal .cbtx-key-sub {
            margin-top: 4px;
            font-size: 12px;
            color: #64748b;
        }

        #cbtx-modal .cbtx-status {
            padding: 13px 15px;
            border-radius: 17px;
            background: #f1f5f9;
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-line;
            overflow-wrap: anywhere;
        }

        #cbtx-modal .cbtx-close-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }

        #cbtx-modal .cbtx-close {
            padding: 8px 14px;
            border: 0;
            border-radius: 10px;
            background: #e2e8f0;
            color: #334155;
            font-size: 13px;
            cursor: pointer;
        }

        @media (min-width: 600px) {
            #cbtx-modal {
                left: 50%;
                right: auto;
                width: min(560px, 100%);
                transform: translate(-50%, 110%);
                border-radius: 28px 28px 0 0;
            }

            #cbtx-modal.active {
                transform: translate(-50%, 0);
            }
        }

        @media (max-width: 360px) {
            #cbtx-modal {
                padding-left: 12px;
                padding-right: 12px;
            }

            #cbtx-modal .cbtx-card {
                padding: 13px 10px;
            }

            #cbtx-modal .cbtx-kkm {
                padding: 10px;
            }

            #cbtx-modal .cbtx-stepper {
                gap: 4px;
            }

            #cbtx-modal .cbtx-stepper button {
                width: 26px;
                height: 28px;
            }
        }
    `;

    d.head.appendChild(style);

    // =========================
    // 2. OVERLAY DAN PANEL
    // =========================
    const overlay = d.createElement("div");
    overlay.id = "cbtx-overlay";

    const panel = d.createElement("section");
    panel.id = "cbtx-modal";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Menu latihan");

    panel.innerHTML = `
        <div class="cbtx-handle"></div>

        <div class="cbtx-grid">
            <button type="button"
                    class="cbtx-card cbtx-mark"
                    id="btn-mark">
                <div class="cbtx-icon">🎯</div>
                <div class="cbtx-title">Jawab Soal Ini</div>
                <div class="cbtx-subtitle">
                    Tandai soal aktif
                </div>
            </button>

            <button type="button"
                    class="cbtx-card cbtx-auto"
                    id="btn-auto">
                <div class="cbtx-icon">⚡</div>
                <div class="cbtx-title">Kerjakan Semua</div>
                <div class="cbtx-subtitle">
                    Mode latihan
                </div>
            </button>
        </div>

        <div class="cbtx-kkm">
            <div class="cbtx-kkm-info" id="btn-kkm">
                <div class="cbtx-kkm-title">
                    🏆 Auto di atas KKM
                </div>
                <div class="cbtx-kkm-sub">
                    Skor sedikit di atas target
                </div>
            </div>

            <div class="cbtx-stepper">
                <button type="button" id="kkm-minus"
                        aria-label="Kurangi KKM">−</button>
                <span id="kkm-value">75</span>
                <button type="button" id="kkm-plus"
                        aria-label="Tambah KKM">+</button>
            </div>
        </div>

        <button type="button" class="cbtx-key" id="btn-key">
            <span style="font-size:25px">🔑</span>
            <span class="cbtx-key-main">
                <span class="cbtx-key-title">Lihat Kunci</span>
                <span class="cbtx-key-sub" style="display:block">
                    Informasi fitur latihan
                </span>
            </span>
            <span style="font-size:22px">➡️</span>
        </button>

        <div class="cbtx-status" id="cbtx-status"
             role="status" aria-live="polite">
            Status: Siap
            Silakan pilih fitur di atas.
        </div>

        <div class="cbtx-close-row">
            <button type="button" class="cbtx-close"
                    id="cbtx-close">Tutup</button>
        </div>
    `;

    d.body.append(overlay, panel);

    // =========================
    // 3. BUKA DAN TUTUP PANEL
    // =========================
    function openPanel() {
        overlay.classList.add("active");
        panel.classList.add("active");
    }

    function closePanel() {
        overlay.classList.remove("active");
        panel.classList.remove("active");
    }

    panel.querySelector("#cbtx-close").onclick = closePanel;
    overlay.onclick = closePanel;

    d.addEventListener("keydown", e => {
        if (e.key === "Escape") closePanel();
    });

    // Hubungkan ke ikon toga yang sudah ada di halaman.
    const cap = d.querySelector(".fa-graduation-cap");

    if (cap && cap.parentElement) {
        const trigger = cap.parentElement;
        trigger.style.cursor = "pointer";
        trigger.title = "Buka menu latihan";
        trigger.addEventListener("click", openPanel);
    }

    // =========================
    // 4. PENGATUR KKM
    // =========================
    let targetKKM = 75;
    const kkmValue = panel.querySelector("#kkm-value");
    const status = panel.querySelector("#cbtx-status");

    panel.querySelector("#kkm-plus").onclick = () => {
        targetKKM = Math.min(95, targetKKM + 5);
        kkmValue.textContent = targetKKM;
        status.textContent =
            `Status: Siap\nTarget KKM: ${targetKKM}`;
    };

    panel.querySelector("#kkm-minus").onclick = () => {
        targetKKM = Math.max(40, targetKKM - 5);
        kkmValue.textContent = targetKKM;
        status.textContent =
            `Status: Siap\nTarget KKM: ${targetKKM}`;
    };

    // =========================
    // 5. AKSI UI
    // =========================
    panel.querySelector("#btn-mark").onclick = () => {
        status.textContent =
            "Fitur dipilih: Jawab Soal Ini.";
    };

    panel.querySelector("#btn-auto").onclick = () => {
        status.textContent =
            "Mode latihan dipilih. Belum ada proses otomatis yang dijalankan.";
    };

    panel.querySelector("#btn-kkm").onclick = () => {
        status.textContent =
            `Target KKM saat ini: ${targetKKM}.\n` +
            "Pengaturan target tersimpan selama halaman terbuka.";
    };

    panel.querySelector("#btn-key").onclick = () => {
        status.textContent =
            "Menu informasi kunci dipilih. " +
            "Panel UI ini tidak mengambil atau menampilkan kunci jawaban.";
    };

    // Tampilkan saat script dimuat.
    openPanel();
})();
