document.addEventListener("DOMContentLoaded", () => {

    const tam = 11;
    var board;
    var sprites;
    var score = 0;
    var gameOver = false;
    let intervalWall, intervalEnemy
    var displayScore = document.querySelector('.score')


    function innerBoard() {

        var str = '';
        for (var n = 0; n < tam; n++) {
            for (var m = 0; m < tam; m++) {
                var y = GetY(n, m);
                var x = GetX(n, m);
                str +=
                    "<div style= ' position:absolute; left:" +
                    x +
                    '; top:' +
                    y +
                    "; '>";
                str += "<image src ='images/d" + board[n][m] + ".png'/>";
                str += '</div>';
            }
        }
        return str;
    }

    function innerGameOver() {
        var str = '';
        if (gameOver == 1) {
            str += "<div style='position:absolute;left:-100;top:115;'>";
            str += "<image src='images/gameover.png'/>";
            str += '</div>';
        }
        return str;
    }

    function innerSprites() {
        var str = '';
        for (var f = 0; f < tam; f++) {
            for (var c = 0; c < tam; c++) {
                for (var n = 0; n < sprites.length; n++) {
                    if (f == sprites[n][0] && c == sprites[n][1]) {
                        let y = GetY(f);
                        let x = GetX(f, c);
                        str +=
                            "<div style= ' position:absolute; left:" +
                            x +
                            '; top:' +
                            y +
                            "; '>";
                        str += "<image src ='images/n" + Math.min(2, n) + ".png'/>";
                        str += '</div>';
                    }
                }
            }
        }
        return str;
    }

    function innerHTML() {
        var str = '';
        str += innerBoard();
        str += innerSprites();
        str += innerGameOver();
        return str;
    }

    function GetX(f, c) {
        return c * 46 - f * 24;
    }

    function GetY(f) {
        return f * 20;
    }

    function colissionBall(f, c) {
        return sprites[0][0] == f && sprites[0][1] == c;
    }

    function iscolissionEnemy(f, c) {
        for (var n = 2; n < sprites.length; n++) {
            if (sprites[n][0] == f && sprites[n][1] == c) {
                return true;
            }
        }
        return false;
    }

    function colissionEnemy() {
        for (var n = 2; n < sprites.length; n++)
            if (sprites[n][0] == sprites[1][0] && sprites[n][1] == sprites[1][1])
                gameOver = 1;
    }

    function isDoor(n, m) {
        if (n % 2 == 0 && m % 2 == 0) return false;
        if (n <= 0 || m <= 0) return false;
        if (n >= tam - 1 || m >= tam - 1) return false;
        if ((n + m) % 2 == 0) return false;
        return true;
    }

    function ballRandom() {
        var f, c;
        do {
            f = Math.floor(Math.random() * (tam - 2) + 1);
            c = Math.floor(Math.random() * (tam - 2) + 1);
        } while (board[f][c] == 2);
        sprites[0][0] = f;
        sprites[0][1] = c;
    }

    function doorRandom() {
        const numChange = 50
        for (let n = 0; n < numChange; n++) {
            var f = Math.floor(Math.random() * tam);
            var c = Math.floor(Math.random() * tam);
            if (isDoor(f, c) && !iscolissionEnemy(f, c) && !(f == sprites[1][0] && c == sprites[1][1])) board[f][c] = 1 - board[f][c];
        }
        document.getElementById('prueba').innerHTML = innerHTML()
        displayScore.innerHTML = score
    }

    function initComponents() {
        /*Board*/
        board = new Array(tam);
        for (var n = 0; n < tam; n++) {
            board[n] = new Array(tam);
            for (var m = 0; m < tam; m++)
                if (isDoor(n, m)) board[n][m] = 1;
                else board[n][m] = 2;
        }

        for (var n = 1; n < tam; n += 2)
            for (var m = 1; m < tam; m += 2) board[n][m] = 0;
        sprites = new Array();
        /*Actors og the game, ball,actor,enemy*/
        sprites[0] = new Array(5, 5); //Ball
        sprites[1] = new Array(1, 1);
        sprites[2] = new Array(1, 9);
        sprites[3] = new Array(9, 9);
        sprites[4] = new Array(9, 1);
        sprites[5] = new Array(5, 5);
        score = 0;
        ballRandom();
        doorRandom();

        clearInterval(intervalWall)
        intervalWall = setInterval(doorRandom, 500);
        clearInterval(intervalEnemy)
        intervalEnemy = setInterval(() => {
            moveEnemies();
        }, 1500);
    }

    function movePlayer(df, dc) {
        var f = sprites[1][0] + df;
        var c = sprites[1][1] + dc;
        var v = board[f][c];
        if (v == 0) {
            sprites[1][0] = f;
            sprites[1][1] = c;
            if (colissionBall(f, c)) {
                score = (score + 1) % 100;
                ballRandom();
            }
            colissionEnemy();
            document.getElementById('prueba').innerHTML = innerHTML()
        }
    }


    function moveEnemies() {
        var f1 = sprites[1][0];
        var c1 = sprites[1][1];
        for (var n = 2; n < sprites.length; n++) {
            var fE = sprites[n][0];
            var cE = sprites[n][1];
            if (f1 < fE && board[fE - 1][cE] == 0 && !iscolissionEnemy(fE - 1, cE)) {
                sprites[n][0] = fE - 1;
            } else if (
                f1 > fE &&
                board[fE + 1][cE] == 0 &&
                !iscolissionEnemy(fE + 1, cE)
            ) {
                sprites[n][0] = fE + 1;
            } else if (
                c1 < cE &&
                board[fE][cE - 1] == 0 &&
                !iscolissionEnemy(fE, cE - 1)
            ) {
                sprites[n][1] = cE - 1;
            } else if (
                c1 > cE &&
                board[fE][cE + 1] == 0 &&
                !iscolissionEnemy(fE, cE + 1)
            ) {
                sprites[n][1] = cE + 1;
            }
        }
        colissionEnemy();
    }


    function keyBoard(e) {
        var keynum;
        if (window.event) keynum = e.keyCode;
        else if (e.which) keynum = e.which;
        switch (keynum) {
            case 37:
                if (gameOver == 0) movePlayer(0, -1);
                break;
            case 38:
                if (gameOver == 0) movePlayer(-1, 0);
                break;
            case 39:
                if (gameOver == 0) movePlayer(0, 1);
                break;
            case 40:
                if (gameOver == 0) movePlayer(1, 0);
                break;
            case 32:
                if (gameOver == 1) {
                    gameOver = 0;
                    start();
                }
                break;
        }
    }

    function start() {
        initComponents();
        document.getElementById('prueba').innerHTML = innerHTML();
    }

    start()
    addEventListener('keydown', keyBoard)
})