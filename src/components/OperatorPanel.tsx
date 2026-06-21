/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Check, FileText, Send, Share2, Clipboard, ArrowRight, UserCheck, Timer, Sparkles } from "lucide-react";
import { PremiumPass, PassState } from "../types";
import { KairosLogoSymbol } from "./KairosLogo";

interface OperatorPanelProps {
  onIssuePass: (newPass: PremiumPass) => void;
  onNavigateToWallet: () => void;
  onNavigateToValidator: (seal: string) => void;
}

const ASSET_TYPES = [
  "Piscina VIP",
  "Palco de Teatro Privado",
  "Cancha de Tenis",
  "Salón de Casino VIP",
  "Spa de Hotel",
  "Sala de Coworking",
  "Estacionamiento Premium",
];

export function OperatorPanel({ onIssuePass, onNavigateToWallet, onNavigateToValidator }: OperatorPanelProps) {
  // Form states with optimal default values for easy presentation
  const [assetName, setAssetName] = useState("Piscina Las Acacias Doradas");
  const [assetType, setAssetType] = useState("Piscina VIP");
  const [venueName, setVenueName] = useState("Las Acacias Doradas Resort");
  const [authorizedUser, setAuthorizedUser] = useState("Sofía Martínez");
  const [contactDetails, setContactDetails] = useState("sofia.martinez@member.kairos.com");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("14:45");
  const [durationHours, setDurationHours] = useState(4);

  // Success state
  const [issuedPass, setIssuedPass] = useState<PremiumPass | null>(null);
  const [copied, setCopied] = useState(false);

  const generateHex = (length: number) => {
    const chars = "0123456789abcdef";
    let result = "0x";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const digitalSeal = generateHex(40); // Generate standard luxury proof signature

    // Calculate expiration timestamp
    const startDateTimeStr = `${startDate}T${startTime}`;
    const startDateObj = new Date(startDateTimeStr);
    const expiresAtObj = new Date(startDateObj.getTime() + durationHours * 60 * 60 * 1000);

    const formatTimeWindow = (start: Date, duration: number) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const sH = pad(start.getHours());
      const sM = pad(start.getMinutes());
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
      const eH = pad(end.getHours());
      const eM = pad(end.getMinutes());
      return `${sH}:${sM} – ${eH}:${eM}`;
    };

    const newPass: PremiumPass = {
      id: generateHex(8),
      assetName,
      assetType,
      venueName,
      authorizedUser,
      contactDetails,
      startDateTime: formatTimeWindow(startDateObj, durationHours),
      durationHours,
      expiresAt: expiresAtObj.toISOString(),
      status: PassState.ACTIVE,
      digitalSeal,
    };

    onIssuePass(newPass);
    setIssuedPass(newPass);
  };

  const handleCopySeal = () => {
    if (!issuedPass) return;
    navigator.clipboard.writeText(issuedPass.digitalSeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setIssuedPass(null);
    // Clear forms with pre-populated placeholders for standard beautiful use
    setAuthorizedUser("");
    setContactDetails("");
  };

  if (issuedPass) {
    return (
      <div className="animate-scale-in p-6 bg-gradient-to-br from-stone-900 to-[#0e0e0e] rounded-[24px] border border-kairos-gold/20 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-950/50 border border-kairos-emerald/40 text-kairos-emerald rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(47,167,114,0.15)]">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-medium tracking-widest text-[#D8B56A]">
            PASE EMITIDO CON ÉXITO
          </h3>
          <p className="font-sans text-xs text-stone-400 mt-1 uppercase tracking-wider">
            Derechos de Acceso Premium Delegados Oficialmente
          </p>
        </div>

        {/* Verification Summary Receipt */}
        <div className="space-y-4 bg-black/50 p-5 rounded-2xl border border-stone-850 mb-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-850">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                Sede Autorizada
              </span>
              <span className="text-sm font-semibold text-white">{issuedPass.assetName}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-[#B4882A] bg-stone-900/80 border border-stone-800">
              {issuedPass.assetType}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-850">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                Titular / Autorizado
              </span>
              <span className="text-xs font-medium text-stone-200">{issuedPass.authorizedUser}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                Contacto Registrado
              </span>
              <span className="text-xs font-mono text-stone-400 block truncate">{issuedPass.contactDetails}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                Ventana de Acceso Delegada
              </span>
              <span className="text-xs font-semibold text-kairos-champagne">{issuedPass.startDateTime}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
                Duración Total
              </span>
              <span className="text-xs font-sans text-stone-300">{issuedPass.durationHours} Horas de Acceso Premium</span>
            </div>
          </div>

          {/* Secure Digital Seal */}
          <div className="mt-4 pt-4 border-t border-stone-850">
            <div className="flex items-center justify-between gap-2 bg-stone-950 p-3 rounded-xl border border-stone-900">
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#B4882A] block mb-1">
                  SELLO DIGITAL GENERADO
                </span>
                <p className="font-mono text-[10px] text-stone-300 break-all leading-normal select-all">
                  {issuedPass.digitalSeal}
                </p>
              </div>
              <button
                onClick={handleCopySeal}
                className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                title="Copiar Sello Digital"
              >
                {copied ? <Check className="w-4 h-4 text-kairos-emerald" /> : <Clipboard className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons to make the App connected */}
        <div className="space-y-2.5">
          <button
            onClick={onNavigateToWallet}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-kairos-gold to-kairos-champagne text-black text-xs font-bold font-mono tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(180,136,58,0.15)]"
          >
            <span>VER EN BILLETERA ACTIVA</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={() => onNavigateToValidator(issuedPass.digitalSeal)}
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-white text-xs font-semibold font-mono tracking-widest uppercase border border-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROBAR EN VALIDADOR DE ACCESO</span>
          </button>

          <button
            onClick={resetForm}
            className="w-full py-2.5 text-stone-500 hover:text-stone-300 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
          >
            Emitir Otro Pase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 p-6 rounded-[24px] border border-stone-850/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      
      {/* Decorative metal background lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-kairos-gold/2 opacity-3 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-amber-950/20 border border-kairos-gold/25 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-kairos-champagne" />
        </div>
        <div>
          <h3 className="font-display text-[15px] font-semibold tracking-widest text-[#D8B56A] uppercase">
            CENTRO DE EMISIÓN DE PASES
          </h3>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">
            ASIGNAR ACCESO TEMPORAL PREMIUM
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Asset Details */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase font-mono tracking-widest text-[#B4882A] font-semibold">
            Nombre de la Sede o Activo
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Piscina Oasis Premium"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="w-full bg-black/60 border border-stone-800 p-3 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-kairos-gold/60 text-xs tracking-wide transition-all"
          />
        </div>

        {/* Row 2: Preset Select for Asset Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Categoría de Activo
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-3 rounded-xl text-stone-300 focus:outline-none focus:border-kairos-gold/60 text-xs tracking-wide transition-all cursor-pointer"
            >
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type} className="bg-stone-900 text-stone-300">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Establecimiento o Sede Principal
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Ritz Luxury Club"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-3 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-kairos-gold/60 text-xs tracking-wide transition-all"
            />
          </div>
        </div>

        {/* Row 3: Holder Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-[#B4882A] font-semibold">
              Titular Autorizado
            </label>
            <input
              type="text"
              required
              placeholder="Nombre Completo"
              value={authorizedUser}
              onChange={(e) => setAuthorizedUser(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-3 rounded-xl text-stone-350 placeholder-stone-650 focus:outline-none focus:border-kairos-gold/60 text-xs tracking-wide transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Email o Teléfono del Titular
            </label>
            <input
              type="text"
              required
              placeholder="sofia@resort.com"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-3 rounded-xl text-stone-350 placeholder-stone-650 focus:outline-none focus:border-kairos-gold/60 text-xs tracking-wide transition-all"
            />
          </div>
        </div>

        {/* Row 4: Timing Duration */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Fecha de Inicio
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-2.5 rounded-xl text-stone-300 focus:outline-none focus:border-kairos-gold/60 text-xs transition-all cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Hora de Inicio
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-black/60 border border-stone-800 p-2.5 rounded-xl text-stone-300 focus:outline-none focus:border-kairos-gold/60 text-xs transition-all cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-medium">
              Duración (Hrs)
            </label>
            <input
              type="number"
              required
              min={1}
              max={72}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full bg-black/60 border border-stone-800 p-2.5 rounded-xl text-stone-300 focus:outline-none focus:border-kairos-gold/60 text-xs transition-all"
            />
          </div>
        </div>

        {/* Warning Policy info */}
        <p className="text-[9px] text-stone-500 font-mono tracking-wide leading-relaxed p-2.5 bg-black/40 rounded-xl border border-stone-850">
          * El titular autorizado obtendrá acceso verificado a partir de la fecha de delegación especificada. El estado cambiará automáticamente a expirado una vez concluída la ventana horaria asignada.
        </p>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-kairos-gold via-kairos-champagne to-kairos-gold text-black hover:brightness-110 active:scale-[0.99] font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_15px_rgba(180,136,58,0.15)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>DELEGAR PASE PREMIUM</span>
        </button>
      </form>
    </div>
  );
}
