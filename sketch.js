import Game from './Game.js';
import Model from './qlearning-module/model.js';

const DELAY = 100;
let game = new Game({
    width: 5,
    height: 5,
    start: {x: 0, y: 0},
    winState: {x: 4, y: 4},
    loseState: {x: 4, y: 2}
});

let model = new Model({
    learningRate: 0.5,
    discountFactor: 0.99,
    epsilon: 0.1,
    epsilonDecay: 0.99,
});

game.model = model;

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

window.setup = setup;
window.draw = draw;

// await game.trainDemo();
game.train();
game.demo();