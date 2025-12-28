import React, { useState } from 'react';
import { Question } from '../types';

const QUESTIONS: Question[] = [
  // --- Insuficiencia Cardiaca y Digitálicos ---
  {
    id: 1,
    text: "¿Qué es la insuficiencia cardiaca y qué ocurre en el ventrículo izquierdo en la mayoría de los casos?",
    options: [
      "Síndrome en el que el VI no mantiene un volumen sistólico adecuado por disfunción sistólica.",
      "Aumento descontrolado del gasto cardiaco por hipertrofia.",
      "Infección viral del miocardio que causa bloqueo AV.",
      "Acumulación de líquido pericárdico que impide la diástole."
    ],
    correctAnswer: 0,
    explanation: "Es un síndrome clínico caracterizado por la incapacidad del corazón para bombear sangre suficiente (disfunción sistólica)."
  },
  {
    id: 2,
    text: "¿Qué es un inótropo positivo y en qué situación clínica se indica su uso?",
    options: [
      "Fármaco que relaja los vasos sanguíneos para hipertensión.",
      "Fármaco que aumenta la diuresis en fallo renal.",
      "Fármaco que aumenta la fuerza de contracción cardiaca, usado en IC.",
      "Fármaco que reduce la frecuencia cardiaca en taquicardias."
    ],
    correctAnswer: 2,
    explanation: "Inótropo positivo = Mayor fuerza de contracción. Se usa cuando el bombeo es insuficiente."
  },
  {
    id: 3,
    text: "¿Cómo actúan los glucósidos digitálicos sobre la célula cardiaca?",
    options: [
      "Estimulan los receptores Beta-1 adrenérgicos.",
      "Inhiben la bomba Na+/K+ ATPasa, aumentando calcio intracelular.",
      "Bloquean los canales de calcio voltaje-dependientes.",
      "Inhiben la enzima convertidora de angiotensina."
    ],
    correctAnswer: 1,
    explanation: "Al inhibir la bomba Na+/K+, se acumula Na+ que luego se intercambia por Ca++, aumentando la contractilidad."
  },
  {
    id: 4,
    text: "¿Qué efecto tienen los digitálicos sobre la contractilidad, frecuencia y conducción?",
    options: [
      "Aumentan todo: contractilidad, frecuencia y conducción.",
      "Aumentan contractilidad (inótropo +) y reducen frecuencia (cronotropo -).",
      "Disminuyen contractilidad pero aumentan frecuencia.",
      "No afectan la frecuencia, solo la contractilidad."
    ],
    correctAnswer: 1,
    explanation: "Son inotrópicos positivos pero cronotrópicos y dromotrópicos negativos (frenan el corazón)."
  },
  {
    id: 5,
    text: "¿Por qué los glucósidos digitálicos tienen 'margen terapéutico estrecho'?",
    options: [
      "Porque solo funcionan en pacientes delgados.",
      "Porque la diferencia entre dosis eficaz y tóxica es muy pequeña.",
      "Porque se eliminan muy rápido del cuerpo.",
      "Porque son muy costosos de fabricar."
    ],
    correctAnswer: 1,
    explanation: "Pequeños aumentos en la concentración pueden pasar de efecto terapéutico a toxicidad grave."
  },
  {
    id: 6,
    text: "¿Qué factor aumenta el riesgo de intoxicación digitálica?",
    options: [
      "Hipopotasemia (Bajo potasio)",
      "Hipernatremia (Alto sodio)",
      "Hipercalcemia (Alto calcio)",
      "Hipoglucemia (Baja glucosa)"
    ],
    correctAnswer: 0,
    explanation: "El K+ compite con la digoxina en la bomba Na+/K+. Si hay poco K+, la digoxina se une más y es más tóxica."
  },
  {
    id: 7,
    text: "En caso de intoxicación digitálica grave, ¿cuál es el tratamiento específico?",
    options: [
      "Diálisis urgente.",
      "Administración de adrenalina.",
      "Anticuerpos específicos antidigoxina (Fab).",
      "Aumento de la dosis de diuréticos."
    ],
    correctAnswer: 2,
    explanation: "Los fragmentos Fab antidigoxina neutralizan el fármaco circulante."
  },

  // --- Otros Inotrópicos ---
  {
    id: 8,
    text: "¿Diferencia principal entre digitálicos y agonistas beta-adrenérgicos (dobutamina)?",
    options: [
      "Digitálicos son orales/crónicos; Dobutamina es IV/aguda.",
      "Digitálicos son para agudos; Dobutamina para crónicos.",
      "Digitálicos bajan la presión; Dobutamina la baja más.",
      "No hay diferencia, son lo mismo."
    ],
    correctAnswer: 0,
    explanation: "La dobutamina se usa en perfusión continua en hospitales (shock), la digoxina es para mantenimiento oral."
  },
  {
    id: 9,
    text: "¿En qué situación clínica aguda se utiliza la dobutamina?",
    options: [
      "Hipertensión arterial leve.",
      "Insuficiencia cardiaca aguda y shock cardiogénico.",
      "Taquicardia supraventricular.",
      "Crisis de ansiedad."
    ],
    correctAnswer: 1,
    explanation: "Es el inotrópico de elección para 'despertar' un corazón en shock cardiogénico."
  },
  {
    id: 10,
    text: "¿Cómo actúan los inhibidores de la fosfodiesterasa (milrinona)?",
    options: [
      "Aumentan AMP cíclico y calcio intracelular.",
      "Bloquean receptores alfa.",
      "Estimulan la recaptación de serotonina.",
      "Eliminan sodio por el riñón."
    ],
    correctAnswer: 0,
    explanation: "Al inhibir la degradación del AMPc, aumenta el Ca++ disponible para la contracción."
  },

  // --- Vasodilatadores, IECA y ARA II ---
  {
    id: 11,
    text: "¿Ejemplo de vasodilatador venoso?",
    options: [
      "Hidralazina",
      "Nitratos (Nitroglicerina)",
      "Minoxidilo",
      "Enalapril"
    ],
    correctAnswer: 1,
    explanation: "Los nitratos dilatan predominantemente las venas, reduciendo la precarga."
  },
  {
    id: 12,
    text: "¿Qué papel tiene el óxido nítrico (NO) en los nitratos?",
    options: [
      "Causa vasoconstricción.",
      "Activa guanilato ciclasa y causa vasodilatación.",
      "Bloquea la entrada de calcio.",
      "Aumenta la frecuencia cardiaca directamente."
    ],
    correctAnswer: 1,
    explanation: "Los nitratos donan NO, que relaja la musculatura lisa vascular."
  },
  {
    id: 13,
    text: "¿Qué efecto hemodinámico producen los nitratos?",
    options: [
      "Aumentan precarga y poscarga.",
      "Disminuyen sobre todo la precarga (retorno venoso).",
      "Aumentan el volumen sistólico.",
      "No tienen efecto hemodinámico."
    ],
    correctAnswer: 1,
    explanation: "Al dilatar las venas, llega menos sangre al corazón (menor precarga), aliviando el trabajo cardiaco."
  },
  {
    id: 14,
    text: "¿Cuál es una complicación tóxica de nitratos y nitritos?",
    options: [
      "Metahemoglobinemia.",
      "Hiperpotasemia.",
      "Tos seca.",
      "Insuficiencia hepática."
    ],
    correctAnswer: 0,
    explanation: "Pueden oxidar la hemoglobina impidiendo el transporte de oxígeno."
  },
  {
    id: 15,
    text: "¿Qué hacen los IECA sobre el sistema renina-angiotensina?",
    options: [
      "Bloquean los receptores de Angiotensina II.",
      "Inhiben la conversión de Angiotensina I a II.",
      "Inhiben la liberación de Renina.",
      "Destruyen la Aldosterona."
    ],
    correctAnswer: 1,
    explanation: "IECA = Inhibidor de la Enzima Convertidora de Angiotensina."
  },
  {
    id: 16,
    text: "¿Qué ocurre con la Bradicinina al usar un IECA?",
    options: [
      "Disminuye, causando hipertensión.",
      "No cambia.",
      "Aumenta (se acumula), pudiendo causar tos seca.",
      "Se convierte en Angiotensina."
    ],
    correctAnswer: 2,
    explanation: "La ECA degrada bradicinina. Al inhibir la ECA, la bradicinina sube y causa tos."
  },
  {
    id: 17,
    text: "¿Cuál es el mecanismo de los ARA II (sartanes)?",
    options: [
      "Inhiben la enzima ECA.",
      "Bloquean canales de calcio.",
      "Bloquean receptores AT1 de Angiotensina II.",
      "Son diuréticos de asa."
    ],
    correctAnswer: 2,
    explanation: "Bloquean directamente el receptor donde actúa la angiotensina II."
  },
  {
    id: 18,
    text: "¿Cuándo se prefieren los ARA II frente a los IECA?",
    options: [
      "En pacientes con tos seca por IECA.",
      "En pacientes hipotensos.",
      "Siempre son primera elección.",
      "Nunca, los IECA son superiores."
    ],
    correctAnswer: 0,
    explanation: "Al no inhibir la degradación de bradicinina, no producen tos."
  },

  // --- Antiarrítmicos ---
  {
    id: 19,
    text: "¿Qué es una arritmia cardiaca?",
    options: [
      "Dolor en el pecho al esfuerzo.",
      "Alteración del ritmo por cambios en automatismo o conducción.",
      "Aumento de la presión arterial.",
      "Inflamación del pericardio."
    ],
    correctAnswer: 1,
    explanation: "Cualquier ritmo que no sea el sinusal normal."
  },
  {
    id: 20,
    text: "¿En qué se basa la clasificación de Vaughan Williams?",
    options: [
      "En el precio del fármaco.",
      "En la vía de administración.",
      "En el canal iónico bloqueado y efecto en potencial de acción.",
      "En la edad del paciente."
    ],
    correctAnswer: 2,
    explanation: "Clase I (Na+), Clase II (Beta), Clase III (K+), Clase IV (Ca++)."
  },
  {
    id: 21,
    text: "¿Qué canal bloquean los antiarrítmicos Grupo I?",
    options: [
      "Canales de Calcio.",
      "Canales de Potasio.",
      "Canales de Sodio.",
      "Receptores Beta."
    ],
    correctAnswer: 2,
    explanation: "Son bloqueantes de los canales de Sodio (Na+)."
  },
  {
    id: 22,
    text: "¿Qué cuadro clínico se llama 'cinconismo'?",
    options: [
      "Intoxicación por Quinidina (tinnitus, cefalea).",
      "Intoxicación por Lidocaína (convulsiones).",
      "Efecto de los Beta-bloqueantes.",
      "Alergia a la Amiodarona."
    ],
    correctAnswer: 0,
    explanation: "Relacionado con la Quinina/Quinidina: zumbido de oídos, mareo, visión borrosa."
  },
  {
    id: 23,
    text: "¿Para qué se usa la Lidocaína en cardio?",
    options: [
      "Hipertensión crónica.",
      "Arritmias ventriculares en fase aguda de infarto.",
      "Fibrilación auricular crónica.",
      "Bloqueo AV."
    ],
    correctAnswer: 1,
    explanation: "Es un antiarrítmico Ib, específico para tejido ventricular isquémico."
  },
  {
    id: 24,
    text: "¿Qué toxicidad es característica de la Amiodarona?",
    options: [
      "Toxicidad tiroidea, pulmonar y hepática.",
      "Insuficiencia renal aguda.",
      "Caída del cabello.",
      "Gastritis erosiva."
    ],
    correctAnswer: 0,
    explanation: "Tiene mucho Yodo en su molécula y se acumula en tejidos."
  },
  {
    id: 25,
    text: "¿Para qué sirve la Adenosina?",
    options: [
      "Tratamiento crónico de la IC.",
      "Cortar taquicardias supraventriculares paroxísticas.",
      "Subir la tensión en shock.",
      "Anticoagulación."
    ],
    correctAnswer: 1,
    explanation: "Produce un bloqueo transitorio del nodo AV ('resetea' el corazón)."
  },

  // --- Antihipertensivos ---
  {
    id: 26,
    text: "¿Qué determina la presión arterial?",
    options: [
      "Solo la frecuencia cardiaca.",
      "Gasto cardiaco y Resistencia vascular periférica.",
      "El nivel de glucosa en sangre.",
      "La capacidad pulmonar."
    ],
    correctAnswer: 1,
    explanation: "PA = GC x RVP."
  },
  {
    id: 27,
    text: "¿Medida no farmacológica para bajar la presión?",
    options: [
      "Aumentar el consumo de café.",
      "Reducción de sal y ejercicio físico.",
      "Dormir menos de 5 horas.",
      "Tomar suplementos de hierro."
    ],
    correctAnswer: 1,
    explanation: "El estilo de vida es el primer escalón terapéutico."
  },
  {
    id: 28,
    text: "¿Cuál es el antihipertensivo de elección en embarazo (preeclampsia)?",
    options: [
      "Enalapril",
      "Losartán",
      "Metildopa",
      "Furosemida"
    ],
    correctAnswer: 2,
    explanation: "Seguro para el feto. IECA y ARA II están contraindicados."
  },
  {
    id: 29,
    text: "¿Cómo actúan los beta-bloqueantes en la HTA?",
    options: [
      "Aumentan la renina.",
      "Bajan FC, contractilidad y secreción de renina.",
      "Dilatan directamente las arterias.",
      "Aumentan la diuresis."
    ],
    correctAnswer: 1,
    explanation: "Bloquean receptores beta-1 en corazón y riñón."
  },
  {
    id: 30,
    text: "¿Por qué los beta-bloqueantes sirven para angina?",
    options: [
      "Porque quitan el dolor analgésicamente.",
      "Reducen la demanda de oxígeno miocárdica.",
      "Dilatan las coronarias masivamente.",
      "Aumentan el gasto cardiaco."
    ],
    correctAnswer: 1,
    explanation: "Al trabajar menos el corazón, necesita menos oxígeno, evitando la isquemia."
  },
  {
    id: 31,
    text: "¿Qué efecto tienen los calcioantagonistas (ej: Nifedipino)?",
    options: [
      "Vasoconstricción periférica.",
      "Vasodilatación y bajada de resistencia periférica.",
      "Aumento de la conducción AV.",
      "Retención de potasio."
    ],
    correctAnswer: 1,
    explanation: "Impiden la entrada de calcio en músculo liso vascular -> relajación."
  },

  // --- Antianginosos ---
  {
    id: 32,
    text: "¿Objetivo principal de los antianginosos?",
    options: [
      "Curar la aterosclerosis.",
      "Disminuir demanda de O2 y/o aumentar aporte.",
      "Dormir al paciente.",
      "Bajar el colesterol."
    ],
    correctAnswer: 1,
    explanation: "Restaurar el equilibrio entre oferta y demanda de oxígeno."
  },
  {
    id: 33,
    text: "¿Cómo se toman los nitratos en una crisis de angina?",
    options: [
      "Vía oral con agua, esperar 1 hora.",
      "Vía sublingual, repetible cada 5 min (max 3 dosis).",
      "Inyección intramuscular.",
      "Parche transdérmico (inicio lento)."
    ],
    correctAnswer: 1,
    explanation: "La vía sublingual es rapidísima y evita el primer paso hepático."
  },
  {
    id: 34,
    text: "¿Qué es la Molsidomina?",
    options: [
      "Un beta-bloqueante.",
      "Un profármaco que libera óxido nítrico (NO).",
      "Un calcioantagonista.",
      "Un diurético."
    ],
    correctAnswer: 1,
    explanation: "Se metaboliza a SIN-1 que libera NO. Útil para tolerancia a nitratos."
  },
  {
    id: 35,
    text: "¿Diferencia entre Verapamilo y Nifedipino?",
    options: [
      "Verapamilo es más cardiaco; Nifedipino más vascular.",
      "Verapamilo sube la tensión; Nifedipino la baja.",
      "No hay diferencia.",
      "Nifedipino es para arritmias."
    ],
    correctAnswer: 0,
    explanation: "Verapamilo frena el corazón (No dihidropiridina); Nifedipino dilata vasos (Dihidropiridina)."
  }
];

const Quiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent double click

    setSelectedOption(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 100);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-purple-900 text-white p-8 overflow-y-auto">
        <h2 className="text-4xl md:text-5xl font-black mb-6 animate-bounce text-center">¡Juego Terminado!</h2>
        <div className="bg-white text-purple-900 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
          <p className="text-xl mb-2 font-bold">Puntuación Final</p>
          <p className="text-6xl font-black mb-6 text-purple-600">{score}</p>
          <p className="text-gray-600 mb-6 font-medium">
            {score > (QUESTIONS.length * 100 * 0.8) ? "¡Excelente! Dominas la Farmacología Cardiovascular." : "Buen intento. Repasa los conceptos en el Mapa Mental y vuelve a intentar."}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Volver a Jugar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 relative overflow-hidden">
      {/* Top Bar */}
      <div className="bg-purple-800 p-4 flex justify-between items-center shadow-md z-10 text-white">
        <div className="flex items-center space-x-2">
          <span className="bg-purple-900 px-3 py-1 rounded-full font-bold text-sm border border-purple-600">
            {currentQIndex + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="font-black text-xl md:text-2xl">Puntos: {score}</div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 text-center z-10 overflow-y-auto">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-4xl w-full mb-6 border-b-4 border-gray-200">
          <h2 className="text-xl md:text-3xl font-black text-gray-800 leading-tight">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-5xl pb-20 md:pb-0">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = ""; // Default
            
            // Logic for revealing colors
            if (selectedOption !== null) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass = "bg-green-500 text-white ring-4 ring-green-300 opacity-100"; // Correct
              } else if (idx === selectedOption) {
                btnClass = "bg-red-500 text-white ring-4 ring-red-300 opacity-100"; // Wrong selected
              } else {
                btnClass = "bg-gray-200 text-gray-400 opacity-40 grayscale"; // Others
              }
            } else {
                // Colors for unselected state (Kahoot style shapes usually)
                const colors = ["bg-red-500 border-red-700", "bg-blue-500 border-blue-700", "bg-yellow-500 border-yellow-700", "bg-green-500 border-green-700"];
                btnClass = `${colors[idx]} text-white hover:brightness-110 kahoot-shadow active:kahoot-shadow-active border-b-4`;
            }

            const shapes = ["▲", "◆", "●", "■"];

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 md:p-6 rounded-xl text-lg md:text-xl font-bold transition-all transform flex items-center shadow-lg min-h-[80px] text-left ${btnClass}`}
              >
                <span className="mr-4 text-2xl opacity-80 shrink-0">{shapes[idx]}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Overlay */}
      {selectedOption !== null && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 text-white p-6 z-20 animate-slide-up backdrop-blur-sm border-t-4 border-white/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:justify-between mb-4 gap-4">
              <div className={`text-3xl md:text-4xl font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? "¡Correcto!" : "Incorrecto..."}
              </div>
              <button 
                onClick={nextQuestion}
                className="bg-white text-purple-900 font-black py-3 px-10 rounded-full hover:bg-gray-200 transition-colors shadow-lg transform active:scale-95"
              >
                Siguiente ➔
              </button>
            </div>
            <p className="text-lg text-gray-300 mb-3 font-medium bg-white/10 p-3 rounded-lg border-l-4 border-yellow-400">
               💡 {currentQuestion.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;