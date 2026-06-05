/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Dumbbell, Users, Play, Award, Scale, CheckCircle2, MessageSquare, 
  Phone, MapPin, Mail, Clock, Flame, ArrowRight, ShieldCheck, 
  ExternalLink, Instagram, Youtube, Facebook, Twitter, Settings, Heart, PlusCircle, Check
} from "lucide-react";

import { 
  initialTrainers, initialPlans, initialClasses, initialTransformations, 
  initialTestimonials, defaultSettings 
} from "./data";
import { Lead, AdminSettings } from "./types";
import { BMICalculator } from "./components/BMICalculator";
import { FormModal } from "./components/FormModal";
import { ExitPopup } from "./components/ExitPopup";
import { OfferBanner } from "./components/OfferBanner";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  // Navigation Section States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const stored = localStorage.getItem("apex_forge_settings");
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error(e);
    }
    return defaultSettings;
  });

  // Leads total tracker
  const [submissionCount, setSubmissionCount] = useState(0);

  // Modals & States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<"free_trial" | "membership" | "trainer" | "general">("free_trial");
  const [preSelectedPlan, setPreSelectedPlan] = useState("");
  const [preSelectedTrainer, setPreSelectedTrainer] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Before & after image toggle helper states
  const [hoveredTransformation, setHoveredTransformation] = useState<string | null>(null);

  // Load and update state
  const refreshSubmissionCount = () => {
    try {
      const stored = localStorage.getItem("apex_forge_leads");
      if (stored) {
        setSubmissionCount(JSON.parse(stored).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshSubmissionCount();
  }, []);

  // Sync Settings changes
  const handleUpdateSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    try {
      localStorage.setItem("apex_forge_settings", JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  // SEO Dynamic Injector
  useEffect(() => {
    // 1. Title and Description
    document.title = "Transform Your Body | Apex Forge Fitness Portal | Premium Gym & Training Desk";
    
    // Check or create Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", "Welcome to Apex Forge Fitness Portal. Transform your confidence with certified personal coaches, heavy compound barbell cages, high-intensity cardio conditioning, and customized micro diets. Claim your free pass today!");

    // 2. Open Graph Tags Injection
    const ogTags = [
      { property: "og:title", content: "Apex Forge Fitness Portal | World-Class Force & Recovery" },
      { property: "og:description", content: "Forge your ultimate physique with professional 1-on-1 coaching, premium equipment, and structured biometrics." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200" },
      { property: "og:type", content: "website" }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", tag.content);
    });

    // 3. Structured Local Business Schema Markup
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      "name": "Apex Forge Fitness Portal",
      "description": "Premium world-class athletics strength academy, recovery center and barbell club.",
      "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": adminSettings.gymAddress,
        "addressLocality": "Austin",
        "addressRegion": "TX",
        "postalCode": "78701",
        "addressCountry": "US"
      },
      "telephone": adminSettings.phoneNumber,
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "05:00",
          "closes": "23:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday"],
          "opens": "07:00",
          "closes": "21:00"
        }
      ]
    };

    let schemaScript = document.getElementById("structured-business-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.setAttribute("id", "structured-business-schema");
      schemaScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaMarkup);

    return () => {
      // Cleanup dynamically
    };
  }, [adminSettings.gymAddress, adminSettings.phoneNumber]);

  // Modal open helpers
  const triggerFreeTrial = () => {
    setFormType("free_trial");
    setPreSelectedPlan("");
    setPreSelectedTrainer("");
    setIsFormOpen(true);
  };

  const triggerMembershipInquiry = (planName: string) => {
    setFormType("membership");
    setPreSelectedPlan(planName);
    setPreSelectedTrainer("");
    setIsFormOpen(true);
  };

  const triggerTrainerHiring = (trainerName: string) => {
    setFormType("trainer");
    setPreSelectedPlan("");
    setPreSelectedTrainer(trainerName);
    setIsFormOpen(true);
  };

  const triggerGeneralContact = () => {
    setFormType("general");
    setPreSelectedPlan("");
    setPreSelectedTrainer("");
    setIsFormOpen(true);
  };

  return (
    <div className="bg-black text-neutral-100 min-h-screen selection:bg-red-600 selection:text-white font-sans antialiased">
      
      {/* 1. LIMITED TIME OFFER BANNER */}
      <OfferBanner onTriggerAction={triggerFreeTrial} />

      {/* 2. DYNAMIC STICKY HEADER */}
      <header className="sticky top-11 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 cursor-pointer group" id="header-logo-container" onClick={() => setActiveTab("home")}>
            <div className="relative">
              {/* Premium Interactive Glow */}
              <div className="absolute inset-0 bg-red-600/35 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
              <div className="relative bg-gradient-to-br from-red-600 to-orange-600 p-2.5 rounded-xl text-white transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-[0_4px_12px_rgba(239,68,68,0.25)]">
                <Dumbbell className="font-black rotate-45 shrink-0" size={18} />
              </div>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-display font-extrabold tracking-wider text-white uppercase italic transition-colors duration-300 group-hover:text-red-500">
                  APEX
                </span>
                <span className="text-xs font-display font-medium tracking-widest text-red-500 uppercase">
                  FORGE
                </span>
              </div>
              <span className="text-[8px] block text-neutral-400 font-mono tracking-[0.25em] font-extrabold mt-1">
                FITNESS PORTAL
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-neutral-300">
            <button 
              onClick={() => { setActiveTab("home"); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              className={`hover:text-red-500 transition-colors ${activeTab === "home" ? "text-red-500 font-extrabold" : ""}`}
            >
              Home
            </button>
            <a 
              href="#about-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              About
            </a>
            <a 
              href="#membership-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Memberships
            </a>
            <a 
              href="#training-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Coaching
            </a>
            <a 
              href="#classes-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Classes
            </a>
            <a 
              href="#transformations-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Success
            </a>
            <a 
              href="#trainers-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Trainers
            </a>
            <a 
              href="#contact-section"
              onClick={() => setActiveTab("home")}
              className="hover:text-red-500 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-3">
            {/* Secret/Admin trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              id="header-admin-trigger"
              className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-lg transition-all flex items-center gap-1"
              title="Open Administrative Leads Desk"
            >
              <Settings size={15} />
              {submissionCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                  {submissionCount}
                </span>
              )}
            </button>

            <button
              onClick={triggerFreeTrial}
              id="header-book-trial-btn"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg transition duration-200 shadow-md shadow-red-600/15"
            >
              Book Free Trial
            </button>
          </div>
        </div>
      </header>

      {/* 3. CORE VIEWPORT CONTAINER */}
      <main className="pb-16">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-black overflow-hidden px-4">
          {/* Moody background dark image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600" 
              alt="Apex Forge Premium Gym Vault" 
              className="w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
              loading="eager"
              width={1600}
              height={1066}
            />
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-950/80 to-black/40" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12">
            
            {/* Text details */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/25 rounded-full text-xs font-extrabold uppercase tracking-widest">
                <Flame size={12} className="animate-bounce" />
                Apex Strength & Conditioning Academy
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
                Transform Your Body. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                  Build Your Confidence.
                </span>
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Professional coaching, medical-grade compound equipment, specialized biometrics tracking, and customized nutrition layouts. Stop wishing. Start forging.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => {
                    const el = document.getElementById("membership-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  id="hero-join-now-btn"
                  className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-black font-extrabold uppercase tracking-widest text-xs py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition duration-300 shadow-xl"
                >
                  Join Elite Member Tiers
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={triggerFreeTrial}
                  id="hero-free-trial-btn"
                  className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 font-extrabold uppercase tracking-widest text-xs py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition duration-300"
                >
                  <Play size={13} className="text-red-500 fill-red-500" />
                  Book Free 1-Day Trial
                </button>
              </div>

              {/* Badges indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0 border-t border-neutral-900">
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black text-white block">12+</span>
                  <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono">Expert Coaches</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black text-red-500 block">250+</span>
                  <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono">Ripped Clients</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl sm:text-3xl font-black text-white block">24/7</span>
                  <span className="text-[10px] uppercase text-neutral-500 font-bold font-mono">Gym Access</span>
                </div>
              </div>
            </div>

            {/* Quick Conversion Promo Slider box */}
            <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800/80 p-6 rounded-3xl space-y-4 relative overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-600 to-red-600" />
              
              <div className="flex items-center gap-2">
                <div className="bg-red-500 text-black p-1.5 rounded-full text-xs font-black">
                  <Flame size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs uppercase text-neutral-400 font-black tracking-widest">Active Deal Alert</h4>
                  <p className="text-[11px] text-green-500 font-bold">Expires tonight at 11:59PM</p>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-lg font-extrabold text-white">Claim Summer Blueprint</h5>
                <p className="text-neutral-400 text-xs">Register before you load out, and secure absolute premium training resources worth $249 completely free.</p>
              </div>

              <div className="border-t border-neutral-800/80 pt-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Coaching Induction:</span>
                  <span className="font-extrabold text-white text-[11px]">INCLUDED ($75 value)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">InBody Scanner Scan:</span>
                  <span className="font-extrabold text-white text-[11px]">INCLUDED ($40 value)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">1-Day Wellness Pass:</span>
                  <span className="text-green-500 font-extrabold text-[11px]">100% FREE ($30 value)</span>
                </div>
              </div>

              <button
                onClick={triggerFreeTrial}
                id="hero-claim-bonus-btn"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition duration-300 transform active:scale-95 shadow-lg shadow-red-600/35"
              >
                Claim This Bonus Package Now
              </button>
            </div>
          </div>
        </section>


        {/* WHY CHOOSE US */}
        <section id="about-section" className="py-20 px-4 bg-neutral-950 border-y border-neutral-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Our Professional Edge</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Why Elite Athletes Forge With Us
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Apex Forge is not a commercial fitness warehouse. It is a highly optimized environment dedicated to absolute biological development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <Award size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Certified Master Coaches</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Our fitness desk is staffed strictly by accredited CSCS coaches, physical therapist associates, and nutrition coaches. No generic guides.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <Dumbbell size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Modern Equipment Floor</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Train with high-end Eleiko barbells, competition-grade power cages, specialized plate-loaded rowers, and biometric conditioning devices.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Affordable Custom Plans</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Transparent member pricing without predatory long-term locked contracts or deceptive maintenance processing surcharges. Cancel anytime.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Personalized Training Models</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  We program every sequence specifically to your kinematic boundaries, structural restrictions, schedule, and absolute metabolic priorities.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <Heart size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Micro-Nutritional Guidance</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Acquire precise macronutrient targets and meal architectures paired directly with your progressive cycles to speed recovery and mass change.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-red-500/50 transition-all duration-300 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Highly Flexible Hours</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Whether lifting early before work at 05:00 AM or squeezing in stress relief late at night, our digital fob doors fit your lifestyle demands.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* MEMBERSHIP PLANS */}
        <section id="membership-section" className="py-20 px-4 bg-black scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Premium Tariff Tiers</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Invest In Your Physique
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                No hidden assessment processing fees. Choose a membership plan that aligns with your active goals. Canceling is simple.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {initialPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border rounded-2xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                    plan.popular 
                      ? "bg-neutral-900 border-red-500 lg:scale-105 shadow-2xl shadow-red-600/10 z-10" 
                      : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {/* Popular Indicator badge */}
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-red-400 animate-pulse">
                      Most Selected Academy Tier
                    </span>
                  )}

                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block font-mono">
                      {plan.name}
                    </span>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-4 text-4xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-neutral-400 font-medium">/ {plan.billing.includes("Quarter") ? "3mo" : plan.billing.includes("Annual") ? "yr" : "mo"}</span>
                    </div>

                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest font-mono border-b border-neutral-800 pb-3">
                      Includes the following:
                    </p>

                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check size={14} className="text-red-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => triggerMembershipInquiry(plan.name)}
                      id={`plan-inquire-${plan.id}-btn`}
                      className={`w-full text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition duration-300 ${
                        plan.popular
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                          : "bg-neutral-800 hover:bg-neutral-700 text-white"
                      }`}
                    >
                      Process Inquiry Registration
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action block */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
              <div>
                <h4 className="text-lg font-bold text-white">Not ready to lock in?</h4>
                <p className="text-xs text-neutral-400 mt-1">Book a free physical test and tour the floors with an elite coach. No pressure, guaranteed luxury experience.</p>
              </div>
              <button
                onClick={triggerFreeTrial}
                id="membership-free-tour-btn"
                className="bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition shrink-0"
              >
                Book My Free Tour
              </button>
            </div>

          </div>
        </section>


        {/* PERSONAL TRAINING */}
        <section id="training-section" className="py-20 px-4 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Design Grid Photo */}
            <div className="lg:col-span-5 relative">
              <div className="absolute top-4 left-4 w-full h-full bg-red-600 rounded-2xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800" 
                alt="Strength Coaching Session" 
                className="w-full h-full object-cover rounded-2xl shadow-xl border border-neutral-800"
                referrerPolicy="no-referrer"
              />
              {/* Badge indicator */}
              <div className="absolute -bottom-4 -right-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-3 shadow-lg max-w-xs text-xs">
                <CheckCircle2 size={32} className="text-green-500 shrink-0" />
                <div>
                  <p className="font-bold text-white">Accredited Programs</p>
                  <p className="text-[10px] text-neutral-500 font-mono font-bold">100% SECURE SCIENTIFIC LOADS</p>
                </div>
              </div>
            </div>

            {/* Specialized Text info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">1-on-1 Premium Performance</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Personalized Training Built On Solid Science.
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                Elite physical modification does not come from generalized phone applications. Our certified coaching staff models biomechanical patterns, checks movement integrity, isolates lagging ranges, and designs specific nutritional structures.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="p-1 rounded bg-red-500/10 text-red-500 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Biometric Diagnostic Testing</h4>
                    <p className="text-[11px] text-neutral-400">Monthly InBody metric checking tracking precise fat distribution, lean bulk layers, and hydration indexes.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-1 rounded bg-red-500/10 text-red-500 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Therapeutic Corrective Conditioning</h4>
                    <p className="text-[11px] text-neutral-400">Stiff shoulders, lower back fatigue or tight knees? Our coaches implement injury prevention models directly.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-1 rounded bg-red-500/10 text-red-500 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Weekly Lifestyle Macro Auditing</h4>
                    <p className="text-[11px] text-neutral-400">Complete caloric blueprint and grocery lists optimized for performance recovery, memory clarity, and work-life energy balance.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => triggerTrainerHiring("Elite Personal Coach")}
                  id="pt-hire-consult-btn"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest py-3.5 px-8 rounded-xl transition duration-300 shadow-md shadow-red-600/15"
                >
                  Schedule A Free Strategic Assessment
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* CLASSES */}
        <section id="classes-section" className="py-20 px-4 bg-black scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Structured Group Workouts</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Apex Forge Training Classes
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Ramp kinetic thresholds with organized, heavy-hitting sessions built for absolute motor conditioning. High energy, zero slop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialClasses.map((cl) => (
                <div 
                  key={cl.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-lg hover:border-neutral-700 transition duration-300"
                >
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src={cl.photoUrl} 
                      alt={cl.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
                      {cl.intensity}
                    </div>
                  </div>

                  <div className="md:w-2/3 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white hover:text-red-500 transition cursor-pointer">{cl.title}</h3>
                      <p className="text-neutral-400 text-xs leading-relaxed">{cl.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-neutral-500 text-[10px] uppercase font-mono block">Schedule / Weekdays</span>
                        <span className="text-white font-bold font-mono text-[11px]">{cl.time}</span>
                      </div>
                      <div className="space-y-1 sm:text-right shrink-0">
                        <span className="text-neutral-500 text-[10px] uppercase font-mono block">Class Duration</span>
                        <span className="text-red-500 font-bold block">{cl.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* TRANSFORMATION GALLERY */}
        <section id="transformations-section" className="py-20 px-4 bg-neutral-950 border-y border-neutral-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Proof of Performance</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Elite Transformation Gallery
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Real results from dedicated local business executives, working parents, and seasoned lifters. Hover or tap to inspect before status.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {initialTransformations.map((trans) => (
                <div 
                  key={trans.id}
                  className="bg-neutral-900 border border-neutral-800/85 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  onMouseEnter={() => setHoveredTransformation(trans.id)}
                  onMouseLeave={() => setHoveredTransformation(null)}
                >
                  {/* Photo comparison box */}
                  <div className="md:col-span-6 relative overflow-hidden rounded-2xl bg-black h-72 border border-neutral-850">
                    <img 
                      src={hoveredTransformation === trans.id ? trans.beforeImg : trans.afterImg} 
                      alt={`${trans.clientName} Physique Evolution`}
                      className="w-full h-full object-cover transition-all duration-500 transform hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Visual filter overlay label */}
                    <div className="absolute top-3 left-3 bg-black/75 border border-neutral-800 text-white font-bold font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                      {hoveredTransformation === trans.id ? "BEFORE REGISTER" : `AFTER ${trans.duration.toUpperCase()}`}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-center bg-black/60 backdrop-blur-xs py-1.5 rounded-lg text-[9px] text-neutral-400 font-medium">
                      {hoveredTransformation === trans.id ? "Displaying starting composition" : "Hover cursor over card layout to view BEFORE state!"}
                    </div>
                  </div>

                  {/* Testimonial detail text */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="space-y-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-red-600/10 border border-red-500/20 text-red-500 rounded text-[10px] font-bold uppercase font-mono">
                        {trans.duration} Structural Cycle
                      </span>
                      <h4 className="text-lg font-extrabold text-white">{trans.clientName}</h4>
                      <p className="text-sm text-green-500 font-extrabold tracking-tight">{trans.achievement}</p>
                    </div>

                    <p className="text-neutral-400 text-xs italic leading-relaxed">
                      "{trans.quote}"
                    </p>

                    <div className="pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-500 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-red-500" /> Results verified via InBody biometric logs.
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* TRAINERS SECTION */}
        <section id="trainers-section" className="py-20 px-4 bg-black scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Apex Coaching Staff</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Commanders of the Floor
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Certified, experienced, and dedicated strictly to functional, sustainable changes. Read credentials and schedule coach alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialTrainers.map((coach) => (
                <div 
                  key={coach.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-lg group hover:border-red-500/40 transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-80 overflow-hidden bg-neutral-950">
                    <img 
                      src={coach.photoUrl} 
                      alt={coach.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-red-500 text-[10px] font-black uppercase font-mono block mb-1">
                        {coach.role}
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {coach.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase font-mono block">Experience Depth</span>
                      <span className="text-xs text-neutral-300 font-bold block">{coach.experience}</span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-neutral-500 uppercase font-mono block">Core Specialties</span>
                      <div className="flex flex-wrap gap-1.5">
                        {coach.specialties.map((spec, i) => (
                          <span key={i} className="bg-neutral-950 border border-neutral-800 text-[10px] px-2 py-0.5 rounded text-neutral-300">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                      <span className="text-[10px] text-red-500 font-bold uppercase font-mono block">Accredited Credentials</span>
                      <ul className="space-y-1">
                        {coach.certifications.map((cert, idx) => (
                          <li key={idx} className="text-[10px] text-neutral-400 font-medium truncate" title={cert}>
                            • {cert}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => triggerTrainerHiring(coach.name)}
                      id={`coach-hire-${coach.id}-btn`}
                      className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase py-2.5 rounded-lg tracking-wider transition duration-200"
                    >
                      Book 1-on-1 Coached Trial
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* TESTIMONIALS */}
        <section className="py-20 px-4 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Local Reviews desk</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Accolades From The Vault
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Read what certified community professionals, busy entrepreneurs and premium athletes highlight after training at Apex Forge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialTestimonials.map((test) => (
                <div 
                  key={test.id}
                  className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: test.stars }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-md">★</span>
                      ))}
                    </div>

                    <p className="text-neutral-300 text-xs md:text-sm leading-relaxed italic">
                      "{test.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-neutral-800/80 pt-4">
                    <img 
                      src={test.photoUrl} 
                      alt={test.name} 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{test.name}</h4>
                      <p className="text-[10px] text-neutral-500">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* BMI CALCULATOR SECTION */}
        <section className="py-20 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <BMICalculator />
          </div>
        </section>


        {/* CONTACT US & MAP SECTION */}
        <section id="contact-section" className="py-20 px-4 bg-neutral-950 border-t border-neutral-900 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest font-mono">Locate & Inquire</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Let's Build Your Legacy
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm">
                Get in touch using the direct hotline channel, message our training desk on WhatsApp, or stop by the Olympic facility floor.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left detail info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl" />
                  
                  <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
                    <Users size={18} className="text-red-500" />
                    Administrative Directory
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-neutral-950 rounded-xl text-neutral-400 border border-neutral-800 shrink-0">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block tracking-wider">Gym Location</span>
                        <span className="text-xs text-neutral-200 block">{adminSettings.gymAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-neutral-950 rounded-xl text-neutral-400 border border-neutral-800 shrink-0">
                        <Phone size={16} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block tracking-wider">Hotline Calling Support</span>
                        <a href={`tel:${adminSettings.phoneNumber}`} className="text-xs text-red-500 hover:underline block font-bold font-mono">
                          {adminSettings.phoneNumber}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-neutral-950 rounded-xl text-neutral-400 border border-neutral-800 shrink-0">
                        <Mail size={16} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block tracking-wider">Register Email Carrier</span>
                        <a href={`mailto:${adminSettings.adminEmail}`} className="text-xs text-neutral-200 hover:underline block font-mono">
                          {adminSettings.adminEmail}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-neutral-950 rounded-xl text-neutral-400 border border-neutral-800 shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-neutral-500 font-mono block tracking-wider">Lifting Schedules</span>
                        <span className="text-xs text-neutral-200 block font-semibold">Mon - Fri: 05:00 AM - 11:00 PM</span>
                        <span className="text-xs text-neutral-400 block">Sat - Sun: 07:00 AM - 09:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider font-mono">
                    <span>Stay Connected:</span>
                    <div className="flex gap-3">
                      <a href={adminSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition"><Facebook size={14} /></a>
                      <a href={adminSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition"><Instagram size={14} /></a>
                      <a href={adminSettings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition"><Youtube size={14} /></a>
                      <a href={adminSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition"><Twitter size={14} /></a>
                    </div>
                  </div>
                </div>

                {/* Simulated Google Map design */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-1 overflow-hidden h-60 relative group">
                  <iframe 
                    title="Apex Forge Arena District Map Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74637217316!2d-97.8219957!3d30.267153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a075039f%3A0x2213dc11212c2213!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                    className="w-full h-full border-0 rounded-2xl opacity-75 group-hover:opacity-90 transition duration-300 filter grayscale"
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-black/85 border border-neutral-800 px-3 py-1.5 rounded-lg text-[10px] text-white font-mono flex items-center gap-1.5 pointer-events-none shadow">
                    <MapPin size={12} className="text-red-500" /> Ground Floor Access Activated
                  </div>
                </div>
              </div>

              {/* Right contact simple form */}
              <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 p-6 md:p-8 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Transmit General Message</h3>
                  <p className="text-xs text-neutral-400">Connect with operations regarding business, guest access or media inquiries</p>
                </div>

                <div className="space-y-4">
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    Would you like to speak directly to billing support or report a keyfob access issue? Fill in properties below and we'll reply directly to your primary email carrier.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={triggerGeneralContact}
                      id="contact-general-btn"
                      className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition duration-200"
                    >
                      <Mail size={13} className="text-red-500" />
                      Email Desk
                    </button>
                    <a
                      href={`https://wa.me/${adminSettings.whatsappNumber.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-1.5 transition duration-200"
                    >
                      <MessageSquare size={13} />
                      WhatsApp Chat
                    </a>
                  </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Live Support Status:</span>
                    <span className="font-extrabold text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                      ONLINE (Under 12-min response)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500">Authorized Access Gate:</span>
                    <span className="text-white font-mono text-[11px] font-bold">RFID GUEST REGISTER ACTIVE</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 4. LUXURIOUS PORTAL FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900 px-6 py-12 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1 */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-xl text-white">
                <Dumbbell className="font-extrabold rotate-45" size={18} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-white">
                APEX <span className="text-red-500">FORGE</span>
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              We build functional, durable physical composition changes with high-performance coaching metrics and structured bio tracking. Establish your legacy.
            </p>
            <p className="text-[10px] text-neutral-600">
              © {new Date().getFullYear()} Apex Forge Fitness Portal. Accreditations pending registration. All rights reserved.
            </p>
          </div>

          {/* Col 2 Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white uppercase font-bold text-[10px] tracking-widest font-mono">Jump Directions</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#about-section" className="hover:text-white transition">About Our Facility</a></li>
              <li><a href="#membership-section" className="hover:text-white transition">Acquisition Plans</a></li>
              <li><a href="#training-section" className="hover:text-white transition">Accredited Personal Coaches</a></li>
              <li><a href="#classes-section" className="hover:text-white transition">Group Workout Calendars</a></li>
              <li><a href="#transformations-section" className="hover:text-white transition">Physique Transformations</a></li>
            </ul>
          </div>

          {/* Col 3 Resources */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white uppercase font-bold text-[10px] tracking-widest font-mono">Administration Desk</h4>
            <p className="text-neutral-500 text-xs">
              Apex Forge runs local-level tracking metrics to guard performance outcomes. Download CSV logs or customize parameters below.
            </p>
            <div>
              <button
                onClick={() => setIsAdminOpen(true)}
                id="footer-admin-btn"
                className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-bold uppercase tracking-wider text-[10px] py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition"
              >
                <Settings size={12} />
                Open Leads & Settings Panel
              </button>
            </div>
          </div>

        </div>
      </footer>


      {/* 5. CONVERSION STICKY PANEL FLOATERS */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 items-end">
        
        {/* Sticky Active WhatsApp button */}
        <a 
          href={`https://wa.me/${adminSettings.whatsappNumber.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 hover:scale-105 text-white p-3.5 rounded-full shadow-2xl transition duration-300 flex items-center justify-center border border-emerald-500/35 relative group"
          title="Direct WhatsApp Helpline"
          id="sticky-whatsapp-btn"
        >
          <MessageSquare size={20} />
          <span className="absolute right-12 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-350 shrink-0 whitespace-nowrap">
            Support Chat Active
          </span>
        </a>

        {/* Sticky Call Hotline Button */}
        <a 
          href={`tel:${adminSettings.phoneNumber}`}
          className="bg-neutral-900 border border-neutral-800 hover:scale-105 hover:bg-neutral-850 text-red-500 p-3.5 rounded-full shadow-2xl transition duration-300 flex items-center justify-center relative group"
          title="Call Official Support Desk"
          id="sticky-call-btn"
        >
          <Phone size={20} />
          <span className="absolute right-12 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-350 shrink-0 whitespace-nowrap">
            Call Operator Support
          </span>
        </a>

        {/* Sticky Main Join Action Trigger */}
        <button
          onClick={triggerFreeTrial}
          id="sticky-join-now-btn"
          className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 shadow-2xl transition duration-300 border border-red-500/25"
        >
          <Flame size={14} className="animate-pulse" />
          Join Now
        </button>

      </div>


      {/* 6. CONVERSION MODALS & OVERLAYS */}
      
      {/* Form Submission Modal Overlay */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formType={formType}
        preSelectedPlan={preSelectedPlan}
        preSelectedTrainer={preSelectedTrainer}
        settings={adminSettings}
        onLeadAdded={refreshSubmissionCount}
      />

      {/* Exit Intent Tracker */}
      <ExitPopup onTriggerFreeTrial={triggerFreeTrial} />

      {/* Administration Lead Dashboard Modal Overlay */}
      {isAdminOpen && (
        <AdminDashboard
          settings={adminSettings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

    </div>
  );
}
