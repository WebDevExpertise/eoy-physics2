export class MazeDemo {
    // Sets up the maze demonstration with initial properties and predefined solution paths
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.maze = [];
        this.cellSize = 40;
        this.start = {x: 1, y: 1};
        this.goal = {x: 13, y: 7};
        this.classicalSolver = {x: 1, y: 1, visible: false, trail: []};
        this.quantumSolvers = [];
        this.isRunning = false;
        this.animationId = null;
        this.startTime = null;
        this.stopwatchInterval = null;
        this.init();
        this.paths = [
            [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3}, {x: 7, y: 3}],
            [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 5, y: 2}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1}, {x: 9, y: 1}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 3, y: 6}, {x: 3, y: 7}, {x: 2, y: 7}, {x: 1, y: 7}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 5, y: 6}, {x: 5, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}, {x: 7, y: 7}, {x: 8, y: 7}, {x: 9, y: 7}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 13, y: 8}],
        ];
    }

    // Creates the canvas, maze, solvers, controls and starts the animation
    init() {
        this.createCanvas();
        this.generateMaze();
        this.initializeSolvers();
        this.addControls();
        this.animate();
    }

    // Creates a 2D canvas with proper scaling for clear display on all devices
    createCanvas() {
        const container = document.getElementById('all-concepts-demo');
        if (!container) {
            return;
        }

        this.canvas = document.createElement('canvas');
        
        const mazeWidth = 15;
        const mazeHeight = 9;
        const idealCellSize = 45;
        
        const canvasWidth = mazeWidth * idealCellSize;
        const canvasHeight = mazeHeight * idealCellSize;
        
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = canvasWidth * dpr;
        this.canvas.height = canvasHeight * dpr;
        
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';
        
        this.ctx = this.canvas.getContext('2d');
        
        this.ctx.scale(dpr, dpr);
        
        this.cellSize = idealCellSize;
        
        this.canvas.style.cssText = `
            background: #0f172a;
            border-radius: 1.5rem;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
            display: block;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        `;
        
        container.appendChild(this.canvas);
    }

    // Creates the maze layout with walls (1) and open paths (0)
    generateMaze() {
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,1,1,0,1,0,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1]
        ];
    }

    // Sets up the classical and quantum solver objects with their initial properties
    initializeSolvers() {
        this.classicalSolver = {
            x: this.start.x,
            y: this.start.y,
            visible: false,
            color: '#ef4444',
            trail: []
        };

        this.quantumSolvers = [
            { x: this.start.x, y: this.start.y, visible: false, color: '#8b5cf6', opacity: 0.9, trail: [] },
            { x: this.start.x, y: this.start.y, visible: false, color: '#a855f7', opacity: 0.7, trail: [] },
            { x: this.start.x, y: this.start.y, visible: false, color: '#c084fc', opacity: 0.6, trail: [] },
            { x: this.start.x, y: this.start.y, visible: false, color: '#d8b4fe', opacity: 0.5, trail: [] }
        ];
    }

    // Sets up click event listeners for the classical and quantum solver buttons
    addControls() {
        setTimeout(() => {
            const classicalBtn = document.getElementById('maze-classical-btn');
            const quantumBtn = document.getElementById('maze-quantum-btn');
            
            if (classicalBtn) {
                classicalBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.runClassicalSolver();
                });
            }
        
            if (quantumBtn) {
                quantumBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.runQuantumSolver();
                });
            }
        }, 100);
    }

    // Clears the canvas and draws all maze elements in the correct order
    draw() {
        const logicalWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const logicalHeight = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        this.drawMaze();
        this.drawStartAndGoal();
        this.drawTrails();
        this.drawSolvers();
    }

    // Draws the maze walls and open paths with different colors
    drawMaze() {
        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[row].length; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                if (this.maze[row][col] === 1) {
                    this.ctx.fillStyle = '#1e293b';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                    this.ctx.strokeStyle = '#334155';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                } else {
                    this.ctx.fillStyle = '#0f172a';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
    }

    // Draws the start and goal markers with labels
    drawStartAndGoal() {
        const startX = this.start.x * this.cellSize + this.cellSize / 2;
        const startY = this.start.y * this.cellSize + this.cellSize / 2;
        
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('START', startX, startY + 28);
        
        const goalX = this.goal.x * this.cellSize + this.cellSize / 2;
        const goalY = this.goal.y * this.cellSize + this.cellSize / 2;
        
        this.ctx.fillStyle = '#22c55e';
        this.ctx.beginPath();
        this.ctx.arc(goalX, goalY, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('GOAL', goalX, goalY + 28);
    }

    // Draws the classical and quantum solver dots on the maze
    drawSolvers() {
        if (this.classicalSolver.visible) {
            const x = this.classicalSolver.x * this.cellSize + this.cellSize / 2;
            const y = this.classicalSolver.y * this.cellSize + this.cellSize / 2;
            
            this.ctx.fillStyle = this.classicalSolver.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        this.quantumSolvers.forEach(solver => {
            if (solver.visible) {
                const x = solver.x * this.cellSize + this.cellSize / 2;
                const y = solver.y * this.cellSize + this.cellSize / 2;
                
                this.ctx.globalAlpha = solver.opacity;
                this.ctx.fillStyle = solver.color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        });
    }

    // Draws colored trails showing the paths taken by the solvers
    drawTrails() {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        if (this.classicalSolver.trail.length > 0) {
            this.ctx.strokeStyle = this.classicalSolver.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.classicalSolver.trail.forEach((point, index) => {
                const x = point.x * this.cellSize + this.cellSize / 2;
                const y = point.y * this.cellSize + this.cellSize / 2;
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
        
        this.quantumSolvers.forEach(solver => {
            if (solver.trail.length > 0) {
                this.ctx.strokeStyle = solver.color;
                this.ctx.globalAlpha = solver.opacity * 0.6;
                this.ctx.beginPath();
                solver.trail.forEach((point, index) => {
                    const x = point.x * this.cellSize + this.cellSize / 2;
                    const y = point.y * this.cellSize + this.cellSize / 2;
                    if (index === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                });
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        });
    }

    // Runs the classical pathfinding algorithm by trying each path sequentially
    async runClassicalSolver() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.disableButtons();
        this.updateStatus('Trying paths sequentially...');
        
        this.resetSolvers();
        this.classicalSolver.visible = true;
        this.startStopwatch();
        
        for (let pathIndex = 0; pathIndex < this.paths.length; pathIndex++) {
            this.updateStatus(`Trying path ${pathIndex + 1} of ${this.paths.length}...`);
            
            for (let step = 0; step < this.paths[pathIndex].length; step++) {
                const pos = this.paths[pathIndex][step];
                this.classicalSolver.x = pos.x;
                this.classicalSolver.y = pos.y;
                this.classicalSolver.trail.push({...pos});
                this.draw();
                await this.sleep(100);
            }
            
            if (pathIndex < this.paths.length - 1) {
                this.updateStatus(`Path ${pathIndex + 1} hit a dead end. Backtracking...`);
                await this.sleep(800);
                this.classicalSolver.x = this.start.x;
                this.classicalSolver.y = this.start.y;
                this.classicalSolver.trail = [];
                await this.sleep(400);
            }
        }
        
        const finalTime = this.stopStopwatch();
        this.updateStatus(`Classical solver found the path in ${finalTime.toFixed(2)}s`);
        this.isRunning = false;
        this.enableButtons();
    }

    // Runs the quantum pathfinding showing superposition, entanglement, interference, and decoherence
    async runQuantumSolver() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.disableButtons();
        this.updateStatus('Superposition (exploring all paths simultaneously)');
        
        this.resetSolvers();
        this.quantumSolvers.forEach(solver => solver.visible = true);
        this.startStopwatch();
        
        const maxSteps = Math.max(...this.paths.map(p => p.length));

        for (let step = 0; step < maxSteps; step++) {
            for (let i = 0; i < this.quantumSolvers.length; i++) {
                if (this.paths[i] && this.paths[i][step]) {
                    const pos = this.paths[i][step];
                    this.quantumSolvers[i].x = pos.x;
                    this.quantumSolvers[i].y = pos.y;
                    this.quantumSolvers[i].trail.push({...pos});
                }
            }
            this.draw();
            await this.sleep(80);
        }
        
        this.updateStatus('Entanglement (all quantum path results "communicate" with each other...');
        await this.sleep(1000);
        
        this.updateStatus('Interference (dead-end paths destructively interfere and fade)...');
        for (let i = 0; i < 3; i++) {
            this.quantumSolvers[i].opacity *= 0.15;
        }
        this.draw();
        await this.sleep(1500);

        this.updateStatus('Decoherence (quantum state collapses to the correct solution)');
        for (let i = 0; i < 3; i++) {
            this.quantumSolvers[i].visible = false;
        }
        this.quantumSolvers[3].color = '#22c55e';
        this.quantumSolvers[3].opacity = 1.0;
        this.draw();
        
        const finalTime = this.stopStopwatch();
        this.updateStatus(`Quantum solver found the path in ${finalTime.toFixed(2)}s`);
        this.isRunning = false;
        this.enableButtons();
    }

    // Resets all solvers to their starting positions and clears their trails
    resetSolvers() {
        this.stopStopwatch();
        this.updateStopwatch(0);
        
        this.classicalSolver.x = this.start.x;
        this.classicalSolver.y = this.start.y;
        this.classicalSolver.visible = false;
        this.classicalSolver.trail = [];
        
        this.quantumSolvers.forEach((solver, i) => {
            solver.x = this.start.x;
            solver.y = this.start.y;
            solver.visible = false;
            solver.trail = [];
            solver.opacity = [0.9, 0.7, 0.6, 0.5][i] || 0.5;
            solver.color = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'][i] || '#8b5cf6';
        });
    }

    // Updates the status message displayed to the user
    updateStatus(message) {
        const statusDisplay = document.getElementById('maze-status-display');
        if (statusDisplay) {
            statusDisplay.textContent = message;
        }
    }

    // Updates the stopwatch display with the current time
    updateStopwatch(time) {
        const stopwatchDisplay = document.getElementById('maze-stopwatch');
        if (stopwatchDisplay) {
            stopwatchDisplay.textContent = `⏱️ ${time.toFixed(2)}s`;
        }
    }

    // Starts the timer and updates it every 10ms for smooth animation
    startStopwatch() {
        this.startTime = Date.now();
        this.stopwatchInterval = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.updateStopwatch(elapsed);
        }, 10);
    }

    // Stops the timer and returns the final elapsed time
    stopStopwatch() {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
        }
        const finalTime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
        this.updateStopwatch(finalTime);
        return finalTime;
    }

    // Disables both solver buttons while a solver is running
    disableButtons() {
        const classicalBtn = document.getElementById('maze-classical-btn');
        const quantumBtn = document.getElementById('maze-quantum-btn');
        if (classicalBtn) classicalBtn.disabled = true;
        if (quantumBtn) quantumBtn.disabled = true;
    }

    // Re-enables both solver buttons when solving is complete
    enableButtons() {
        const classicalBtn = document.getElementById('maze-classical-btn');
        const quantumBtn = document.getElementById('maze-quantum-btn');
        if (classicalBtn) classicalBtn.disabled = false;
        if (quantumBtn) quantumBtn.disabled = false;
    }

    // Creates a delay for the specified number of milliseconds
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Continuously renders the maze display in a loop
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.draw();
    }
}
