export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.json({
    auctionStarted: true,
    highestBid: '0.0177',
    highestBidder: '0x0000000000000000000000000000000000000000',
    endTime: Math.floor(Date.now() / 1000) + 86400,
    nftContract: '0x6c5cE10cD5dcE7250f5dF94599Ec6869158E966f',
    nftId: '1',
    seller: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
  });
};
