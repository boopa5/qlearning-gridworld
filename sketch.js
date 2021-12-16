const DELAY = 100;
let game = new Game(5, 5, {x: 0, y: 0}, {x: 4, y: 4}, {x: 1, y: 3});

function setup() {
    createCanvas(1000, 1000);
}

function drawGame(game) {
    for (let i = 0; i < game.width; i++) {
        for (let j = 0; j < game.height; j++) {
            if (game.board[i][j] === 0) {
                fill(255);
                stroke(0);
                rect(i * 50, j * 50, 50, 50);
            }
            if (game.board[i][j] === 1) {
                fill(0, 0, 255);
                stroke(0);
                rect(i * 50, j * 50, 50, 50);
            }
            if (game.board[i][j] === 2) {
                fill(0, 255, 0);
                stroke(0);
                rect(i * 50, j * 50, 50, 50);
            }
            if (game.board[i][j] === 3) {
                fill(255, 0, 0);
                stroke(0);
                rect(i * 50, j * 50, 50, 50);
            }
        }
    }
}

function draw() {
    background(220);
    drawGame(game);
}

game.trainDemo();
// game.train();
game.demo();