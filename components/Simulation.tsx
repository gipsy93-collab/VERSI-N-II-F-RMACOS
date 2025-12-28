import React, { useState, useEffect } from 'react';
import { Drug } from '../types';

// --- Tipos Locales para la Simulación ---
interface SimState {
  bp: number;       // Presión Arterial Sistólica
  hr: number;       // Frecuencia Cardiaca
  volume: number;   // 0 a 100 (50 es euvolemia, >80 edema, <20 hipovolemia)
  contractility: number; // 0 a 100
  symptoms: string[];
  isStable: boolean;
}

interface CaseScenario {
  id: number;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Experto';
  initialState: SimState;
  target: {
    bpMin: number;
    bpMax: number;
    hrMin: number;
    hrMax: number;
    volMax: number; // El volumen debe ser menor a esto
  };
}

// --- Datos de los Casos (Ampliado a 8 Niveles) ---
const SCENARIOS: CaseScenario[] = [
  // Nivel 1: Sobrecarga de Volumen Clásica
  {
    id: 1,
    title: "Nivel 1: El Corazón Encharcado",
    description: "Paciente con insuficiencia cardiaca crónica descompensada. Presenta edemas maleolares marcados y disnea. Sobrecarga hídrica evidente.",
    difficulty: 'Fácil',
    initialState: {
      bp: 135,
      hr: 88,
      volume: 95, // Muy alto
      contractility: 40,
      symptoms: ['Edemas ++', 'Disnea'],
      isStable: false
    },
    target: { bpMin: 100, bpMax: 140, hrMin: 60, hrMax: 100, volMax: 60 }
  },
  // Nivel 2: Crisis Hipertensiva
  {
    id: 2,
    title: "Nivel 2: Tensión por las Nubes",
    description: "Paciente acude por cefalea intensa. Se detecta PA muy elevada. Riesgo inminente de daño orgánico. El corazón bombea contra un muro.",
    difficulty: 'Fácil',
    initialState: {
      bp: 210, // Crisis
      hr: 80,
      volume: 50,
      contractility: 60,
      symptoms: ['Cefalea', 'Visión borrosa'],
      isStable: false
    },
    target: { bpMin: 110, bpMax: 150, hrMin: 60, hrMax: 90, volMax: 60 }
  },
  // Nivel 3: Arritmia Rápida (FA)
  {
    id: 3,
    title: "Nivel 3: Corazón Desbocado",
    description: "Paciente con palpitaciones. ECG muestra Fibrilación Auricular con respuesta ventricular rápida. El corazón va tan rápido que no se llena bien.",
    difficulty: 'Medio',
    initialState: {
      bp: 115,
      hr: 160, // Taquicardia severa
      volume: 50,
      contractility: 45,
      symptoms: ['Palpitaciones', 'Mareo'],
      isStable: false
    },
    target: { bpMin: 90, bpMax: 130, hrMin: 60, hrMax: 100, volMax: 60 }
  },
  // Nivel 4: Angina de Pecho
  {
    id: 4,
    title: "Nivel 4: Dolor de Pecho",
    description: "Paciente con dolor opresivo al esfuerzo. Tiene la tensión y la frecuencia altas, lo que dispara el consumo de oxígeno miocárdico.",
    difficulty: 'Medio',
    initialState: {
      bp: 165,
      hr: 110,
      volume: 50,
      contractility: 70,
      symptoms: ['Angina', 'Sudoración'],
      isStable: false
    },
    target: { bpMin: 100, bpMax: 135, hrMin: 55, hrMax: 75, volMax: 60 }
  },
  // Nivel 5: Shock Cardiogénico
  {
    id: 5,
    title: "Nivel 5: Fallo de Bomba",
    description: "¡Emergencia! Paciente hipotenso, frío y oligúrico. El corazón apenas tiene fuerza para contraerse. Necesitamos soporte vital inmediato.",
    difficulty: 'Difícil',
    initialState: {
      bp: 65, // Shock
      hr: 125, // Taquicardia refleja ineficiente
      volume: 60,
      contractility: 15, // Muy baja
      symptoms: ['Piel fría', 'Oliguria', 'Confusión'],
      isStable: false
    },
    target: { bpMin: 90, bpMax: 130, hrMin: 70, hrMax: 110, volMax: 70 }
  },
  // Nivel 6: Edema Agudo de Pulmón Flash
  {
    id: 6,
    title: "Nivel 6: Edema Agudo Hipertensivo",
    description: "Paciente se ahoga súbitamente (EAP Flash). Hipertensión severa + Pulmones encharcados. Requiere manejo experto y rápido.",
    difficulty: 'Experto',
    initialState: {
      bp: 220,
      hr: 115,
      volume: 98, // Crítico
      contractility: 45,
      symptoms: ['Ortopnea severa', 'Crepitantes hasta vértices'],
      isStable: false
    },
    target: { bpMin: 100, bpMax: 150, hrMin: 60, hrMax: 100, volMax: 55 }
  },
  // Nivel 7: FA con IC
  {
    id: 7,
    title: "Nivel 7: El Baile Arrítmico",
    description: "Fibrilación Auricular Rápida en paciente con disfunción sistólica previa. La pérdida de 'patada auricular' y la taquicardia comprometen el gasto.",
    difficulty: 'Difícil',
    initialState: {
      bp: 95, // Justo
      hr: 170, // Muy alta
      volume: 85, // Congestión
      contractility: 35, // Baja
      symptoms: ['Palpitaciones', 'Disnea de reposo'],
      isStable: false
    },
    target: { bpMin: 90, bpMax: 130, hrMin: 60, hrMax: 100, volMax: 65 }
  },
  // Nivel 8: HTA Resistente
  {
    id: 8,
    title: "Nivel 8: La Presión que no Cede",
    description: "Crisis hipertensiva simpática severa. Requiere terapia combinada agresiva para reducir el riesgo de ACV.",
    difficulty: 'Experto',
    initialState: {
      bp: 240,
      hr: 92,
      volume: 55,
      contractility: 75,
      symptoms: ['Cefalea estallante', 'Visión de luces'],
      isStable: false
    },
    target: { bpMin: 120, bpMax: 160, hrMin: 60, hrMax: 100, volMax: 60 }
  }
];

const DRUGS: Drug[] = [
  { 
    id: 'furosemide', 
    name: 'Furosemida', 
    class: 'Diurético Asa', 
    mechanism: 'Elimina Na+/H2O',
    indication: 'Edemas / EAP',
    sideEffects: '' 
  },
  { 
    id: 'enalapril', 
    name: 'Enalapril', 
    class: 'IECA', 
    mechanism: 'Vasodilatador',
    indication: 'HTA / IC',
    sideEffects: '' 
  },
  { 
    id: 'digoxin', 
    name: 'Digoxina', 
    class: 'Inotrópico+', 
    mechanism: 'Bomba Na/K',
    indication: 'Control FC en FA',
    sideEffects: '' 
  },
  { 
    id: 'bisoprolol', 
    name: 'Bisoprolol', 
    class: 'Beta-bloqueante', 
    mechanism: 'Antagonista B1',
    indication: 'Angina / Bajar FC',
    sideEffects: '' 
  },
  { 
    id: 'nitroglycerin', 
    name: 'Nitroglicerina', 
    class: 'Nitrato', 
    mechanism: 'Venodilatador',
    indication: 'Angina / EAP',
    sideEffects: '' 
  },
  { 
    id: 'dobutamine', 
    name: 'Dobutamina', 
    class: 'Agonista B1', 
    mechanism: 'Inotrópico IV',
    indication: 'Shock Cardio',
    sideEffects: '' 
  }
];

// --- Componente Corazón Animado ---
const HeartMonitor: React.FC<{ hr: number; contractility: number }> = ({ hr, contractility }) => {
  const animationDuration = 60 / Math.max(30, hr);
  const scale = 1 + (contractility / 200); 

  return (
    <div className="relative flex items-center justify-center h-48 w-48 mx-auto my-4">
      <svg
        viewBox="0 0 32 29.6"
        className="w-full h-full drop-shadow-2xl text-red-600 transition-all duration-500 ease-in-out"
        style={{
          animation: `beat ${animationDuration}s infinite`,
          transformOrigin: 'center',
          filter: `drop-shadow(0 0 ${contractility/5}px rgba(220, 38, 38, 0.8))`
        }}
      >
        <path
          d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
          c6.1-9.3,16-11.3,16-21.2C32,3.8,28.2,0,23.6,0z"
          fill="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-white drop-shadow-md font-mono">{Math.round(hr)}</span>
      </div>
      <style>{`
        @keyframes beat {
          0% { transform: scale(1); }
          15% { transform: scale(${scale}); }
          30% { transform: scale(1); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// --- Componente de Barra de Progreso Avanzada ---
interface ProgressBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  scaleMax: number;
  unit: string;
  colorFn: (val: number, min: number, max: number) => string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, min, max, scaleMax, unit, colorFn }) => {
  const percentage = Math.min(100, Math.max(0, (value / scaleMax) * 100));
  const targetLeft = (min / scaleMax) * 100;
  const targetWidth = ((max - min) / scaleMax) * 100;
  const safeColor = colorFn(value, min, max);

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm font-mono text-gray-400 mb-2">
        <span className="font-bold tracking-wider">{label}</span>
        <span className={`${safeColor.replace('bg-', 'text-')} font-bold text-lg`}>
          {Math.round(value)} <span className="text-xs text-gray-500">{unit}</span>
        </span>
      </div>
      
      {/* Container Barra */}
      <div className="h-10 w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 relative shadow-inner">
         
         {/* Grid lines */}
         <div className="absolute inset-0 grid grid-cols-4 gap-0 opacity-20 pointer-events-none">
             <div className="border-r border-gray-500"></div>
             <div className="border-r border-gray-500"></div>
             <div className="border-r border-gray-500"></div>
         </div>

         {/* Target Zone - Highlighted */}
         <div
             className="absolute top-0 bottom-0 bg-green-500/10 border-x-2 border-green-500/40 flex flex-col justify-center items-center z-0"
             style={{
               left: `${targetLeft}%`,
               width: `${targetWidth}%`
             }}
         >
            <span className="text-[9px] font-black text-green-400/60 uppercase tracking-widest hidden sm:block bg-black/30 px-1 rounded backdrop-blur-sm">Meta</span>
         </div>

         {/* Current Value Bar */}
         <div
             className={`h-full transition-all duration-700 ease-out relative shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 opacity-90 ${safeColor}`}
             style={{ width: `${percentage}%` }}
         >
            {/* Gloss effect */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/20"></div>
            {/* Stripe pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.1)_50%,rgba(255,255,255,.1)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
         </div>
         
         {/* Tip Marker */}
         <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-700 ease-out z-20"
            style={{ left: `${percentage}%` }}
         ></div>
      </div>
      
      {/* Scale Labels */}
      <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-1 px-1">
         <span>0</span>
         <span>{scaleMax / 2}</span>
         <span>{scaleMax}+</span>
      </div>
    </div>
  );
};


// Helper: Calcular desviación de los objetivos
const calculateDeviations = (state: SimState, target: CaseScenario['target']) => {
  const bpDev = (state.bp < target.bpMin) ? (target.bpMin - state.bp) : (state.bp > target.bpMax) ? (state.bp - target.bpMax) : 0;
  const hrDev = (state.hr < target.hrMin) ? (target.hrMin - state.hr) : (state.hr > target.hrMax) ? (state.hr - target.hrMax) : 0;
  const volDev = (state.volume > target.volMax) ? (state.volume - target.volMax) : 0;
  
  return bpDev + hrDev + volDev;
};

const Simulation: React.FC = () => {
  const [caseIndex, setCaseIndex] = useState(0);
  const [simState, setSimState] = useState<SimState>(SCENARIOS[0].initialState);
  
  // Feedback System
  const [feedback, setFeedback] = useState<string>("¡Paciente ingresado! Revisa sus constantes.");
  const [feedbackType, setFeedbackType] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  
  const [history, setHistory] = useState<string[]>([]);
  const [levelComplete, setLevelComplete] = useState(false);

  const currentCase = SCENARIOS[caseIndex];

  // Reset cuando cambia el caso
  useEffect(() => {
    setSimState(SCENARIOS[caseIndex].initialState);
    setFeedback(SCENARIOS[caseIndex].description);
    setFeedbackType('neutral');
    setHistory([]);
    setLevelComplete(false);
  }, [caseIndex]);

  // Chequear condiciones de victoria
  useEffect(() => {
    const { bp, hr, volume } = simState;
    const { target } = currentCase;
    
    if (
      bp >= target.bpMin && bp <= target.bpMax &&
      hr >= target.hrMin && hr <= target.hrMax &&
      volume <= target.volMax
    ) {
      if (!levelComplete) {
        setLevelComplete(true);
        setFeedback("✅ ¡EXCELENTE! Signos vitales normalizados. Paciente estable.");
        setFeedbackType('positive');
      }
    }
  }, [simState, currentCase, levelComplete]);

  const applyDrug = (drug: Drug) => {
    if (levelComplete) return;

    setSimState(prev => {
      let newState = { ...prev };
      let msg = "";
      
      const prevScore = calculateDeviations(prev, currentCase.target);

      switch (drug.id) {
        case 'digoxin':
          newState.contractility = Math.min(100, prev.contractility + 10);
          newState.hr = Math.max(30, prev.hr - 20); 
          newState.bp = prev.bp + 2; 
          msg = "Digoxina: Inótropo positivo y cronótropo negativo.";
          break;
        case 'furosemide':
          newState.volume = Math.max(0, prev.volume - 30);
          newState.bp = Math.max(40, prev.bp - 10);
          msg = "Furosemida: Diurético potente. Reduce precarga.";
          break;
        case 'enalapril':
          newState.bp = Math.max(40, prev.bp - 25);
          msg = "Enalapril: Vasodilatación arterial sistémica.";
          break;
        case 'nitroglycerin':
          newState.bp = Math.max(40, prev.bp - 20);
          newState.volume = Math.max(0, prev.volume - 5);
          msg = "Nitroglicerina: Venodilatación y redistribución de flujo.";
          break;
        case 'bisoprolol':
          newState.hr = Math.max(30, prev.hr - 25);
          newState.contractility = Math.max(10, prev.contractility - 10);
          newState.bp = Math.max(40, prev.bp - 15);
          msg = "Bisoprolol: Beta-bloqueante. Reduce trabajo cardiaco.";
          break;
        case 'dobutamine':
          newState.contractility = Math.min(100, prev.contractility + 45);
          newState.hr = prev.hr + 10;
          newState.bp = prev.bp + 25;
          msg = "Dobutamina: Estimulante Beta-1 potente.";
          break;
      }

      const newScore = calculateDeviations(newState, currentCase.target);
      
      let type: 'neutral' | 'positive' | 'negative' = 'neutral';
      let outcomeText = "";

      if (newState.bp < 80 && currentCase.target.bpMin > 85) {
        type = 'negative';
        outcomeText = "⚠️ ¡Cuidado! Hipotensión severa.";
      } else if (newState.hr < 45 && currentCase.target.hrMin > 50) {
         type = 'negative';
         outcomeText = "⚠️ ¡Peligro! Bradicardia extrema.";
      } else if (newScore < prevScore) {
        type = 'positive';
        outcomeText = "👍 El paciente mejora.";
      } else if (newScore > prevScore) {
        type = 'negative';
        outcomeText = "❌ La condición ha empeorado.";
      } else {
        type = 'neutral';
        outcomeText = "ℹ️ Efecto neutro en este escenario.";
      }

      const fullMsg = `${outcomeText} ${msg}`;

      setHistory(prevHist => [fullMsg, ...prevHist]);
      setFeedback(fullMsg);
      setFeedbackType(type);
      return newState;
    });
  };

  const nextLevel = () => {
    if (caseIndex < SCENARIOS.length - 1) {
      setCaseIndex(prev => prev + 1);
    } else {
      setFeedback("¡Has completado el Máster en Hemodinámica! 🎓");
      setFeedbackType('positive');
    }
  };

  const getBarColor = (val: number, min: number, max: number) => {
    if (val < min) return 'bg-blue-600'; 
    if (val > max) return 'bg-red-600'; 
    return 'bg-green-500'; 
  };

  const feedbackStyles = {
    neutral: 'bg-slate-800 border-slate-600 text-gray-300',
    positive: 'bg-green-900/80 border-green-500 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    negative: 'bg-red-900/80 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden">
      {/* Header del Caso */}
      <div className="bg-purple-800 p-4 shadow-lg z-10 flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
             <span className="text-yellow-400">Nivel {caseIndex + 1}:</span> {currentCase.title}
           </h2>
           <p className="text-purple-200 text-sm hidden md:block">{currentCase.description}</p>
        </div>
        <div className="text-right">
           <div className="text-xs font-bold text-gray-300 uppercase mb-1">Dificultad</div>
           <div className={`badge font-bold px-3 py-1 rounded-full text-sm inline-block shadow-md
             ${currentCase.difficulty === 'Experto' ? 'bg-black text-red-500 border border-red-500' : 
               currentCase.difficulty === 'Difícil' ? 'bg-red-600 text-white' : 
               currentCase.difficulty === 'Medio' ? 'bg-yellow-600 text-white' : 
               'bg-green-600 text-white'}`}>
             {currentCase.difficulty}
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA IZQUIERDA: Monitor Visual (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* El Monitor Cardiaco */}
          <div className="bg-black rounded-3xl p-6 border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-around flex-1">
               {/* Corazón Animado */}
               <div className="flex flex-col items-center mb-6 md:mb-0 w-1/3">
                  <span className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Monitor EKG</span>
                  <HeartMonitor hr={simState.hr} contractility={simState.contractility} />
                  <div className={`text-xs md:text-sm font-bold font-mono px-3 py-1 rounded bg-gray-800 border mt-2 text-center ${simState.hr > currentCase.target.hrMax ? 'text-red-500 border-red-900 animate-pulse' : simState.hr < currentCase.target.hrMin ? 'text-blue-500 border-blue-900' : 'text-green-500 border-green-900'}`}>
                    Objetivo FC: {currentCase.target.hrMin}-{currentCase.target.hrMax}
                  </div>
               </div>

               {/* Gráficas de Barras Mejoradas */}
               <div className="w-full md:w-2/3 px-4 flex flex-col justify-center">
                  <ProgressBar 
                     label="PRESIÓN ARTERIAL (mmHg)" 
                     value={simState.bp} 
                     min={currentCase.target.bpMin} 
                     max={currentCase.target.bpMax} 
                     scaleMax={250}
                     unit="mmHg"
                     colorFn={getBarColor}
                  />

                  <ProgressBar 
                     label="FRECUENCIA CARDIACA (lpm)" 
                     value={simState.hr} 
                     min={currentCase.target.hrMin} 
                     max={currentCase.target.hrMax} 
                     scaleMax={200}
                     unit="bpm"
                     colorFn={getBarColor}
                  />

                  <ProgressBar 
                     label="SOBRECARGA / FLUIDOS" 
                     value={simState.volume} 
                     min={0} 
                     max={currentCase.target.volMax} 
                     scaleMax={100}
                     unit="%"
                     colorFn={(v, min, max) => v > max ? 'bg-blue-500' : 'bg-green-500'}
                  />
               </div>
            </div>
            
            {/* INTERACTIVE FEEDBACK BOX */}
            <div className={`mt-6 p-4 rounded-xl border-l-4 font-mono text-sm min-h-[5rem] flex items-center transition-all duration-300 ${feedbackStyles[feedbackType]}`}>
               <div className="mr-3 text-3xl shrink-0 animate-bounce">
                  {feedbackType === 'positive' && '✅'}
                  {feedbackType === 'negative' && '❌'}
                  {feedbackType === 'neutral' && '💡'}
               </div>
               <div className="flex-1">
                 <div className="opacity-70 text-[10px] uppercase mb-1 tracking-widest">System Feedback</div>
                 <span className="font-bold text-lg leading-tight">{feedback}</span>
               </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Controles (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
           {/* Farmacia */}
           <div className="bg-white rounded-3xl p-6 shadow-xl flex-1 flex flex-col">
              <h3 className="text-purple-900 font-black text-xl mb-4 flex items-center gap-2">
                <span>💊</span> Farmacia Cardíaca
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {DRUGS.map(drug => (
                  <button
                    key={drug.id}
                    onClick={() => applyDrug(drug)}
                    disabled={levelComplete}
                    className={`p-3 rounded-xl border-2 text-left transition-all transform active:scale-95 hover:shadow-lg relative overflow-hidden group
                      ${levelComplete 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' 
                        : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400'
                      }`}
                  >
                    <div className="font-bold text-indigo-900 text-sm z-10 relative">{drug.name}</div>
                    <div className="text-[10px] text-indigo-600 font-bold uppercase mb-1 z-10 relative">{drug.class}</div>
                    <div className="text-[10px] text-gray-500 leading-tight z-10 relative">{drug.indication}</div>
                  </button>
                ))}
              </div>

              {levelComplete ? (
                 <div className="mt-auto animate-bounce">
                    <button 
                      onClick={nextLevel}
                      className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg text-lg transition-colors"
                    >
                      {caseIndex < SCENARIOS.length - 1 ? 'SIGUIENTE CASO ➡️' : '¡COMPLETASTE EL CURSO! 🎓'}
                    </button>
                 </div>
              ) : (
                 <div className="mt-auto bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-inner">
                    <h4 className="font-bold text-yellow-800 text-sm mb-2">📋 Historial Clínico:</h4>
                    <div className="text-xs text-yellow-700 space-y-2 h-24 overflow-y-auto">
                       {history.map((h, i) => (
                         <div key={i} className="border-b border-yellow-100 pb-1">👉 {h}</div>
                       ))}
                       {history.length === 0 && <span className="opacity-50 italic">Esperando intervención...</span>}
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Simulation;