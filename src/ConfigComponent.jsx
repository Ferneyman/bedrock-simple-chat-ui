import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  SpaceBetween,
  Form,
  FormField,
  Input,
  Button,
} from "@cloudscape-design/components";

/**
 * Simple configuration component for backend settings
 * @param {Object} props - Component properties
 * @param {Function} props.onConfigSet - Callback when configuration is saved
 * @param {boolean} props.isEditingConfig - Flag indicating edit mode
 * @param {Function} props.setEditingConfig - Function to update edit mode
 * @returns {JSX.Element} Configuration form interface
 */
const ConfigComponent = ({ onConfigSet, isEditingConfig, setEditingConfig }) => {
  
  /**
   * Configuration state schema
   * Contains backend configuration
   */
  const [config, setConfig] = useState({
    backend: {
      url: 'http://localhost:8088',
      agentName: 'Bedrock Agent'
    }
  });
  const [errors, setErrors] = useState({});

  /**
   * Load existing configuration from localStorage
   */
  useEffect(() => {
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing stored config:', error);
      }
    }
  }, []);

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validate backend URL
    if (!config.backend.url || !config.backend.url.trim()) {
      newErrors.backendUrl = 'Backend URL is required';
    } else if (!config.backend.url.startsWith('http://') && !config.backend.url.startsWith('https://')) {
      newErrors.backendUrl = 'Backend URL must start with http:// or https://';
    }
    
    // Validate agent name
    if (!config.backend.agentName || !config.backend.agentName.trim()) {
      newErrors.agentName = 'Agent name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save configuration to localStorage
      localStorage.setItem('appConfig', JSON.stringify(config));
      
      // Notify parent component
      onConfigSet();
      
      // Exit edit mode if we were editing
      if (isEditingConfig) {
        setEditingConfig(false);
      }
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      backend: {
        ...prev.backend,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Container
      header={
        <Header variant="h1">
          {isEditingConfig ? 'Edit Configuration' : 'Configure Application'}
        </Header>
      }
    >
      <Form onSubmit={handleSubmit}>
        <SpaceBetween size="l">
          <FormField
            label="Backend URL"
            description="The URL of your backend server (e.g., http://localhost:8088)"
            errorText={errors.backendUrl}
          >
            <Input
              value={config.backend.url}
              onChange={({ detail }) => handleInputChange('url', detail.value)}
              placeholder="http://localhost:8088"
            />
          </FormField>

          <FormField
            label="Agent Name"
            description="Display name for the AI agent"
            errorText={errors.agentName}
          >
            <Input
              value={config.backend.agentName}
              onChange={({ detail }) => handleInputChange('agentName', detail.value)}
              placeholder="Bedrock Agent"
            />
          </FormField>

          <SpaceBetween direction="horizontal" size="s">
            <Button variant="primary" type="submit">
              {isEditingConfig ? 'Save Changes' : 'Save Configuration'}
            </Button>
            
            {isEditingConfig && (
              <Button variant="normal" onClick={() => setEditingConfig(false)}>
                Cancel
              </Button>
            )}
          </SpaceBetween>
        </SpaceBetween>
      </Form>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h3>Backend Configuration</h3>
        <p>Make sure your backend server is running and has the <code>AWS_BEARER_TOKEN_BEDROCK</code> environment variable set.</p>
        <p>The backend should be accessible at the URL you specify above.</p>
      </div>
    </Container>
  );
};

ConfigComponent.propTypes = {
  onConfigSet: PropTypes.func.isRequired,
  isEditingConfig: PropTypes.bool.isRequired,
  setEditingConfig: PropTypes.func.isRequired
};

export default ConfigComponent;