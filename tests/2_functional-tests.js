'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
const { assert } = chai;

describe('Functional Tests', function () {
  describe('GET /api/stock-prices => stockData object', function () {
    it('Viewing one stock', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices?stock=GOOG')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          done();
        });
    });

    it('Viewing one stock and liking it', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          done();
        });
    });

    it('Viewing the same stock and liking it again', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          done();
        });
    });

    it('Viewing two stocks', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          done();
        });
    });

    it('Viewing two stocks and liking them', function (done) {
      chai
        .request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'rel_likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'rel_likes');
          done();
        });
    });
  });
});
