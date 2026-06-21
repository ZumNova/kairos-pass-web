/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Compass, ShieldCheck, ShieldAlert, BadgeInfo, QrCode, Clipboard, Check, HelpCircle, XCircle } from "lucide-react";
import { PremiumPass, PassState } from "../types";

interface ValidatorViewProps {
  passes: PremiumPass[];
  prefilledSeal?: string;
  onClearPrefill?: () => void;
}

export function ValidatorView({ passes, prefilledSeal, onClearPrefill }: ValidatorViewProps) {
  const [proofInput, setProofInput] = useState(prefilledSeal || "");
  const [verificationResult, setVerificationResult] = useState<{
    status: "APPROVED" | "EXPIRED" | "INVALID" | null;
    pass: PremiumPass | null;
  }>({ status: null, pass: null });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = proofInput.trim();

    if (!cleanInput) return;

    // Search for match in active passes
    const matchedPass = passes.find(
      (p) => p.digitalSeal.toLowerCase() === cleanInput.toLowerCase() || p.id.toLowerCase() === cleanInput.toLowerCase()
    );

    if (matchedPass) {
      if (matchedPass.status === PassState.ACTIVE) {
        // Double check time remaining
        const now = new Date().getTime();
        const expiry = new Date(matchedPass.expiresAt).getTime();
        if (now >= expiry) {
          setVerificationResult({
            status: "EXPIRED",
            pass: { ...matchedPass, status: PassState.EXPIRED },
          });
        } else {
          setVerificationResult({ status: "APPROVED", pass: matchedPass });
        }
      } else if (matchedPass.status === PassState.EXPIRED) {
        setVerificationResult({ status: "EXPIRED", pass: matchedPass });
      } else {
        setVerificationResult({ status: "INVALID", pass: matchedPass });
      }
    } else {
      // Mock result when entering a non-existent or random check
      // Allow testing random seals as INVALID
      setVerificationResult({ status: "INVALID", pass: null });
    }
  };

  const handlePrefillType = (status: PassState) => {
    const sampled = passes.find((p) => p.status === status);
    if (sampled) {
      setProofInput(sampled.digitalSeal);
      if (onClearPrefill) onClearPrefill();
    } else {
      // If none found, offer fallback
      setProofInput("0xinvalid_signature_mock_entry38e2d19bc298...");
    }
  };

  const resetResult = () => {
    setVerificationResult({ status: null, pass: null });
    setProofInput("");
    if (onClearPrefill) onClearPrefill();
  };

  // Keep state sync with external prefilledSeal (e.g. from Operator Panel CTA)
  if (prefilledSeal && prefilledSeal !== proofInput) {
    setProofInput(prefilledSeal);
  }

  return (
    <div className="bg-stone-900/60 p-6 rounded-[24px] border border-stone-850/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-950/2 opacity-3 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-amber-955/20 border border-kairos-gold/25 rounded-xl flex items-center justify-center">
          <QrCode className="w-5 h-5 text-kairos-champagne" />
        </div>
        <div>
          <h3 className="font-display text-[15px] font-semibold tracking-widest text-[#D8B56A] uppercase">
            NODO DE VERIFICACIÓN DE ACCESO
          </h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
            Inspección de Sello Digital Seguro
          </p>
        </div>
      </div>

      {verificationResult.status === null ? (
        <div className="space-y-5">
          {/* Instructions */}
          <div className="p-4 rounded-xl bg-black/40 border border-stone-850/60 text-[11px] text-stone-400 font-sans leading-relaxed flex gap-3 items-start">
            <BadgeInfo className="w-4 h-4 text-kairos-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-300">PROCESO DE AUTENTICACIÓN DE ENTRADA</p>
              <p className="mt-1">
                Ingrese el Sello Digital o ID de Comprobante del pase delegado. El nodo validará la firma de autenticidad y los parámetros de la ventana horaria activa para otorgar la aprobación de acceso inmediata.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium block">
                Firma de Sello Digital / ID de Pase
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Pegue o ingrese el sello digital 0x..."
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  className="w-full bg-black/80 border border-stone-800 p-3.5 pr-12 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-kairos-gold/60 text-xs font-mono tracking-wider transition-all"
                />
                <Search className="w-4 h-4 text-stone-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 border border-stone-700/60 hover:border-kairos-gold/50 text-white font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-kairos-gold" />
              <span>VERIFICAR DERECHOS DE ACCESO</span>
            </button>
          </form>

          {/* Quick Shortcuts for Demo/Presentation Purposes */}
          <div className="pt-4 border-t border-stone-850/60">
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-2.5">
              Accesos Rápidos de Prueba para Presentación
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePrefillType(PassState.ACTIVE)}
                className="py-2.5 px-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 hover:border-kairos-emerald/50 text-[9px] font-mono font-medium tracking-widest text-[#2FA772] transition-colors cursor-pointer text-center"
              >
                SELECCIONAR ACTIVO
              </button>
              <button
                onClick={() => handlePrefillType(PassState.EXPIRED)}
                className="py-2.5 px-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:border-stone-600 text-[9px] font-mono font-medium tracking-widest text-stone-400 transition-colors cursor-pointer text-center"
              >
                SELECCIONAR EXPIRADO
              </button>
              <button
                onClick={() => handlePrefillType(PassState.INVALID)}
                className="py-2.5 px-1.5 rounded-lg bg-red-950/20 border border-red-900/30 hover:border-kairos-crimson/50 text-[9px] font-mono font-medium tracking-widest text-red-400 transition-colors cursor-pointer text-center"
              >
                SELECCIONAR INVÁLIDO
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VERIFICATION CARD - RESULT DISPLAY */
        <div className="space-y-5 animate-scale-in">
          {verificationResult.status === "APPROVED" && verificationResult.pass ? (
            /* PASSPORT APPROVED */
            <div className="p-6 bg-gradient-to-br from-[#0c1a14] to-[#040907] border border-kairos-emerald/30 rounded-2xl shadow-[0_8px_30px_rgba(47,167,114,0.1)] text-center relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-kairos-emerald/2 rounded-full blur-xl pointer-events-none" />

              <div className="w-12 h-12 bg-emerald-950/40 border border-kairos-emerald text-kairos-emerald rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(47,167,114,0.2)]">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <h4 className="font-display text-lg font-bold tracking-[0.25em] text-kairos-emerald">
                ACCESO AUTORIZADO
              </h4>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest mt-0.5">
                ACCESO VERIFICADO VÁLIDO
              </p>

              {/* Verified details */}
              <div className="mt-5 space-y-3 p-3 bg-black/60 rounded-xl border border-emerald-950 text-left text-xs">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Activo</span>
                  <span className="text-stone-100 font-semibold">{verificationResult.pass.assetName}</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Titular</span>
                  <span className="text-stone-300">{verificationResult.pass.authorizedUser}</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Ventana Horaria</span>
                  <span className="text-kairos-champagne font-semibold font-mono">{verificationResult.pass.startDateTime}</span>
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">ID de Pase</span>
                  <span className="text-stone-450 font-mono truncate max-w-[150px]">{verificationResult.pass.id}</span>
                </div>
              </div>
            </div>
          ) : verificationResult.status === "EXPIRED" && verificationResult.pass ? (
            /* PASSPORT EXPIRED */
            <div className="p-6 bg-gradient-to-br from-stone-950 to-stone-900 border border-stone-800 rounded-2xl shadow-inner text-center">
              <div className="w-12 h-12 bg-stone-900 border border-stone-700 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-7 h-7" />
              </div>

              <h4 className="font-display text-lg font-bold tracking-[0.25em] text-stone-400">
                ACCESO RECHAZADO
              </h4>
              <p className="font-mono text-[9px] text-stone-500 uppercase tracking-widest mt-0.5">
                VENTANA DE DELEGACIÓN EXPIRADA
              </p>

              <div className="mt-5 space-y-3 p-3 bg-stone-950/60 rounded-xl border border-stone-900 text-left text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Activo Autorizado</span>
                  <span className="text-stone-400 font-medium">{verificationResult.pass.assetName}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Estado Horario</span>
                  <span className="text-stone-400 font-mono">Expirado</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-stone-500 font-mono text-[9px] uppercase tracking-wider">Datos del Titular</span>
                  <span className="text-stone-400 font-mono">{verificationResult.pass.authorizedUser}</span>
                </div>
              </div>
            </div>
          ) : (
            /* PASSPORT INVALID */
            <div className="p-6 bg-gradient-to-br from-[#1c0e0e] to-[#0d0707] border border-red-950/50 rounded-2xl shadow-[0_8px_30px_rgba(184,76,76,0.1)] text-center">
              <div className="w-12 h-12 bg-red-950/40 border border-red-900/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(184,76,76,0.1)]">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <h4 className="font-display text-lg font-bold tracking-[0.25em] text-red-500">
                ACCESO RECHAZADO
              </h4>
              <p className="font-mono text-[9px] text-red-400 uppercase tracking-widest mt-0.5 animate-pulse">
                FALLO DE VERIFICACIÓN
              </p>

              <div className="mt-5 p-4 rounded-xl bg-black/50 border border-red-950/30 text-xs text-stone-400 leading-relaxed text-left">
                <p className="font-semibold text-red-400 mb-1">MOTIVO DE RECHAZO DE ENTRADA:</p>
                Ningún token digital verificado de derecho temporal posee esta clave de firma. La validación se suspende por seguridad. Por favor, inspeccione los registros del terminal del operador o revise los contadores de tiempo.
              </div>
            </div>
          )}

          <button
            onClick={resetResult}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 font-mono text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            ENTENDIDO · REALIZAR OTRA COMPROBACIÓN
          </button>
        </div>
      )}
    </div>
  );
}
