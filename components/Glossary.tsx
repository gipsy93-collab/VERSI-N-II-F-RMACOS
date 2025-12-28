import React, { useState } from 'react';

const TONGUE_TWISTERS = [
  {
    name: "Digoxina",
    rhyme: "La Digoxina domina la bomba con disciplina, pero si te pasas de harina, la Digoxina te arruina y el corazón desafina.",
    meaning: "Aumenta la fuerza (inotrópico +) y frena el ritmo (cronotrópico -). ¡Cuidado con la intoxicación!"
  },
  {
    name: "Furosemida",
    rhyme: "Furosemida furiosa corrió por la avenida, hizo pipí enseguida y perdió la medida, dejando el agua perdida.",
    meaning: "Diurético de asa muy potente. Elimina agua y sodio rápidamente para bajar edemas."
  },
  {
    name: "Enalapril",
    rhyme: "En abril, el Enalapril, sacó la tos del barril. Bajó la tensión mil a mil, dilatando el vaso sutil como un carril.",
    meaning: "IECA (Vasodilatador). Baja la presión arterial protegiendo el riñón, pero puede dar tos seca."
  },
  {
    name: "Nitroglicerina",
    rhyme: "Nitro, nitro, glicerina, debajo de la lengua camina. Si el dolor de pecho domina, la pastilla te ilumina y la vena se empina.",
    meaning: "Venodilatador rapidísimo. Se pone bajo la lengua para quitar el dolor de angina de pecho."
  },
  {
    name: "Bisoprolol",
    rhyme: "Bisoprolol bajó el sol, frenó el latido con control. Bloqueando el beta metió un gol, y el corazón duerme como un caracol.",
    meaning: "Beta-bloqueante. Reduce la frecuencia cardiaca y el esfuerzo del corazón (ahorra oxígeno)."
  },
  {
    name: "Amiodarona",
    rhyme: "Amiodarona a mi lado razona, el ritmo loco perdona. Pero ojo con la hormona, que el yodo se amontona y la tiroides se encona.",
    meaning: "Antiarrítmico de amplio espectro. Muy eficaz pero con toxicidad por yodo (tiroides, pulmón)."
  },
  {
    name: "Dobutamina",
    rhyme: "Doña Dobutamina camina con adrenalina, despierta la fuerza genuina, y el corazón que no opina, bombea gasolina.",
    meaning: "Inotrópico Beta-1. Se usa en hospital (IV) para despertar un corazón en shock."
  },
  {
    name: "Espironolactona",
    rhyme: "Espironolactona no perdona, al potasio lo amontona. Bloquea a la aldosterona, y el corazón se corona.",
    meaning: "Diurético ahorrador de potasio. Bloquea la aldosterona, evitando la fibrosis cardiaca."
  }
];

const Glossary: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setActiveId(activeId === idx ? null : idx);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
       <div className="bg-pink-600 p-4 text-white font-bold flex items-center shadow-md shrink-0">
        <span className="text-3xl mr-3">🗣️</span>
        <div>
           <h2 className="text-xl font-black">Glosario Trabalenguas</h2>
           <p className="text-sm text-pink-200">¡Aprende los fármacos rimando!</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-yellow-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {TONGUE_TWISTERS.map((item, idx) => {
            const isActive = activeId === idx;
            return (
              <div 
                key={idx} 
                onClick={() => toggle(idx)}
                className={`
                   relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300
                   ${isActive 
                     ? 'bg-white shadow-2xl ring-4 ring-pink-300 scale-[1.02] z-10' 
                     : 'bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-pink-50'
                   }
                `}
              >
                 {/* Collapsed View / Header */}
                 <div className="min-h-[100px] flex items-center justify-center p-4 relative">
                    {/* Background Bar Effect for visual interest when inactive */}
                    {!isActive && (
                        <div className="absolute inset-x-4 bottom-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-pink-200 to-purple-200 w-2/3"></div>
                        </div>
                    )}

                    {/* Active Indicator Line */}
                    <div className={`absolute top-0 left-0 w-2 h-full bg-pink-500 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <h3 className={`text-2xl font-black text-center transition-colors duration-300 z-10 ${isActive ? 'text-pink-600 scale-110' : 'text-purple-900'}`}>
                      {item.name}
                    </h3>
                    
                    {/* Expand Icon */}
                    <div className={`absolute right-5 text-pink-400 text-2xl font-bold transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`}>
                       ▼
                    </div>
                 </div>

                 {/* Expanded Content */}
                 <div className={`
                    bg-pink-50/50 overflow-hidden transition-all duration-500 ease-in-out border-t border-pink-100
                    ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                 `}>
                    <div className="p-6 pt-2">
                        <div className="bg-white p-4 rounded-xl shadow-sm mb-3 border-l-4 border-pink-400">
                            <p className="text-xl font-bold text-pink-700 italic text-center leading-relaxed">
                            "{item.rhyme}"
                            </p>
                        </div>
                        
                        <div className="flex items-start gap-2 text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
                            <span className="text-lg">🤓</span>
                            <p><strong>Lo serio:</strong> {item.meaning}</p>
                        </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center pb-8">
           <p className="text-purple-400 font-bold text-sm bg-purple-100 inline-block px-6 py-2 rounded-full animate-pulse">
             👆 Toca una tarjeta para ver la magia
           </p>
        </div>
      </div>
    </div>
  );
};

export default Glossary;