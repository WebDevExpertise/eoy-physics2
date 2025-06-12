export class QuantumCircuitDemo {
    constructor() {
        console.log('QuantumCircuitDemo constructor called');
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
        this.init();
    }

    init() {
        this.createCanvas();
        this.generateMaze();
        this.initializeSolvers();
        this.addControls();
        this.animate();
    }

    createCanvas() {
        const container = document.getElementById('all-concepts-demo');
        if (!container) {
            console.error('Container not found for maze demo');
            return;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 360;
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            background: #0f172a;
            border-radius: 1.5rem;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
        `;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        console.log('Maze canvas created and added to container');
    }

    generateMaze() {
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
            [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
            [1,1,1,0,1,0,1,1,1,1,1,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
    }

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

    addControls() {
        // Simple event listeners for existing HTML buttons
        const classicalBtn = document.getElementById('maze-classical-btn');
        const quantumBtn = document.getElementById('maze-quantum-btn');
        const raceBtn = document.getElementById('maze-race-btn');
        
        console.log('Buttons found:', classicalBtn, quantumBtn, raceBtn);
        
        if (classicalBtn) {
            classicalBtn.addEventListener('click', () => {
                console.log('Classical solver button clicked');
                this.runClassicalSolver();
            });
        }
        
        if (quantumBtn) {
            quantumBtn.addEventListener('click', () => {
                console.log('Quantum solver button clicked');
                this.runQuantumSolver();
            });
        }
        
        if (raceBtn) {
            raceBtn.addEventListener('click', () => {
                console.log('Race button clicked');
                this.runRace();
            });
        }
        
        console.log('Maze controls initialized');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMaze();
        this.drawStartAndGoal();
        this.drawTrails();
        this.drawSolvers();
    }

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

    async runClassicalSolver() {
        console.log('runClassicalSolver called');
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateStatus('Classical solver: Trying paths sequentially...');
        
        this.resetSolvers();
        this.classicalSolver.visible = true;
        
        const paths = [
            [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 2, y: 3}, {x: 1, y: 3}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5}, {x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 13, y: 6}, {x: 13, y: 7}]
        ];
        
        for (let pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            this.updateStatus(`Classical: Trying path ${pathIndex + 1}...`);
            
            for (let step = 0; step < paths[pathIndex].length; step++) {
                const pos = paths[pathIndex][step];
                this.classicalSolver.x = pos.x;
                this.classicalSolver.y = pos.y;
                this.classicalSolver.trail.push({...pos});
                this.draw();
                await this.sleep(120);
            }
            
            if (pathIndex === 0) {
                this.updateStatus('Path 1 hit dead end - backtracking...');
                await this.sleep(800);
                this.classicalSolver.x = this.start.x;
                this.classicalSolver.y = this.start.y;
                this.classicalSolver.trail = [];
                await this.sleep(400);
            }
        }
        
        this.updateStatus('Classical solver found the path!');
        this.isRunning = false;
    }

    async runQuantumSolver() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateStatus('Quantum solver: Superposition - exploring all paths simultaneously!');
        
        this.resetSolvers();
        this.quantumSolvers.forEach(solver => solver.visible = true);
        
        const paths = [
            [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 2, y: 3}, {x: 1, y: 3}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 1, y: 6}, {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}],
            [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5}, {x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 13, y: 6}, {x: 13, y: 7}]
        ];
        
        const maxSteps = Math.max(...paths.map(p => p.length));
        
        for (let step = 0; step < maxSteps; step++) {
            for (let i = 0; i < this.quantumSolvers.length; i++) {
                if (paths[i] && paths[i][step]) {
                    const pos = paths[i][step];
                    this.quantumSolvers[i].x = pos.x;
                    this.quantumSolvers[i].y = pos.y;
                    this.quantumSolvers[i].trail.push({...pos});
                }
            }
            this.draw();
            await this.sleep(80);
        }
        
        this.updateStatus('Entanglement: Connected quantum paths...');
        await this.sleep(1000);
        
        this.updateStatus('Interference: Eliminating impossible paths...');
        for (let i = 0; i < 3; i++) {
            this.quantumSolvers[i].opacity *= 0.2;
        }
        this.draw();
        await this.sleep(1000);
        
        this.updateStatus('Measurement: Quantum state collapses to optimal path!');
        for (let i = 0; i < 3; i++) {
            this.quantumSolvers[i].visible = false;
        }
        this.quantumSolvers[3].color = '#22c55e';
        this.quantumSolvers[3].opacity = 1.0;
        this.draw();
        
        this.isRunning = false;
    }

    async runRace() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateStatus('RACE MODE: Classical vs Quantum - Who finds the path faster?');
        
        this.resetSolvers();
        this.classicalSolver.visible = true;
        this.quantumSolvers.forEach(solver => solver.visible = true);
        
        const classicalPromise = this.runClassicalRace();
        const quantumPromise = this.runQuantumRace();
        
        await Promise.race([classicalPromise, quantumPromise]);
        
        this.updateStatus('Quantum wins! Parallelism beats sequential search.');
        this.isRunning = false;
    }

    async runClassicalRace() {
        const path = [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5}, {x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 13, y: 6}, {x: 13, y: 7}];
        
        for (let step = 0; step < path.length; step++) {
            const pos = path[step];
            this.classicalSolver.x = pos.x;
            this.classicalSolver.y = pos.y;
            this.classicalSolver.trail.push({...pos});
            this.draw();
            await this.sleep(150);
        }
    }

    async runQuantumRace() {
        const path = [{x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5}, {x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 13, y: 6}, {x: 13, y: 7}];
        
        this.quantumSolvers.forEach(solver => solver.visible = true);
        
        for (let step = 0; step < path.length; step++) {
            const pos = path[step];
            this.quantumSolvers.forEach(solver => {
                solver.x = pos.x;
                solver.y = pos.y;
                solver.trail.push({...pos});
            });
            this.draw();
            await this.sleep(60);
        }
        
        for (let i = 1; i < this.quantumSolvers.length; i++) {
            this.quantumSolvers[i].visible = false;
        }
        this.quantumSolvers[0].color = '#22c55e';
        this.draw();
    }

    resetSolvers() {
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

    updateStatus(message) {
        const statusDisplay = document.getElementById('maze-status-display');
        if (statusDisplay) {
            statusDisplay.textContent = message;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.draw();
    }
}
