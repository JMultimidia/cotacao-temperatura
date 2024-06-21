$(document).ready(function() {
  const apiKeyWeather = '';
  const apiKeyCurrency = '';
  const locationTime = '-6.3604399,-39.3305494';
  const locationMoney = 'Guarany';
  const currencyBase = 'PYG'; // Use Guarani (PYG) como base para conversão
  // Tentativa de formatar a data diretamente para o formato desejado
  const options = {
    weekday: 'short', // Exemplo: 'dom', 'seg', etc.
    //year: 'numeric',
    //month: 'short', // Exemplo: 'ene', 'feb', etc.
    day: 'numeric'
};

  function fetchWeather() {
      $.getJSON(`https://api.weatherapi.com/v1/current.json?key=${apiKeyWeather}&q=${locationTime}&lang=es`, function(data) {
          const temperaturaInteira = Math.floor(data.current.temp_c);
          $('#temperatura').text(`${temperaturaInteira}°C`);
          $('#weather-icon').html(`<img src="${data.current.condition.icon}">`);
          $('.wtoday .wic').addClass(`wic-${data.current.condition.code}`);
      });

      $.getJSON(`https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeather}&q=${locationMoney}&days=4&lang=es&tp=24`, function(data) {
          let forecastHtml = '';
          data.forecast.forecastday.forEach(day => {
            const temperaturaMinInteira = Math.floor(day.day.mintemp_c);
            const temperaturaMaxInteira = Math.floor(day.day.maxtemp_c);

            const formattedDate = new Date(day.date).toLocaleDateString('es-ES', options);

            forecastHtml += `
                <div class="wheater">
                    <div class="date">${formattedDate}</div>
                    <div class="icon"><img src="${day.day.condition.icon}"></div>
                    <div class="temp d-flex justify-content-center align-items-center">
                        <span class="num me-2">${temperaturaMinInteira}°</span>
                        <span class="num">${temperaturaMaxInteira}°</span>
                    </div>
                    <div class="temp-min-max d-flex justify-content-center align-items-center">
                        <span class="min-max me-2">min</span>
                        <span class="min-max">max</span>
                    </div>
                </div>
              `;
          });
          //console.log(forecastHtml);
          $('#wheater-week').html(forecastHtml);
      });
  }

  function fetchCurrencyRates() {
      $.getJSON(`https://api.exchangerate-api.com/v4/latest/${currencyBase}`, function(data) {
          const rates = data.rates;
          const currencyData = {
            'USD': { buy: (1 / rates['USD']), sell: (1 / rates['USD']) * 1.030 },
            'EUR': { buy: (1 / rates['EUR']), sell: (1 / rates['EUR']) * 1.025 },
            'ARS': { buy: (1 / rates['ARS']), sell: (1 /rates['ARS']) * 1.075 },
            'BRL': { buy: (1 / rates['BRL']), sell: (1 / rates['BRL']) * 1.015 }
          };

          const currencies = ['USD', 'EUR', 'ARS', 'BRL'];
          let cotacoesHtml = '';
          let cotacoesAllHtml = '';

          currencies.forEach(currency => {
              const flag = getFlag(currency);
              //const buyRate = (1 / rates[currency]).toFixed(2);
              //const sellRate = (buyRate * 1.03).toFixed(2); // Supondo que a margem de venda é de 3%
              const buyRate = currencyData[currency].buy;
              const sellRate = currencyData[currency].sell;

              const formattedBuyRate = buyRate.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              const formattedSellRate = sellRate.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
                    <div class="buy">Venta</div>
                  </div>
              `;
          });

          $('.cur .slick-slider').html(cotacoesHtml);
          $('.cur .slick-slider').slick({
              vertical: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              arrows: false,
              autoplaySpeed: 3000
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

  $('.coll-clima').click(function() {
      $('#cotizaciones').collapse('hide');
  });

  $('.coll-cotizaciones').click(function() {
      $('#clima').collapse('hide');
  });
});
