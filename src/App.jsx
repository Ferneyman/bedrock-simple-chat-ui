// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import { TopNavigation } from "@cloudscape-design/components";
import PropTypes from 'prop-types';
import './App.css';

import ChatComponent from './ChatComponent';
import ConfigComponent from './ConfigComponent';

/**
 * Main App component that manages the application state and routing
 * Controls the configuration flow of the application
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  // State to track if the application has been properly configured
  const [isConfigured, setIsConfigured] = useState(false);
  // State to track if user is currently in configuration editing mode
  const [isEditingConfig, setIsEditingConfig] = useState(false);

  /**
   * Effect hook to check for stored configuration in localStorage
   * Updates the configuration state when editing mode changes
   */
  useEffect(() => {
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig && !isEditingConfig) {
      setIsConfigured(true);
    }
  }, [isEditingConfig]);

  /**
   * Callback handler for when configuration is successfully set
   * Updates the isConfigured state to true
   */
  const handleConfigSet = () => {
    setIsConfigured(true);
  };

  /**
   * Render the appropriate component based on configuration state
   */
  return (
    <div>
      {!isConfigured || isEditingConfig ? (
        // Show configuration component if not configured or editing
        <ConfigComponent 
          onConfigSet={handleConfigSet} 
          isEditingConfig={isEditingConfig} 
          setEditingConfig={setIsEditingConfig} 
        />
      ) : (
        // Show chat component when configured
        <SimpleChatComponent onEditConfigClick={() => setIsEditingConfig(true)} />
      )}
    </div>
  );
};

/**
 * Simple chat component without authentication
 * Renders the top navigation and chat interface
 * @param {Object} props - Component properties
 * @param {Function} props.onEditConfigClick - Callback to handle configuration editing
 * @returns {JSX.Element} The chat view of the application
 */
const SimpleChatComponent = ({ onEditConfigClick }) => {
  return (
    <div>
      <div className="centered-container">
        <TopNavigation
          identity={{
            href: "#",
            title: "Bedrock Secure Chat UI",
          }}
          utilities={[
            // Settings button configuration
            {
              type: "button",
              iconName: "settings",
              title: "Update settings",
              ariaLabel: "Update settings",
              disableUtilityCollapse: false,
              onClick: onEditConfigClick
            }
          ]}
        />
        <ChatComponent 
          user={{ username: 'user' }} 
          onLogout={() => {}} 
          onConfigEditorClick={onEditConfigClick}
        />
      </div>
    </div>
  );
}

SimpleChatComponent.propTypes = {
  onEditConfigClick: PropTypes.func.isRequired
};

export default App;