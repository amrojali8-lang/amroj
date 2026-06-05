/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lead {
  id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  age: number | string;
  gender: string;
  fitnessGoal: string;
  selectedPlan: string;
  preferredTime: string;
  message: string;
  formType: "free_trial" | "membership" | "trainer" | "general";
  submittedAt: string;
}

export interface AdminSettings {
  adminEmail: string;
  whatsappNumber: string;
  phoneNumber: string;
  gymAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  // Customizable EmailJS credentials so the owner can plug theirs in!
  emailjsServiceId: string;
  emailjsTemplateIdAdmin: string;
  emailjsTemplateIdClient: string;
  emailjsPublicKey: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  certifications: string[];
  experience: string;
  specialties: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  billing: string;
  popular: boolean;
  features: string[];
  color: string;
}

export interface WorkoutClass {
  id: string;
  title: string;
  desc: string;
  duration: string;
  intensity: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  photoUrl: string;
  time: string;
}

export interface Transformation {
  id: string;
  clientName: string;
  achievement: string;
  beforeImg: string;
  afterImg: string;
  quote: string;
  duration: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  stars: number;
  text: string;
  photoUrl: string;
}
