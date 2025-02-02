import React from 'react';
import { Toaster } from 'react-hot-toast';
import MissionList from './components/MissionList';
import MissionForm from './components/MissionForm';
import { motion } from 'framer-motion';

const App = () => {
  const [showMissionForm, setShowMissionForm] = React.useState(false);
  const [missions, setMissions] = React.useState([]);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const refreshMissions = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowMissionForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Mission Tracker</h1>
          {!showMissionForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMissionForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                         transition-colors duration-200"
            >
              NEW MISSION
            </motion.button>
          )}
        </header>

        {showMissionForm && (
          <MissionForm 
            onMissionCreated={refreshMissions}
            onCancel={() => setShowMissionForm(false)}
          />
        )}

        <MissionList 
          refreshTrigger={refreshTrigger}
          setMissions={setMissions}
        />
      </div>
    </div>
  );
};

export default App;