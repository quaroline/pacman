document.addEventListener('DOMContentLoaded', () => {
    var createBoard = () => {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div');
    
            grid.appendChild(square);
            squares.push(square);
    
            if (layout[i] === 1)
                squares[i].classList.add('wall');
        }
    }
    
    var getCoordinates = (index) => [index % width, Math.floor(index / width)];

    var getDirection = () => directions[Math.floor(Math.random() * directions.length)];
    
    var checkIfObstacleExists = (index, direction) => squares[index + direction].classList.contains('wall');

    var moveBlinky = () => {
        let direction = getDirection();

        let ghostTimerId = NaN;

        ghostTimerId = setInterval(() => {
            if (!checkIfObstacleExists(blinkyIndex, direction)) {
                squares[blinkyIndex].classList.remove('blinky');

                const [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
                const [blinkyX, blinkyY] = getCoordinates(blinkyIndex);

                const [newBlinkyX, newBlinkyY] = getCoordinates(blinkyIndex + direction);

                var isXCloser = () => ((newBlinkyX - pacmanX) > (blinkyX - pacmanX));
                var isYCloser = () => ((newBlinkyY - pacmanY) > (blinkyY - pacmanY));

                var addBlinkyClass = () => squares[blinkyIndex].classList.add('blinky');

                if (isXCloser() || isYCloser()) {
                    blinkyIndex += direction;

                    addBlinkyClass();
                }
                else {
                    addBlinkyClass();

                    direction = getDirection();
                }

                addBlinkyClass();
            } else
                direction = getDirection();

            if (squares[blinkyIndex].classList.contains('pac-man')) 
                clearInterval(ghostTimerId);
        }, 200);
    }

    var movePacman = (pressedKey) => {
        const acceptedMoves = {
            ArrowUp() {
                if (pacman.y - 1 >= 0) 
                    pacman.y -= 1;
            },
            ArrowRight() {
                if (pacman.x + 1 < screen.width) 
                    pacman.x += 1;
            },
            ArrowDown() { 
                if (pacman.y + 1 < screen.width) 
                    pacman.y += 1; 
            }, 
            ArrowLeft() { 
                if (pacman.x - 1 >= 0) 
                    pacman.x -= 1; 
            }
        }

        const moveFunction = acceptedMoves[pressedKey];

        //let isThereAnObstacle = checkIfObstacleExists(pacmanIndex, getDirection());

        if (!isThereAnObstacle && moveFunction) {
            let pacmanActualCoordinates = pacman;

            moveFunction();

            let pacmanNextCoordinates = pacman;
        }
    }

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

    let pacmanIndex = 502;
    let blinkyIndex = 197;

    let pacmanCoordinates = getCoordinates(pacmanIndex);

    const pacman = {
        x: pacmanCoordinates[0],
        y: pacmanCoordinates[1]
    };

    squares[pacmanIndex].classList.add('pac-man');
    squares[blinkyIndex].classList.add('blinky');

    document.addEventListener('keydown', (event) => movePacman(event.key));

    moveBlinky();
});