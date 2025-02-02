import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import TargetForm from './TargetForm';
import ProgressBar from './ProgressBar';

const API_URL = 'http://localhost:5000/api';

const MissionList = ({ refreshTrigger, setMissions }) => {
  const [localMissions, setLocalMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/missions`);
      setLocalMissions(response.data);
      setMissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Failed to load missions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [refreshTrigger]);

  const handleDeleteMission = async (missionId) => {
    try {
      await axios.delete(`${API_URL}/missions/${missionId}`);
      setLocalMissions(prevMissions => 
        prevMissions.filter(mission => mission.id !== missionId)
      );
      toast.success('Mission deleted successfully!');
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error('Failed to delete mission');
    }
  };

  const handleTargetComplete = async (targetId, missionId) => {
    try {
      await axios.patch(`${API_URL}/targets/${targetId}/complete`);
      
      // Update local state
      setLocalMissions(prevMissions => {
        return prevMissions.map(mission => {
          if (mission.id === missionId) {
            return {
              ...mission,
              targets: mission.targets.map(target => {
                if (target.id === targetId) {
                  return { ...target, is_completed: true };
                }
                return target;
              })
            };
          }
          return mission;
        });
      });
      
      toast.success('Target marked as complete!');
    } catch (error) {
      console.error('Error completing target:', error);
      toast.error('Failed to mark target as complete');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-6">
        {localMissions.map((mission) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{mission.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteMission(mission.id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg
                           hover:bg-red-100 transition-colors duration-200"
                >
                  DELETE MISSION
                </motion.button>
              </div>

              {!mission.is_finalized ? (
                <TargetForm 
                  mission={mission} 
                  onMissionFinalized={fetchMissions}
                />
              ) : (
                <div>
                  <ProgressBar 
                    completed={mission.targets.filter(t => t.is_completed).length}
                    total={mission.targets.length}
                  />
                  
                  <div className="mt-4 space-y-2">
                    {mission.targets.map((target) => (
                      <div 
                        key={target.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className={`text-gray-800 ${target.is_completed ? 'line-through' : ''}`}>
                          {target.title}
                        </span>
                        {!target.is_completed && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTargetComplete(target.id, mission.id)}
                            className="bg-green-600 text-white px-4 py-1 rounded-md
                                     hover:bg-green-700 transition-colors duration-200"
                          >
                            DONE
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default MissionList;