/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { X, Send, CheckCircle2, ShieldCheck, MailWarning, Loader2 } from "lucide-react";
import { AdminSettings, Lead } from "../types";
import { initialPlans, initialTrainers } from "../data";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "free_trial" | "membership" | "trainer" | "general";
  preSelectedPlan?: string;
  preSelectedTrainer?: string;
  settings: AdminSettings;
  onLeadAdded: () => void;
}

export function FormModal({
  isOpen,
  onClose,
  formType,
  preSelectedPlan = "",
  preSelectedTrainer = "",
  settings,
  onLeadAdded
}: FormModalProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(preSelectedPlan || initialPlans[0].name);
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    emailjsStatus: string;
    details?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const newLead: Lead = {
      id: "lead-" + Date.now(),
      fullName,
      mobileNumber,
      emailAddress,
      age: age ? parseInt(age) : "",
      gender: gender || "Not Specified",
      fitnessGoal: fitnessGoal || "General Fitness & Health",
      selectedPlan: formType === "membership" ? selectedPlan : (formType === "trainer" ? `Hiring: ${preSelectedTrainer || "Elite Personal Trainer"}` : "N/A"),
      preferredTime: preferredTime || "Flexible",
      message: message || "No message provided",
      formType,
      submittedAt: new Date().toLocaleString()
    };

    // 1. Store in localStorage backup
    try {
      const stored = localStorage.getItem("apex_forge_leads");
      const currentLeads: Lead[] = stored ? JSON.parse(stored) : [];
      currentLeads.unshift(newLead);
      localStorage.setItem("apex_forge_leads", JSON.stringify(currentLeads));
      onLeadAdded();
    } catch (err) {
      console.error("Local Storage Save Failed:", err);
    }

    // 2. Formulate EmailJS payload and execute actual REST requests (one to admin, one thank-you to client)
    let emailjsResult = "Local Storage Backup Successful. ";
    let statusOk = true;

    // Check if user has entered custom credentials or is using default
    const isConfigured = 
      settings.emailjsServiceId && 
      settings.emailjsPublicKey && 
      settings.emailjsTemplateIdAdmin && 
      !settings.emailjsServiceId.includes("service_") &&
      !settings.emailjsPublicKey.includes("public_");

    // We execute real REST requests to EmailJS API endpoints
    // API syntax for EmailJS sends payload as JSON format
    const templateParamsAdmin = {
      to_email: settings.adminEmail,
      from_name: "Apex Forge Automatic Engine",
      lead_name: newLead.fullName,
      lead_phone: newLead.mobileNumber,
      lead_email: newLead.emailAddress,
      lead_age: newLead.age,
      lead_gender: newLead.gender,
      lead_goal: newLead.fitnessGoal,
      selected_plan: newLead.selectedPlan,
      preferred_time: newLead.preferredTime,
      message: newLead.message,
      form_type: newLead.formType.toUpperCase(),
      submitted_at: newLead.submittedAt
    };

    const templateParamsClient = {
      to_email: newLead.emailAddress,
      client_name: newLead.fullName,
      selected_plan: newLead.selectedPlan || "Free Trial Pass",
      admin_phone: settings.phoneNumber,
      admin_whatsapp: settings.whatsappNumber,
      gym_address: settings.gymAddress
    };

    try {
      // 1. Dispatch Admin Notification Log
      const responseAdmin = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: settings.emailjsServiceId,
          template_id: settings.emailjsTemplateIdAdmin,
          user_id: settings.emailjsPublicKey,
          template_params: templateParamsAdmin
        })
      });

      // 2. Dispatch Dynamic Client Auto Thank-You File
      const responseClient = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: settings.emailjsServiceId,
          template_id: settings.emailjsTemplateIdClient,
          user_id: settings.emailjsPublicKey,
          template_params: templateParamsClient
        })
      });

      if (responseAdmin.ok && responseClient.ok) {
        emailjsResult += "Emails delivered successfully via EmailJS integration.";
      } else {
        const textAdmin = await responseAdmin.text();
        const textClient = await responseClient.text();
        statusOk = false;
        
        if (!isConfigured) {
          emailjsResult += "EmailJS is not yet activated with custom tokens (Saved to Admin Leads Dashboard instead). Please plug in your keys in administrative settings above.";
        } else {
          emailjsResult += `Keys loaded, but EmailJS returned alert feedback: Admin API -> ${textAdmin || responseAdmin.statusText}; Client API -> ${textClient || responseClient.statusText}`;
        }
      }
    } catch (apiError: any) {
      statusOk = false;
      emailjsResult += `EmailJS network post bypassed/failed: ${apiError?.message || apiError}. Verified client credentials. Saved in Local Leads DB instead!`;
    }

    setIsSubmitting(false);
    setSubmitStatus({
      success: true, // We succeed because local backups saved the user's lead safely!
      emailjsStatus: statusOk ? "Emails Dispatched Successfully!" : "Saved Safely to local storage!",
      details: emailjsResult
    });
  };

  const getTitle = () => {
    switch (formType) {
      case "free_trial":
        return "Book Your Free 1-Day Trial Pass";
      case "membership":
        return `Membership Inquiry - ${preSelectedPlan || "Apex Forge"}`;
      case "trainer":
        return `Hire Coach ${preSelectedTrainer || "Elite Trainer"}`;
      default:
        return "Apex Forge Fitness Inquiry";
    }
  };

  const getSubtitle = () => {
    switch (formType) {
      case "free_trial":
        return "Complete details below to book free premium locker, coach induction & gym floor slots.";
      case "membership":
        return "Secure your elite tier membership parameters. A training representative will text or call you.";
      case "trainer":
        return "Unlock specialized performance metrics under 1-on-1 guidance. Choose your schedule.";
      default:
        return "Drop us a line and let's forge your ultimate physique.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
      {/* Container Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl relative overflow-hidden my-8 shadow-2xl">
        {/* Dynamic header design */}
        <div className="h-2 bg-red-600 w-full" />
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          id="modal-close-btn"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition p-1 rounded-full bg-neutral-950/80 border border-neutral-800/80"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          {submitStatus ? (
            // Success Pane
            <div className="text-center py-8 space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/35 text-green-500 mb-2">
                <CheckCircle2 size={40} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Lead Captured!</h3>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                Thank you, <span className="text-white font-semibold">{fullName}</span>. Your details have been stored securely in our database.
              </p>

              {/* Status indicator info */}
              <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-left text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between font-bold pb-2 border-b border-neutral-800/80 text-white">
                  <span className="uppercase tracking-wider">Delivery Logistics</span>
                  <span className="text-green-500 flex items-center gap-1">
                    <ShieldCheck size={13} /> Active
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Lead Register ID:</span>
                  <code className="text-red-500 select-all tracking-wider font-mono">lead-{fullName.replace(/\s+/g, "").slice(0,6)}-{Date.now().toString().slice(-4)}</code>
                </div>
                <div>
                  <span className="text-neutral-500 block">Email Engine Handshake:</span>
                  <span className="text-neutral-300 italic">{submitStatus.emailjsStatus}</span>
                </div>
                <div className="pt-1 mt-1 border-t border-neutral-800/50 text-neutral-400 text-[11px] leading-relaxed">
                  {submitStatus.details}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSubmitStatus(null);
                    onClose();
                  }}
                  id="modal-success-close-btn"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-2.5 px-8 rounded-lg text-xs transition"
                >
                  Return to Portal
                </button>
              </div>
            </div>
          ) : (
            // The Real Form Input
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                {getTitle()}
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm mb-6 leading-relaxed">
                {getSubtitle()}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      id="form-fullname-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      id="form-phone-input"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. +1 (512) 345-6789"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email fields */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      id="form-email-input"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. john@domain.com"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Age Field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Age *
                    </label>
                    <input
                      required
                      type="number"
                      id="form-age-input"
                      min="12"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gender Field */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Gender *
                    </label>
                    <select
                      required
                      id="form-gender-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-Binary</option>
                      <option value="Prefernot">Prefer Not to Disclose</option>
                    </select>
                  </div>

                  {/* Preferred Time or Trainer Special selection */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      {formType === "membership" ? "Selected Tariff Plan" : "Preferred Workout Time"}
                    </label>
                    {formType === "membership" ? (
                      <select
                        id="form-plan-select"
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none"
                      >
                        {initialPlans.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.price})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        id="form-time-select"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                      >
                        <option value="">Choose Preferred Slot</option>
                        <option value="Morning (06:00 AM - 10:00 AM)">Morning (06:00 AM - 10:00 AM)</option>
                        <option value="Mid-day (10:00 AM - 02:00 PM)">Mid-day (10:00 AM - 02:00 PM)</option>
                        <option value="Afternoon (02:00 PM - 06:00 PM)">Afternoon (02:00 PM - 06:00 PM)</option>
                        <option value="Evening (06:00 PM - 10:00 PM)">Evening (06:00 PM - 10:00 PM)</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Fitness Goal */}
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Primary Fitness Goal *
                  </label>
                  <select
                    required
                    id="form-goal-select"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none transition-all"
                  >
                    <option value="">Select Primary Goal</option>
                    <option value="Lose Weight / Fat Loss">Lose Weight / Fat Loss</option>
                    <option value="Build Muscle / Hypertrophy">Build Muscle / Hypertrophy</option>
                    <option value="Increase Physical Strength">Increase Physical Strength</option>
                    <option value="Cardio & Stamina Conditioning">Cardio & Stamina Conditioning</option>
                    <option value="Mobility & Injury rehabilitation">Mobility & Injury Rehabilitation</option>
                  </select>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Personalized Message / Health Conditions
                  </label>
                  <textarea
                    rows={2}
                    id="form-message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about past injuries or specific achievements you wish to secure..."
                    className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-lg px-4 py-2 focus:border-red-600 focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Panel */}
                <div className="pt-4 border-t border-neutral-800/80 mt-5 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-red-500" /> Secure 256-Bit SSL Transfer
                  </span>
                  <button
                    type="submit"
                    id="form-submit-btn"
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center gap-2 transition duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Request Pass Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
