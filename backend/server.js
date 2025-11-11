import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import { SDSClient } from '@somnia-chain/streams';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

let sdsClient = null;

// Initialize SDS Client
async function initializeSDS() {
  try {
    sdsClient = new SDSClient({
      endpoint: 'https://testnet.somnia.network',
      chainId: 50312
    });
    console.log('SDS Client initialized');
  } catch (error) {
    console.error('Failed to initialize SDS:', error);
  }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);

      if (data.type === 'test_sds') {
        const result = await testSDS();
        ws.send(JSON.stringify({
          type: 'sds_test_result',
          success: result.success,
          message: result.message,
          data: result.data
        }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Test SDS Integration
async function testSDS() {
  try {
    if (!sdsClient) {
      return {
        success: false,
        message: 'SDS client not initialized'
      };
    }

    // Example: Get network info
    const networkInfo = {
      endpoint: 'https://testnet.somnia.network',
      chainId: 50312,
      network: 'Somnia Testnet'
    };

    return {
      success: true,
      message: 'SDS Integration Active',
      data: networkInfo
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// REST endpoint for health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// REST endpoint for SDS test
app.post('/api/test-sds', async (req, res) => {
  const result = await testSDS();
  res.json(result);
});

// Initialize and start server
const PORT = process.env.PORT || 3001;
initializeSDS();
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}`);
});

export default app;
