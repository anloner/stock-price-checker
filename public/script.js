document.getElementById('testForm2').addEventListener('submit', e => {
  e.preventDefault(); // Formun varsayılan gönderme işlemini engeller
  const stock = e.target[0].value; // Formdaki ilk input alanından hisse senedi sembolünü alır
  const checkbox = e.target[1].checked; // İkinci input (checkbox) alanının seçili olup olmadığını kontrol eder
  fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`) // API'ye hisse senedi sembolü ve like bilgisiyle GET isteği gönderir
    .then(res => res.json()) // Gelen yanıtı JSON formatına dönüştürür
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data); // Yanıtı ekrana JSON formatında yazdırır
    });
});

document.getElementById('testForm').addEventListener('submit', e => {
  e.preventDefault(); // Formun varsayılan gönderme işlemini engeller
  const stock1 = e.target[0].value; // İlk input alanından birinci hisse senedi sembolünü alır
  const stock2 = e.target[1].value; // İkinci input alanından ikinci hisse senedi sembolünü alır
  const checkbox = e.target[2].checked; // Üçüncü input (checkbox) alanının seçili olup olmadığını kontrol eder
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`) // API'ye iki hisse senedi sembolü ve like bilgisiyle GET isteği gönderir
    .then(res => res.json()) // Gelen yanıtı JSON formatına dönüştürür
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data); // Yanıtı ekrana JSON formatında yazdırır
    });
});

// Yeni ekleme: JSON verisini daha okunabilir hale getirmek için pretty print ekleyelim
document.getElementById('testForm2').addEventListener('submit', e => {
  e.preventDefault();
  const stock = e.target[0].value;
  const checkbox = e.target[1].checked;
  fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data, null, 2); // Daha okunabilir format
    });
});

document.getElementById('testForm').addEventListener('submit', e => {
  e.preventDefault();
  const stock1 = e.target[0].value;
  const stock2 = e.target[1].value;
  const checkbox = e.target[2].checked;
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data, null, 2); // Daha okunabilir format
    });
});
