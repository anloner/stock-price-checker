var analyser = require('./assertion-analyser');
var EventEmitter = require('events').EventEmitter;
var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

var mocha = new Mocha();
var testDir = './tests';

// Test dosyalarını yükle
fs.readdirSync(testDir)
  .filter(function (file) {
    return file.substr(-3) === '.js'; // Sadece .js uzantılı dosyaları seç
  })
  .forEach(function (file) {
    mocha.addFile(path.join(testDir, file)); // Mocha'ya dosyaları ekle
  });

var emitter = new EventEmitter();
emitter.run = function () {
  var tests = []; // Test sonuçlarını saklar
  var context = ""; // Test suite başlıkları için bağlam oluşturur
  var separator = ' -> '; // Başlıklar arasındaki ayırıcı

  try {
    var runner = mocha
      .ui('tdd')
      .run()
      .on('test end', function (test) {
        // Test bitişinde işlemleri gerçekleştir
        var body = test.body.replace(/\/\/.*\n|\/\*.*\*\//g, ''); // Yorumları kaldır
        body = body.replace(/\s+/g, ' '); // Fazladan boşlukları temizle

        var obj = {
          title: test.title, // Testin başlığı
          context: context.slice(0, -separator.length), // Test bağlamı
          state: test.state, // Testin durumu (geçti/başarısız)
          assertions: analyser(body) // Testin analiz edilen assertion'ları
        };
        tests.push(obj); // Test sonuçlarını kaydet
      })
      .on('end', function () {
        emitter.report = tests; // Test raporunu kaydet
        emitter.emit('done', tests); // Rapor tamamlandığında olay yayınla
      })
      .on('suite', function (s) {
        context += s.title + separator; // Suite başlıklarını bağlama ekle
      })
      .on('suite end', function (s) {
        context = context.slice(0, -(s.title.length + separator.length)); // Suite bağlamını geri al
      });
  } catch (e) {
    throw e; // Hataları fırlat
  }
};

module.exports = emitter;
