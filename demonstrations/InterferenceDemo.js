import { CubeComponent } from '../components/CubeComponent.js';
import { SceneComponent } from '../components/SceneComponent.js';

export class InterferenceDemo {
    // Sets up the interference demo with initial cube values and starts animation
    constructor() {
        this.cube1Value = '0';
        this.cube2Value = '1';
        this.animationTime = 0;
        this.init();
        this.animate();
    }

    // Creates the 3D scene with cubes, connections, and controls
    init() {
        this.scene = new SceneComponent('interference-demo');
        if (!this.scene.container) return;

        this.createInterferenceCubes();
        this.createConnectionLines();
        this.addControls();
        this.updateInterference();
    }

    // Creates three cubes - two input cubes at the top and one result cube at the bottom
    createInterferenceCubes() {
        const cubeComponent1 = new CubeComponent(0x10b981, 1.2);
        const cubeComponent2 = new CubeComponent(0x10b981, 1.2);
        const resultCubeComponent = new CubeComponent(0x22c55e, 1.2);

        this.cube1 = cubeComponent1.create();
        this.cube1.position.set(-1.2, 0.6, 0);

        this.cube2 = cubeComponent2.create();
        this.cube2.position.set(1.2, 0.6, 0);

        this.resultCube = resultCubeComponent.create();
        this.resultCube.position.set(0, -1.0, 0);

        this.cube1Text = cubeComponent1.addText(this.cube1, this.cube1Value);
        this.cube2Text = cubeComponent2.addText(this.cube2, this.cube2Value);
        this.resultText = resultCubeComponent.addText(this.resultCube, '0');

        this.scene.add(this.cube1);
        this.scene.add(this.cube2);
        this.scene.add(this.resultCube);
    }

    // Creates visual lines connecting the input cubes to the result cube
    createConnectionLines() {
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x22c55e, 
            transparent: true, 
            opacity: 0.6 
        });

        const points1 = [
            new THREE.Vector3(-1.2, 0.6, 0),
            new THREE.Vector3(0, -1.0, 0)
        ];
        const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        this.line1 = new THREE.Line(geometry1, lineMaterial);

        const points2 = [
            new THREE.Vector3(1.2, 0.6, 0),
            new THREE.Vector3(0, -1.0, 0)
        ];
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        this.line2 = new THREE.Line(geometry2, lineMaterial);

        this.scene.add(this.line1);
        this.scene.add(this.line2);
    }

    // Sets up clicking on the input cubes to change their values
    addControls() {
        this.scene.addClickControls((raycaster) => {
            const intersects1 = raycaster.intersectObject(this.cube1);
            const intersects2 = raycaster.intersectObject(this.cube2);
            
            if (intersects1.length > 0) {
                this.toggleCube1Value();
            } else if (intersects2.length > 0) {
                this.toggleCube2Value();
            }
        });
    }

    // Changes the first cube's value between 0 and 1 when clicked
    toggleCube1Value() {
        this.cube1Value = this.cube1Value === '0' ? '1' : '0';
        this.updateCubeText(this.cube1, this.cube1Text, this.cube1Value);
        this.updateInterference();
    }

    // Changes the second cube's value between 0 and 1 when clicked
    toggleCube2Value() {
        this.cube2Value = this.cube2Value === '0' ? '1' : '0';
        this.updateCubeText(this.cube2, this.cube2Text, this.cube2Value);
        this.updateInterference();
    }

    // Updates the text display on a cube when its value changes
    updateCubeText(cube, currentText, newValue) {
        cube.remove(currentText);
        const cubeComponent = new CubeComponent(0x10b981, 1.2);
        const newText = cubeComponent.addText(cube, newValue);
        
        if (cube === this.cube1) {
            this.cube1Text = newText;
        } else {
            this.cube2Text = newText;
        }
    }

    // Calculates and shows interference effects based on whether cube values match
    updateInterference() {
        const valuesMatch = this.cube1Value === this.cube2Value;
        const isConstructive = valuesMatch;
        
        let resultValue;
        let resultColor;
        let lineColor;
        let cubeOpacity;

        if (isConstructive) {
            resultValue = this.cube1Value;
            resultColor = 0x22c55e;
            lineColor = 0x22c55e;
            cubeOpacity = 0.15;
            this.showConstructiveMode();
        } else {
            resultValue = '?';
            resultColor = 0x6b7280;
            lineColor = 0xef4444;
            cubeOpacity = 0.03;
            this.showDestructiveMode();
        }

        this.updateResultCube(resultValue, resultColor, cubeOpacity);
        this.updateConnectionColors(lineColor);
    }

    // Shows instruction text for constructive interference (when values match)
    showConstructiveMode() {
        const constructiveInstruction = document.getElementById('constructive-instruction');
        const destructiveInstruction = document.getElementById('destructive-instruction');
        
        if (constructiveInstruction && destructiveInstruction) {
            constructiveInstruction.classList.remove('hidden');
            destructiveInstruction.classList.add('hidden');
        }
    }

    // Shows instruction text for destructive interference (when values differ)
    showDestructiveMode() {
        const constructiveInstruction = document.getElementById('constructive-instruction');
        const destructiveInstruction = document.getElementById('destructive-instruction');
        
        if (constructiveInstruction && destructiveInstruction) {
            constructiveInstruction.classList.add('hidden');
            destructiveInstruction.classList.remove('hidden');
        }
    }

    // Updates the bottom result cube's appearance and value based on interference
    updateResultCube(value, color, opacity) {
        this.resultCube.remove(this.resultText);
        this.resultCube.material.color.setHex(color);
        this.resultCube.material.opacity = opacity;
        
        const wireframe = this.resultCube.children.find(child => child.type === 'LineSegments');
        if (wireframe) {
            wireframe.material.color.setHex(color === 0x22c55e ? 0x15803d : 0x374151);
        }

        if (value !== '?') {
            const resultCubeComponent = new CubeComponent(color, 1.2);
            this.resultText = resultCubeComponent.addText(this.resultCube, value);
        } else {
            const resultCubeComponent = new CubeComponent(color, 1.2);
            this.resultText = resultCubeComponent.addText(this.resultCube, '0');
            this.resultText.visible = false;
        }
    }

    // Changes the color of the connecting lines based on interference type
    updateConnectionColors(color) {
        this.line1.material.color.setHex(color);
        this.line2.material.color.setHex(color);
    }

    // Continuously renders the scene and creates pulsing animation on the connection lines
    animate = () => {
        requestAnimationFrame(this.animate);
        
        this.animationTime += 0.02;
        const pulse = Math.sin(this.animationTime * 2) * 0.2 + 1;
        
        this.line1.material.opacity = 0.4 * pulse;
        this.line2.material.opacity = 0.4 * pulse;

        this.scene.render();
    }
}
