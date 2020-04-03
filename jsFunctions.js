var opcion="todos";
var maxdate;
document.addEventListener("DOMContentLoaded", function (event) {
  llenarfechas();
  select();
  leerJSON();
  document.getElementById("select").addEventListener("change", select);
  document.getElementById("fechas").addEventListener("change", fechas);
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
          'rgba(	236, 228, 39, .7)'
        ],
        borderColor: [
          'rgba(242, 237, 111, .5)',
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

function llenarfechas() {
  $.ajax({
    url: 'csvjson.json', //escribe el nombre del archivo
    dataType: 'json',

    success: function (a) {
      maxdate = a[a.length-1].Fecha;
      for (let i = a.length-1; i > 0; i--) {
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
          if (a[i].Fecha == maxdate) {
            if (opcion == a[i]["CCAA Codigo ISO"]) {
              if (typeof a[i][nomficha] === "string" && a[i][nomficha].includes("http")) {
                body += "<td><img src=\"" + a[i][nomficha] + "\" class=\"img-fluid\" style=\"height:200px;\"></img></td>";
              } else {
                body += "<td>" + a[i][nomficha] + "</td>";
              }
            } else if (opcion == "todos") {
              if (typeof a[i][nomficha] === "string" && a[i][nomficha].includes("http")) {
                body += "<td><img src=\"" + a[i][nomficha] + "\" class=\"img-fluid\" style=\"height:200px;\"></img></td>";
              } else {
                body += "<td>" + a[i][nomficha] + "</td>";
              }
            }
          }
        }
        body += "</tr>";

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
            sumacasos = 0;
            sumafallecidos = 0;
            sumarecuperados = 0;
          }
        }

      }

      //display
      document.getElementById("chartContent").innerHTML = "<canvas class=\"mb-3\" id=\"myChart\"></canvas>"
      document.getElementById("table").innerHTML = head + body;
      grafico(fecha, casos, fallecidos, recuperados);
    },
    error: function (xhr) {
      alert("An AJAX error occured: " + xhr.status + " " + xhr.statusText);
    }
  });
}
