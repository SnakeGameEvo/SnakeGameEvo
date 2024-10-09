import React, { Component } from 'react';

import './play_area.css';

class PlayArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: 10,
            column: 10,
            grid: [],
            snake: {
                head: {},
            },
            currentDirection: 'right',
        };
    };

    // Generating random positions for the food
    generateRandomGrids() {
        const currentFoodGrid = {
            row: Math.floor(Math.random() * this.state.row),
            col: Math.floor(Math.random() * this.state.column),
        };
        return currentFoodGrid;
    };

    getCenterOfGrid() {
        return {
            row: Math.floor((this.state.row - 1) / 2),
            col: Math.floor((this.state.column - 1) / 2),
        };
    }

    // Reads and toggles the key pressed by the user
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
        };
    };

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

        // Boundary check
        if (newHead.row < 0 || newHead.row >= this.state.row || newHead.col < 0 || newHead.col >= this.state.column) {
            alert('Game over! Snake hit the boundary.');
            clearInterval(this.movementInterval);
            return;
        }

        // Updating the grid to reflect the new head position
        const newGrid = grid.map((cell) => {
            if (cell.row === snake.head.row && cell.col === snake.head.col) {
                return { ...cell, isHead: false };  // Unmark old head position
            }
            if (cell.row === newHead.row && cell.col === newHead.col) {
                return { ...cell, isHead: true };   // Mark new head position
            }
            return cell;  // Leave other cells unchanged
        });

        // Update the snake's head position and the grid
        this.setState({ snake: { head: newHead }, grid: newGrid });
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyPress);

        const gameGrid = [];
        const food = this.generateRandomGrids();
        const snakeHead = this.getCenterOfGrid();

        for (let row = 0; row < this.state.row; row++) {
            for (let col = 0; col < this.state.column; col++) {
                const isFood = (food.row === row && food.col === col);  // Is this a food cell?
                const isHead = (snakeHead.row === row && snakeHead.col === col);  // Is this the snake's head?
                gameGrid.push({ row, col, isFood, isHead });
            }
        }

        // Set initial grid, snake head position, and the initial direction
        this.setState({ grid: gameGrid, snake: { head: snakeHead }, currentDirection: 'right' });

        // Call moveSnake every 200ms to keep the snake moving
        this.movementInterval = setInterval(this.moveSnake, 700);
    }

    componentWillUnmount() {
        // Prevents memory leakage
        window.removeEventListener('keydown', this.handleKeyPress);
        clearInterval(this.movementInterval);  // Clear interval on unmount to prevent memory leaks
    }

    render() {
        const gridBoxes = this.state.grid.map((grid_box) => {
            const className = grid_box.isHead
                ? 'grid-item is-head'
                : grid_box.isFood
                    ? 'grid-item is-food'
                    : 'grid-item';

            return <div key={grid_box.row.toString() + "-" + grid_box.col.toString()} className={className} ></div>
        });

        return (
            <>
                <section className='board'>
                    <article className='grid-lines'>
                        {gridBoxes}
                    </article>
                </section>
            </>
        );
    };
}

export default PlayArea;
