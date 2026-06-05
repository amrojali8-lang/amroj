/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trainer, Plan, WorkoutClass, Transformation, Testimonial, AdminSettings } from "./types";

export const initialTrainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Marcus 'The Titan' Vance",
    role: "Head Strength Coach & Co-Founder",
    photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=85&w=600",
    certifications: ["CSCS (Certified Strength & Conditioning Specialist)", "NASM-PES", "USA Weightlifting L2"],
    experience: "12+ Years High-Performance Coaching",
    specialties: ["Powerlifting", "Hypertrophy training", "Athletic durability", "Contest Prep"]
  },
  {
    id: "trainer-2",
    name: "Serena Vance",
    role: "Elite Functional & Biomechanics Specialist",
    photoUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=85&w=600",
    certifications: ["FMS Level 2", "NASM-CES", "Precision Nutrition L1"],
    experience: "8+ Years Personal Training",
    specialties: ["Mobility & injury prevention", "High-intensity metabolic conditioning", "Body composition change"]
  },
  {
    id: "trainer-3",
    name: "Darnell Ross",
    role: "Senior Athletic Conditioning Coach",
    photoUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=85&w=600",
    certifications: ["ISSA Master Trainer", "Kettlebell Certified Coach", "EXOS Performance Specialist"],
    experience: "10 Years Tactical & Athlete Coaching",
    specialties: ["Speed and agility development", "Core optimization", "Kettlebell mastery", "Fat loss"]
  }
];

export const initialPlans: Plan[] = [
  {
    id: "plan-monthly",
    name: "Forge Standard",
    price: "$59",
    billing: "Billed Monthly",
    popular: false,
    color: "slate",
    features: [
      "Access to premium gym floor & conditioning area",
      "Full locker room, sauna & premium luxury showers",
      "2 Introductory group training passes per month",
      "Complimentary high-speed Wi-Fi and wellness assessment",
      "No long-term locked contracts - cancel anytime"
    ]
  },
  {
    id: "plan-quarterly",
    name: "Apex Champion",
    price: "$149",
    billing: "Billed Quarterly",
    popular: true,
    color: "red",
    features: [
      "24/7 Priority gym floor & recovery zone access",
      "Unlimited premium group workout sessions",
      "1 Monthly body composition & biometric scan (InBody)",
      "Dedicated virtual fitness advisor & nutrition starter pack",
      "10% savings over standard monthly membership"
    ]
  },
  {
    id: "plan-annual",
    name: "Elite Iron",
    price: "$499",
    billing: "Billed Annually",
    popular: false,
    color: "gold",
    features: [
      "Full premium access across all Apex Forge locations",
      "Unlimited group workouts + 4 Guest passes/month",
      "InBody biometric analysis every single month",
      "Apex Forge Premium Gym Shirt & Welcome Pack",
      "Our best value package – under $42 per month equivalent"
    ]
  },
  {
    id: "plan-pt",
    name: "Ultimate Mastery (PT)",
    price: "$299",
    billing: "Billed Monthly",
    popular: false,
    color: "crimson",
    features: [
      "8 1-on-1 private styling sessions with an Elite Coach",
      "Daily personalized nutrition plan & macro calibration",
      "24/7 direct coaching desk WhatsApp access",
      "Weekly performance tracking & corrective biometrics",
      "Complimentary unlimited gym floor entry included"
    ]
  }
];

export const initialClasses: WorkoutClass[] = [
  {
    id: "class-1",
    title: "Apex Conditioning (HIIT)",
    desc: "A high-octane metabolic workout blending tactical kettlebell complexes, rowing, and cardiovascular threshold drills to shock fat loss and ramp stamina.",
    duration: "45 mins",
    intensity: "Intermediate",
    photoUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
    time: "Mon/Wed/Fri at 07:00 AM & 06:30 PM"
  },
  {
    id: "class-2",
    title: "Forge Barbell Club",
    desc: "Master the classic compound moves. Focus strictly on perfect kinematics for the Squat, Bench Press, Deadlift, and Clean & Jerk. Pure heavy lifting.",
    duration: "60 mins",
    intensity: "Advanced",
    photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    time: "Tue/Thu at 05:00 PM & Sat at 10:00 AM"
  },
  {
    id: "class-3",
    title: "Biomechanical Recovery & Yoga",
    desc: "Relieve muscle stiffness and restore absolute joint flexibility. Gentle athletic-targeted yoga combined with coached deep myofascial release.",
    duration: "50 mins",
    intensity: "Beginner",
    photoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    time: "Wed at 08:00 AM & Sun at 09:00 AM"
  },
  {
    id: "class-4",
    title: "Elite Core & Kettlebells",
    desc: "Build bulletproof structural armor. Target deep abdominal layers, obliques, and posterior chains with scientific trunk stability exercises and heavy swings.",
    duration: "45 mins",
    intensity: "All Levels",
    photoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    time: "Mon/Fri at 12:00 PM"
  }
];

export const initialTransformations: Transformation[] = [
  {
    id: "trans-1",
    clientName: "David Chen",
    achievement: "Lost 42 lbs & Forged Complete Abdominal Definition",
    beforeImg: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
    quote: "The personalized coaching at Apex Forge gave me more than a new body; I reclaimed my vitality, focus, and drive as a healthy, muscular bodybuilder. Simply outstanding.",
    duration: "16 Weeks"
  },
  {
    id: "trans-2",
    clientName: "James Thorne",
    achievement: "Added 15 lbs of Pure Muscular Density & Squat Power",
    beforeImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600",
    quote: "I was extremely lean and struggled with posture fatigue. Under my coach's macro guidance, I packed on massive compound power and built a strong, healthy physique!",
    duration: "12 Weeks"
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Bradley Cooper",
    role: "CEO, Nexo Ventures",
    stars: 5,
    text: "Apex Forge has been a absolute game changer for me. The trainers are incredibly knowledgable, the equipment is standard premium and the atmosphere pushing you to be better is unmatched. High level professional execution.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-2",
    name: "Jessica Albright",
    role: "Marathon Runner & Athlete",
    stars: 5,
    text: "I was struggling with knee pain during my fast pacing. Coach Serena rebuilt my structural foundation from the glutes up. Not only is my pain gone, but my 10k pace is 35 seconds faster. This place is gold.",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "test-3",
    name: "Marcus Aurelius",
    role: "Fitness Enthusiast",
    stars: 5,
    text: "The annual membership is an absolute steal given the hyper-luxurious locker rooms, modern equipment, and excellent coaching standard. Cleanliness is flawless.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
];

export const defaultSettings: AdminSettings = {
  adminEmail: "amrojali8@gmail.com",
  whatsappNumber: "+1234567890",
  phoneNumber: "+1234567890",
  gymAddress: "404 Apex Olympic Blvd, Arena District, Austin, TX",
  facebookUrl: "https://facebook.com/apexforge",
  instagramUrl: "https://instagram.com/apexforge",
  youtubeUrl: "https://youtube.com/apexforge",
  twitterUrl: "https://twitter.com/apexforge",
  // Standard EmailJS placeholders to prompt real input
  emailjsServiceId: "service_apex_forge",
  emailjsTemplateIdAdmin: "template_lead_admin",
  emailjsTemplateIdClient: "template_thank_you_client",
  emailjsPublicKey: "user_apex_public_key"
};
