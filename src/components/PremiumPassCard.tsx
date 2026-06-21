/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, ShieldAlert, Award, QrCode, MapPin, User, Clock, Copy, Check, ChevronRight, RefreshCw } from "lucide-react";
import { PremiumPass, PassState } from "../types";
import { StatusBadge } from "./StatusBadge";
import { CountdownTimer } from "./CountdownTimer";
import kairosIso from "./assets/kairos-iso.png";

interface PremiumPassCardProps {
  pass: PremiumPass;
  onExpire?: () => void;
}

export function PremiumPassCard({ pass, onExpire }: PremiumPassCardProps) {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleCopySeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(pass.digitalSeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status-specific visual styles
  const getThemeStyles = () => {
    switch (pass.status) {
      case PassState.ACTIVE:
        return {
          glow: "shadow-[0_0_50px_-10px_rgba(180,136,58,0.25)] border-[1.5px] border-kairos-gold/40",
          accentLine: "bg-gradient-to-r from-kairos-gold via-kairos-champagne to-kairos-dark-gold",
          innerBg: "bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#1a1a1a]",
          sealColor: "text-kairos-champagne/70",
          cardLabel: "text-kairos-champagne/60",
          cardValue: "text-white",
          glowDot: "bg-kairos-gold shadow-[0_0_15px_#B4882A]",
        };
      case PassState.EXPIRED:
        return {
          glow: "shadow-none border-[1.5px] border-stone-800",
          accentLine: "bg-stone-700",
          innerBg: "bg-gradient-to-br from-[#161616] to-[#0f0f0f]",
          sealColor: "text-stone-500",
          cardLabel: "text-stone-500",
          cardValue: "text-stone-400",
          glowDot: "bg-stone-500",
        };
      case PassState.INVALID:
        return {
          glow: "shadow-[0_0_40px_-5px_rgba(184,76,76,0.15)] border-[1.5px] border-red-900/30",
          accentLine: "bg-red-800",
          innerBg: "bg-gradient-to-br from-[#151212] via-[#0f0a0a] to-[#120a0a]",
          sealColor: "text-red-400/50",
          cardLabel: "text-red-400/40",
          cardValue: "text-stone-300",
          glowDot: "bg-red-500 shadow-[0_0_12px_#B84C4C]",
        };
    }
  };

  const theme = getThemeStyles();
  const shortSeal = `${pass.digitalSeal.slice(0, 6)}...${pass.digitalSeal.slice(-6)}`;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Outer Golden Aura for active passes */}
      <div
        className={`w-full rounded-[24px] overflow-hidden transition-all duration-500 ${theme.glow} ${
          pass.status === PassState.ACTIVE ? "hover:scale-[1.01]" : ""
        }`}
      >
        <div className={`relative ${theme.innerBg} p-6 pb-5 flex flex-col min-h-[460px] metallic-shimmer`}>
          
          {/* Card Top / Header Line */}
          <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-2.5">
  <img
    src={kairosIso}
    alt="Kairos"
    className="w-10 h-10 object-contain opacity-90"
  />
</div>
            
            {/* Status pill right top */}
            <StatusBadge status={pass.status} />
          </div>

          {/* Accent Separator with gold gradient */}
          <div className={`w-full h-[1px] ${theme.accentLine} opacity-80 mb-5 relative z-10`} />

          {/* Card Body - Dual States via Flip */}
          {!flipped ? (
            // FRONT: Details
            <div className="flex-1 flex flex-col justify-between relative z-10">
              
              {/* Premium Designation Large */}
              <div>
                <span className="font-display font-medium text-lg uppercase tracking-[0.3em] text-[#D8B56A] block mb-2 opacity-90">
                  PASE VIP
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-500 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#B4882A]" />
                  Acceso autorizado
                </span>
              </div>

              {/* Main Information Section */}
              <div className="space-y-4 my-5">
                {/* Location Card */}
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B4882A]" />
                    <span className={`text-[10px] uppercase font-sans tracking-widest ${theme.cardLabel}`}>
                      Espacio autorizado
                    </span>
                  </div>
                  <p className={`font-display text-[15px] font-medium tracking-wide leading-tight ${theme.cardValue}`}>
                    {pass.assetName}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono tracking-wider mt-0.5">
                    Tipo: <span className="text-stone-300 font-sans">{pass.assetType}</span>
                  </p>
                </div>

                {/* Grid for User and Window */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-stone-900">
                  {/* Authorized User */}
                  <div>
                    <span className={`text-[9px] uppercase font-mono tracking-widest block mb-0.5 ${theme.cardLabel}`}>
                      Invitado
                    </span>
                    <p className={`font-sans text-xs font-semibold tracking-wide ${theme.cardValue} truncate`}>
                      {pass.authorizedUser}
                    </p>
                  </div>

                  {/* Access Time Window */}
                  <div>
                    <span className={`text-[9px] uppercase font-mono tracking-widest block mb-0.5 ${theme.cardLabel}`}>
                      Horario
                    </span>
                    <p className={`font-sans text-xs font-medium tracking-wide ${theme.cardValue}`}>
                      {pass.startDateTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Live Timer & Verified Digital Seal key */}
              <div className="mt-auto space-y-3 pt-3 border-t border-stone-900/60 flex flex-col">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className={`text-[9px] uppercase font-mono tracking-widest block mb-1 ${theme.cardLabel}`}>
                      Tiempo Restante
                    </span>
                    <CountdownTimer expiresAt={pass.expiresAt} status={pass.status} onExpire={onExpire} />
                  </div>

                  {/* SHOW SECURE PASS QR button */}
                  <button
                    onClick={() => setFlipped(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-white font-mono text-[10px] font-medium tracking-wider border border-stone-800 transition-all hover:border-kairos-gold/50 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-kairos-gold" />
                    <span>MOSTRAR ACCESO</span>
                  </button>
                </div>

                {/* Digital Seal proof key */}
                <div className="flex items-center justify-between gap-2 bg-black/60 px-3 py-2 rounded-xl border border-stone-900">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#B4882A]">
                      Sello digital
                    </span>
                    <span className={`font-mono text-[10px] tracking-widest font-medium ${theme.sealColor}`}>
                      {shortSeal}
                    </span>
                  </div>
                  <button
                    onClick={handleCopySeal}
                    className="p-1 rounded-md text-stone-500 hover:text-white hover:bg-stone-905 transition-colors cursor-pointer"
                    title="Copy Digital Seal"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-kairos-emerald animate-scale-in" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // BACK: High-Verification Secure QR & Hex Pass Detail (flip state)
            <div className="flex-1 flex flex-col justify-between items-center text-center relative z-10 animate-fade-in py-1">
              
              <div className="w-full text-left flex justify-between items-center mb-2">
                <div>
                  <span className="font-display text-sm tracking-widest text-[#D8B56A] block">
                    ACCESO VERIFICABLE
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Presentar en recepción
                  </span>
                </div>
                <button
                  onClick={() => setFlipped(false)}
                  className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-[9px] font-mono text-kairos-gold tracking-widest border border-stone-800 cursor-pointer"
                >
                  DETALLES
                </button>
              </div>

              {/* Unique stylized digital pass gate (visual vector instead of raw SVG) */}
              <div className="relative my-4 flex flex-col items-center justify-center p-5 bg-black/80 rounded-[20px] border border-stone-800 max-w-[200px] w-full aspect-square shadow-inner">
                
                {/* Visual grid corner decorators */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-kairos-gold/60" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-kairos-gold/60" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-kairos-gold/60" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-kairos-gold/60" />

                {/* QR Code / Rotating dynamic luxury key representation */}
                {pass.status === PassState.ACTIVE ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {/* Unique simulated high-end biometric QR/ID graphic */}
                    <div className="grid grid-cols-4 gap-1.5 p-1 text-kairos-gold opacity-90 animate-pulse">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-sm ${
                            (i + 3) % 3 === 0 || i % 5 === 0 || i === 0 || i === 15
                              ? "bg-gradient-to-br from-kairos-champagne to-kairos-gold"
                              : "bg-stone-900 border border-stone-800"
                          }`}
                        />
                      ))}
                    </div>
                    {/* Glowing status indicator inside back pass */}
                    <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-kairos-emerald mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-kairos-emerald animate-ping" />
                      <span>ACCESO VÁLIDO AHORA</span>
                    </div>
                  </div>
                ) : pass.status === PassState.EXPIRED ? (
                  <div className="flex flex-col items-center text-stone-500 p-2">
                    <Shield className="w-12 h-12 stroke-[1.2] text-stone-600 mb-2" />
                    <span className="text-[9px] font-mono tracking-widest text-center">PASE EXPIRADO</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-red-500 p-2">
                    <ShieldAlert className="w-12 h-12 stroke-[1.2] text-red-500 mb-2 animate-bounce" />
                    <span className="text-[9px] font-mono tracking-widest text-center text-red-400">ACCESO NO VÁLIDO</span>
                  </div>
                )}
              </div>

              {/* Full Digital Seal readout with easy click-to-copy */}
              <div className="w-full bg-stone-950/80 p-3 rounded-xl border border-stone-900/60 mb-1">
                <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#B4882A]/80 block mb-1">
                  SELLO DIGITAL KAIROS
                </span>
                <p className="font-mono text-[9px] tracking-wider text-stone-400 break-all select-all leading-relaxed whitespace-pre-wrap">
                  {pass.digitalSeal}
                </p>
                
                <button
                  onClick={handleCopySeal}
                  className="mt-2 text-[8px] font-mono uppercase tracking-widest text-[#D8B56A] hover:text-white flex items-center gap-1 mx-auto bg-stone-900 px-2.5 py-1 rounded border border-stone-800 cursor-pointer"
                >
                  {copied ? "COPIADO" : "COPIAR SELLO DIGITAL"}
                </button>
              </div>

              <span className="text-[10px] text-stone-400 leading-normal max-w-[250px]">
                {pass.status === PassState.ACTIVE
                  ? "Mostrá este acceso en recepción. El sello confirma que el pase pertenece a esta ventana de tiempo."
                  : "Este pase ya no está activo. Para ingresar se necesita una nueva autorización de tiempo."}
              </span>
            </div>
          )}

          {/* Premium Logo footer element on card */}
          <div className="absolute bottom-1 right-6 opacity-3 shadow-inner text-[18px] font-display font-black tracking-widest text-stone-800 select-none pointer-events-none">
            0X_KAIROS
          </div>

        </div>
      </div>
    </div>
  );
}
