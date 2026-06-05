/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { 
  Users, Settings, Award, Search, Download, Trash2, CheckCircle2, 
  MapPin, Phone, MessageSquare, ShieldCheck, Mail, Calendar, Eye, X, RefreshCw
} from "lucide-react";
import { Lead, AdminSettings } from "../types";

interface AdminDashboardProps {
  settings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
  onClose: () => void;
}

export function AdminDashboard({ settings, onUpdateSettings, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"leads" | "settings" | "insights">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("all");
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Lead | null>(null);

  // Administrative Settings form local state
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber);
  const [gymAddress, setGymAddress] = useState(settings.gymAddress);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl);
  
  // EmailJS details settings
  const [emailjsServiceId, setEmailjsServiceId] = useState(settings.emailjsServiceId);
  const [emailjsTemplateIdAdmin, setEmailjsTemplateIdAdmin] = useState(settings.emailjsTemplateIdAdmin);
  const [emailjsTemplateIdClient, setEmailjsTemplateIdClient] = useState(settings.emailjsTemplateIdClient);
  const [emailjsPublicKey, setEmailjsPublicKey] = useState(settings.emailjsPublicKey);

  const [saveMessage, setSaveMessage] = useState("");

  const loadLeads = () => {
    try {
      const stored = localStorage.getItem("apex_forge_leads");
      if (stored) {
        setLeads(JSON.parse(stored));
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      adminEmail,
      whatsappNumber,
      phoneNumber,
      gymAddress,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      twitterUrl,
      emailjsServiceId,
      emailjsTemplateIdAdmin,
      emailjsTemplateIdClient,
      emailjsPublicKey
    };
    onUpdateSettings(updated);
    setSaveMessage("Settings updated successfully! Submissions will target these parameters.");
    setTimeout(() => setSaveMessage(""), 4000);
  };

  const handleDeleteLead = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you wish to delete this lead? This cannot be undone.")) return;
    
    try {
      const stored = localStorage.getItem("apex_forge_leads");
      if (stored) {
        const currentLeads: Lead[] = JSON.parse(stored);
        const filtered = currentLeads.filter((l) => l.id !== id);
        localStorage.setItem("apex_forge_leads", JSON.stringify(filtered));
        setLeads(filtered);
        if (selectedLeadDetails?.id === id) {
          setSelectedLeadDetails(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoLeads = () => {
    if (!window.confirm("This will inject 3 demo leads for administrative demonstration purposes. OK?")) return;
    const demoLeads: Lead[] = [
      {
        id: "demo-1",
        fullName: "Alex Rivera",
        mobileNumber: "+1 (512) 693-0211",
        emailAddress: "alex.rivera@example.com",
        age: 26,
        gender: "Male",
        fitnessGoal: "Build Muscle / Hypertrophy",
        selectedPlan: "N/A",
        preferredTime: "Morning (06:00 AM - 10:00 AM)",
        message: "Looking to scale up compound lifting and recover from a minor rotator cuff restriction.",
        formType: "free_trial",
        submittedAt: new Date(Date.now() - 3600000).toLocaleString()
      },
      {
        id: "demo-2",
        fullName: "Samantha Kincaid",
        mobileNumber: "+1 (312) 555-0144",
        emailAddress: "samantha.k@corp.com",
        age: 33,
        gender: "Female",
        fitnessGoal: "Lose Weight / Fat Loss",
        selectedPlan: "Apex Champion ($149)",
        preferredTime: "Evening (06:00 PM - 10:00 PM)",
        message: "Interested in high-density functional conditioning classes and nutrition plan macros alignment.",
        formType: "membership",
        submittedAt: new Date(Date.now() - 86400000).toLocaleString()
      },
      {
        id: "demo-3",
        fullName: "Commander Shepherd",
        mobileNumber: "+1 (703) 117-2521",
        emailAddress: "n7Shep@alliance.mil",
        age: 29,
        gender: "Non-binary",
        fitnessGoal: "Cardio & Stamina Conditioning",
        selectedPlan: "Hiring: Serena Vance (Elite Trainer)",
        preferredTime: "Mid-day (10:00 AM - 02:00 PM)",
        message: "Tactical performance optimization to boost maximum jump threshold and VO2 levels.",
        formType: "trainer",
        submittedAt: new Date(Date.now() - 172800000).toLocaleString()
      }
    ];

    try {
      localStorage.setItem("apex_forge_leads", JSON.stringify(demoLeads));
      setLeads(demoLeads);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllLeads = () => {
    if (!window.confirm("CRITICAL: This will delete and wipe ALL leads locally stored. Proceed?")) return;
    try {
      localStorage.removeItem("apex_forge_leads");
      setLeads([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("No stored leads available to export! Submit some forms or load demo leads first.");
      return;
    }

    // Define header columns
    const headers = [
      "ID",
      "Full Name",
      "Mobile Number",
      "Email Address",
      "Age",
      "Gender",
      "Fitness Goal",
      "Selected Plan / Specialist",
      "Preferred Time",
      "Message",
      "Inquiry Type",
      "Submission Date"
    ];

    // Map lead entries to row string format, escaping quotes
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.mobileNumber}"`,
      `"${l.emailAddress}"`,
      l.age,
      `"${l.gender}"`,
      `"${l.fitnessGoal}"`,
      `"${l.selectedPlan.replace(/"/g, '""')}"`,
      `"${l.preferredTime}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.formType.toUpperCase(),
      `"${l.submittedAt}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Apex_Forge_Leads_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search/Filter matching rules
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.fitnessGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.selectedPlan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = formTypeFilter === "all" || lead.formType === formTypeFilter;

    return matchesSearch && matchesType;
  });

  // Calculate high-end analytic stats for dashboards
  const totalInquiries = leads.length;
  const trialLeadsCount = leads.filter((l) => l.formType === "free_trial").length;
  const planLeadsCount = leads.filter((l) => l.formType === "membership").length;
  const trainerLeadsCount = leads.filter((l) => l.formType === "trainer").length;
  const contactLeadsCount = leads.filter((l) => l.formType === "general").length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col overflow-y-auto">
      {/* Top Admin Navigation Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg font-black text-xs text-white uppercase tracking-widest shadow-md flex items-center gap-1.5 animate-pulse">
            <ShieldCheck size={16} /> Admin Desk
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Apex Forge Leads Management</h2>
            <p className="text-xs text-neutral-400">Track dynamic client acquisitions, configure integrations, download CSV audits</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-neutral-950 p-1 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab("leads")}
            id="tab-admin-leads-btn"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "leads" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Users size={13} />
            Leads DB ({leads.length})
          </button>
          
          <button
            onClick={() => setActiveTab("insights")}
            id="tab-admin-insights-btn"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "insights" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Award size={13} />
            Lead Insights
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            id="tab-admin-settings-btn"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "settings" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Settings size={13} />
            Portal Settings
          </button>
        </div>

        <button
          onClick={onClose}
          id="admin-exit-btn"
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase px-4 py-2 rounded-lg transition"
        >
          Exit Admin Views
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* LEADS LIST VIEW */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
              
              {/* Search */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
                <input
                  type="text"
                  placeholder="Search by client name, mobile, email, goals..."
                  id="search-leads-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-sm pl-10 pr-4 py-2 rounded-lg outline-none focus:border-red-600 text-white placeholder-neutral-500"
                />
              </div>

              {/* Filter and Actions Pane */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={formTypeFilter}
                  id="filter-type-select"
                  onChange={(e) => setFormTypeFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs px-3 py-2 rounded-lg focus:border-red-600"
                >
                  <option value="all">All Inquiry Types</option>
                  <option value="free_trial">Free VIP Trial Pass</option>
                  <option value="membership">Membership Tariff</option>
                  <option value="trainer">Hire Personal Trainer</option>
                  <option value="general">General Contact Inquiry</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  id="export-csv-btn"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase py-2 px-4 rounded-lg flex items-center gap-1.5 transition ml-auto"
                >
                  <Download size={13} />
                  Export CSV List
                </button>

                <button
                  onClick={loadLeads}
                  id="refresh-leads-btn"
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold p-2 rounded-lg flex items-center justify-center transition"
                  title="Reload Local leads"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Quick Demo loader notice if empty */}
            {leads.length === 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center space-y-4">
                <Users size={48} className="mx-auto text-neutral-700 font-extrabold" />
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">No Leads Captured Yet</h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    The leads database is currently empty. Try filling out forms around the website, or run a quick diagnostic simulation by loading ready-made mock logs below.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleResetDemoLeads}
                    id="load-demo-leads-btn"
                    className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 text-xs font-bold uppercase px-4 py-2 rounded-lg transition"
                  >
                    Load Demo Leads
                  </button>
                </div>
              </div>
            )}

            {/* Leads Table Card */}
            {leads.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-950 text-neutral-400 text-[11px] font-bold uppercase tracking-widest border-b border-neutral-800">
                        <th className="py-3 px-4">Client Name</th>
                        <th className="py-3 px-4">Inquiry Type</th>
                        <th className="py-3 px-4">Mobile & Email</th>
                        <th className="py-3 px-4">Fitness Goal</th>
                        <th className="py-3 px-4">Selected Tariff / Trainer</th>
                        <th className="py-3 px-4">Registered Date</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
                      {filteredLeads.map((item) => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedLeadDetails(item)}
                          className="hover:bg-neutral-800/50 transition cursor-pointer"
                        >
                          {/* Name age gender icon */}
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex flex-col">
                              <span>{item.fullName}</span>
                              <span className="text-[10px] text-neutral-500 font-normal">
                                {item.age}y • {item.gender}
                              </span>
                            </div>
                          </td>

                          {/* Inquiry type tag */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                              item.formType === "free_trial" ? "bg-orange-500/15 text-orange-400 border border-orange-500/25" :
                              item.formType === "membership" ? "bg-red-500/15 text-red-400 border border-red-500/25" :
                              item.formType === "trainer" ? "bg-purple-500/15 text-purple-400 border border-purple-500/25" :
                              "bg-neutral-800 text-neutral-300 border border-neutral-700"
                            }`}>
                              {item.formType === "free_trial" ? "VIP Trial" :
                               item.formType === "membership" ? "Membership" :
                               item.formType === "trainer" ? "Hiring" : "General"}
                            </span>
                          </td>

                          {/* Phone & Email */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="flex flex-col">
                              <span>{item.mobileNumber}</span>
                              <span className="text-neutral-500 select-all">{item.emailAddress}</span>
                            </div>
                          </td>

                          {/* Goal */}
                          <td className="py-3.5 px-4 font-medium max-w-[200px] truncate" title={item.fitnessGoal}>
                            {item.fitnessGoal}
                          </td>

                          {/* Tariff selection / Preferred trainer */}
                          <td className="py-3.5 px-4 text-neutral-400">
                            {item.selectedPlan}
                          </td>

                          {/* Registration Date */}
                          <td className="py-3.5 px-4 font-mono text-neutral-500 text-[10px]">
                            {item.submittedAt}
                          </td>

                          {/* Delete Entry */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedLeadDetails(item)}
                                className="p-1.5 hover:bg-neutral-800 hover:text-white rounded text-neutral-500 transition"
                                title="Inspect Lead details"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteLead(item.id, e)}
                                className="p-1.5 hover:bg-red-500/25 hover:text-red-500 rounded text-neutral-500 transition"
                                title="Delete Lead permanently"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-neutral-500 italic">
                            No stored leads matching search criteria found. Attempt another query or change the form filter category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* DB Summary Bar */}
                <div className="bg-neutral-950 border-t border-neutral-800 px-4 py-3 text-xs text-neutral-500 flex justify-between items-center">
                  <span>Showing {filteredLeads.length} of {leads.length} leads in administrative memory.</span>
                  
                  {leads.length > 0 && (
                    <button
                      onClick={handleClearAllLeads}
                      className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase transition"
                    >
                      Wipe Leads Database
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}


        {/* SYSTEM PORTAL SETTINGS */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Description Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-2">
                  <Settings size={18} className="text-red-600" />
                  Integration Logic
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Modify active emails, social links, phone lines, and physical addresses to real-time update content across headers, contact sliders, and buttons instantly.
                </p>
                <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-[11px] text-neutral-500 space-y-2 leading-relaxed">
                  <div className="font-bold text-white uppercase">How to setup EmailJS:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
                    <li>Create account at <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-red-500 underline">emailjs.com</a></li>
                    <li>Provision a transactional mail service link to acquire your <b>Service ID</b>.</li>
                    <li>Create two email templates:
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10px] text-neutral-500">
                        <li><b>Admin Alert:</b> Pass variables like <code className="text-neutral-300">{"{{lead_name}}"}</code>, <code className="text-neutral-300">{"{{lead_phone}}"}</code>.</li>
                        <li><b>Client Thank You:</b> Pass <code className="text-neutral-300">{"{{client_name}}"}</code>, location strings, etc.</li>
                      </ul>
                    </li>
                    <li>Expose your Account <b>Public Key</b> in settings tab here and execute test inquires!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Gym Contact Settings</h3>
                  <p className="text-xs text-neutral-400">Configure global business contact points across elements</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Admin Register Notification Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">WhatsApp Contact Number</label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Call Hotline Number</label>
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Physical Gym Address</label>
                    <input
                      type="text"
                      required
                      value={gymAddress}
                      onChange={(e) => setGymAddress(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-sm rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-2 border-t border-neutral-800/80">
                  <h4 className="text-sm font-bold text-white mb-3">Custom Social Handles Urls</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Facebook URL</label>
                      <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Instagram URL</label>
                      <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">YouTube URL</label>
                      <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Twitter URL</label>
                      <input type="text" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2 text-white" />
                    </div>
                  </div>
                </div>

                {/* EmailJS credential section */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <h4 className="text-sm font-bold text-white mb-1.5">Configure EmailJS Service Credentials</h4>
                  <p className="text-xs text-neutral-500 mb-3">Map forms to live transactional triggers</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Service ID</label>
                      <input
                        type="text"
                        value={emailjsServiceId}
                        onChange={(e) => setEmailjsServiceId(e.target.value)}
                        placeholder="e.g. service_g6hx7la"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Account Public Key</label>
                      <input
                        type="text"
                        value={emailjsPublicKey}
                        onChange={(e) => setEmailjsPublicKey(e.target.value)}
                        placeholder="e.g. upb4Yor8O3X8W9"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Admin Template ID</label>
                      <input
                        type="text"
                        value={emailjsTemplateIdAdmin}
                        onChange={(e) => setEmailjsTemplateIdAdmin(e.target.value)}
                        placeholder="e.g. template_new_lead"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">Client Auto Thank-You Template ID</label>
                      <input
                        type="text"
                        value={emailjsTemplateIdClient}
                        onChange={(e) => setEmailjsTemplateIdClient(e.target.value)}
                        placeholder="e.g. template_thank_you"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {saveMessage && (
                  <div className="bg-red-500/15 border border-red-500/35 text-red-500 p-3 rounded-lg text-xs font-bold uppercase animate-pulse">
                    {saveMessage}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    id="save-settings-btn"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-6 rounded-lg transition"
                  >
                    Commit Settings Modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* INSIGHTS METRIC PANE */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            
            {/* Grid display stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Total Active Inquiries</span>
                <span className="text-4xl font-extrabold text-white mt-2">{totalInquiries}</span>
                <p className="text-[10px] text-green-500 mt-2">● Real-time updates active</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">VIP Free Trial Passes</span>
                <span className="text-4xl font-extrabold text-white mt-2">{trialLeadsCount}</span>
                <span className="text-[10px] text-neutral-500 mt-2">Conversion: {totalInquiries ? ((trialLeadsCount / totalInquiries) * 100).toFixed(0) : 0}% of bulk</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Tariff Inquiries</span>
                <span className="text-4xl font-extrabold text-white mt-2">{planLeadsCount}</span>
                <span className="text-[10px] text-neutral-500 mt-2">Ready membership contracts queued</span>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Coach Hire Orders</span>
                <span className="text-4xl font-extrabold text-white mt-2">{trainerLeadsCount}</span>
                <span className="text-[10px] text-neutral-500 mt-2">Private macro guidance requests</span>
              </div>
            </div>

            {/* Demographics distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase text-white tracking-widest border-b border-neutral-800 pb-2">Primary Goals Distribution</h4>
                {totalInquiries === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-6 text-center">Save/Simulate some leads to see analysis metrics</p>
                ) : (
                  <div className="space-y-3">
                    {Array.from(new Set(leads.map(l => l.fitnessGoal))).map(goal => {
                      const count = leads.filter(l => l.fitnessGoal === goal).length;
                      const pct = ((count / totalInquiries) * 100).toFixed(0);
                      return (
                        <div key={goal} className="space-y-1">
                          <div className="flex justify-between text-xs text-neutral-300 font-medium">
                            <span>{goal || "Not Specified"}</span>
                            <span>{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase text-white tracking-widest border-b border-neutral-800 pb-2 font-bold select-none">Client Tariff Popularity Status</h4>
                {totalInquiries === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-6 text-center">Save/Simulate some leads to see analysis metrics</p>
                ) : (
                  <div className="space-y-3">
                    {["Forge Standard", "Apex Champion", "Elite Iron", "Ultimate Mastery (PT)", "N/A"].map(planName => {
                      const count = leads.filter(l => l.selectedPlan.includes(planName)).length;
                      const pct = ((count / totalInquiries) * 100).toFixed(0);
                      return (
                        <div key={planName} className="space-y-1">
                          <div className="flex justify-between text-xs text-neutral-300 font-medium">
                            <span>{planName === "N/A" ? "Trial Passes / Direct Inquires" : planName}</span>
                            <span>{count} leads</span>
                          </div>
                          <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* LEAD DETAILS DIALOG POPUP OVERLAY */}
      {selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="bg-neutral-950 p-5 border-b border-neutral-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Lead Biometric Inspection</h3>
              </div>
              <button 
                onClick={() => setSelectedLeadDetails(null)}
                className="text-neutral-400 hover:text-white transition p-1 rounded-full bg-neutral-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedLeadDetails.fullName}</h4>
                  <p className="text-xs text-neutral-400">{selectedLeadDetails.age} years old • {selectedLeadDetails.gender}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-red-600/10 border border-red-600/20 text-red-500 rounded">
                  {selectedLeadDetails.formType.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-850 font-mono text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] block uppercase">Call Hotline</span>
                  <a href={`tel:${selectedLeadDetails.mobileNumber}`} className="text-white hover:underline flex items-center gap-1.5 font-bold">
                    <Phone size={12} /> {selectedLeadDetails.mobileNumber}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] block uppercase">Email Carrier</span>
                  <a href={`mailto:${selectedLeadDetails.emailAddress}`} className="text-white hover:underline flex items-center gap-1.5 truncate">
                    <Mail size={12} /> {selectedLeadDetails.emailAddress}
                  </a>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Coached Directives & Settings</span>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Inquiry Target:</span>
                    <span className="text-white font-semibold">{selectedLeadDetails.selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Goal Category:</span>
                    <span className="text-white font-semibold">{selectedLeadDetails.fitnessGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Preferred Slot:</span>
                    <span className="text-white font-semibold">{selectedLeadDetails.preferredTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-bold">Inquiry Message / Health Notes</span>
                <p className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-xs text-neutral-300 leading-relaxed italic">
                  "{selectedLeadDetails.message}"
                </p>
              </div>

              <div className="text-[10px] text-neutral-500 flex items-center gap-1 bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-850/80">
                <Calendar size={12} /> Logged in local storage: {selectedLeadDetails.submittedAt}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <a
                  href={`https://wa.me/${selectedLeadDetails.mobileNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition"
                >
                  <MessageSquare size={13} />
                  WhatsApp Direct
                </a>
                <button
                  onClick={() => setSelectedLeadDetails(null)}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition"
                >
                  Dismiss Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
