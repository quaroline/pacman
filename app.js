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
        squares[blinkyIndex].classList.add('blinky');
    
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

    function shuffle(ind, array) {
        let arr = []
        let index = ind % 4
        for (let i = 0; i < 4; i++) {
          arr.push(array[(index + i) % 4])
        }
        return arr
      }

    function getAdjacences(ind, queue, point) {
        if (typeof point !== 'undefined') {
          let adj = shuffle(ind, [{
            x: point.x,
            y: point.y - 1,
            checked: false
          }, {
            x: point.x,
            y: point.y + 1,
            checked: false
          }, {
            x: point.x - 1,
            y: point.y,
            checked: false
          }, {
            x: point.x + 1,
            y: point.y,
            checked: false
          }])
          return adj.filter((value) =>
            ((value.x >= 1 && value.x < width && value.y < width && value.y >= 1 && !isContained(map, value) && !isContained(queue, value))))
        } else {
          return []
        }
      }

    // var directionLEFT = directions[0];
    // var directionRIGHT = directions[1];
    // var directionDOWN = directions[2];
    // var directionUP = directions[3];

    var routeSquare = function(i){
        var self = this;

        self.index = i;

        let [selfX, selfY] = getCoordinates(i);

        self.coordinates = {x : selfX, y: selfY};

        self.CheckedLeft = false;

        self.CheckedRight = false;

        self.CheckedDown = false;

        self.CheckedUp = false;

        self.CurrentStep = 0;

        self.CanGoLeft = !checkIfObstacleExists(i, directions[0], 'exit-door') && 
        !checkIfObstacleExists(i, directions[0], 'wall');

        self.CanGoRight = !checkIfObstacleExists(i, directions[1], 'exit-door') && 
        !checkIfObstacleExists(i, directions[1], 'wall');

        self.CanGoDown = !checkIfObstacleExists(i, directions[2], 'exit-door') && 
        !checkIfObstacleExists(i, directions[2], 'wall');

        self.CanGoUp = !checkIfObstacleExists(i, directions[3], 'exit-door') && 
        !checkIfObstacleExists(i, directions[3], 'wall');

        self.Bifurcation = [self.CanGoLeft,self.CanGoRight,self.CanGoDown,self.CanGoUp].filter((v) => {return v;}).length > 1;
    };

    var GetRoute = function(index, sqrs, cameFromDirection, stepsTaken, results){
        let [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
    
        let pacmanCoords = { x: pacmanX, y: pacmanY };

        let [currentX, currentY] = getCoordinates(index);

        let currentCoords = { x: currentX, y: currentY };

        stepsTaken.qty++;

        let result = {foundPacman: false, stepsTakenQty: stepsTaken.qty};

        // se chegou no pacman, rota concluida
        if(currentCoords.x == pacmanCoords.x && currentCoords.y == pacmanCoords.y) {
            result = { foundPacman: true, stepsTakenQty: stepsTaken.qty };
            return result;
        }

        let currentSqr = sqrs.find((s) => { return s.coordinates.x == currentCoords.x && s.coordinates.y == currentCoords.y; });

        if(!currentSqr){
            currentSqr = new routeSquare(index);
            currentSqr.CurrentStep = stepsTaken.qty;
            sqrs.push(currentSqr);
        } 

        let Bifurcation = [currentSqr.CanGoLeft && cameFromDirection != -1,currentSqr.CanGoRight && cameFromDirection != 1,currentSqr.CanGoDown && cameFromDirection != 28,currentSqr.CanGoUp && cameFromDirection != -28].filter((v) => {return v;}).length > 1;

        var goLeft = {
            f: function(){
                currentSqr.CheckedLeft = true;
                
                stepsTaken.qty = currentSqr.CurrentStep;
    
                result = GetRoute(index + directions[0], sqrs, (-1 * directions[0]), stepsTaken, results);
    
                if(result.foundPacman && !results.find((r) => r.stepsTakenQty == result.stepsTakenQty))
                    results.push(result);
                else {
                    stepsTaken.qty--;
                    results.stepsTakenQty--;
                }
    
                return result;
            },
            valid: currentSqr.CanGoLeft && cameFromDirection != -1 && !currentSqr.CheckedLeft
        };

        var goRight ={
            f: function(){
                currentSqr.CheckedRight = true;
                
                stepsTaken.qty = currentSqr.CurrentStep;
    
                result = GetRoute(index + directions[1], sqrs, (-1 * directions[1]), stepsTaken, results);
    
                if(result.foundPacman && !results.find((r) => r.stepsTakenQty == result.stepsTakenQty))
                    results.push(result);
                else {
                    stepsTaken.qty--;
                    results.stepsTakenQty--;
                }
    
                return result;   
            },
            valid: currentSqr.CanGoRight && cameFromDirection != 1 && !currentSqr.CheckedRight
        };

        var goDown ={
            f: function(){
                currentSqr.CheckedDown = true;
                
                stepsTaken.qty = currentSqr.CurrentStep;
    
                result = GetRoute(index + directions[2], sqrs, (-1 * directions[2]), stepsTaken, results);
    
                if(result.foundPacman && !results.find((r) => r.stepsTakenQty == result.stepsTakenQty))
                    results.push(result);
                else {
                    stepsTaken.qty--;
                    results.stepsTakenQty--;
                }
                
                return result;
            },
            valid: currentSqr.CanGoDown && cameFromDirection != 28 && !currentSqr.CheckedDown
        };

        var goUp = {
            f: function(){
                currentSqr.CheckedUp = true;
                
                stepsTaken.qty = currentSqr.CurrentStep;
                
                result = GetRoute(index + directions[3], sqrs, (-1 * directions[3]), stepsTaken, results);
    
                if(result.foundPacman && !results.find((r) => r.stepsTakenQty == result.stepsTakenQty))
                    results.push(result);
                else {
                    stepsTaken.qty--;
                    results.stepsTakenQty--;
                }
    
                return result;
            },
            valid: currentSqr.CanGoUp && cameFromDirection != -28 && !currentSqr.CheckedUp
        };

        var checkFunctions = [];

        if(currentCoords.y < pacmanCoords.y){
            checkFunctions.push(goUp);
            checkFunctions.push(goDown);
        }
        
        if(currentCoords.x < pacmanCoords.x){
            checkFunctions.push(goRight);
            checkFunctions.push(goLeft);
        }

        if(currentCoords.y > pacmanCoords.y){
            checkFunctions.push(goDown);
            checkFunctions.push(goUp);
        }
        
        if(currentCoords.x > pacmanCoords.x){
            checkFunctions.push(goLeft);
            checkFunctions.push(goRight);
        }

        for(var i = 0; i < checkFunctions.length; i++){
            if(checkFunctions[i].valid){
                result = checkFunctions[i].f();

                if(!Bifurcation)
                    break;
            }
        }

        return result;
    };

    var getDistanceBetweenTwoCoords = (direction) => {
        let steps = [];
        let stepsQty = { qty: 0 };
        let results = [];

        GetRoute(blinkyIndex + direction, steps, (-1 * direction), stepsQty, results);

        let lowerResult = results.filter((dir) => dir.foundPacman)
        .sort((a,b) => (a.stepsTakenQty > b.stepsTakenQty) ? 1 : ((b.stepsTakenQty > a.stepsTakenQty) ? -1 : 0));

        if(lowerResult.length > 0){
            return lowerResult[0].stepsTakenQty;
        }
        else {
            return 9999;
        }
    }

    var getDirectionAccordingToDistanceOfPacman = () => {
        let [pacmanX, pacmanY] = getCoordinates(pacmanIndex);
        let [blinkyX, blinkyY] = getCoordinates(blinkyIndex);

        let getDistance = (direction) => {
            let canGo = !checkIfObstacleExists(blinkyIndex, directions[direction], 'exit-door') && 
                !checkIfObstacleExists(blinkyIndex, directions[direction], 'wall');

            let distance = canGo
                ? getDistanceBetweenTwoCoords(directions[direction])
                : Infinity;

            let obj = {
                distance: distance,
                direction: directions[direction],
                available: canGo
            };

            return obj;
        }

        let left = getDistance(0);
        let right = getDistance(1);
        let down = getDistance(2);
        let up = getDistance(3);
        
        let minDistance = [left, right, down, up]
            .filter((dir) => dir.available)
            .sort((a,b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));

        debugger;

        return minDistance[0].direction;
    }
    
    var checkIfObstacleExists = (index, direction, obstacle) => squares[index + direction].classList.contains(obstacle);

    var addClass = (index, className) => squares[index].classList.add(className);

    var removeClass = (index, className) => squares[index].classList.remove(className);

    var moveBlinky = (direction) => {
        let className = 'blinky';

        if (blinkyMoveQuantity < 3 || blinkyIndex === 321 || blinkyIndex === 322) {
            direction = directions[3];

            blinkyMoveQuantity++;
        } 
        else {
            // Avoids Blinky enter the initial square again.
            squares[321].classList.add('exit-door');
            squares[322].classList.add('exit-door');

            // In case Blinky goes to the edges.
            if (blinkyIndex == 364) {
                removeClass(blinkyIndex, className);

                blinkyIndex = 391;

                direction = -1;
            }
            else if (blinkyIndex == 391) {
                removeClass(blinkyIndex, className);

                blinkyIndex = 364;

                direction = 1;
            }
            // Avoids Blinky lock itself on "come and go" movement.
            else if (lastDirection && lastDirection == (-1 * direction) &&
                !checkIfObstacleExists(blinkyIndex, lastDirection, 'exit-door') &&
                !checkIfObstacleExists(blinkyIndex, lastDirection, 'wall'))
            direction = lastDirection;
        }

        removeClass(blinkyIndex, className);

        lastDirection = direction;
        blinkyIndex += direction;

        addClass(blinkyIndex, className);

        if (checkIfGameIsOver())
            endGame();
    }

    var endGame = () => {
        squares[blinkyIndex].classList.remove('pac-man');

        document.removeEventListener('keydown', handleArrows);

        clearInterval(pacmanTimer);

        wakaSound.pause();

        deathSound.volume = 0.2;
        deathSound.play();

        clearInterval(blinkyTimer);    
    }

    var checkIfGameIsOver = () => squares[blinkyIndex].classList.contains('pac-man');

    var createMoveBlinkyTimer = () => {
        blinkyTimer = setInterval(() => {
            let direction = getDirectionAccordingToDistanceOfPacman();

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
            }, 120);
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
    let blinkyIndex = 377;

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