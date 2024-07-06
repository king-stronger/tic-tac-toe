const gameboard = (function(){
    let board = new Array(10);
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
        for (let i = 0; i < winPossibilities.length; i++) {
            const possibility = winPossibilities[i];
            let dot = 0;
            let marker = "";
    
            for (let j = 0; j < possibility.length; j++) {
                const number = possibility[j];
    
                if (!board[number]) {
                    break;
                }
    
                if (!marker) {
                    marker = board[number];
                }
    
                if (board[number] === marker) {
                    dot++;
                }
            }
    
            if (dot === 3) {
                return { status: true, marker }; 
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
    const chooseMarker = (secondMarker) => {
        if(secondMarker){
            return secondMarker = "X" ? "O" : "X"; 
        }

        let marker = prompt("Choose a marker X or O");
        
        if(marker != "X" && marker != "O"){
            chooseMarker();
        }

        return marker;
    }

    const chooseName = (secondPlayer) => {
        return prompt(`The ${secondPlayer ? 'second' : 'first'} player should write his name:`);
    }

    const chooseSide = (secondPlayer) => {
        let marker = secondPlayer ? chooseMarker(true): chooseMarker();
        let name = chooseName(secondPlayer);

        return createPlayer(name, marker);
    };

    const playRound = () => {
        const turn = (player) => {
            let position = parseInt(prompt(player.getName()  + " choose a square"));

            let statement = gameboard.save(player.getMarker(), position);

            if(!statement){
                alert("This square is already taken !");
                turn(player);
            }

            let gameboardStatus = gameboard.check();
            if(gameboardStatus?.status){
                return gameboardStatus;
            }
        }

        return { turn };        
    }

    const start = () => {
        
        let firstPlayer = chooseSide(false);
        let secondPlayer = chooseSide(true);

        let round = playRound();
        let nextTurn = "firstPlayer";
        let roundStatus = false, turn = 0;
        let playerVictory;
        
        do {
            if(nextTurn == "firstPlayer"){
                roundStatus = round.turn(firstPlayer);
                nextTurn = "secondPlayer";
            } else {
                roundStatus = round.turn(secondPlayer);
                nextTurn = "firstPlayer";
            }
        } while (!roundStatus && turn <= 9);

        if(roundStatus.marker == "X"){
            playerVictory = firstPlayer.getMarker() == roundStatus.marker ? firstPlayer : secondPlayer;
            console.log(playerVictory.getName() + " won")
        } else if (roundStatus.marker == "O") {
            playerVictory = firstPlayer.getMarker() == roundStatus.marker ? firstPlayer : secondPlayer;
            console.log(playerVictory.getName() + " won")
        } else {
            console.log("It's a draw")
        }

    };

    return {start};
})();

game.start();