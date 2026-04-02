import React from 'react';
import { motion } from 'framer-motion';
import { Image, Type, CheckSquare, FileSpreadsheet, Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Image Processing', icon: Image, description: 'Enhancing and deskewing' },
  { id: 2, title: 'Table Detection', icon: CheckSquare, description: 'Identifying structure' },
  { id: 3, title: 'OCR Extraction', icon: Type, description: 'Reading text content' },
  { id: 4, title: 'Excel Generation', icon: FileSpreadsheet, description: 'Formatting data' },
];

const ProcessingTimeline = ({ currentStep, isProcessing, darkMode }) => {
  if (!isProcessing && currentStep === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 my-8 transition-all duration-500">
      <div className={`p-8 relative overflow-hidden rounded-3xl border transition-all duration-500 ${darkMode ? 'glass-panel border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
        {/* Animated Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${darkMode ? 'from-[#00f0ff]/5 to-[#bb86fc]/5' : 'from-blue-50 to-indigo-50'} opacity-50`}></div>
        
        <h3 className={`text-xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-white to-white/60' : 'from-gray-900 to-gray-500'}`}>
          AI Analysis in Progress
        </h3>

        <div className="relative flex justify-between items-start max-w-3xl mx-auto">
          {/* Connecting Line Vector */}
          <div className={`absolute top-8 left-[10%] right-[10%] h-[2px] ${darkMode ? 'bg-white/10' : 'bg-gray-100'} -z-10`}>
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#bb86fc]"
              initial={{ width: '0%' }}
              animate={{ width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center w-1/4 relative z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isCompleted ? '#bb86fc' : isActive ? (darkMode ? 'rgba(0, 240, 255, 0.2)' : 'rgba(59, 130, 246, 0.1)') : (darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(243, 244, 246, 1)'),
                    borderColor: isCompleted ? '#bb86fc' : isActive ? (darkMode ? '#00f0ff' : '#3b82f6') : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 1)'),
                  }}
                  className={`w-16 h-16 rounded-xl border flex items-center justify-center mb-4 transition-colors duration-300 ${isActive ? (darkMode ? 'neon-border-blue shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500') : isCompleted ? 'shadow-[0_0_20px_rgba(187,134,252,0.3)]' : ''}`}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="w-8 h-8 text-white" />
                    </motion.div>
                  ) : (
                    <Icon className={`w-8 h-8 ${isActive ? (darkMode ? 'text-[#00f0ff]' : 'text-blue-600') : (darkMode ? 'text-white/40' : 'text-gray-400')}`} />
                  )}
                  
                  {/* Processing pulse ring */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl border-2 ${darkMode ? 'border-[#00f0ff]' : 'border-blue-500'}`}
                      animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    />
                  )}
                </motion.div>

                <div className="text-center">
                  <h4 className={`text-sm font-medium mb-1 ${isActive || isCompleted ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-white/50' : 'text-gray-400')}`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs hidden md:block ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeline;
