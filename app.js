document.addEventListener('DOMContentLoaded', () => {
    var createBoard = () => {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');

            square.setAttribute("id", i);
    
            grid.appendChild(square);

            squares.push(square);
    
            if (layout[i] === 1)
                squares[i].classList.add('wall');
        }
    }

    var handleArrows = (event) => movePacman(event.key);

    var startGame = () => {
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
    }
    
    var getCoordinates = (index) => [index % width, Math.floor(index / width)];

    var getRandomDirection = (index) => {
        let direction = directions[Math.floor(Math.random() * directions.length)];

        while (checkIfObstacleExists(index, direction, 'wall') || checkIfObstacleExists(index, direction, 'exit-door')) 
            direction = directions[Math.floor(Math.random() * directions.length)];

        return direction;
    };
    
    var checkIfObstacleExists = (index, direction, obstacle) => squares[index + direction].classList.contains(obstacle);

    var addClass = (index, className) => squares[index].classList.add(className);

    var removeClass = (index, className) => squares[index].classList.remove(className);

    var moveBlinky = (direction) => {
        if (blinkyMoveQuantity < 3) {
            direction = directions[3];

            blinkyMoveQuantity++;
        } else {
            // Avoids Blinky enter the initial square again.
            squares[321].classList.add('exit-door');
            squares[322].classList.add('exit-door');

            // Avoids Blinky lock itself on "come and go" movement.
            if (lastDirection && lastDirection == (-1 * direction) &&
                !checkIfObstacleExists(redBlinkyIndex, lastDirection, 'wall'))
            direction = lastDirection;
        }

        let className = 'red-blinky';

        removeClass(redBlinkyIndex, className);

        lastDirection = direction;
        redBlinkyIndex += direction;

        addClass(redBlinkyIndex, className);
    }

    var isCoordinateCloser = (next, actual, pacmans) => ((next - pacmans) > (actual - pacmans));

    var endGame = (blinkyTimer) => {
        document.removeEventListener('keydown', handleArrows);

        squares[redBlinkyIndex].classList.remove('pac-man')

        clearInterval(pacmanTimer);

        wakaSound.pause();

        deathSound.volume = 0.2;
        deathSound.play();

        clearInterval(blinkyTimer);    
    }

    var checkIfGameIsOver = () => squares[redBlinkyIndex].classList.contains('pac-man');

    var createMoveBlinkyTimer = () => {
        let blinkyTimer = NaN;

        blinkyTimer = setInterval(() => {
            let direction = getRandomDirection(redBlinkyIndex);

            const [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
            const [blinkyX, blinkyY] = getCoordinates(redBlinkyIndex);

            let alreadyMoved = false;

            directions.every((dir) => {
                const [newBlinkyX, newBlinkyY] = getCoordinates(redBlinkyIndex + dir);

                if (isCoordinateCloser(newBlinkyX, blinkyX, pacmanX) || isCoordinateCloser(newBlinkyY, blinkyY, pacmanY)) {
                    moveBlinky(dir);

                    alreadyMoved = true;

                    return false;
                }
            });

            if (!alreadyMoved) {
                moveBlinky(direction);
            }

            if (checkIfGameIsOver()) {
                endGame(blinkyTimer);
            }
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
                if (!checkIfObstacleExists(pacmanIndex, direction, 'wall')) {
                    wakaSound.play();

                    let className = 'pac-man';

                    removeClass(pacmanIndex, className);

                    pacmanIndex += direction;

                    addClass(pacmanIndex, className);
                } 
                else if (checkIfGameIsOver()) {
                    endGame(blinkyTimer);
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
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    const squares = [];

    let pacmanIndex = 489;
    let redBlinkyIndex = 377;

    let pacmanTimer = NaN;

    let btnStart = document.getElementById("humanAgentStart");

    btnStart.onclick = startGame;

    let handleEnter = (event) => {
        if (event.key === 'Enter') {
            startGame();

            document.removeEventListener('keydown', handleEnter);
        }
    }

    document.addEventListener('keydown', handleEnter);
});