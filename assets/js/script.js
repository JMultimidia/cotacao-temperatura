$(document).ready(function() {
  const apiKeyWeather = 'e778c017e55e4107b72113247241906';
  const apiKeyCurrency = '142a5e5b485ca9c2c8137632';
  const locationTime = 'Iguatu';
  const locationMoney = 'Guarany';
  const currencyBase = 'PYG'; // Use Guarani (PYG) como base para conversão

  function fetchWeather() {
      $.getJSON(`https://api.weatherapi.com/v1/current.json?key=${apiKeyWeather}&q=${locationTime}&lang=es`, function(data) {
          const temperaturaInteira = Math.floor(data.current.temp_c);
          $('#temperatura').text(`${temperaturaInteira}°C`);
          $('#weather-icon').html(`<img src="${data.current.condition.icon}">`);
          $('.wtoday .wic').addClass(`wic-${data.current.condition.code}`);
      });

      $.getJSON(`https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeather}&q=${locationMoney}&days=7&lang=es`, function(data) {
          let forecastHtml = '';
          data.forecast.forecastday.forEach(day => {
              forecastHtml += `
                  <div class="it">
                      <div class="text">${day.date}</div>
                      <div class="icon"><div class="wic wic-${day.day.condition.code} lnic"></div></div>
                      <div class="temp">
                          <div class="num nmin ts">${day.day.mintemp_c}°C</div>
                          <div class="num nmax ts">${day.day.maxtemp_c}°C</div>
                      </div>
                  </div>
              `;
          });
          $('#weather-week').html(forecastHtml);
      });
  }

  function fetchCurrencyRates() {
      $.getJSON(`https://api.exchangerate-api.com/v4/latest/${currencyBase}`, function(data) {
          const rates = data.rates;
          const currencies = ['USD', 'EUR', 'ARS', 'BRL'];
          let cotacoesHtml = '';
          let cotacoesAllHtml = '';

          currencies.forEach(currency => {
              const flag = getFlag(currency);
              const buyRate = (1 / rates[currency]).toFixed(2);
              const sellRate = (buyRate * 1.03).toFixed(2); // Supondo que a margem de venda é de 3%

              const formattedBuyRate = buyRate.toLocaleString('pt-BR');
              const formattedSellRate = sellRate.toLocaleString('pt-BR');

              cotacoesHtml += `
                  <div class="citem" title="${currency}" tabindex="-1">
                      <span class="ccicon cicon-${currency.toLowerCase()} lnic">${flag}</span>
                      <span class="text">${currency}</span>
                      <span class="cprice cpricec ts">${formattedBuyRate}/${formattedSellRate}</span>
                  </div>
              `;

              cotacoesAllHtml += `
                  <div class="cotacao" tabindex="-1">
                    <div class="ccicon cicon-${currency.toLowerCase()} lnic">${flag}</div>
                    <div class="country">${currency}</div>
                    <div class="cprice cpricec ts">${formattedBuyRate}</div>
                    <div class="buy">Compra</div>
                    <div class="cprice cpricec ts">${formattedSellRate}</div>
                    <div class="buy">Venda</div>
                  </div>
              `;
          });

          $('.cur .slick-slider').html(cotacoesHtml);
          $('.cur .slick-slider').slick({
              vertical: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 2000
          });
          $('#detalhes-cotacoes').html(cotacoesAllHtml);
      });
  }

  function getFlag(currency) {
      const flags = {
          USD: '🇺🇸',
          EUR: '🇪🇺',
          ARS: '🇦🇷',
          BRL: '🇧🇷'
      };
      return flags[currency] || '🏳️';
  }

  fetchWeather();
  fetchCurrencyRates();

  $('#weather-exchange').on('click', function() {
      $('#modal').fadeIn();
  });

  // Fechar modal ao clicar fora do conteúdo do modal
  $(document).on('click', function(event) {
      if ($(event.target).closest('#modal-content').length === 0 && $(event.target).closest('#weather-exchange').length === 0) {
          $('#modal').fadeOut();
      }
  });

  $.simpleWeather({
      location: 'Austin, TX',
      woeid: '',
      unit: 'c',
      success: function(weather) {
          html = '<span>' + weather.city + ' </span><img src="' + weather.thumbnail + '"><span> ' + weather.temp + '&deg;' + weather.units.temp + '</span>';
          $("#weather").html(html);
      },
      error: function(error) {
          $("#weather").html('<p>' + error + '</p>');
      }
  });

  $.simpleWeather({
      location: 'ciudad del este, py',
      woeid: '',
      unit: 'c',
      success: function(weather) {
          for (var i = 4; i < weather.forecast.length; i++) {
              html = '<img class="weather-image" src="' + weather.image + '">' + '<span class="weather-temp"> ' + weather.temp + '&deg;' + weather.units.temp + '</span><span class="weather-date">' + weather.forecast[i].date + '</span><span class="weather-region">' + weather.city + ', ' + weather.country + '</span>';
          }
          html += '<span class="weather-humidity">' + weather.humidity + '%</span> ';
          html += '<span class="weather-wind">' + weather.wind.speed + ' MPH</span>';

          $("#weather-widget").html(html);
      },
      error: function(error) {
          $("#weather-widget").html('<p>' + error + '</p>');
      }
  });

  $('.coll-clima').click(function() {
      $('#cotizaciones').collapse('hide');
  });

  $('.coll-cotizaciones').click(function() {
      $('#clima').collapse('hide');
  });
});
