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
    
        document.addEventListener('keydown', (event) => movePacman(event.key));
    }
    
    var getCoordinates = (index) => [index % width, Math.floor(index / width)];

    var getRandomDirection = () => directions[Math.floor(Math.random() * directions.length)];
    
    var checkIfObstacleExists = (index, direction) => squares[index + direction].classList.contains('wall');

    var addBlinkyClass = () => squares[redBlinkyIndex].classList.add('red-blinky');

    var removeBlinkyClass = () => squares[redBlinkyIndex].classList.remove('red-blinky');

    var moveBlinky = (direction) => {
        if (blinkyMoveQuantity < 3) {
            direction = directions[3];

            blinkyMoveQuantity++;
        }

        while (checkIfObstacleExists(redBlinkyIndex, direction)) {
            direction = getRandomDirection();
        }

        removeBlinkyClass();

        lastDirection = direction;
        redBlinkyIndex += direction;

        addBlinkyClass();
    }

    var createMoveBlinkyTimer = () => {
        let blinkyTimer = NaN;

        blinkyTimer = setInterval(() => {
            let direction = getRandomDirection();

            while (redBlinkyIndex + direction === 321 || redBlinkyIndex + direction === 322) 
                direction = getRandomDirection();

            const [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
            const [blinkyX, blinkyY] = getCoordinates(redBlinkyIndex);

            const [newBlinkyX, newBlinkyY] = getCoordinates(redBlinkyIndex + direction);

            var isXCloser = () => ((newBlinkyX - pacmanX) > (blinkyX - pacmanX));
            var isYCloser = () => ((newBlinkyY - pacmanY) > (blinkyY - pacmanY));

            if (isXCloser() || isYCloser()) {
                moveBlinky(direction);
            }

            if (squares[redBlinkyIndex].classList.contains('pac-man')) {
                squares[redBlinkyIndex].classList.remove('pac-man')

                clearInterval(pacmanTimer);

                wakaSound.pause();

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

    document.addEventListener('keydown', handleEnter = (event) => {
        if (event.key === 'Enter') {
            startGame();

            // Corrigir bug aqui:
            document.removeEventListener('keydown', handleEnter);
        }
    });
});