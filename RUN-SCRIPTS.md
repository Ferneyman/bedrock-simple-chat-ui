# Run Scripts Documentation

This project includes several ways to start both the backend and frontend servers simultaneously.

## Quick Start Options

### Option 1: Shell Script (macOS/Linux)
```bash
./run.sh
```

### Option 2: npm Scripts
```bash
# Install dependencies first (includes concurrently package)
npm install

# Start both servers
npm start

# Or start them individually
npm run start:backend  # Backend only (port 8088)
npm run start:frontend # Frontend only (port 8087)
```

## Server Details

- **Frontend**: http://localhost:8087 (Vite dev server)
- **Backend**: http://localhost:8088 (Node.js server)

## Environment Variables

The backend server supports these environment variables:

- `BACKEND_PORT`: Backend server port (default: 8088)
- `FRONTEND_ORIGIN`: Frontend origin for CORS (default: http://localhost:8087)
- `AWS_BEARER_TOKEN_BEDROCK`: AWS Bearer token for Bedrock API
- `BEDROCK_REGION`: AWS region (default: ap-southeast-2)
- `BEDROCK_MODEL_ID`: Bedrock model ID (default: anthropic.claude-sonnet-4-5-20250929-v1:0)
- `BEDROCK_INFERENCE_PROFILE_ID`: Optional inference profile ID
- `BEDROCK_INFERENCE_PROFILE_ARN`: Optional inference profile ARN

## Stopping Servers

- **Shell script**: Press `Ctrl+C` to stop both servers
- **npm start**: Press `Ctrl+C` to stop both servers

## Troubleshooting

1. **Port conflicts**: If ports 8087 or 8088 are in use, stop the conflicting processes or change the ports in the configuration
2. **Node.js not found**: Ensure Node.js and npm are installed and in your PATH
3. **Dependencies**: Run `npm install` if you encounter module not found errors
