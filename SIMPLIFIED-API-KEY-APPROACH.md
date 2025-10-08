# Simplified API Key Approach
## AWS Bedrock Sonnet 4.5 Australian Local-Only System

**Version:** 1.0  
**Date:** January 2025  
**Approach:** Single API Key / Bearer Token Authentication  

---

## 🎯 Why This Approach is Better

### ✅ **Advantages of API Key Approach:**
- **Simpler Setup**: Just one environment variable (`AWS_API_KEY`)
- **No AWS SDK Complexity**: Direct HTTP API calls
- **No Credential Management**: No access keys, secret keys, or session tokens
- **No Amplify Dependencies**: Pure Node.js/Express backend
- **Faster Development**: Less configuration and setup time
- **Easier Debugging**: Direct HTTP requests are easier to troubleshoot
- **Better Security**: Single token instead of multiple credentials
- **Local-First**: Perfect for single-user local deployment

### ❌ **What We're Avoiding:**
- Complex AWS credential management
- AWS SDK initialization and configuration
- Cognito authentication flows
- Temporary credential refresh logic
- Multiple environment variables
- AWS Amplify dependencies

---

## 🏗️ Simplified Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Local Development Environment                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    HTTP/JSON    ┌──────────────────┐      │
│  │   Frontend      │◄────────────────►│   Backend        │      │
│  │   (React/Vite)  │                 │   (Node.js/      │      │
│  │   Port: 5174    │                 │    Express)      │      │
│  │                 │                 │   Port: 3001     │      │
│  └─────────────────┘                 └──────────────────┘      │
│           │                                 │                   │
│           │                                 │ Direct HTTP       │
│           │                                 ▼                   │
│           │                        ┌──────────────────┐         │
│           │                        │   AWS Bedrock    │         │
│           │                        │   Runtime API    │         │
│           │                        │   (ap-southeast-2)│         │
│           │                        │   Bearer Token   │         │
│           │                        └──────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### 1. Environment Configuration
```bash
# .env file - Just 2 variables needed!
AWS_REGION=ap-southeast-2
AWS_API_KEY=your-bearer-token-here

# Optional application settings
PORT=3001
FRONTEND_PORT=5174
```

### 2. Backend Implementation
```javascript
// services/bedrock-client.js
const invokeModel = async (prompt, conversationHistory) => {
  const response = await fetch('https://bedrock-runtime.ap-southeast-2.amazonaws.com/model/anthropic.claude-3-5-sonnet-20241022-v2:0/invoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AWS_API_KEY}`,
      'X-Amz-Target': 'BedrockRuntime.InvokeModel'
    },
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4000,
      messages: conversationHistory.concat([{
        role: 'user',
        content: prompt
      }])
    })
  });

  if (!response.ok) {
    throw new Error(`Bedrock API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};
```

### 3. Dependencies (Minimal)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

**No AWS SDK needed!** Just standard Node.js fetch API.

---

## 🚀 Setup Process

### Step 1: Get Your API Key
1. Go to AWS Console → Bedrock → API Keys
2. Create a new API key for Bedrock access
3. Copy the bearer token

### Step 2: Environment Setup
```bash
# Create .env file
echo "AWS_REGION=ap-southeast-2" > .env
echo "AWS_API_KEY=your-actual-api-key-here" >> .env
```

### Step 3: Start Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**That's it!** No complex AWS configuration needed.

---

## 🔒 Security Considerations

### ✅ **Security Benefits:**
- **Single Token**: Easier to manage and rotate
- **No Long-term Credentials**: API keys can be short-lived
- **Local Storage**: Token stays on your local machine
- **No Network Exposure**: No credential exchange over network
- **Simple Rotation**: Just update one environment variable

### 🛡️ **Best Practices:**
- Store API key in `.env` file (never commit to git)
- Use `.env.example` for documentation
- Rotate API key regularly
- Use least-privilege permissions
- Monitor API key usage

---

## 📋 Updated Implementation Checklist

### Backend Tasks (Simplified)
- [ ] Create Express server with CORS
- [ ] Implement direct HTTP API calls to Bedrock
- [ ] Add single environment variable validation
- [ ] Create chat endpoint
- [ ] Add error handling
- [ ] Test with API key

### Frontend Tasks (Unchanged)
- [ ] Create React chat interface
- [ ] Implement message display
- [ ] Add input form
- [ ] Connect to backend API
- [ ] Add loading states
- [ ] Style with CSS

### Configuration Tasks (Simplified)
- [ ] Create `.env.example` file
- [ ] Document API key setup
- [ ] Add configuration validation
- [ ] Create setup instructions

---

## 🎯 Benefits Summary

| Aspect | Complex AWS SDK | Simple API Key |
|--------|----------------|----------------|
| **Setup Time** | 30+ minutes | 5 minutes |
| **Environment Variables** | 4+ variables | 2 variables |
| **Dependencies** | AWS SDK + others | Just Express |
| **Configuration** | Complex credential setup | Single API key |
| **Debugging** | SDK-specific errors | Standard HTTP errors |
| **Security** | Multiple credentials | Single token |
| **Maintenance** | SDK updates, credential rotation | Just token rotation |

---

## 🚀 Next Steps

1. **Update Implementation Plan** to use API key approach
2. **Create simplified backend** with direct HTTP calls
3. **Test with real API key** from AWS Bedrock
4. **Document setup process** for single API key
5. **Deploy and test** the simplified system

This approach will give you a **much simpler, faster, and more maintainable** backup system for your AWS Bedrock Sonnet 4.5 Australian access!


