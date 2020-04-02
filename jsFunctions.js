document.addEventListener("DOMContentLoaded", function (event) {
  leerJSON();

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
          '#f2ed6f'
        ],
        borderColor: [
          '#f2ed6f',
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
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}
//esta diseñado para convertir cualquier json en una tabla
function leerJSON() {

  $.ajax({
    url: 'https://raw.githubusercontent.com/sergio9929/COVID-19/master/covid2demarzo.json', //escribe el nombre del archivo
    dataType: 'json',

    success: function (objeto) {
      var nomobjeto = Object.keys(objeto);
      var a = objeto[nomobjeto];
      var fecha = [];
      var casos = [];
      var fallecidos = [];
      var recuperados = [];
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
        body += "<tr>";
        for (let j = 0; j < Object.keys(a[i]).length; j++) {
          var nomficha = Object.keys(a[i])[j];
          if (typeof a[i][nomficha] === "string" && a[i][nomficha].includes("http")) {
            body += "<td><img src=\"" + a[i][nomficha] + "\" class=\"img-fluid\" style=\"height:200px;\"></img></td>";
          } else {
            body += "<td>" + a[i][nomficha] + "</td>";
          }
        }
        body += "</tr>";

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
          sumacasos = 0;
          sumafallecidos = 0;
          sumarecuperados = 0;
        }
      }

      //display
      document.getElementById("table").innerHTML = head + body;
      grafico(fecha, casos, fallecidos, recuperados);
    },
    error: function (xhr) {
      alert("An AJAX error occured: " + xhr.status + " " + xhr.statusText);
    }
  });
}
