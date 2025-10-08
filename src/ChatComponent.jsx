import useSpeechToText from './js/useSpeechToText';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown"
import rehypeRaw from 'rehype-raw'
import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
import Avatar from "@cloudscape-design/chat-components/avatar";
import LoadingBar from "@cloudscape-design/chat-components/loading-bar";
import LiveRegion from "@cloudscape-design/components/live-region";
import Box from "@cloudscape-design/components/box";
import {
  Container,
  Form,
  FormField,
  PromptInput,
  Button,
  Modal,
  SpaceBetween,
} from "@cloudscape-design/components";
import PropTypes from 'prop-types';
import './ChatComponent.css';

/**
 * Simple chat interface component that uses backend API
 * @param {Object} props - Component properties
 * @param {Object} props.user - Current user information
 * @param {Function} props.onLogout - Callback handler for logout action
 * @param {Function} props.onConfigEditorClick - Callback for configuration editor
 * @returns {JSX.Element} The chat interface
 */
const ChatComponent = ({ user, onLogout, onConfigEditorClick }) => {
  // Array of chat messages in the conversation
  const [messages, setMessages] = useState([]);
  // Current message being composed by the user
  const [newMessage, setNewMessage] = useState('');
  // Reference to automatically scroll to latest messages
  const messagesEndRef = useRef(null);
  // Tracks when the AI agent is processing a response
  const [isAgentResponding, setIsAgentResponding] = useState(false);
  // Controls visibility of the clear conversation modal
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  // Name of the AI agent for display purposes
  const [agentName, setAgentName] = useState({ value: 'Bedrock Agent' });
  // Speech-to-text functionality
  const { isListening, transcript, startListening, stopListening } = useSpeechToText();

  /**
   * Scrolls the chat window to the most recent message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Shows the modal for confirming conversation clearing
   */
  const handleClearData = () => {
    setShowClearDataModal(true);
  };

  /**
   * Confirms and clears the conversation
   */
  const confirmClearData = () => {
    setMessages([]);
    setShowClearDataModal(false);
  };

  /**
   * Cancels the clear data operation
   */
  const cancelClearData = () => {
    setShowClearDataModal(false);
  };

  /**
   * Sends a message to the backend API
   */
  const sendMessageToBackend = async (message, conversationHistory) => {
    try {
      const response = await fetch('http://localhost:8088/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message to backend:', error);
      throw error;
    }
  };

  /**
   * Handles the submission of new messages to the chat
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    
    // Add user message to chat
    const userMessage = { text: messageText, sender: user.username };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsAgentResponding(true);

    try {
      // Prepare conversation history for the backend
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === user.username ? 'user' : 'assistant',
        content: msg.text
      }));

      // Send message to backend
      const response = await sendMessageToBackend(messageText, conversationHistory);
      
      // Extract the response text from the Bedrock response
      let responseText = '';
      if (response && response.content && response.content[0] && response.content[0].text) {
        responseText = response.content[0].text;
      } else if (response && response.message) {
        responseText = response.message;
      } else {
        responseText = 'Sorry, I could not process your request.';
      }

      // Add agent response to chat
      const agentMessage = { text: responseText, sender: agentName.value };
      setMessages(prevMessages => [...prevMessages, agentMessage]);

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = { 
        text: 'Sorry, there was an error processing your message. Please try again.', 
        sender: agentName.value 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsAgentResponding(false);
    }
  };

  /**
   * Handles speech-to-text functionality
   */
  const handleSpeechToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setNewMessage(prev => prev + ' ' + transcript);
      }
    } else {
      startListening();
    }
  };

  /**
   * Effect hook to scroll to latest messages
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Effect hook to handle speech transcript
   */
  useEffect(() => {
    if (transcript && !isListening) {
      setNewMessage(prev => prev + ' ' + transcript);
    }
  }, [transcript, isListening]);

  return (
    <Container>
      <LiveRegion>
        {isAgentResponding ? `${agentName.value} is typing...` : ''}
      </LiveRegion>

      {/* Chat Messages */}
      <Box padding="m">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === user.username ? 'user-message' : 'agent-message'}`}>
              <div className="message-content">
                <div className="message-sender">
                  <Avatar name={message.sender} />
                  <span>{message.sender}</span>
                </div>
                <div className="message-text">
                  {message.sender === agentName.value ? (
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isAgentResponding && (
            <div className="message agent-message">
              <div className="message-content">
                <div className="message-sender">
                  <Avatar name={agentName.value} />
                  <span>{agentName.value}</span>
                </div>
                <div className="message-text">
                  <LoadingBar />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </Box>

      {/* Message Input Form */}
      <Box padding="m">
        <Form onSubmit={handleSubmit}>
          <SpaceBetween size="m">
            <FormField>
              <PromptInput
                value={newMessage}
                onChange={({ detail }) => setNewMessage(detail.value)}
                placeholder="Type your message here..."
                disabled={isAgentResponding}
                onKeyDown={({ detail }) => {
                  if (detail.key === 'Enter' && !detail.shiftKey) {
                    handleSubmit({ preventDefault: () => {} });
                  }
                }}
              />
            </FormField>
            
            <SpaceBetween direction="horizontal" size="s">
              <Button
                variant="normal"
                iconName={isListening ? "microphone-off" : "microphone"}
                onClick={handleSpeechToggle}
                disabled={isAgentResponding}
              >
                {isListening ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <Button
                variant="primary"
                type="submit"
                disabled={!newMessage.trim() || isAgentResponding}
              >
                Send
              </Button>
              
              <Button
                variant="normal"
                onClick={handleClearData}
                disabled={isAgentResponding}
              >
                Clear Chat
              </Button>
            </SpaceBetween>
          </SpaceBetween>
        </Form>
      </Box>

      {/* Clear Data Confirmation Modal */}
      <Modal
        visible={showClearDataModal}
        onDismiss={cancelClearData}
        header="Clear Conversation"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={cancelClearData}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmClearData}>
                Clear
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        Are you sure you want to clear the conversation? This action cannot be undone.
      </Modal>
    </Container>
  );
};

ChatComponent.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  onConfigEditorClick: PropTypes.func.isRequired
};

export default ChatComponent;