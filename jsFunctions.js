console.log("hola")
const csvPath = "https://raw.githubusercontent.com/rubenfcasal/COVID-19/master/serie_historica_acumulados.csv";
var opcion = "todos";
var maxdate = "20/02/2020";
var tipografico = "total";
document.addEventListener("DOMContentLoaded", function (event) {
  llenarfechas();
  habilitarbotones()
})
function habilitarbotones() {
  $("#grafico a").on("click", function (e) {
    $("#graficoboton").text(this.text);
    tipografico = this["name"]
    leerJSON()
  });
  $("#select a").on("click", function (e) {
    $("#selectboton").text(this.text);
    opcion = this["text"]
    this["name"] == "todos" ? opcion = this["name"] : opcion = this["text"]
    leerJSON()
  });
  $("#fechas a").on("click", function (e) {
    $("#fechasboton").text(this.text);
    maxdate = this["name"]
    leerJSON()
  });
}

function grafico(fecha, casos, fallecidos, recuperados, activos) {
  Chart.defaults.global.defaultFontColor = '#CCCCCC';
  Chart.defaults.global.defaultFontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fecha,
      datasets: [{
        label: 'fallecidos',
        data: fallecidos,
        backgroundColor: 'rgba(255,200,0,.7)',
        borderColor: 'rgba(255,200,0,.7)',
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 4,
      }, {
        label: 'recuperados',
        data: recuperados,
        backgroundColor: 'rgba(40,189,229,.7)',
        borderColor: 'rgba(40,189,229,.7)',
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 4,
      }, {
        label: 'activos',
        data: activos,
        backgroundColor: '#d7385e',
        borderColor: '#d7385e',
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 4,
      }, {
        label: 'casos',
        data: casos,
        borderColor: '#d7385e',
        backgroundColor: 'rgba(0, 0, 0,.15)',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 4,
      },]
    },
    options: {
      responsive: true,
      tooltips: {
        enabled: false,
        mode: 'index',
        intersect: false,
        position: "nearest",

        custom: function (tooltipModel) {
          // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add('no-transform');
          }

          function getBody(bodyItem) {
            return bodyItem.lines;
          }

          // Set Text
          if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            var bodyLines = tooltipModel.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function (title) {
              innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function (body, i) {
              var colors = tooltipModel.labelColors[i];
              var style = 'background:' + colors.backgroundColor;
              style += '; border-color:' + colors.borderColor;
              style += '; border-width: 2px';
              var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
              innerHtml += '<tr><td>' + span + body + '</td></tr>';
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
          }

          // `this` will be the overall tooltip
          var position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          // tooltipEl.style.left = window.innerWidth - tooltipModel.width - 25 + 'px';
          // let keke = (window.innerWidth - tooltipModel.caretX - 35) * -1 + tooltipModel.width / 2;
          // if (keke > 0) { keke = 0 }
          // tooltipEl.style.transform = 'translate(' + keke + 'px, 0)';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.x + 'px';
          tooltipEl.style.transform = 'translate(0%, 0)';
          // console.log(tooltipModel.caretX + " " + tooltipModel.x)
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              if (value != 0 && values[0] >= 8000 || values[0] <= -8000) {
                value = value / 1000
                value += 'K'
              } else if (value >= 1000000) {
                value = value / 1000000
                value += 'M'
              }
              return value;
            }
          }
        }],
        xAxes: [{
          display: true
        }]
      }
    }
  });
}

function llenarfechas() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", csvPath, false);
  rawFile.overrideMimeType("text/html; charset=latin1");
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200 || rawFile.status == 0) {
      var a = csvObject(rawFile.responseText);
      maxdate = a[a.length - 8].fecha;
      for (let i = a.length - 1; i > 0; i--) {
        if (a[i].ccaa == "RI") {
          document.getElementById("fechas").innerHTML += "<a class=\"dropdown-item\" href=\"#\" name=\"" + a[i].fecha + "\">" + a[i].fecha + "</a>";
        }
      }
      habilitarbotones()
      document.getElementById("fechasboton").innerHTML = maxdate;
      leerJSON();
    }
  }
  rawFile.send(null);
}

function csvObject(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

  //correccion
  headers[0] = "ccaa";
  for (let i = 1; i < headers.length; i++) {
    if (i > 0) {
      headers[i] = headers[i].trim().toLowerCase();
    }
  }

  for (let i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    //correccion
    // if (currentline[0].startsWith("NOTA")) {
    //   i = lines.length - 1;
    if (currentline[1] == 0) {
      obj[headers[0]] = currentline[0];
    } else {
      for (let j = 0; j < headers.length; j++) {
        if (j == 0 || j == 1) {
          obj[headers[j]] = currentline[j];
        } else {
          obj[headers[j]] = parseInt(currentline[j]);
        }

        if (currentline[j] == 0) {
          obj[headers[j]] = 0;
        }
      }
    }

    result.push(obj);
  }

  return result; //JavaScript object
}

//esta diseñado para convertir cualquier json en una tabla
function leerJSON() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", csvPath, false);
  rawFile.overrideMimeType("text/html; charset=latin1");
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200 || rawFile.status == 0) {
      var a = csvObject(rawFile.responseText);
      var displaytotal = "";
      var fecha = []
      var casos = { cantidad: [], suma: 0, diarios: [] }
      var fallecidos = { cantidad: [], suma: 0, diarios: [] }
      var recuperados = { cantidad: [], suma: 0, diarios: [] }
      var hospitalizados = { cantidad: [], suma: 0, diarios: [] }
      var uci = { cantidad: [], suma: 0, diarios: [] }
      var activos = { cantidad: [], suma: 0, diarios: [] }
      var pcr = { cantidad: [], suma: 0, diarios: [] }
      var testac = { cantidad: [], suma: 0, diarios: [] }
      var casoscorregidos = { cantidad: [], suma: 0, diarios: [] }
      var activoscorregidos = { cantidad: [], suma: 0, diarios: [] }

      //fill table head
      head = "<tr><td class='font-weight-bold'>CCAA</td><td class='font-weight-bold'>Fechas</td><td class='font-weight-bold dark'>Casos</td><td class='font-weight-bold red'>Activos</td><td class='font-weight-bold dark'>PCR+</td><td class='font-weight-bold dark'>TestAc+</td><td class='font-weight-bold'>Hospitalizados</td><td class='font-weight-bold'>UCI</td><td class='font-weight-bold yellow'>Fallecidos</td><td class='font-weight-bold blue'>Recuperados</td></tr>";

      //fill table body
      var body = "";
      for (let i = 0; i < a.length; i++) {

        //String to Date
        if (a[i].fecha) {
          var pd1 = a[i].fecha.split("/")
          var pd2 = new Date(pd1[2], pd1[1] - 1, pd1[0])
          var pd3 = new Date("2020", "4" - 1, "28")
        }

        a[i].ccaa = renombrar(a[i].ccaa);
        if (tipografico == "total") {
          if (a[i].fecha == maxdate) {
            if (opcion == a[i].ccaa) {
              var q = a[i].casos + a[i]["pcr+"] + a[i]["testac+"] - a[i].fallecidos - a[i].recuperados;
              body += "<tr><td>" + a[i].ccaa + "</td><td>" + a[i].fecha + "</td><td class='dark'>" + a[i].casos + "</td><td class='red'>" + q + "</td><td class='dark'>" + a[i]["pcr+"] + "</td><td class='dark'>" + a[i]["testac+"] + "</td><td>" + a[i].hospitalizados + "</td><td>" + a[i].uci + "</td><td class='yellow'>" + a[i].fallecidos + "</td><td class='blue'>" + a[i].recuperados + "</td></tr>";
            } else if (opcion == "todos") {
              var q = a[i].casos + a[i]["pcr+"] + a[i]["testac+"] - a[i].fallecidos - a[i].recuperados;
              body += "<tr><td>" + a[i].ccaa + "</td><td>" + a[i].fecha + "</td><td class='dark'>" + a[i].casos + "</td><td class='red'>" + q + "</td><td class='dark'>" + a[i]["pcr+"] + "</td><td class='dark'>" + a[i]["testac+"] + "</td><td>" + a[i].hospitalizados + "</td><td>" + a[i].uci + "</td><td class='yellow'>" + a[i].fallecidos + "</td><td class='blue'>" + a[i].recuperados + "</td></tr>";
            }
          }
        } else {
          if (opcion == "todos") {
            provincias = document.getElementById("select").options;
            if (a[i].fecha == maxdate && i > 18) {
              let q1 = a[i].casos - a[i - 19].casos;
              let q3 = a[i].hospitalizados - a[i - 19].hospitalizados;
              let q4 = a[i].uci - a[i - 19].uci;
              let q5 = a[i].fallecidos - a[i - 19].fallecidos;
              let q6 = a[i].recuperados - a[i - 19].recuperados;
              let q7 = a[i]["pcr+"] - a[i - 19]["pcr+"];
              let q8 = a[i]["testac+"] - a[i - 19]["testac+"];
              let q2 = q1 + q7 + q8 - q5 - q6;
              body += "<tr><td>" + a[i].ccaa + "</td><td>" + a[i].fecha + "</td><td class='dark'>" + q1 + "</td><td class='red'>" + q2 + "</td><td class='dark'>" + q7 + "</td><td class='dark'>" + q8 + "</td><td>" + q3 + "</td><td>" + q4 + "</td><td class='yellow'>" + q5 + "</td><td class='blue'>" + q6 + "</td></tr>";
            }
          }
        }

        if (opcion == a[i].ccaa) {
          fecha.push(a[i].fecha);
          casos.cantidad.push(a[i].casos);
          fallecidos.cantidad.push(a[i].fallecidos);
          recuperados.cantidad.push(a[i].recuperados);
          hospitalizados.cantidad.push(a[i].hospitalizados);
          uci.cantidad.push(a[i].uci);
          activos.cantidad.push(a[i].casos - a[i].fallecidos - a[i].recuperados);
          if (a[i]["pcr+"] == 0) {
            casoscorregidos.cantidad.push(a[i].casos);
            activoscorregidos.cantidad.push(a[i].casos - a[i].fallecidos - a[i].recuperados);
          } else {
            casoscorregidos.cantidad.push(a[i]["pcr+"] + a[i]["testac+"]);
            activoscorregidos.cantidad.push(a[i]["pcr+"] + a[i]["testac+"] - a[i].fallecidos - a[i].recuperados);
          }
          pcr.cantidad.push(a[i]["pcr+"]);
          testac.cantidad.push(a[i]["testac+"]);

        } else if (opcion == "todos") {

          casos.suma += a[i].casos;
          fallecidos.suma += a[i].fallecidos;
          recuperados.suma += a[i].recuperados;
          hospitalizados.suma += a[i].hospitalizados;
          uci.suma += a[i].uci;
          activos.suma += a[i].casos - a[i].fallecidos - a[i].recuperados;
          if (a[i]["pcr+"] == 0) {
            casoscorregidos.suma += a[i].casos;
            activoscorregidos.suma += a[i].casos - a[i].fallecidos - a[i].recuperados;
          } else {
            casoscorregidos.suma += a[i]["pcr+"] + a[i]["testac+"];
            activoscorregidos.suma += a[i]["pcr+"] + a[i]["testac+"] - a[i].fallecidos - a[i].recuperados;
          }
          pcr.suma += a[i]["pcr+"];
          testac.suma += a[i]["testac+"];


          //suma
          if (a[i].ccaa == "La Rioja") {
            fecha.push(a[i].fecha);
            casos.cantidad.push(casos.suma);
            casoscorregidos.cantidad.push(casoscorregidos.suma);
            fallecidos.cantidad.push(fallecidos.suma);
            recuperados.cantidad.push(recuperados.suma);
            hospitalizados.cantidad.push(hospitalizados.suma);
            uci.cantidad.push(uci.suma);
            activos.cantidad.push(activos.suma);
            activoscorregidos.cantidad.push(activoscorregidos.suma);
            pcr.cantidad.push(pcr.suma);
            testac.cantidad.push(testac.suma);


            if (maxdate == a[i].fecha && tipografico == "total") {
              displaytotal = "<tr style='background-color: #1B1E21;'><td colspan=\"10\"></td></tr>"
              displaytotal += "<tr><td class='font-weight-bold'>TOTAL</td><td>" + maxdate + "</td><td class='dark'>" + casos.suma + "</td><td class='red'>" + activoscorregidos.suma + "</td><td class='dark'>" + pcr.suma + "</td><td class='dark'>" + testac.suma + "</td><td>" + hospitalizados.suma + "</td><td>" + uci.suma + "</td><td class='yellow'>" + fallecidos.suma + "</td><td class='blue'>" + recuperados.suma + "</td></tr>";
            }

            casos.suma = 0;
            casoscorregidos.suma = 0;
            fallecidos.suma = 0;
            recuperados.suma = 0;
            hospitalizados.suma = 0;
            uci.suma = 0;
            activos.suma = 0;
            activoscorregidos.suma = 0;
            pcr.suma = 0;
            testac.suma = 0;

          }
        }
      }

      if (tipografico == "diario") {
        for (let i = 0; i < fecha.length; i++) {
          casos.diarios[i] = casos.cantidad[i] - casos.cantidad[i - 1];
          casoscorregidos.diarios[i] = casoscorregidos.cantidad[i] - casoscorregidos.cantidad[i - 1];
          recuperados.diarios[i] = recuperados.cantidad[i] - recuperados.cantidad[i - 1];
          fallecidos.diarios[i] = fallecidos.cantidad[i] - fallecidos.cantidad[i - 1];
          hospitalizados.diarios[i] = hospitalizados.cantidad[i] - hospitalizados.cantidad[i - 1];
          uci.diarios[i] = uci.cantidad[i] - uci.cantidad[i - 1];
          activos.diarios[i] = activos.cantidad[i] - activos.cantidad[i - 1];
          activoscorregidos.diarios[i] = activoscorregidos.cantidad[i] - activoscorregidos.cantidad[i - 1];
          pcr.diarios[i] = pcr.cantidad[i] - pcr.cantidad[i - 1];
          testac.diarios[i] = testac.cantidad[i] - testac.cantidad[i - 1];

          if (maxdate == fecha[i]) {
            if (opcion != "todos") {
              body += "<tr><td>" + opcion + "</td><td>" + fecha[i] + "</td><td class='dark'>" + casos.diarios[i] + "</td><td class='red'>" + activoscorregidos.diarios[i] + "</td><td class='dark'>" + pcr.diarios[i] + "</td><td class='dark'>" + testac.diarios[i] + "</td><td>" + hospitalizados.diarios[i] + "</td><td>" + uci.diarios[i] + "</td><td class='yellow'>" + fallecidos.diarios[i] + "</td><td class='blue'>" + recuperados.diarios[i] + "</td></tr>";
            } else {
              displaytotal = "<tr style='background-color: #1B1E21;'><td colspan=\"10\"></td></tr>"
              displaytotal += "<tr><td class='font-weight-bold'>TOTAL</td><td>" + fecha[i] + "</td><td class='dark'>" + casos.diarios[i] + "</td><td class='red'>" + activoscorregidos.diarios[i] + "</td><td class='dark'>" + pcr.diarios[i] + "</td><td class='dark'>" + testac.diarios[i] + "</td><td>" + hospitalizados.diarios[i] + "</td><td>" + uci.diarios[i] + "</td><td class='yellow'>" + fallecidos.diarios[i] + "</td><td class='blue'>" + recuperados.diarios[i] + "</td></tr>";
            }
          }
        }

        casos.cantidad = casos.diarios;
        casoscorregidos.cantidad = casoscorregidos.diarios;
        fallecidos.cantidad = fallecidos.diarios;
        recuperados.cantidad = recuperados.diarios;
        hospitalizados.cantidad = hospitalizados.diarios;
        uci.cantidad = uci.diarios;
        activos.cantidad = activos.diarios;
        activoscorregidos.cantidad = activoscorregidos.diarios;
        pcr.cantidad = pcr.diarios;
        testac.cantidad = testac.diarios;

      }

      var notas = "<p class='font-weight-bold mt-4'>Notas del Gobierno:</p>";
      for (let i = a.length - 15; i < a.length; i++) {
        if (Object.keys(a[i]).length == 1) {
          notas += "<p>" + a[i].ccaa + "</p>";
        }
      }

      //display
      document.getElementById("chartContent").innerHTML = "<canvas id=\"myChart\"></canvas>";
      document.getElementById("table").innerHTML = head + body + displaytotal;
      document.getElementById("notas").innerHTML = notas;
      grafico(fecha, casoscorregidos.cantidad, fallecidos.cantidad, recuperados.cantidad, activoscorregidos.cantidad);
    }
  }
  rawFile.send(null);
}

function renombrar(a) {
  switch (a) {
    case 'AN':
      a = "Andalucía";
      break;
    case 'AR':
      a = "Aragón";
      break;
    case 'AS':
      a = "Principado de Asturias";
      break;
    case 'IB':
      a = "Islas Baleares";
      break;
    case 'CN':
      a = "Canarias";
      break;
    case 'CB':
      a = "Cantabria";
      break;
    case 'CM':
      a = "Castilla La Mancha";
      break;
    case 'CL':
      a = "Castilla y León";
      break;
    case 'CT':
      a = "Cataluña";
      break;
    case 'CE':
      a = "Ceuta";
      break;
    case 'VC':
      a = "Comunidad Valenciana";
      break;
    case 'EX':
      a = "Extremadura";
      break;
    case 'GA':
      a = "Galicia";
      break;
    case 'MD':
      a = "Comunidad de Madrid";
      break;
    case 'ML':
      a = "Melilla";
      break;
    case 'MC':
      a = "Región de Murcia";
      break;
    case 'NC':
      a = "Comunidad Foral de Navarra";
      break;
    case 'PV':
      a = "País Vasco";
      break;
    case 'RI':
      a = "La Rioja";
  }
  return a;
}