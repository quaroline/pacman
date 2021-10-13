document.addEventListener('DOMContentLoaded', () => {
    var createBoard = () => {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');

            square.setAttribute("id", i);
    
            grid.appendChild(square);

            squares.push(square);
    
            if (layout[i] === 1)
                squares[i].classList.add('wall');

            let [x, y] = getCoordinates(i);

            map.push({
                index: i,
                x,
                y,
                available: layout[i] === 0
            });
        }
    }

    var handleArrows = (event) => movePacman(event.key);

    var startGame = () => {
        document.removeEventListener('keydown', handleEnter);
        
        document.querySelector('.menu').remove();

        grid.classList.remove('hidden');

        createBoard();

        squares[pacmanIndex].classList.add('pac-man');
        squares[redBlinkyIndex].classList.add('red-blinky');
    
        startSound.play();
    
        setTimeout(() => {
            movePacman('ArrowLeft');
    
            createMoveBlinkyTimer();
        }, 1000);
    
        document.addEventListener('keydown', handleArrows);

        setInterval(() => {
            const [x, y] = getCoordinates(pacmanIndex);

            lastPacmanCoords = { x, y };
        }, 2000);
    }
    
    var getCoordinates = (index) => [index % width, Math.floor(index / width)];

    var getRandomDirection = (index) => {
        let direction = directions[Math.floor(Math.random() * directions.length)];

        while (checkIfObstacleExists(index, direction, 'wall') || checkIfObstacleExists(index, direction, 'exit-door')) 
            direction = directions[Math.floor(Math.random() * directions.length)];

        return direction;
    };

    var getDistanceBetweenTwoCoords = (direction, pacmanCoords, blinkyCoords) => {
        switch (direction) {
            case -1: 
                return Math.sqrt(Math.pow((blinkyCoords.x - (pacmanCoords.x - 4 * width)), 2) + Math.pow(blinkyCoords.y - pacmanCoords.y, 2));
            case 1: 
                return Math.sqrt(Math.pow((blinkyCoords.x - (pacmanCoords.x + 4 * width)), 2) + Math.pow(blinkyCoords.y - pacmanCoords.y, 2));
            case 28:
                return Math.sqrt(Math.pow((blinkyCoords.x - pacmanCoords.x), 2) + Math.pow(blinkyCoords.y - (pacmanCoords.y + 4 * width), 2));
            case -28:
                return Math.sqrt(Math.pow((blinkyCoords.x - pacmanCoords.x), 2) + Math.pow(blinkyCoords.y - (pacmanCoords.y - 4 * width), 2));
            default:
                return Math.sqrt(Math.pow((blinkyCoords.x - pacmanCoords.x), 2) + Math.pow(blinkyCoords.y - pacmanCoords.y, 2));
        }
    }

    var getDirectionAccordingToDistanceOfPacman = () => {
        let [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
        let [blinkyX, blinkyY] = getCoordinates(redBlinkyIndex);
    
        let pacmanCoords = { x: pacmanX, y: pacmanY };
        let blinkyCoords = { x: blinkyX, y: blinkyY };

        let getDistance = (i) => {
            return (!checkIfObstacleExists(redBlinkyIndex, directions[i], 'exit-door') && 
                !checkIfObstacleExists(redBlinkyIndex, directions[i], 'wall'))
                ? getDistanceBetweenTwoCoords(directions[i], pacmanCoords, blinkyCoords) 
                : Infinity;
        }

        let left = getDistance(0);
        let right = getDistance(1);
        let down = getDistance(2);
        let up = getDistance(3);
        
        let minDistance = Math.min(Math.min(left, right), Math.min(up, down));

        switch (minDistance) {
            case left:
                return directions[0];    
            case right:
                return directions[1];
            case down:
                return directions[2];
            case up:
                return directions[3];
        }
    }
    
    var checkIfObstacleExists = (index, direction, obstacle) => squares[index + direction].classList.contains(obstacle);

    var addClass = (index, className) => squares[index].classList.add(className);

    var removeClass = (index, className) => squares[index].classList.remove(className);

    var moveBlinky = (direction) => {
        let className = 'red-blinky';

        if (blinkyMoveQuantity < 3 || redBlinkyIndex === 321 || redBlinkyIndex === 322) {
            direction = directions[3];

            blinkyMoveQuantity++;
        } 
        else {
            // Avoids Blinky enter the initial square again.
            squares[321].classList.add('exit-door');
            squares[322].classList.add('exit-door');

            // In case Blinky goes to the edges.
            if (redBlinkyIndex == 364) {
                removeClass(redBlinkyIndex, className);

                redBlinkyIndex = 391;
                direction = -1;
            }
            else if (redBlinkyIndex == 391) {
                removeClass(redBlinkyIndex, className);

                redBlinkyIndex = 364;
                direction = 1;
            }
            // Avoids Blinky lock itself on "come and go" movement.
            else if (lastDirection && lastDirection == (-1 * direction) &&
                !checkIfObstacleExists(redBlinkyIndex, lastDirection, 'exit-door') &&
                !checkIfObstacleExists(redBlinkyIndex, lastDirection, 'wall'))
            direction = lastDirection;
        }

        removeClass(redBlinkyIndex, className);

        lastDirection = direction;
        redBlinkyIndex += direction;

        addClass(redBlinkyIndex, className);

        if (checkIfGameIsOver())
            endGame();
    }

    var endGame = () => {
        squares[redBlinkyIndex].classList.remove('pac-man');

        document.removeEventListener('keydown', handleArrows);

        clearInterval(pacmanTimer);

        wakaSound.pause();

        deathSound.volume = 0.2;
        deathSound.play();

        clearInterval(blinkyTimer);    
    }

    var checkIfGameIsOver = () => squares[redBlinkyIndex].classList.contains('pac-man');

    var createMoveBlinkyTimer = (runningAway) => {
        blinkyTimer = setInterval(() => {
            let direction = 
                runningAway ? getDirectionAccordingToDistanceOfPacman() : getRandomDirection(redBlinkyIndex);

            moveBlinky(direction);
        }, 200);
    }

    var movePacman = (pressedKey) => {
        if (pacmanTimer !== NaN)
            clearInterval(pacmanTimer)

        const acceptedMoves = {
            ArrowLeft: () => directions[0],
            ArrowRight: () => directions[1],
            ArrowDown: () => directions[2], 
            ArrowUp: () => directions[3]
        };

        const moveFunction = acceptedMoves[pressedKey];

        if (moveFunction) {
            let direction = moveFunction();

            pacmanTimer = setInterval(() => {
                if (!checkIfObstacleExists(pacmanIndex, direction, 'wall') &&
                    !checkIfObstacleExists(pacmanIndex, direction, 'exit-door')) {
                    wakaSound.play();

                    let className = 'pac-man';

                    removeClass(pacmanIndex, className);

                    pacmanIndex += direction;

                    addClass(pacmanIndex, className);
                } 
                else if (checkIfGameIsOver()) {
                    endGame();
                } 
                else {
                    clearInterval(pacmanTimer);

                    wakaSound.pause();
                }
            }, 180);
        }
    }

    var lastDirection = NaN;

    var blinkyMoveQuantity = 0;

    const wakaSound = new Audio('assets/waka.mp3');
    const startSound = new Audio('assets/start.mp3');
    const deathSound = new Audio('assets/death.mp3');

    wakaSound.volume = 0.2;
    startSound.volume = 0.2;

    const width = 28;

    const grid = document.querySelector('.grid');

    const directions = [-1, +1, +width, -width];

    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,
        0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,
        1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    const squares = [];
    const map = [];

    let pacmanIndex = 489;
    let redBlinkyIndex = 377;

    let pacmanTimer = NaN;
    let blinkyTimer = NaN;

    let btnStart = document.getElementById("humanAgentStart");

    btnStart.onclick = startGame;

    let handleEnter = (event) => {
        if (event.key === 'Enter') 
            startGame();
    }

    document.addEventListener('keydown', handleEnter);
});