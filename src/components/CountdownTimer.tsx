/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: string; // ISO string
  status: string;
  onExpire?: () => void;
}

export function CountdownTimer({ expiresAt, status, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });

  // Access stable primitive representing the target time
  const targetTime = new Date(expiresAt).getTime();

  useEffect(() => {
    if (status !== "ACTIVE" || isNaN(targetTime)) {
      setTimeLeft({
        hours: "00",
        minutes: "00",
        seconds: "00",
        isExpired: true,
      });
      return;
    }

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
        });
        if (onExpire) onExpire();
        return true; // was expired
      }

      const hoursNum = Math.floor(diff / (1000 * 60 * 60));
      const minsNum = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secsNum = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hoursNum).padStart(2, "0"),
        minutes: String(minsNum).padStart(2, "0"),
        seconds: String(secsNum).padStart(2, "0"),
        isExpired: false,
      });
      return false;
    };

    // Run once immediately
    const expiredYet = calculateTime();
    if (expiredYet) return;

    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetTime, status, onExpire]);

  if (status === "EXPIRED" || timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs text-stone-500 bg-stone-900/60 px-3 py-1.5 rounded-full border border-stone-800">
        <Clock className="w-3.5 h-3.5" />
        <span>EXPIRADO</span>
      </div>
    );
  }

  if (status === "INVALID") {
    return (
      <div className="flex items-center gap-2 font-mono text-xs text-red-400 bg-red-950/40 px-3 py-1.5 rounded-full border border-red-900/40">
        <Clock className="w-3.5 h-3.5" />
        <span>SUSPENDIDO</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-wider text-kairos-champagne bg-amber-950/20 px-3 py-1.5 rounded-full border border-kairos-gold/20 shadow-[0_0_12px_rgba(180,136,58,0.06)] animate-pulse">
      <Clock className="w-4 h-4 text-kairos-gold" />
      <span>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
    </div>
  );
}
