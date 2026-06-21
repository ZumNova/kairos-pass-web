/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, CalendarRange, AlertTriangle } from "lucide-react";
import { PassState } from "../types";

interface StatusBadgeProps {
  status: PassState;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case PassState.ACTIVE:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-emerald-950/40 text-kairos-emerald border border-emerald-500/30 shadow-[0_0_12px_rgba(47,167,114,0.15)] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-kairos-emerald" />
          <span>ACTIVO</span>
        </span>
      );

    case PassState.EXPIRED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-stone-900 text-stone-400 border border-stone-800 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-stone-500" />
          <CalendarRange className="w-3.5 h-3.5 text-stone-400" />
          <span>EXPIRADO</span>
        </span>
      );

    case PassState.INVALID:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider bg-red-950/40 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(184,76,76,0.15)] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>INVÁLIDO</span>
        </span>
      );

    default:
      return null;
  }
}
