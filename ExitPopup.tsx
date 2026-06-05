/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { X, Flame, Gift, Check } from "lucide-react";

interface ExitPopupProps {
  onTriggerFreeTrial: () => void;
}

export function ExitPopup({ onTriggerFreeTrial }: ExitPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when the user moves their cursor out of the viewport (usually top area)
      if (e.clientY < 20) {
        const hasSeen = sessionStorage.getItem("apex_forge_exit_popup_seen");
        if (!hasSeen) {
          setIsVisible(true);
          sessionStorage.setItem("apex_forge_exit_popup_seen", "true");
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    setIsVisible(false);
    onTriggerFreeTrial();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-neutral-900 border-2 border-red-600 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-red-600/20 relative animate-in fade-in zoom-in duration-300">
        
        {/* Dynamic graphics */}
        <div className="bg-gradient-to-r from-red-700 to-red-950 p-6 text-center text-white relative">
          <button
            onClick={handleClose}
            id="exit-popup-close-btn"
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          >
            <X size={20} />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/30 text-yellow-400 mb-3 hover:scale-110 transition duration-300">
            <Flame size={24} className="animate-pulse" />
          </div>
          
          <h4 className="text-2xl font-black uppercase tracking-tight">HOlD UP, CHAMPION!</h4>
          <p className="text-xs text-red-200 mt-1 uppercase tracking-widest font-semibold">Limited Availability Offer</p>
        </div>

        <div className="p-6 md:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h5 className="text-xl font-bold text-white">Don't Leave Empty Handed!</h5>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Before you step off, secure a <span className="text-white font-bold underline decoration-red-500">100% Free VIP Day Pass</span> including high-end recovery lounge access, state-of-the-art weights floor, & coach diagnostic assessment. 
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-2.5 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check size={16} className="text-red-500 shrink-0" /> No Credit Card or Hidden Fees Required 
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check size={16} className="text-red-500 shrink-0" /> Includes Coated Weight & Kettlebell Access
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Check size={16} className="text-red-500 shrink-0" /> 1-on-1 Corrective Biometrics Included
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleClose}
              id="exit-popup-no-btn"
              className="border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold uppercase py-3 px-4 rounded-xl transition"
            >
              No, Thanks
            </button>
            <button
              onClick={handleClaim}
              id="exit-popup-yes-btn"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-red-600/30 font-bold"
            >
              <Gift size={14} /> Claim My Pass
            </button>
          </div>
          
          <p className="text-[10px] text-neutral-500">
            * Limited to 15 slots daily to preserve coaching excellence. Claim now to lock in.
          </p>
        </div>
      </div>
    </div>
  );
}
