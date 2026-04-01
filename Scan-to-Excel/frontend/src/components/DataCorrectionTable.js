import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check } from 'lucide-react';

const DataCorrectionTable = ({ data, onChange, darkMode }) => {
  const [editingCell, setEditingCell] = useState(null); // { rIndex, cIndex }
  const [editValue, setEditValue] = useState("");

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
        No tabular data detected.
      </div>
    );
  }

  const startEdit = (rIndex, cIndex, value) => {
    setEditingCell({ rIndex, cIndex });
    setEditValue(value !== null && value !== undefined ? String(value) : "");
  };

  const saveEdit = () => {
    if (editingCell) {
      const { rIndex, cIndex } = editingCell;
      const newData = [...data];
      newData[rIndex] = [...newData[rIndex]];
      newData[rIndex][cIndex] = editValue;
      onChange(newData);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Ensure robust rendering even if rows have different column counts
  const maxCols = Math.max(...data.map(row => (row ? row.length : 0)));

  return (
    <div className={`w-full h-full overflow-auto custom-scrollbar transition-colors duration-500`}>
      <table className="w-full border-collapse text-sm table-fixed">
        <tbody>
          <AnimatePresence>
            {data.map((row, rIndex) => {
              return (
                <motion.tr 
                  key={rIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rIndex * 0.05 }}
                  className={`border-b transition-colors group ${darkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <td className={`w-12 p-2 border-r text-center font-mono text-xs cursor-default sticky left-0 z-10 ${darkMode ? 'border-white/10 text-white/25 bg-[#0a0a0a]' : 'border-gray-100 text-gray-400 bg-gray-50'}`}>
                    {rIndex + 1}
                  </td>
                  
                  {Array.from({ length: maxCols }).map((_, cIndex) => {
                    const isEditing = editingCell?.rIndex === rIndex && editingCell?.cIndex === cIndex;
                    const cellValue = row[cIndex] !== undefined && row[cIndex] !== null ? String(row[cIndex]) : "";
                    const isSectionRow = cIndex === 0 && !cellValue ? false : row.slice(1).every((cell) => !String(cell || "").trim());
                    
                    return (
                      <td 
                        key={cIndex}
                        className={`border-r relative group/cell transition-colors p-0 align-top ${
                          darkMode 
                            ? `border-white/10 hover:bg-white/5 ${isSectionRow ? 'bg-white/[0.04]' : ''}` 
                            : `border-gray-100 hover:bg-blue-50/50 ${isSectionRow ? 'bg-gray-50' : ''}`
                        }`}
                        onClick={() => !isEditing && startEdit(rIndex, cIndex, cellValue)}
                      >
                        {isEditing ? (
                          <div className={`absolute inset-0 z-20 flex border rounded-sm outline-none shadow-xl ${darkMode ? 'bg-[#00f0ff]/10 backdrop-blur-sm neon-border-blue' : 'bg-blue-50 border-blue-500 shadow-blue-500/10'}`}>
                            <input
                              autoFocus
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={saveEdit}
                              className={`w-full h-full px-3 bg-transparent outline-none font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}
                            />
                            <button onMouseDown={(e) => { e.preventDefault(); saveEdit(); }} className={`px-2 transition-colors rounded-r-sm ${darkMode ? 'text-[#00f0ff] hover:text-white bg-black/20' : 'text-blue-600 hover:text-blue-800 bg-blue-100'}`}>
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className={`p-3 w-full min-h-[44px] transition-colors flex items-start justify-between gap-2 ${
                            darkMode 
                              ? `text-white/80 group-hover/cell:text-white ${isSectionRow ? 'font-semibold text-white/90 uppercase tracking-[0.08em] text-xs' : ''}` 
                              : `text-gray-700 group-hover/cell:text-gray-900 ${isSectionRow ? 'font-semibold text-gray-900 uppercase tracking-[0.08em] text-xs' : ''}`
                          }`}>
                            <span className="whitespace-pre-wrap break-words pr-4 text-left flex-1" title={cellValue}>{cellValue}</span>
                            <Edit2 size={12} className={`opacity-0 group-hover/cell:opacity-100 transition-opacity ${darkMode ? 'text-[#00f0ff]/70' : 'text-blue-500/70'}`} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default DataCorrectionTable;
