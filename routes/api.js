'use strict';
const axios = require('axios');
const crypto = require('crypto');

// Like işlemlerini saklamak için basit bir nesne
const stockLikes = {};

function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;

      if (!stock) {
        return res.json({ error: 'Stock symbol is required' });
      }

      const stocks = Array.isArray(stock) ? stock : [stock];
      const stockData = [];

      for (const symbol of stocks) {
        let stockPrice;
        try {
          const response = await axios.get(
            `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
          );
          stockPrice = response.data.latestPrice;
        } catch (error) {
          return res.json({ error: 'Failed to fetch stock data' });
        }

        const ip = anonymizeIP(req.ip);

        if (!stockLikes[symbol]) {
          stockLikes[symbol] = { likes: new Set() };
        }

        if (like === 'true' && !stockLikes[symbol].likes.has(ip)) {
          stockLikes[symbol].likes.add(ip);
        }

        stockData.push({
          stock: symbol,
          price: stockPrice,
          likes: stockLikes[symbol].likes.size,
        });
      }

      if (stockData.length === 2) {
        const relLikes = stockData[0].likes - stockData[1].likes;
        stockData[0].rel_likes = relLikes;
        stockData[1].rel_likes = -relLikes;
        delete stockData[0].likes;
        delete stockData[1].likes;
      }

      res.json({
        stockData: stockData.length === 1 ? stockData[0] : stockData,
      });
    });
};
