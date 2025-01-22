'use strict';
const axios = require('axios'); // Hisse senedi fiyatlarını çekmek için
const { v4: uuidv4 } = require('uuid'); // IP adreslerini anonimleştirmek için

// Like işlemlerini saklamak için basit bir nesne
const stockLikes = {};

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;

      // Hisse senedi sembolünü kontrol et
      if (!stock) {
        return res.json({ error: 'Stock symbol is required' });
      }

      // Birden fazla hisse senedi sembolü varsa (örneğin, "GOOG,MSFT")
      const stocks = stock.split(',');

      // Hisse senedi fiyatlarını çek
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

        // IP adresini anonimleştir
        const ip = req.ip;
        const hashedIp = uuidv4(); // IP adresini UUID ile anonimleştir

        // Like işlemini yönet
        if (!stockLikes[symbol]) {
          stockLikes[symbol] = { likes: new Set() }; // Her hisse senedi için like'ları sakla
        }

        if (like === 'true' && !stockLikes[symbol].likes.has(hashedIp)) {
          stockLikes[symbol].likes.add(hashedIp); // Like ekle
        }

        // Hisse senedi verisini hazırla
        stockData.push({
          stock: symbol,
          price: stockPrice,
          likes: stockLikes[symbol].likes.size,
        });
      }

      // İki hisse senedi karşılaştırılıyorsa, rel_likes ekle
      if (stockData.length === 2) {
        const relLikes = stockData[0].likes - stockData[1].likes;
        stockData[0].rel_likes = relLikes;
        stockData[1].rel_likes = -relLikes;
        delete stockData[0].likes;
        delete stockData[1].likes;
      }

      // Yanıtı hazırla
      res.json({
        stockData: stockData.length === 1 ? stockData[0] : stockData,
      });
    });
};