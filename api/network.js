export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.json({
    chainId: '0xc488',
    chainName: 'Somnia Testnet (Shannon)',
    nativeCurrency: {
      name: 'STT',
      symbol: 'STT',
      decimals: 18
    },
    rpcUrls: ['https://dream-rpc.somnia.network/'],
    blockExplorerUrls: ['https://shannon-explorer.somnia.network/']
  });
};
