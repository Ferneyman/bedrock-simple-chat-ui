# Product Requirements Document (PRD)
## Simplified AWS Bedrock Sonnet 4.5 Australian Local-Only Chat Interface

**Version:** 1.0  
**Date:** January 2025  
**Project:** Local-Only Bedrock Sonnet 4.5 AU Backup System  

---

## 1. Executive Summary

### 1.1 Project Overview
Develop a simplified, local-only web application that provides direct API access to AWS Bedrock Claude Sonnet 4.5 model in the Australian region. This system serves as a lightweight backup to the existing comprehensive system running on port 5173, designed for single-user local deployment without multi-user authentication complexity.

### 1.2 Business Objectives
- **Primary Goal**: Provide a simple, reliable backup interface for AWS Bedrock Sonnet 4.5 Australian model access
- **Secondary Goal**: Maintain local-only deployment without external dependencies
- **Success Criteria**: Functional chat interface with direct Bedrock API integration, minimal setup requirements

### 1.3 Scope
- **In Scope**: Simple chat UI, direct Bedrock API integration, local deployment, single-user access
- **Out of Scope**: Multi-user authentication, AWS Amplify deployment, complex agent orchestration, external hosting

---

## 2. Current System Analysis

### 2.1 Existing System Complexity
The current comprehensive system includes:
- **Authentication**: Amazon Cognito User/Identity Pools with temporary credentials
- **Multiple Agent Types**: Bedrock Agents, Strands Agents, AgentCore Agents
- **Complex Configuration**: Multi-step setup with AWS service configuration
- **Session Management**: Persistent chat sessions with localStorage
- **UI Framework**: AWS Cloudscape Design System components
- **Deployment**: AWS Amplify with automated CI/CD

### 2.2 Simplification Requirements
Remove the following complexity for the backup system:
- ❌ Cognito authentication (use direct AWS credentials)
- ❌ Multiple agent type support (Bedrock Sonnet 4.5 only)
- ❌ Complex configuration UI (environment variables/config file)
- ❌ Session persistence (simple in-memory chat)
- ❌ Cloudscape components (basic HTML/CSS/JS)
- ❌ AWS Amplify deployment (local Vite dev server)

---

## 3. Functional Requirements

### 3.1 Core Features

#### 3.1.1 Chat Interface
- **Simple Text Input**: Single input field for user messages
- **Message Display**: Clean display of user messages and AI responses
- **Send Functionality**: Submit messages to Bedrock API
- **Clear Conversation**: Reset chat history
- **Loading States**: Visual feedback during API calls

#### 3.1.2 AWS Bedrock Integration
- **Model Access**: Direct API calls to Claude Sonnet 4.5 in Australian region
- **API Endpoint**: `https://bedrock-runtime.ap-southeast-2.amazonaws.com`
- **Model ID**: `anthropic.claude-3-5-sonnet-20241022-v2:0` (or latest Sonnet 4.5)
- **Request Format**: Standard Bedrock InvokeModel API
- **Response Handling**: Parse and display streaming or complete responses

#### 3.1.3 Configuration Management
- **API Key**: Simple AWS API key or bearer token via environment variable
- **Region Configuration**: Hardcoded to `ap-southeast-2` (Sydney)
- **Model Configuration**: Pre-configured for Sonnet 4.5
- **Minimal Setup**: Single API key configuration step

### 3.2 User Experience Requirements

#### 3.2.1 Interface Design
- **Clean Layout**: Minimal, focused chat interface
- **Responsive Design**: Works on desktop and mobile
- **Fast Loading**: Minimal dependencies for quick startup
- **Error Handling**: Clear error messages for API failures

#### 3.2.2 Interaction Flow
1. User opens application in browser
2. Application loads with empty chat interface
3. User types message and clicks send
4. Application shows loading indicator
5. API call made to Bedrock Sonnet 4.5
6. Response displayed in chat
7. User can continue conversation or clear history

---

## 4. Technical Requirements

### 4.1 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   AWS Bedrock   │
│   (React/Vite)  │◄──►│   (Node.js/      │◄──►│   Sonnet 4.5    │
│                 │    │    Express)      │    │   (ap-southeast-2)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 4.2 Frontend Specifications

#### 4.2.1 Technology Stack
- **Framework**: React 18+ with Vite
- **Styling**: CSS3 with minimal framework (no Cloudscape)
- **HTTP Client**: Fetch API or Axios
- **Build Tool**: Vite for fast development and building
- **Port**: 5174 (to avoid conflict with existing system on 5173)

#### 4.2.2 Component Structure
```
src/
├── App.jsx                 # Main application component
├── ChatInterface.jsx       # Chat UI component
├── MessageList.jsx         # Message display component
├── MessageInput.jsx        # Input component
├── LoadingSpinner.jsx      # Loading indicator
└── styles/
    ├── App.css            # Main styles
    └── Chat.css           # Chat-specific styles
```

### 4.3 Backend Specifications

#### 4.3.1 Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js (minimal setup)
- **AWS SDK**: @aws-sdk/client-bedrock-runtime
- **CORS**: Enable for local development
- **Port**: 3001 (to avoid conflicts)

#### 4.3.2 API Endpoints
```
POST /api/chat
- Request: { message: string, conversationHistory: array }
- Response: { response: string, error?: string }
```

#### 4.3.3 AWS Integration
- **Service**: AWS Bedrock Runtime
- **Region**: ap-southeast-2 (Sydney)
- **Model**: Claude Sonnet 4.5
- **Authentication**: AWS credentials (environment variables or IAM role)
- **Request Format**: Standard Bedrock InvokeModel API

### 4.4 Configuration Requirements

#### 4.4.1 Environment Variables
```bash
# AWS Configuration
AWS_REGION=ap-southeast-2
AWS_API_KEY=your-api-key-or-bearer-token

# Application Configuration
PORT=3001
FRONTEND_PORT=5174
```

#### 4.4.2 Configuration File (Alternative)
```json
{
  "aws": {
    "region": "ap-southeast-2",
    "apiKey": "your-api-key-or-bearer-token"
  },
  "bedrock": {
    "modelId": "anthropic.claude-3-5-sonnet-20241022-v2:0"
  }
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- **Response Time**: < 5 seconds for typical queries
- **Startup Time**: < 3 seconds for application initialization
- **Memory Usage**: < 100MB for frontend + backend
- **Concurrent Users**: 1 (single-user system)

### 5.2 Security Requirements
- **Credential Management**: Secure storage of AWS credentials
- **Input Validation**: Sanitize user inputs before API calls
- **Error Handling**: No sensitive information in error messages
- **Local Only**: No external network dependencies except AWS Bedrock

### 5.3 Reliability Requirements
- **Availability**: 99% uptime during local usage
- **Error Recovery**: Graceful handling of API failures
- **Data Persistence**: Optional conversation history (localStorage)
- **Backup Strategy**: Simple file-based backup of conversations

### 5.4 Usability Requirements
- **Setup Time**: < 10 minutes for initial configuration
- **Learning Curve**: Minimal - intuitive chat interface
- **Documentation**: Clear setup and usage instructions
- **Troubleshooting**: Helpful error messages and logs

---

## 6. Implementation Plan

### 6.1 Development Phases

#### Phase 1: Core Backend (Week 1)
- [ ] Set up Node.js/Express backend
- [ ] Implement AWS Bedrock API integration
- [ ] Create basic chat endpoint
- [ ] Add error handling and logging
- [ ] Test with AWS credentials

#### Phase 2: Frontend Interface (Week 1)
- [ ] Create React application with Vite
- [ ] Implement chat UI components
- [ ] Add message display and input handling
- [ ] Integrate with backend API
- [ ] Add loading states and error handling

#### Phase 3: Configuration & Deployment (Week 2)
- [ ] Implement configuration management
- [ ] Add environment variable support
- [ ] Create setup documentation
- [ ] Test local deployment
- [ ] Create backup/restore functionality

#### Phase 4: Testing & Documentation (Week 2)
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Create user documentation
- [ ] Setup troubleshooting guide
- [ ] Final deployment testing

### 6.2 Technical Dependencies

#### 6.2.1 Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "vite": "^6.1.1",
    "@vitejs/plugin-react": "^4.4.1"
  }
}
```

#### 6.2.2 Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@aws-sdk/client-bedrock-runtime": "^3.682.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### 6.3 File Structure
```
bedrock-sonnet-backup/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── ChatInterface.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageInput.jsx
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── bedrock-client.js
│   │   └── config.js
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── SETUP.md
│   ├── USAGE.md
│   └── TROUBLESHOOTING.md
└── README.md
```

---

## 7. Success Criteria

### 7.1 Functional Success
- ✅ User can send messages and receive responses from Bedrock Sonnet 4.5
- ✅ Application runs locally without external dependencies
- ✅ Configuration can be completed in under 10 minutes
- ✅ Chat interface is intuitive and responsive
- ✅ Error handling provides clear feedback

### 7.2 Technical Success
- ✅ API response times under 5 seconds
- ✅ Application starts in under 3 seconds
- ✅ Memory usage under 100MB
- ✅ No security vulnerabilities in credential handling
- ✅ Clean, maintainable codebase

### 7.3 User Experience Success
- ✅ Single-user can use system without technical knowledge
- ✅ Clear setup instructions enable quick deployment
- ✅ Intuitive interface requires no training
- ✅ Reliable backup system for primary application
- ✅ Minimal maintenance requirements

---

## 8. Risks and Mitigation

### 8.1 Technical Risks
- **Risk**: AWS credential management complexity
- **Mitigation**: Provide clear documentation and environment variable examples

- **Risk**: Bedrock API changes or deprecation
- **Mitigation**: Use stable API versions and implement version checking

- **Risk**: Regional availability issues
- **Mitigation**: Document alternative regions and fallback options

### 8.2 Operational Risks
- **Risk**: Single point of failure (local deployment)
- **Mitigation**: Provide backup/restore functionality and documentation

- **Risk**: AWS cost overruns
- **Mitigation**: Implement usage monitoring and cost alerts

- **Risk**: Maintenance overhead
- **Mitigation**: Keep system simple and well-documented

---

## 9. Future Considerations

### 9.1 Potential Enhancements
- **Conversation History**: Persistent storage of chat sessions
- **Export Functionality**: Save conversations to files
- **Multiple Models**: Support for other Bedrock models
- **Advanced UI**: Markdown rendering, syntax highlighting
- **Configuration UI**: Web-based configuration interface

### 9.2 Scalability Options
- **Multi-user Support**: Add simple authentication
- **Docker Deployment**: Containerized deployment option
- **Cloud Deployment**: Optional cloud hosting
- **API Gateway**: RESTful API for external integration

---

## 10. Conclusion

This PRD defines a simplified, local-only backup system for AWS Bedrock Sonnet 4.5 Australian model access. The system removes the complexity of the existing comprehensive solution while maintaining core functionality for single-user local deployment.

The proposed solution provides:
- **Simplicity**: Minimal setup and configuration
- **Reliability**: Direct API integration with error handling
- **Performance**: Fast, lightweight application
- **Maintainability**: Clean codebase with clear documentation
- **Backup Purpose**: Reliable alternative to primary system

This system will serve as an effective backup solution while maintaining the ability to access AWS Bedrock Sonnet 4.5 in the Australian region with minimal overhead.
