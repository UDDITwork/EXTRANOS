// Mission.jsx 
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const MissionForm = ({ onMissionCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a mission title');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/missions`, { title });
      toast.success('Mission created successfully!');
      onMissionCreated(response.data);
    } catch (error) {
      console.error('Error creating mission:', error);
      toast.error('Failed to create mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg p-6 shadow-lg mb-8"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Mission Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                     focus:ring-2 focus:ring-blue-500"
            placeholder="Enter mission title"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'SAVE MISSION'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 
                     transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default MissionForm;