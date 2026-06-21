import { useEffect, useMemo, useState } from "react";
import { PremiumPass, PassState } from "./types";
import { PremiumPassCard } from "./components/PremiumPassCard";
import { Clock, RefreshCw, ShieldCheck } from "lucide-react";
import kairosIso from "./components/assets/kairos-iso.png";
import kairosLogo from "./components/assets/kairos-logo.png";
import kairosBackground from "./components/assets/kairos-background.mp4";
import kairosEmptyKey from "./components/assets/kairos-empty-key.jpg";
import { loadTimeKeyPasses } from "./timekeyClient";

const CONTRACT_ADDRESS = "0x95e1c52ecaa7c453bb659d0dbece51fe8f0efff2";
const EXPLORER_URL = "https://sepolia.arbiscan.io";

export default function App() {
  const forceEmptyState = new URLSearchParams(window.location.search).get("empty") === "1";
  const [passes, setPasses] = useState<PremiumPass[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activePasses = useMemo(
    () => (forceEmptyState ? [] : passes.filter((pass) => pass.status === PassState.ACTIVE)),
    [forceEmptyState, passes],
  );
  const selectedPass = useMemo(
    () => activePasses.find((pass) => pass.tokenId === selectedTokenId) || activePasses[0],
    [activePasses, selectedTokenId],
  );

  useEffect(() => {
    refreshPasses();
  }, []);

  async function refreshPasses() {
    try {
      setLoading(true);
      setError("");
      const onChainPasses = await loadTimeKeyPasses();
      setPasses(onChainPasses);
      const firstActivePass = onChainPasses.find((pass) => pass.status === PassState.ACTIVE);
      if (firstActivePass && !onChainPasses.some((pass) => pass.tokenId === selectedTokenId && pass.status === PassState.ACTIVE)) {
        setSelectedTokenId(firstActivePass.tokenId || 9);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los pases.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#18130a_0%,#050505_42%,#000_100%)] text-stone-100 flex items-center justify-center font-sans antialiased selection:bg-kairos-gold selection:text-black p-4">
      <section className="w-full max-w-sm relative bg-[#070707] rounded-[42px] p-4 border border-stone-800 shadow-[0_30px_80px_rgba(0,0,0,0.9)] min-h-[700px]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full border border-stone-900 z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-stone-800 rounded-full" />
        </div>

        <div className="min-h-[660px] rounded-[32px] overflow-hidden bg-[#0b0b0b] border border-stone-900 flex flex-col">
          <header className="px-5 pt-8 pb-4 border-b border-stone-900/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img src={kairosIso} alt="Kairos" className="w-10 h-10 object-contain shrink-0" />
                <img src={kairosLogo} alt="Kairos Own The Moment" className="h-8 w-auto object-contain" />
              </div>

              <button
                type="button"
                onClick={refreshPasses}
                className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-kairos-emerald shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                Live
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-black/45 border border-stone-900 p-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-kairos-gold font-mono mb-1">
                OWN THE MOMENT
              </p>
              <h1 className="font-display text-xl leading-tight text-kairos-champagne">
                Acceso autorizado por tiempo limitado.
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-4 grid grid-cols-2 gap-2">
              {activePasses.map((pass) => (
                <button
                  key={pass.tokenId}
                  type="button"
                  onClick={() => setSelectedTokenId(pass.tokenId || 0)}
                  className={`rounded-2xl border p-3 text-left transition-colors ${
                    pass.tokenId === selectedTokenId
                      ? "border-kairos-gold bg-kairos-gold/10"
                      : "border-stone-900 bg-black/50"
                  }`}
                >
                  <span className="block text-[9px] font-mono uppercase tracking-widest text-stone-500">
                    Token #{pass.tokenId}
                  </span>
                  <span className="block text-xs text-stone-100 truncate">{pass.venueName}</span>
                </button>
              ))}
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-4 text-xs text-red-200">
                {error}
              </div>
            ) : selectedPass ? (
              <PremiumPassCard pass={selectedPass} />
            ) : (
              <KairosEmptyState loading={loading} />
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-stone-900 bg-black/50 p-3">
                <Clock className="w-4 h-4 text-kairos-gold mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">Contrato</p>
                <a
                  href={`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-stone-200 break-all hover:text-kairos-gold"
                >
                  {CONTRACT_ADDRESS.slice(0, 10)}...
                </a>
              </div>

              <div className="rounded-2xl border border-stone-900 bg-black/50 p-3">
                <ShieldCheck className="w-4 h-4 text-kairos-gold mb-2" />
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">Red</p>
                <p className="text-xs text-stone-200">Arbitrum Sepolia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function KairosEmptyState({ loading }: { loading: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-kairos-gold/25 bg-black min-h-[460px] shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={kairosBackground}
        poster={kairosEmptyKey}
        autoPlay
        muted
        playsInline
      />
      {loading ? (
        <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-black/30 bg-black/45 px-4 py-2 text-[9px] font-mono uppercase tracking-[0.24em] text-kairos-champagne backdrop-blur-sm">
          Buscando pases
        </div>
      ) : null}
    </div>
  );
}
