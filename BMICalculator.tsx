/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Activity, ShieldCheck, Scale, Compass } from "lucide-react";

export function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");

  const calculateBMI = (e: FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    let computedBmi = 0;
    if (unit === "metric") {
      // height in cm, weight in kg
      const heightInMeters = h / 100;
      computedBmi = w / (heightInMeters * heightInMeters);
    } else {
      // height in inches, weight in lbs
      computedBmi = (w / (h * h)) * 703;
    }

    const roundedBmi = parseFloat(computedBmi.toFixed(1));
    setBmi(roundedBmi);

    let cat = "";
    let rec = "";

    if (roundedBmi < 18.5) {
      cat = "Underweight";
      rec = "We recommend joining our 'Forge Barbell Club' and adopting a targeted caloric surplus meal program. Focus on progressive overload and high protein intake to pack on athletic lean mass.";
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      cat = "Optimal Healthy Weight";
      rec = "Excellent composition. Maintain your high-end performance by enrolling in 'Apex Conditioning (HIIT)' combined with compound heavy barbell lifting to build deep trunk density.";
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      cat = "Overweight";
      rec = "Your best path is high-density functional strength training. Join our 'Apex Conditioning (HIIT)' workouts to boost your daily caloric burn while preserving solid motor mass.";
    } else {
      cat = "Obese / Extreme mass index";
      rec = "We strongly suggest hiring our elite 1-on-1 coach Serena Vance or Marcus Vance for personalized safe corrective biometrics, customized micro nutrition schedules, and low-impact high-intensity recovery programs.";
    }

    setCategory(cat);
    setRecommendation(rec);
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
    setRecommendation("");
  };

  return (
    <div id="bmi-calculator" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/15 text-red-500 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-red-500/25">
            <Activity size={12} />
            Biometric Testing
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            Check Your <span className="text-red-500">BMI Index</span>
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed mb-6">
            Input your measurements below to instantly compute your Body Mass Index (BMI). Discover custom tailored athletic paths designed by our expert training desk to crush your fitness goals.
          </p>

          <form onSubmit={calculateBMI} className="space-y-4">
            {/* Unit Selector */}
            <div className="flex rounded-md bg-neutral-950 p-1 border border-neutral-800">
              <button
                type="button"
                id="unit-metric-btn"
                onClick={() => { setUnit("metric"); resetForm(); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  unit === "metric" ? "bg-red-600 text-white shadow-md" : "text-neutral-400 hover:text-white"
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                type="button"
                id="unit-imperial-btn"
                onClick={() => { setUnit("imperial"); resetForm(); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  unit === "imperial" ? "bg-red-600 text-white shadow-md" : "text-neutral-400 hover:text-white"
                }`}
              >
                Imperial (lbs / inches)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                  Weight ({unit === "metric" ? "kg" : "lbs"})
                </label>
                <input
                  type="number"
                  required
                  id="bmi-weight-input"
                  min="5"
                  max="1000"
                  step="0.1"
                  placeholder={unit === "metric" ? "e.g. 78" : "e.g. 172"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white rounded-lg px-4 py-2.5 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
                  Height ({unit === "metric" ? "cm" : "inches"})
                </label>
                <input
                  type="number"
                  required
                  id="bmi-height-input"
                  min="10"
                  max="500"
                  step="0.1"
                  placeholder={unit === "metric" ? "e.g. 178" : "e.g. 70"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white rounded-lg px-4 py-2.5 outline-none transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              id="bmi-calculate-btn"
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase py-3 px-4 rounded-lg tracking-wider transition-all duration-300 transform active:scale-95 shadow-lg shadow-red-600/20"
            >
              Analyze My Biometrics
            </button>
          </form>
        </div>

        {/* Results Pane */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
          {bmi === null ? (
            <div className="flex flex-col items-center justify-center text-center py-10 my-auto text-neutral-500">
              <Scale size={48} className="text-neutral-700 mb-3 animate-pulse" />
              <p className="text-sm font-medium">Enter details and hit analyze</p>
              <p className="text-xs text-neutral-600 mt-1">We will compile the physical indicators</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Biometric Diagnosis</span>
                <button 
                  onClick={resetForm}
                  className="text-xs text-red-500 hover:text-red-400 transition"
                  id="bmi-reset-btn"
                >
                  Recalculate
                </button>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">{bmi}</span>
                <span className="text-xs text-neutral-500">BMI Index</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg">
                <span className={`w-3 h-3 rounded-full ${
                  bmi < 18.5 ? "bg-amber-400" :
                  bmi >= 18.5 && bmi < 25 ? "bg-green-500" :
                  bmi >= 25 && bmi < 30 ? "bg-amber-500" : "bg-red-500"
                }`} />
                <span className="text-sm font-semibold text-white">{category}</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase tracking-widest">
                  <Compass size={14} />
                  Apex Master Coach Directive:
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {recommendation}
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                <ShieldCheck size={11} className="text-green-500" /> This is a standard physical estimate. Always consult personal trainers before launching premium fitness loads.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
