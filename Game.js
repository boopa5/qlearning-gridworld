import Model from './qlearning-module/model.js';

export default class Game {

    constructor({
        width = 5,
        height = 5,
        start = {x: 0, y: 0},
        winState = {x: 4, y: 4},
        loseState = {x: 4, y: 2},
        model = new Model()
    } = {
        width: 5,
        height: 5,
        start: {x: 0, y: 0},
        winState: {x: 4, y: 4},
        loseState: {x: 4, y: 2},
        model: new Model()
    }) {
        this.width = width;
        this.height = height;
        this.board = Array(this.width).fill(0).map(() => Array(this.height).fill(0));
        this.state = start;
        this.winState = winState;
        this.loseState = loseState;
        this.model = model;
        this.board[this.state.x][this.state.y] = 1;
        this.board[this.winState.x][this.winState.y] = 2;
        this.board[this.loseState.x][this.loseState.y] = 3;
    }

    reset() {
        this.board = Array(this.width).fill(0).map(() => Array(this.height).fill(0));
        this.state = {x: 0, y: 0};
        this.board[this.state.x][this.state.y] = 1;
        this.board[this.winState.x][this.winState.y] = 2;
        this.board[this.loseState.x][this.loseState.y] = 3;
    }

    step(action) {
        let newState = this.nextState(action);
        this.model.updateQValue(this.state, action, newState, this.getLegalActions(newState), this.giveReward(newState));
        
        this.board[this.state.x][this.state.y] = 0;
        this.state = newState;
        this.board[this.state.x][this.state.y] = 1;
    }

    giveReward(state) {
        if (JSON.stringify(state) === JSON.stringify(this.winState)) {
            console.log("reward: 1");
            return 1000;
        }
        if (JSON.stringify(state) === JSON.stringify(this.loseState)) {
            return -100;
        }
        else {
            return -0.5;
        }
    }

    nextState(action) {
        let newState = {x: this.state.x, y: this.state.y};
        if (action == "L") {
            newState.x -= 1;
        }
        else if (action == "R") {
            newState.x += 1;
        }
        else if (action == "U") {
            newState.y -= 1;
        }
        else if (action == "D") {
            newState.y += 1;
        }
        if (newState.x < 0 || newState.x >= this.width || newState.y < 0 || newState.y >= this.height) {
            return this.state;
        }
        return newState;
    }

    isWin() {
        return JSON.stringify(this.state) === JSON.stringify(this.winState) || this.board[this.winState.x][this.winState.y] == 0;
    }

    isLose() {
        return JSON.stringify(this.state) === JSON.stringify(this.loseState) || this.board[this.loseState.x][this.loseState.y] == 0;
    }

    isTerminal() {
        return this.isWin() || this.isLose();
    }

    getLegalActions(state) {
        let actions = [];
        if (state.x > 0) {
            actions.push("L");
        }
        if (state.x < this.width - 1) {
            actions.push("R");
        }
        if (state.y > 0) {
            actions.push("U");
        }
        if (state.y < this.height - 1) {
            actions.push("D");
        }
        return actions;
    }

    train(episodes = 100) {
        for (let i = 0; i < episodes; ++i) {
            this.reset();
            while (!this.isTerminal()) {
                let action = this.model.getAction(this.state, this.getLegalActions(this.state));
                this.step(action);
                if (this.isWin()) {
                    this.model.decayEpsilon();
                }
            }
        }
    }
    
    async demo() {
        this.reset();
        this.model.epsilon = 0;
        await delay(1000);
        let intervalId = setInterval(() => {
            this.step(this.model.getAction(this.state, this.getLegalActions(this.state)));
            if (this.isTerminal()) {
                clearInterval(intervalId);
            }
        }, 500);
    }

    async trainDemo(episodes = 100) {
        for (let i = 0; i < episodes; ++i) {
            this.reset();
            while (!this.isTerminal()) {
                this.step(this.model.getAction(this.state, this.getLegalActions(this.state)));
                if (this.isTerminal()) {
                    this.model.decayEpsilon();
                }
                await delay(10);
            }
        }
    }
            
}

const delay = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}