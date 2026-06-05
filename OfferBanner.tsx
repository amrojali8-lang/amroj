/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Sparkles, Flame, Clock } from "lucide-react";

interface OfferBannerProps {
  onTriggerAction: () => void;
}

export function OfferBanner({ onTriggerAction }: OfferBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 12 });
  const [slotsLeft, setSlotsLeft] = useState(6);

  useEffect(() => {
    // Tick Countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to prevent zeros
          return { hours: 3, minutes: 14, seconds: 45 };
        }
      });
    }, 1000);

    // Occasional simulate slot countdown to improve conversion pressure
    const slotTimer = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev > 2) {
          return prev - 1;
        }
        return prev;
      });
    }, 120000); // every 2 minutes code slips a slot

    return () => {
      clearInterval(timer);
      clearInterval(slotTimer);
    };
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-red-600 text-white py-2 px-4 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-3">
          <span className="inline-flex items-center gap-1 bg-black/25 text-[10px] md:text-xs font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-white/20">
            <Flame size={12} className="text-yellow-400 shrink-0" /> Limited Slot Alert
          </span>
          <p className="text-xs md:text-sm font-bold tracking-tight">
            MID-SUMMER BODY BLITZ: Get <span className="underline decoration-yellow-300 font-extrabold text-yellow-300">50% OFF Elite Coaching</span>. Only <span className="bg-neutral-950 px-1.5 py-0.5 rounded text-red-500 font-black">{slotsLeft}</span> slots remain active today!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Dynamic Countdown Text */}
          <div className="flex items-center gap-1 font-mono text-xs font-extrabold bg-black/15 border border-white/10 px-2.5 py-1 rounded">
            <Clock size={12} className="text-red-200 shrink-0" />
            <span>{formatNumber(timeLeft.hours)}</span>:
            <span>{formatNumber(timeLeft.minutes)}</span>:
            <span>{formatNumber(timeLeft.seconds)}</span>
          </div>

          <button
            onClick={onTriggerAction}
            id="offer-banner-claim-btn"
            className="bg-white hover:bg-neutral-100 text-red-600 text-[10px] md:text-xs font-black uppercase py-1.5 px-3 md:px-4 rounded-lg tracking-wider transition-all shadow-md active:scale-95"
          >
            Claim 50% Off
          </button>
        </div>
      </div>
    </div>
  );
}
