// Progress.jsx 
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm text-gray-600">
        <span>Progress</span>
        <span>{completed}/{total} ({percentage}%)</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;