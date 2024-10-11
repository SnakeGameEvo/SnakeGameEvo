import React, { Component } from 'react';
import './play_area.css';

// Player class to manage player information
export class Player {
    constructor(name) {
        this.name = name;
    }
}

class PlayArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: 10,
            column: 10,
            grid: [],
            snake: {
                head: {},
                body: [],
            },
            currentDirection: 'right',
            food: null,
            score: 0, // Move score to state for React to track it
        };
    }

    // Generate random grid positions for food
    generateRandomGrids() {
        const currentFoodGrid = {
            row: Math.floor(Math.random() * this.state.row),
            col: Math.floor(Math.random() * this.state.column),
        };
        return currentFoodGrid;
    }

    getCenterOfGrid() {
        return {
            row: Math.floor((this.state.row - 1) / 2),
            col: Math.floor((this.state.column - 1) / 2),
        };
    }

    handleKeyPress = (event) => {
        switch (event.key) {
            case 'ArrowUp':
                this.setState({ currentDirection: 'up' });
                break;
            case 'ArrowDown':
                this.setState({ currentDirection: 'down' });
                break;
            case 'ArrowLeft':
                this.setState({ currentDirection: 'left' });
                break;
            case 'ArrowRight':
                this.setState({ currentDirection: 'right' });
                break;
            default:
                break;
        }
    };

    isEatingFood = (head) => {
        const { food } = this.state;
        return food && head.row === food.row && head.col === food.col;
    };

    generateNewFood = () => {
        const { snake, row, column } = this.state;
        let newFood;
        let isOnSnake;

        do {
            newFood = {
                row: Math.floor(Math.random() * row),
                col: Math.floor(Math.random() * column),
            };

            isOnSnake = snake.body.some(segment => segment.row === newFood.row && segment.col === newFood.col)
                || (snake.head.row === newFood.row && snake.head.col === newFood.col);

        } while (isOnSnake);

        this.setState({ food: newFood });
        return newFood;
    }

    moveSnake = () => {
        const { currentDirection, snake, grid } = this.state;
        const newHead = { ...snake.head };

        switch (currentDirection) {
            case 'up':
                newHead.row -= 1;
                break;
            case 'down':
                newHead.row += 1;
                break;
            case 'left':
                newHead.col -= 1;
                break;
            case 'right':
                newHead.col += 1;
                break;
            default:
                break;
        }

        if (newHead.row < 0 || newHead.row >= this.state.row || newHead.col < 0 || newHead.col >= this.state.column) {
            alert('Game over! Snake hit the boundary.');
            clearInterval(this.movementInterval);
            this.saveUserData(); // Save player data when the game is over
            return;
        }

        const ateFood = this.isEatingFood(newHead);

        let newFood = this.state.food;
        if (ateFood) {
            newFood = this.generateNewFood();
            this.incrementScore(); // Increment the score on food consumption
        }

        const newGrid = grid.map((cell) => {
            if (cell.row === snake.head.row && cell.col === snake.head.col) {
                return { ...cell, isHead: false };
            }
            if (cell.row === newHead.row && cell.col === newHead.col) {
                return { ...cell, isHead: true };
            }
            if (ateFood && cell.row === this.state.food.row && cell.col === this.state.food.col) {
                return { ...cell, isFood: false };
            }
            if (cell.row === newFood.row && cell.col === newFood.col) {
                return { ...cell, isFood: true };
            }
            return cell;
        });

        const newBody = [...snake.body];

        if (ateFood) {
            newBody.unshift(snake.head);
        } else {
            newBody.unshift(snake.head);
            newBody.pop();
        }

        this.setState({ snake: { head: newHead, body: newBody }, grid: newGrid, food: newFood });
    }

    incrementScore = () => {
        this.setState(prevState => ({ score: prevState.score + 10 }));
    }

    // Save user data to PHP (name and score)
    saveUserData = () => {
        const { name, score } = this.state;

        // Sending a POST request to PHP backend
        fetch('http://localhost/snake-game/backend/users/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyPress);

        const gameGrid = [];
        const food = this.generateRandomGrids();
        const snakeHead = this.getCenterOfGrid();

        for (let row = 0; row < this.state.row; row++) {
            for (let col = 0; col < this.state.column; col++) {
                const isFood = (food.row === row && food.col === col);
                const isHead = (snakeHead.row === row && snakeHead.col === col);
                gameGrid.push({ row, col, isFood, isHead });
            }
        }

        this.setState({ grid: gameGrid, snake: { head: snakeHead, body: [] }, food, currentDirection: 'right' });

        this.movementInterval = setInterval(this.moveSnake, 700);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyPress);
        clearInterval(this.movementInterval);
    }

    render() {
        const gridBoxes = this.state.grid.map((grid_box) => {
            const isHead = grid_box.isHead;
            const isBody = this.state.snake.body.some(segment => segment.row === grid_box.row && segment.col === grid_box.col);
            const isFood = this.state.food && this.state.food.row === grid_box.row && this.state.food.col === grid_box.col;

            const className = isHead
                ? 'grid-item is-head'
                : isBody
                    ? 'grid-item is-body'
                    : isFood
                        ? 'grid-item is-food'
                        : 'grid-item';

            return <div key={grid_box.row + "-" + grid_box.col} className={className}></div>;
        });

        return (
            <>
                <section className='board'>
                    <article className='grid-lines'>
                        {gridBoxes}
                    </article>
                </section>
                <div className="score-board">
                    <h1>Player: {this.props.player.name}</h1>
                    <h2>Score: {this.state.score}</h2>
                </div>
            </>
        );
    }
}

export default PlayArea;
