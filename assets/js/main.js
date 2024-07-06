const gameboard = (function(){
    let board = new Array(9);
    let winPossibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    const save = (marker, position) => {
        if(!board[position]){
            board[position] = marker;
            return true;
        }

        return false;
    }

    const check = () => {
        for(const possibility of winPossibilities){
            let [a, b, c] = possibility;

            if(board[a] && board[a] == board[b] && board[a] == board[c]){
                return { status: true, marker:board[a]}
            }
        }
    
        return false; 
    };
    
    return {save, check};
})();

function createPlayer(name, marker){
    let score = 0;

    const getName = () => name;
    const getMarker = () => marker;
    const getScore = () => score;
    const incrementScore = () => score++;

    return {
        getName, getMarker, getScore, incrementScore
    }
}

const game = (function(){
    const chooseMarker = (existingMarker = null) => {
        if(existingMarker){
            return existingMarker = "X" ? "O" : "X"; 
        }

        let marker;

        do {
            marker = prompt("Choose a marker X or O");
        } while(marker !== "X" && marker !== "O");

        return marker;
    }

    const chooseName = (existingPlayer = null) => {
        return prompt(`The ${existingPlayer ? 'second' : 'first'} player should write his name:`);
    }

    const chooseSide = (isSecondPlayer = null) => {        
        return createPlayer(chooseName(isSecondPlayer), chooseMarker(isSecondPlayer));
    };

    const playRound = (player) => {
        let position;
        do {
            position = parseInt(prompt(player.getName()  + " choose a square"));

        } while(!gameboard.save(player.getMarker(), position));

        return gameboard.check();
    }

    const start = () => {
        
        let firstPlayer = chooseSide(false);
        let secondPlayer = chooseSide(true);
        
        let roundStatus, currentPlayer = firstPlayer;

        for(let turn = 0; turn < 9; turn++){
            roundStatus = playRound(currentPlayer);
            if(roundStatus){
                console.log(`${currentPlayer.getName()} has won`);
                return;
            }

            currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
        }

        return console.log("It's a draw");
    };

    return {start};
})();

game.start();