# Bedrock Simple Chat UI

> **Note**: This is a simplified version of the [AWS Solutions Library Guidance for Secure Chat UI for Amazon Bedrock Agents](https://github.com/aws-solutions-library-samples/guidance-for-a-secure-chat-user-interface-for-amazon-bedrock). This version removes the complexity of AWS Amplify and Cognito authentication in favor of a simple bearer token approach.

## 🎯 What This Is

A simplified React-based chat interface for Amazon Bedrock that uses:
- **Bearer Token Authentication** instead of AWS Cognito
- **Direct Backend API** instead of AWS SDK calls
- **Simple Environment Variables** for configuration
- **No AWS Amplify Dependencies**

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- AWS Bedrock access with a bearer token

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ferneyman/bedrock-simple-chat-ui.git
   cd bedrock-simple-chat-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your AWS Bearer Token
   ```

4. **Add your bearer token to `.env`**:
   ```bash
   AWS_BEARER_TOKEN_BEDROCK=your_actual_bearer_token_here
   ```

5. **Start the application**:
   ```bash
   ./run.sh
   ```

6. **Access the application**:
   - Frontend: http://localhost:8087
   - Backend: http://localhost:8088

## 📁 Project Structure

```
├── src/
│   ├── App.jsx              # Main app component (simplified)
│   ├── ChatComponent.jsx    # Chat interface (uses backend API)
│   ├── ConfigComponent.jsx  # Simple configuration
│   └── js/
│       └── useSpeechToText.jsx
├── backend/
│   └── server.mjs           # Simple Node.js backend
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
└── run.sh                   # Start both servers
```

## 🔧 Configuration

The application uses a simple `.env` file for configuration:

```bash
# AWS Bedrock Configuration
AWS_BEARER_TOKEN_BEDROCK=your_bearer_token_here

# Backend Server Configuration
BACKEND_PORT=8088
FRONTEND_ORIGIN=http://localhost:8087

# Bedrock Model Configuration
BEDROCK_REGION=ap-southeast-2
BEDROCK_MODEL_ID=anthropic.claude-sonnet-4-5-20250929-v1:0
```

## 🛠️ Development

### Available Scripts

- `./run.sh` - Start both frontend and backend servers
- `npm run dev` - Start frontend only (port 8087)
- `npm run backend` - Start backend only (port 8088)
- `npm start` - Start both servers using concurrently

### How It Works

1. **Frontend** (React + Vite) runs on port 8087
2. **Backend** (Node.js) runs on port 8088 and handles Bedrock API calls
3. **Authentication** is handled via bearer token in the backend
4. **Chat Interface** sends HTTP requests to the backend API

## 🔒 Security

- Bearer token is stored in `.env` file (not committed to git)
- Backend handles all AWS API calls
- Frontend only communicates with your backend
- No AWS credentials exposed to the browser

## 📝 Differences from Original

| Original AWS Version | This Simplified Version |
|---------------------|------------------------|
| AWS Amplify hosting | Local development server |
| AWS Cognito authentication | Bearer token authentication |
| AWS SDK in frontend | Backend API calls |
| Complex configuration | Simple `.env` file |
| Multiple AWS services | Just Bedrock API |

## 🤝 Contributing

This is a simplified version for personal use. For the full AWS Solutions Library version with enterprise features, see the [original repository](https://github.com/aws-solutions-library-samples/guidance-for-a-secure-chat-user-interface-for-amazon-bedrock).

## 📄 License

This project is based on the AWS Solutions Library guidance. Please refer to the original repository for licensing information.

## 🔗 Links

- **Original AWS Repository**: https://github.com/aws-solutions-library-samples/guidance-for-a-secure-chat-user-interface-for-amazon-bedrock
- **AWS Bedrock Documentation**: https://docs.aws.amazon.com/bedrock/