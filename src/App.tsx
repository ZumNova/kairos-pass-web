import { useState } from "react";
import { PremiumPass, PassState } from "./types";
import { PremiumPassCard } from "./components/PremiumPassCard";
import { Clock, ShieldCheck } from "lucide-react";
import kairosIso from "./components/assets/kairos-iso.png";
import kairosLogo from "./components/assets/kairos-logo.png";

export default function App() {
  const [showExpiredPreview, setShowExpiredPreview] = useState(false);

  const now = new Date();
  const activePassExpiresAt = new Date(
    now.getTime() + (3 * 60 * 60 + 24 * 60 + 18) * 1000
  );

  const activePass: PremiumPass = {
    id: "kairos-pass-001",
    assetName: "Piscina & Lounge Aurora",
    assetType: "VIP Pool Access",
    venueName: "Aurora Private Club",
    authorizedUser: "Sofía Martínez",
    contactDetails: "sofia.martinez@member.kairos.com",
    startDateTime: "14:45 – 18:45",
    durationHours: 4,
    expiresAt: activePassExpiresAt.toISOString(),
    status: PassState.ACTIVE,
    digitalSeal: "0x8fa4b7e2a9b310467fae32c024d1cb03fae82fdcaec991c2",
  };

  const expiredPass: PremiumPass = {
    ...activePass,
    id: "kairos-pass-expired",
    expiresAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
    status: PassState.EXPIRED,
    digitalSeal: "0xbc88a72e811cda3201460fae24fb12543e21cd8b1f50a9829e1fbdac93fa0ebd",
  };

  const currentPass = showExpiredPreview ? expiredPass : activePass;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#18130a_0%,#050505_42%,#000_100%)] text-stone-100 flex items-center justify-center font-sans antialiased selection:bg-kairos-gold selection:text-black p-4">
      <section className="w-full max-w-sm relative bg-[#070707] rounded-[42px] p-4 border border-stone-800 shadow-[0_30px_80px_rgba(0,0,0,0.9)] min-h-[680px]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full border border-stone-900 z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-stone-800 rounded-full" />
        </div>

        <div className="min-h-[640px] rounded-[32px] overflow-hidden bg-[#0b0b0b] border border-stone-900 flex flex-col">
          <header className="px-5 pt-8 pb-4 border-b border-stone-900/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={kairosIso}
                  alt="Kairos"
                  className="w-10 h-10 object-contain shrink-0"
                />

                <img
                  src={kairosLogo}
                  alt="Kairos Own The Moment"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-kairos-emerald shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-kairos-emerald" />
                Live
              </div>
            </div>
<div className="mt-5 rounded-2xl bg-black/45 border border-stone-900 p-3">
  <p className="text-[10px] uppercase tracking-[0.28em] text-kairos-gold font-mono mb-1">
    Own the moment
  </p>
  <h1 className="font-display text-xl leading-tight text-kairos-champagne">
    Acceso autorizado por tiempo limitado.
  </h1>
</div>
            
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <PremiumPassCard pass={currentPass} />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-stone-900 bg-black/50 p-3">
                <Clock className="w-4 h-4 text-kairos-gold mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
                  Ventana
                </p>
                <p className="text-xs text-stone-200">
                  Acceso válido solo durante el horario autorizado.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-900 bg-black/50 p-3">
                <ShieldCheck className="w-4 h-4 text-kairos-gold mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
                  Sello
                </p>
                <p className="text-xs text-stone-200">
                  Identidad y permiso verificables.
                </p>
              </div>
            </div>
          </div>

          <footer className="p-3 border-t border-stone-900 bg-black/55">
            <button
              type="button"
              onClick={() => setShowExpiredPreview((value) => !value)}
              className="w-full rounded-2xl border border-kairos-gold/20 bg-stone-950 px-4 py-3 text-[10px] font-mono uppercase tracking-[0.22em] text-kairos-champagne hover:border-kairos-gold/45 transition-colors"
            >
              {showExpiredPreview ? "Ver pase" : "Ver estado"}
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
}