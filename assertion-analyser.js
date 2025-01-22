function objParser(str, init) {
  // Nesne, dizi, string ve fonksiyon argümanlarını ayrıştırır
  var openSym = ['[', '{', '"', "'", '(']; // Açılış sembolleri
  var closeSym = [']', '}', '"', "'", ')']; // Kapanış sembolleri
  var type;
  for (var i = (init || 0); i < str.length; i++) {
    type = openSym.indexOf(str[i]);
    if (type !== -1) break; // Açılış sembolü bulundu
  }
  if (type === -1) return null; // Açılış sembolü bulunamadı
  var open = openSym[type];
  var close = closeSym[type];
  var count = 1; // Açılış sembollerini saymak için sayaç
  for (var k = i + 1; k < str.length; k++) {
    if (open === '"' || open === "'") {
      if (str[k] === close) count--;
      if (str[k] === '\\') k++; // Kaçış karakteri
    } else {
      if (str[k] === open) count++;
      if (str[k] === close) count--;
    }
    if (count === 0) break; // Tüm semboller kapandı
  }
  if (count !== 0) return null; // Dengesiz açılış/kapanış sembolleri
  var obj = str.slice(i, k + 1);
  return {
    start: i,
    end: k,
    obj: obj
  };
}

function replacer(str) {
  // Nesneleri bir sembolle (__#n) değiştirir
  var obj;
  var cnt = 0;
  var data = [];
  while ((obj = objParser(str))) {
    data[cnt] = obj.obj;
    str = str.substring(0, obj.start) + '__#' + cnt++ + str.substring(obj.end + 1);
  }
  return {
    str: str,
    dictionary: data
  };
}

function splitter(str) {
  // Virgüllere göre böl ve nesneleri geri yükle
  var strObj = replacer(str);
  var args = strObj.str.split(',');
  args = args.map(function (a) {
    var m = a.match(/__#(\d+)/);
    while (m) {
      a = a.replace(/__#(\d+)/, strObj.dictionary[m[1]]);
      m = a.match(/__#(\d+)/);
    }
    return a.trim();
  });
  return args;
}

function assertionAnalyser(body) {
  // Assert ifadelerini analiz eder
  if (!body) return "invalid assertion"; // Geçersiz ifade kontrolü

  var body = body.match(/(?:browser\s*\.\s*)?assert\s*\.\s*\w*\([\s\S]*\)/)[0]; // Assert yapısını al
  var s = replacer(body);

  var splittedAssertions = s.str.split('assert');
  var assertions = splittedAssertions.slice(1);

  var assertionBodies = [];
  var methods = assertions.map(function (a, i) {
    var m = a.match(/^\s*\.\s*(\w+)__#(\d+)/);
    assertionBodies.push(parseInt(m[2]));
    var pre = splittedAssertions[i].match(/browser\s*\.\s*/) ? 'browser.' : '';
    return pre + m[1]; // Assert metotlarını al
  });
  if (methods.some(function (m) {
    return !m;
  })) return "invalid assertion";

  var bodies = assertionBodies.map(function (b) {
    return s.dictionary[b].slice(1, -1).trim(); // Parantezleri kaldır
  });

  assertions = methods.map(function (m, i) {
    return {
      method: m, // Metot adı
      args: splitter(bodies[i]) // Argümanları böl
    };
  });
  return assertions;
}

module.exports = assertionAnalyser;
