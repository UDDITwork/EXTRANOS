import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const TargetForm = ({ mission, onMissionFinalized }) => {
  const [targetTitle, setTargetTitle] = useState('');
  const [targets, setTargets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTarget = async (e) => {
    e.preventDefault();
    if (!targetTitle.trim()) {
      toast.error('Please enter a target title');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/missions/${mission.id}/targets`,
        { title: targetTitle }
      );
      setTargets([...targets, response.data]);
      setTargetTitle('');
      toast.success('Target added successfully!');
    } catch (error) {
      console.error('Error adding target:', error);
      toast.error('Failed to add target');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTarget = async (targetId) => {
    try {
      await axios.delete(`${API_URL}/targets/${targetId}`);
      setTargets(targets.filter(t => t.id !== targetId));
      toast.success('Target deleted successfully!');
    } catch (error) {
      console.error('Error deleting target:', error);
      toast.error('Failed to delete target');
    }
  };

  const handleFinalizeMission = async () => {
    if (targets.length === 0) {
      toast.error('Please add at least one target before finalizing');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/missions/${mission.id}/finalize`);
      
      // Trigger goosebumps animation
      const element = document.getElementById(`mission-${mission.id}`);
      element.classList.add('animate-goosebumps');
      setTimeout(() => {
        element.classList.remove('animate-goosebumps');
      }, 1000);

      toast.success('Mission finalized successfully!');
      onMissionFinalized();
    } catch (error) {
      console.error('Error finalizing mission:', error);
      toast.error('Failed to finalize mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id={`mission-${mission.id}`} className="bg-white rounded-lg p-6 shadow-lg mb-4">
      <form onSubmit={handleAddTarget} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={targetTitle}
            onChange={(e) => setTargetTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter target title"
            disabled={isSubmitting}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
                     transition-colors duration-200 disabled:opacity-50"
          >
            Add Target
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {targets.map((target) => (
          <motion.div
            key={target.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2"
          >
            <span className="text-gray-800">{target.title}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteTarget(target.id)}
              className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md
                       hover:bg-red-100 transition-colors duration-200"
            >
              DELETE TARGET
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {targets.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinalizeMission}
          disabled={isSubmitting}
          className="w-full mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg 
                   hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          PROCEED MISSION
        </motion.button>
      )}
    </div>
  );
};

export default TargetForm;
