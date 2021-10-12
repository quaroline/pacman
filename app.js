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
    
    var getCoordinates = (index) => [index % width, Math.floor(index / width)];

    var getRandomDirection = () => directions[Math.floor(Math.random() * directions.length)];
    
    var checkIfObstacleExists = (index, direction) => squares[index + direction].classList.contains('wall');

    var moveBlinky = (direction) => {
        if (!checkIfObstacleExists(redBlinkyIndex, direction)) {
            squares[redBlinkyIndex].classList.remove('red-blinky');

            redBlinkyIndex += direction;

            squares[redBlinkyIndex].classList.add('red-blinky');
        }
    }

    var createMoveBlinkyTimer = () => {
        let blinkyTimer = NaN;

        blinkyTimer = setInterval(() => {
            //265 é o pixel acima do início do jogo
            moveBlinky(directions[3]);

            if (squares[redBlinkyIndex].classList.contains('pac-man')) {
                clearInterval(pacmanTimer);

                wakaSound.pause();

                const deathSound = new Audio('assets/death.mp3');

                deathSound.volume = 0.2;
                deathSound.play();

                clearInterval(blinkyTimer);
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
        }

        const moveFunction = acceptedMoves[pressedKey];

        if (moveFunction) {
            let direction = moveFunction();

            pacmanTimer = setInterval(() => {
                if (!checkIfObstacleExists(pacmanIndex, direction)) {
                    wakaSound.play();

                    squares[pacmanIndex].classList.remove('pac-man');

                    pacmanIndex += direction;

                    squares[pacmanIndex].classList.add('pac-man');
                } else {
                    clearInterval(pacmanTimer);

                    wakaSound.pause();
                }
            }, 180);
        }
    }

    const wakaSound = new Audio('assets/waka.mp3');

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

    createBoard();

    let pacmanIndex = 489;
    let redBlinkyIndex = 377;

    let pacmanTimer = NaN;

    squares[pacmanIndex].classList.add('pac-man');
    squares[redBlinkyIndex].classList.add('red-blinky');

    wakaSound.volume = 0.2;

    document.addEventListener('keydown', (event) => movePacman(event.key));

    createMoveBlinkyTimer();
});