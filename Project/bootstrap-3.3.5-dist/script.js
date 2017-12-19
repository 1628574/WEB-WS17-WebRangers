var tableHorizontalIndex = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
var tableVerticalIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];
var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5']
var pointField = ['po1', 'po2', 'po3', 'po4', 'po5']
var scoreUrl = 'http://52.166.12.116:3000/api/highscore';
var shipsUrl = 'http://52.166.12.116:3000/api/ships';
var backgroundColorWater = "#0000ff";
var backgroundColorShip = "#000000";

function start() {
  createTable(1);
  createTable(2);
  getShips(1);
  getShips(2);
  getScore();

  $(document).ready(function() {
    $('#modal-1').modal('show');
  });
}

function createTable(table) {
  var myTable = document.createElement("table");
  myTable.setAttribute("class", "tg");
  for (var i = 0; i < 11; i++) {
    currentRow = document.createElement("tr");
    for (var j = 0; j < 11; j++) {
      currentCell = document.createElement("td");
      if (i == 0 && j == 0) {
        currentText = document.createTextNode("");
      } else if (i == 0) {
        currentText = document.createTextNode(tableHorizontalIndex[j - 1]);
      } else if (j == 0) {
        currentText = document.createTextNode(tableVerticalIndex[i - 1]);
      } else {
        currentCell.id = table + "" + (i - 1) + "" + (j - 1);
        currentCell.setAttribute('onclick', "shootSquare((this.id))");
        currentText = document.createTextNode("");
      }
      currentCell.appendChild(currentText);
      currentRow.appendChild(currentCell);
    }
    myTable.appendChild(currentRow);
  }
  myTable.setAttribute("border", 1);

  node = document.getElementById("hierTabelle" + table);
  node.appendChild(myTable);
}

function setText() {
  var spieler1 = document.getElementById("input1").value;
  var spieler2 = document.getElementById("input2").value;

  document.getElementById("output").innerHTML = spieler1 + " gegen " + spieler2;
}

function getScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', scoreUrl, true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      var array = getData(data);

      printData(array);
    }
  };
  xhttp.send(null);
}

function getData(text) {
  var j = 0;
  var array = [];
  var nameToInsert = 0;
  var pointsA = [];
  var pointsA2 = [];
  var pointsASize = 0;
  var nameInPA = false;
  var arrayPos = 0;
  var arrayPos2 = 0;

  try {
    while (text.highscore[j].name != 'undefined') {
      j++;
    }
  } catch (e) {

  }

  for (var i = 0; i < j; i++) {
    if (text.highscore[i].name != null) {
      array[arrayPos] = text.highscore[i].points + " " + text.highscore[i].name;
      arrayPos++;
    }
  }

  for (var k = 0; k < j; k++) {
    if (text.highscore[k].name != null) {
      pointsA[arrayPos2] = parseInt(text.highscore[k].points);
      arrayPos2++;
      pointsASize++;
    }
  }

  pointsA.sort(function(a, b) {
    return a - b
  });


  for (var g = 0; g < j; g++) {
    if (text.highscore[g].name != null) {

      for (var m = 0; m < j; m++) {
        if (pointsA[g] == text.highscore[m].points) {

          for (var n = 0; n < pointsASize; n++) {
            if (String(pointsA[n]).includes(text.highscore[m].name)) {
              nameInPA = true;
            }
          }
          if (!nameInPA) {
            nameToInsert = m;
            m = j;
          }
        }

      }
      if (!nameInPA) {
        pointsA2[arrayPos2] = pointsA[g] + " " + text.highscore[nameToInsert].name;
        arrayPos2++;
      }
      nameInPa = false;
    }
  }
  pointsA2.splice(0, pointsASize);

  return pointsA2;
}

function printData(array) {
  for (var i = 0; i < array.length && i < textField.length; i++) {
    document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
    document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
  }
}

function getShips(player) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', shipsUrl, true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      printShips(data, player);
    }
  };
  xhttp.send(null);
}

function shootSquare(id) {
  alert("SHOOOOOOT´s fired on " + id + "!");
}


function printShips(data, player) {
  var row = 0;
  var square = 0;

  if (player == 1) {
    for (var i = 100; i <= 199; i++) {

      document.getElementById(i).textContent = data[row][square];
      square++;

      if (square == 10) {
        row++;
        square = 0;
      }
    }

    for (var i = 100; i <= 199; i++) {
      if (document.getElementById(i).textContent == "1") {
        document.getElementById(i).textContent = "";
        document.getElementById(i).style.background = backgroundColorShip;
      }
      if (document.getElementById(i).textContent == "0") {
        document.getElementById(i).textContent = "";
        document.getElementById(i).style.background = backgroundColorWater;
      }
      square++;

      if (square == 10) {
        row++;
        square = 0;
      }
    }
  }

  if (player == 2) {
    for (var i = 200; i <= 299; i++) {

      document.getElementById(i).textContent = data[row][square];
      square++;

      if (square == 10) {
        row++;
        square = 0;
      }
    }

    for (var i = 200; i <= 299; i++) {
      if (document.getElementById(i).textContent == "1") {
        document.getElementById(i).textContent = "";
        document.getElementById(i).style.background = backgroundColorShip;
      }
      if (document.getElementById(i).textContent == "0") {
        document.getElementById(i).textContent = "";
        document.getElementById(i).style.background = backgroundColorWater;
      }
      square++;

      if (square == 10) {
        row++;
        square = 0;
      }
    }
  }

  row = 0;
  square = 0;
}