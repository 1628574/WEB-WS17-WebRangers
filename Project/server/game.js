const Player = require(__dirname + '/player');

module.exports = class Game {
  constructor() {
    this.player1Socket;
    this.player2Socket;

    this.p1C = false;
    this.p2C = false;

    this.player1;
    this.player2;
  }

  startGame(socket) {
    console.log('user connected');

    if (!this.p1C) { //erster Spieler verbindet
      console.log('Player 1 connected');
      this.player1Socket = socket;
      this.p1C = true;
      this.player1 = new Player('player 1');

      this.player1Socket.on('disconnect', () => {
        console.log('Player1 hat das Spiel verlassen');
        this.player1Socket = undefined;
        this.p1C = false;
        if (this.p2C) {
          this.player2Socket.emit('enemyDisconnect');
        }
      });

      this.player1Socket.on('setPlayerName', playerName => {
        this.player1.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });

    } else if (!this.p2C) { //zweiter Spieler verbindet
      console.log('Player 2 connected');
      this.player2Socket = socket;
      this.p2C = true;
      this.player2 = new Player('player 2');

      this._makeGamePlayable();
      this._makeFirePossible(this.player1);
      this._makeFirePossible(this.player2);

      this.player2Socket.on('disconnect', () => {
        console.log('Player2 hat das Spiel verlassen');
        this.player2Socket = undefined;
        this.p2C = false;
        if (this.p1C) {
          this.player1Socket.emit('enemyDisconnect');
        }
      });

      this.player2Socket.on('setPlayerName', playerName => {
        this.player2.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });
    } else {
      console.log("p1C: " + this.p1C + ", p2C: " + this.p2C);
    }
  }

  //Benachrichtige aktuellen Spieler
  _emitTurn() {
    if (this.turn == this.player1.id) {
      this.player1Socket.emit('playerTurn', true);
      this.player2Socket.emit('playerTurn', false);
    } else {
      this.player1Socket.emit('playerTurn', false);
      this.player2Socket.emit('playerTurn', true);
    }
  }

  _makeFirePossible(currentPlayer) {
    let playerSocket;
    let opponentSocket;
    let opponent;
    let nextTurn;

    if (currentPlayer.id === this.player1.id) {
      playerSocket = this.player1Socket;
      opponentSocket = this.player2Socket;
      opponent = this.player2;
      nextTurn = this.player2.id;
    } else {
      playerSocket = this.player2Socket;
      opponentSocket = this.player1Socket;
      opponent = this.player1;
      nextTurn = this.player1.id;
    }
    playerSocket.on('fire', (x, y) => {
      console.log("Fire detected: x:" + x + " y:" + y);
      if (currentPlayer.id === this.turn) {
        if (opponent.field[y][x] == 1) { //Treffer
          playerSocket.emit('fireResult', true);
          opponentSocket.emit('fireResultEnemy', x, y, true);
          opponent.field[y][x] = 2;

          //#####################
          //controllLog();
          //#####################

          // TODO: ANFANG (MAX)
          if (_checkShipDown(opponet, x, y)) { //DONE: noch nicht implementiert -> Prüfe ob Schiff an x,y versenkt wurde
            playerSocket.emit('shipDown', x, y); // DONE: noch nicht implementiert -> Muss in "script.js" implementier werden (möglicherweise auch ähnlich implemtieren), Schiff an Stelle x,y wurde versenkt(natürlich auch der rest vom Schiff)
<<<<<<< HEAD
            if (_checkGameOver(opponet)) { // DONE: noch nicht implementiert -> prüfe ob noch '1' auf dem Spielfeld ist
=======
            if (_checkGameOver(opponet)) { // TODO: noch nicht implementiert -> prüfe ob noch '1' auf dem Spielfeld ist
>>>>>>> b15ccf6bdbf2c550fbacf0088b749e7cdc573f4b
              opponentSocket.emit('lost', player.score); // TODO: noch nicht implementiert -> Muss in "SchiffeVersenken.html"/"script.js" implementier werden
              playerSocket.emit('won', player.score); // TODO: noch nicht implementiert -> Muss in "SchiffeVersenken.html"/"script.js" implementier werden
              _setHighscore(player.name, player.score); // TODO: (BEN) noch nicht implementiert -> Lade Highscore auf den Server
            }
          }
          // TODO: ENDE (MAX)

        } else { //verfehlt
          playerSocket.emit('fireResult', false);
          opponentSocket.emit('fireResultEnemy', x, y, false);
          opponent.field[y][x] = 3;

          //#####################
          //controllLog();
          //#####################

          this.turn = nextTurn;
          this._emitTurn();
        }
        if (currentPlayer.id === this.player1.id) {
          this.player1.increaseScore();
        } else {
          this.player2.increaseScore();
        }
      }
    });
  }

  //Test / Controlling (gebe Spielfeld auf die Konsole)
  controllLog() {
    var string1 = "Player1: \n";
    var string2 = "Player2: \n";
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        string1 += this.player1.field[j][i] + " ";
        string2 += this.player2.field[j][i] + " ";
      }
      string1 += "\n";
      string2 += "\n";
    }
    console.log(string1);
    console.log(string2);
  }

  //benachrichtige Spieler(Zug,Schiffe) und wähle Startspieler aus
  _makeGamePlayable() {
    this.player1Socket.emit('myShips', this.player1.field);
    this.player2Socket.emit('myShips', this.player2.field);
    switch (Math.floor(Math.random() * (1 - 0 + 1)) + 0) {
      case 0:
        this.turn = this.player1.id;
        break;
      case 1:
        this.turn = this.player2.id;
    }
    this._emitTurn();
  }


  //prüfe ob Spiel bereit ist (Spieler sind da und haben einen Namen, Spiel ist nicht vorbei)
  _isAbleToPlay() {
    return this.player1Socket &&
      this.player2Socket &&
      this.player1.name &&
      this.player2.name;
  }

<<<<<<< HEAD
  _checkGameOver(opponet) {
    var result = true;

    for (int i = 0, i < 10, i++) {
      for (int k = 0; k < 10, k++) {

        if (opponent.field[k][i] == 1 = ) {
          result = false;
        }
      }
    }
    return result;
  }

  _checkShipDown(opponet, x, y) {
    var ind = x;
    var shipDownResult = true;

    if (opponet.field[y][x] == 2) {

      while (true) {
        if (opponet.field[y][ind] == 1) {
          shipDownResult = false;
          break;
        } else {
          ind++;
        }
      }
      var ind = x;
      while (true) {
        if (opponet.field[y][ind] == 1) {
          shipDownResult = false;
          break;
        } else {
          ind--;
        }
      }
      var ind = y;
      while (true) {
        if (opponet.field[y][ind] == 1) {
          shipDownResult = false;
          break;
        } else {
          ind++;
        }
      }
      var ind = y;
      while (true) {
        if (opponet.field[y][ind] == 1) {
          shipDownResult = false;
          break;
        } else {
          ind--;
        }
      }
    }
    return shipDownResult;
  }

=======
  _checkShipDown(opponet, x, y){
    var ind = x;
    var shipDownResult = true;

    if(opponet.field[y][x] == 2){

      while (true){
      if(opponet.field[y][ind] == 1){
        shipDownResult = false;
        break;
      }else {
        ind++;
      }
    }
    var ind = x;
    while (true){
    if(opponet.field[y][ind] == 1){
      shipDownResult = false;
      break;
    }else {
      ind--;
    }
  }
  var ind = y;
  while (true){
  if(opponet.field[y][ind] == 1){
    shipDownResult = false;
    break;
  }else {
    ind++;
  }
}
var ind = y;
while (true){
if(opponet.field[y][ind] == 1){
  shipDownResult = false;
  break;
}else {
  ind--;
}
}

    return shipDownResult;
  }
>>>>>>> b15ccf6bdbf2c550fbacf0088b749e7cdc573f4b
  //übermittle namen des gegenspielers
  _refreshNames() {
    console.log("Namen wurden übermittelt: Player1: " + this.player1.name + ", Player2: " + this.player2.name);
    this.player1Socket.emit('refreshName', this.player2.name);
    this.player2Socket.emit('refreshName', this.player1.name);
  }
}
