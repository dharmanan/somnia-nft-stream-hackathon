import { SDK, SchemaEncoder } from '@somnia-chain/streams';

// Initialize SDS SDK
let sdsSDK = null;
let schemaEncoder = null;

const initializeSDS = async () => {
  if (sdsSDK) return;
  try {
    sdsSDK = new SDK({
      rpcUrl: 'https://dream-rpc.somnia.network/'
    });
    schemaEncoder = new SchemaEncoder();
  } catch (error) {
    console.error('Failed to initialize SDS:', error);
  }
};

await initializeSDS();

const SUPPORTED_SCHEMAS = {
  BID_PLACED: {
    name: 'BID_PLACED',
    schema: 'uint256 auctionId, address bidder, uint256 bidAmount, uint256 timestamp',
    id: '0xdbc461f2979180da401d5fa5f646a62c0b862dd8128fec16258714b900c705ee'
  },
  AUCTION_STARTED: {
    name: 'AUCTION_STARTED',
    schema: 'uint256 auctionId, address seller, uint256 startTime, uint256 endTime',
    id: '0xdbc461f2979180da401d5fa5f646a62c0b862dd8128fec16258714b900c705ee'
  }
};

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = req;

  if (pathname === '/api/sds/status' && req.method === 'GET') {
    return res.json({
      sds_initialized: sdsSDK !== null,
      schema_encoder_ready: schemaEncoder !== null,
      supported_schemas: Object.keys(SUPPORTED_SCHEMAS)
    });
  }

  if (pathname === '/api/sds/schemas' && req.method === 'GET') {
    const schemas = Object.entries(SUPPORTED_SCHEMAS).map(([key, value]) => ({
      name: value.name,
      schema: value.schema,
      id: value.id
    }));
    return res.json(schemas);
  }

  if (pathname === '/api/sds/publish-event' && req.method === 'POST') {
    const { eventType, data } = req.body;
    
    if (!SUPPORTED_SCHEMAS[eventType]) {
      return res.status(400).json({ error: `Unsupported event type: ${eventType}` });
    }

    const schema = SUPPORTED_SCHEMAS[eventType];
    
    const publishedEvent = {
      event_type: eventType,
      schema_id: schema.id,
      encoded_data: JSON.stringify(data),
      timestamp: Date.now(),
      status: 'published'
    };

    return res.json(publishedEvent);
  }

  res.status(404).json({ error: 'Not found' });
};
