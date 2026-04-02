import React from 'react';
import { motion } from 'framer-motion';

const NeuralNetworkBackground = ({ darkMode }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // Handle Mouse Move for Parallax
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20, // -10 to 10 shift
        y: (e.clientY / window.innerHeight - 0.5) * 20, 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random stars for the space effect
  const starsArray = React.useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  })), []);

  const tinyStarsArray = React.useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  })), []);

  // Generate neurons
  const neurons = React.useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 5 + 1.5,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  })), []);

  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000 ${darkMode ? 'bg-[#02040a]' : 'bg-gray-50'}`}>
      
      {/* Dynamic Cursor Highlight / Mouse Nebula */}
      {darkMode && (
         <motion.div 
           animate={{ 
             x: (mousePos.x * 20) + (window.innerWidth / 2) - 300,
             y: (mousePos.y * 20) + (window.innerHeight / 2) - 300,
           }}
           transition={{ type: "spring", stiffness: 50, damping: 20 }}
           className="absolute w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"
         />
      )}

      {/* Parallax Nebula Layer */}
      {darkMode && (
        <motion.div
           animate={{ x: mousePos.x * -1.5, y: mousePos.y * -1.5 }}
           className="absolute inset-0"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-900/40 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/30 rounded-full blur-[180px]"
          />
        </motion.div>
      )}

      {/* Parallax Starfield Layer */}
      {darkMode && (
         <motion.div 
            animate={{ x: mousePos.x * -0.8, y: mousePos.y * -0.8 }}
            className="absolute inset-0 z-0"
         >
           {starsArray.map(star => (
             <motion.div
                key={`star-${star.id}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: star.size,
                  height: star.size,
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                }}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
             />
           ))}
           {tinyStarsArray.map(star => (
             <motion.div
                key={`t-star-${star.id}`}
                className="absolute w-[1px] h-[1px] bg-white/40 rounded-full"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={{ opacity: [0.1, 0.5, 0.1] }}
                transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
             />
           ))}
         </motion.div>
      )}

      <motion.svg 
        animate={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
        className="w-full h-full relative z-10 opacity-80"
      >
        {/* Connective lines */}
        {neurons.slice(0, 15).map((neuron, idx) => {
          const nextNeuron = neurons[(idx + 5) % neurons.length];
          return (
            <motion.line
              key={`line-${idx}`}
              x1={`${neuron.initialX}%`}
              y1={`${neuron.initialY}%`}
              x2={`${nextNeuron.initialX}%`}
              y2={`${nextNeuron.initialY}%`}
              stroke={darkMode ? 'rgba(0, 240, 255, 0.4)' : 'rgba(59, 130, 246, 0.3)'}
              strokeWidth="0.5"
              strokeDasharray="4 8"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
            />
          );
        })}

        {neurons.map((neuron) => (
          <motion.circle
            key={neuron.id}
            cx={`${neuron.initialX}%`}
            cy={`${neuron.initialY}%`}
            r={neuron.size}
            fill={darkMode ? '#00f0ff' : '#3b82f6'}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{ 
              duration: neuron.duration, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: neuron.delay 
            }}
            style={{ 
               filter: 'blur(1.5px)',
               boxShadow: darkMode ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none'
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default NeuralNetworkBackground;
