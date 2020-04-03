var opcion = "todos";
var maxdate = "20/02/2020";
var tipografico = "total";
var casosdiarios = [];
var fallecidosdiarios = [];
var recuperadosdiarios = [];
document.addEventListener("DOMContentLoaded", function (event) {
  llenarfechas();
  select();
  leerJSON();
  document.getElementById("select").addEventListener("change", select);
  document.getElementById("fechas").addEventListener("change", fechas);
  document.getElementById("grafico").addEventListener("change", cambiargrafico);
})
function grafico(fecha, casos, fallecidos, recuperados) {
  Chart.defaults.global.defaultFontColor = 'white';
  Chart.defaults.global.defaultFontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fecha,
      datasets: [{
        label: 'fallecidos',
        data: fallecidos,
        backgroundColor: [
          'rgba(236, 228, 39, .7)'
        ],
        borderColor: [
          'rgba(236, 228, 39, .7)',
        ],
        borderWidth: 1
      }, {
        label: 'recuperados',
        data: recuperados,
        backgroundColor: [
          '#a6b1e1'
        ],
        borderColor: [
          '#a6b1e1',
        ],
        borderWidth: 1
      }, {
        label: 'casos',
        data: casos,
        backgroundColor: [
          '#d7385e'
        ],
        borderColor: [
          '#d7385e',
        ],
        borderWidth: 1
      },]
    },
    options: {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false,
        position: "nearest",
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            var dataset = chart.config.data.datasets[tooltipItem.datasetIndex];
            return {
              backgroundColor: dataset.backgroundColor
            }
          }
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true
          },
        }]
      }
    }
  });
}

//select
function select() {
  if (this.options != undefined) {
    opcion = this.options[this.selectedIndex].value;
  }
  leerJSON()
}

//fechas
function fechas() {
  if (this.options != undefined) {
    maxdate = this.options[this.selectedIndex].value;
  }
  leerJSON()
}

//grafico
function cambiargrafico() {
  if (this.options != undefined) {
    tipografico = this.options[this.selectedIndex].value;
  }
  leerJSON()
}

function llenarfechas() {
  $.ajax({
    url: 'https://raw.githubusercontent.com/sergio9929/COVID-19/master/csvjson.json', //escribe el nombre del archivo
    dataType: 'json',

    success: function (a) {
      maxdate = a[a.length - 1].Fecha;
      for (let i = a.length - 1; i > 0; i--) {
        if (a[i]["CCAA Codigo ISO"] == "RI") {
          document.getElementById("fechas").innerHTML += "<option value=\"" + a[i].Fecha + "\">" + a[i].Fecha + "</option>;"
        }
      }
    },
    error: function (xhr) {
      alert("An AJAX error occured: " + xhr.status + " " + xhr.statusText);
    }
  });
}
//esta diseñado para convertir cualquier json en una tabla
function leerJSON() {

  $.ajax({
    url: 'csvjson.json', //escribe el nombre del archivo
    dataType: 'json',

    success: function (a) {
      var displaytotal = "";
      var fecha = []
      var casos = []
      var fallecidos = []
      var recuperados = []
      var sumacasos = 0;
      var sumafallecidos = 0;
      var sumarecuperados = 0;

      //fill table head
      var head = "<tr>";
      for (let j = 0; j < Object.keys(a[0]).length; j++) {
        var nombre = Object.keys(a[0])[j];
        head += "<th>" + nombre + "</th>";
      }
      head += "</tr>";

      //fill table body
      var body = "";
      for (let i = 0; i < a.length; i++) {
        if (tipografico == "total") {
          body += "<tr>";
          if (a[i].Fecha == maxdate) {
            if (opcion == a[i]["CCAA Codigo ISO"]) {
              for (let j = 0; j < Object.keys(a[i]).length; j++) {
                var nomficha = Object.keys(a[i])[j];
                body += "<td>" + a[i][nomficha] + "</td>";
              }
            } else if (opcion == "todos") {
              for (let j = 0; j < Object.keys(a[i]).length; j++) {
                var nomficha = Object.keys(a[i])[j];
                body += "<td>" + a[i][nomficha] + "</td>";
              }
            }
          }
          body += "</tr>";
        } else {
          if (opcion == "todos") {
            provincias = document.getElementById("select").options;
            if (a[i].Fecha == maxdate) {
              let q1 = a[i].Casos - a[i - 19].Casos;
              let q2=a[i].Fallecidos-a[i-19].Fallecidos;
              let q3=a[i].Recuperados-a[i-19].Recuperados;
              body += "<tr><td>" + a[i]["CCAA Codigo ISO"] + "</td><td>" + a[i].Fecha + "</td><td>" + q1 + "</td><td></td><td></td><td>" + q2 + "</td><td>" + q3 + "</td></tr>";
            }
          }
        }
        if (opcion == a[i]["CCAA Codigo ISO"]) {
          fecha.push(a[i].Fecha);
          casos.push(a[i].Casos);
          fallecidos.push(a[i].Fallecidos);
          recuperados.push(a[i].Recuperados);
        } else if (opcion == "todos") {

          //Eliminar NaN
          if (a[i].Casos > 0) {
            sumacasos += a[i].Casos;
          }
          if (a[i].Fallecidos > 0) {
            sumafallecidos += a[i].Fallecidos;
          }
          if (a[i].Recuperados > 0) {
            sumarecuperados += a[i].Recuperados;
          }

          //suma
          if (a[i]["CCAA Codigo ISO"] == "RI") {
            fecha.push(a[i].Fecha);
            casos.push(sumacasos);
            fallecidos.push(sumafallecidos);
            recuperados.push(sumarecuperados);
            if (maxdate == a[i].Fecha && sumacasos > 0 && tipografico == "total") {
              displaytotal = "<tr><th>TOTAL</th><td></td><td>" + sumacasos + "</td><td></td><td></td><td>" + sumafallecidos + "</td><td>" + sumarecuperados + "</td></tr>";
            }
            sumacasos = 0;
            sumafallecidos = 0;
            sumarecuperados = 0;
          }
        }
      }

      if (tipografico == "diario") {
        for (let i = 0; i < fecha.length; i++) {
          casosdiarios[i] = casos[i] - casos[i - 1];
          recuperadosdiarios[i] = recuperados[i] - recuperados[i - 1];
          fallecidosdiarios[i] = fallecidos[i] - fallecidos[i - 1];
          if (maxdate == fecha[i]) {
            if (opcion != "todos") {
              body += "<tr><td>" + opcion + "</td><td>" + fecha[i] + "</td><td>" + casosdiarios[i] + "</td><td></td><td></td><td>" + fallecidosdiarios[i] + "</td><td>" + recuperadosdiarios[i] + "</td></tr>";
            } else {
              displaytotal = "<tr><th>TOTAL</th><td></td><td>" + casosdiarios[i] + "</td><td></td><td></td><td>" + fallecidosdiarios[i] + "</td><td>" + recuperadosdiarios[i] + "</td></tr>";
            }
          }
        }

        casos = casosdiarios;
        fallecidos = fallecidosdiarios;
        recuperados = recuperadosdiarios;
      }

      //display
      document.getElementById("chartContent").innerHTML = "<canvas class=\"mb-3\" id=\"myChart\"></canvas>";
      document.getElementById("table").innerHTML = head + body + "<tr class=\"bg-dark\"><td colspan=\"7\"></td></tr>" + displaytotal;
      grafico(fecha, casos, fallecidos, recuperados);
    },
    error: function (xhr) {
      alert("An AJAX error occured: " + xhr.status + " " + xhr.statusText);
    }
  });
}
