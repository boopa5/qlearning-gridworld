class Game {

    static ACTIONS = ["L", "R", "U", "D"];
    static DISCOUNT_RATE = 0.99;
    static LEARNING_RATE = 0.5;
    static EPSILON = 0.1;

    constructor(width = 5, height = 5, start = {x: 0, y: 0}, winState = {x: 4, y: 4}, loseState = {x: 4, y: 2}) {
        this.width = width;
        this.height = height;
        this.board = Array(this.width).fill(0).map(() => Array(this.height).fill(0));
        this.state = start;
        this.winState = winState;
        this.loseState = loseState;
        this.board[this.state.x][this.state.y] = 1;
        this.board[this.winState.x][this.winState.y] = 2;
        this.board[this.loseState.x][this.loseState.y] = 3;

        // Initialize the Q-table
        this.qtable = {};
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.qtable[`${i},${j}`] = {};
                Game.ACTIONS.forEach(a => {
                    this.qtable[`${i},${j}`][a] = 0;
                });
            }
        }
    }

    reset() {
        this.board = Array(this.width).fill(0).map(() => Array(this.height).fill(0));
        this.state = {x: 0, y: 0};
        this.board[this.state.x][this.state.y] = 1;
        this.board[this.winState.x][this.winState.y] = 2;
        this.board[this.loseState.x][this.loseState.y] = 3;
    }

    resetQTable() {
        this.qtable = {};
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                this.qtable[`${i},${j}`] = {};
                Game.ACTIONS.forEach(a => {
                    this.qtable[`${i},${j}`][a] = 0;
                });
            }
        }
    }

    step(action) {
        let newState = this.nextState(action);
        let reward = this.giveReward(newState);
        let y = reward + Game.DISCOUNT_RATE * this.qtable[`${newState.x},${newState.y}`][argmax(a => this.qtable[`${newState.x},${newState.y}`][a], Game.ACTIONS)];
        this.qtable[`${this.state.x},${this.state.y}`][action] = this.qtable[`${this.state.x},${this.state.y}`][action] + (Game.LEARNING_RATE) * (y - this.qtable[`${this.state.x},${this.state.y}`][action]);
        
        this.board[this.state.x][this.state.y] = 0;
        this.state = newState;
        this.board[this.state.x][this.state.y] = 1;
    }

    giveReward(state) {
        if (JSON.stringify(state) === JSON.stringify(this.winState)) {
            return 1000;
        }
        if (JSON.stringify(state) === JSON.stringify(this.loserState)) {
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
        return JSON.stringify(this.state) === JSON.stringify(this.winState);
    }

    isLose() {
        return JSON.stringify(this.state) === JSON.stringify(this.loseState) 
    }

    isTerminal() {
        return this.isWin() || this.isLose();
    }

    epsilonGreedy() {
        let action;
        if (Math.random() < Game.EPSILON) {
            action = this.chooseRandomLegalAction();
        } else {
            action = this.chooseMaxLegalAction();
        }
        return action;
    }

    isLegalAction(action) {
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

        return !(newState.x < 0 || newState.x >= this.width || newState.y < 0 || newState.y >= this.height)
    }

    chooseRandomLegalAction() {
        let action = randomElement(Game.ACTIONS);
        while (!this.isLegalAction(action)) {
            action = randomElement(Game.ACTIONS);
        }
        return action;
    }

    decayEpsilon() {
        Game.EPSILON *= 0.90;
    }

    chooseMaxLegalAction() {
        let cloneAction = [...Game.ACTIONS];
        let action = argmax(a => this.qtable[`${this.state.x},${this.state.y}`][a], cloneAction);
        while (!this.isLegalAction(action)) {
            action = argmax(a => this.qtable[`${this.state.x},${this.state.y}`][a], cloneAction);
            cloneAction.splice(cloneAction.indexOf(action), 1);
        }
        return action;
    }

    train(episodes = 100) {
        for (let i = 0; i < episodes; ++i) {
            this.reset();
            while (!this.isTerminal()) {
                this.step(this.epsilonGreedy());
                if (this.isWin()) {
                    this.decayEpsilon();
                }
            }
        }
    }
    
    demo() {
        this.reset();
        setTimeout(()=>{}, 1000);
        let intervalId = setInterval(() => {
            this.step(this.chooseMaxLegalAction());
            if (this.isTerminal()) {
                clearInterval(intervalId);
            }
        }, 500);
    }

    async trainDemo(episodes = 100) {
        for (let i = 0; i < episodes; ++i) {
            this.reset();
            while (!this.isTerminal()) {
                this.step(this.epsilonGreedy(0.9));
                if (this.isWin()) {
                    this.decayEpsilon();
                }
                await delay(10);
            }
        }
    }
            
}

const argmax = (func, inputs) => {
    let maxIndex = 0;

    for (let i = 0; i < inputs.length; ++i) {
        if (func(inputs[i]) > func(inputs[maxIndex])) {
            maxIndex = i;
        }
    }
    return inputs[maxIndex];
}

const randomElement = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const delay = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}