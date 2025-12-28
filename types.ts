export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Drug {
  id: string;
  name: string;
  class: string;
  mechanism: string;
  indication: string;
  sideEffects: string;
}

export interface PatientState {
  bp: number; // Blood Pressure Systolic
  hr: number; // Heart Rate
  fluidStatus: 'Normal' | 'Edema' | 'Hypovolemia';
  contractility: 'Normal' | 'Low' | 'High';
  symptoms: string[];
  statusMessage: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum GamePhase {
  MENU = 'MENU',
  MAP = 'MAP',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  GLOSSARY = 'GLOSSARY'
}