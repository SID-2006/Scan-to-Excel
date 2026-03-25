import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';

const DataCorrectionTable = ({ data, onChange }) => {
  const [editingCell, setEditingCell] = useState(null); // { rIndex, cIndex }
  const [editValue, setEditValue] = useState("");

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
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
    <div className="w-full h-full overflow-auto custom-scrollbar">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
            <th className="w-12 p-2 border-r border-white/10 text-center text-white/30 font-medium">#</th>
            {Array.from({ length: maxCols }).map((_, i) => (
              <th key={i} className="p-3 border-r border-white/10 font-medium text-white/70 min-w-[120px]">
                {data[0] && data[0][i] ? data[0][i] : `Col ${i + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {/* Start from row 1 if row 0 is assumed header, else render all. Let's render all for flexibility */}
            {data.slice(1).map((row, rIndex) => {
              const actualRowIndex = rIndex + 1; // since we sliced 1
              return (
                <motion.tr 
                  key={actualRowIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rIndex * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-2 border-r border-white/10 text-center text-white/30 bg-white/5 font-mono text-xs cursor-default">
                    {actualRowIndex}
                  </td>
                  
                  {Array.from({ length: maxCols }).map((_, cIndex) => {
                    const isEditing = editingCell?.rIndex === actualRowIndex && editingCell?.cIndex === cIndex;
                    const cellValue = row[cIndex] !== undefined && row[cIndex] !== null ? String(row[cIndex]) : "";
                    
                    return (
                      <td 
                        key={cIndex}
                        className="border-r border-white/10 relative group/cell hover:bg-white/5 transition-colors p-0"
                        onClick={() => !isEditing && startEdit(actualRowIndex, cIndex, cellValue)}
                      >
                        {isEditing ? (
                          <div className="absolute inset-0 z-20 flex bg-[#00f0ff]/10 backdrop-blur-sm neon-border-blue border rounded-sm outline-none shadow-xl">
                            <input
                              autoFocus
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={saveEdit}
                              className="w-full h-full px-3 bg-transparent text-white outline-none font-medium text-sm"
                            />
                            <button onMouseDown={(e) => { e.preventDefault(); saveEdit(); }} className="px-2 text-[#00f0ff] hover:text-white transition-colors bg-black/20 rounded-r-sm">
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 w-full h-full min-h-[40px] text-white/80 group-hover/cell:text-white transition-colors flex items-center justify-between">
                            <span className="truncate pr-4" title={cellValue}>{cellValue}</span>
                            <Edit2 size={12} className="opacity-0 group-hover/cell:opacity-100 text-[#00f0ff]/70 transition-opacity" />
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
