import { CubeComponent } from '../components/CubeComponent.js';
import { SceneComponent } from '../components/SceneComponent.js';

export class EntanglementDemo {
    // Sets up both classical and quantum entanglement demonstrations and starts animation
    constructor() {
        this.initClassicalEntanglement();
        this.initQuantumEntanglement();
        this.animate();
    }

    // Creates the classical bits demo scene where each cube changes independently
    initClassicalEntanglement() {
        this.classicalScene = new SceneComponent('classical-entanglement-demo');
        if (!this.classicalScene.container) return;

        this.createClassicalEntanglementCubes();
        this.addClassicalClickControls();
    }

    // Creates two gray cubes with different values that work independently
    createClassicalEntanglementCubes() {
        const cubeComponent = new CubeComponent(0x6b7280);

        this.classicalCube1 = cubeComponent.create();
        this.classicalCube1.position.y = 1.2;
        this.classicalValue1 = '1';
        this.classicalText1 = cubeComponent.addText(this.classicalCube1, this.classicalValue1);

        this.classicalCube2 = cubeComponent.create();
        this.classicalCube2.position.y = -1.2;
        this.classicalValue2 = '0';
        this.classicalText2 = cubeComponent.addText(this.classicalCube2, this.classicalValue2);

        this.classicalScene.add(this.classicalCube1);
        this.classicalScene.add(this.classicalCube2);
    }

    // Creates the quantum entanglement demo scene where cubes are connected
    initQuantumEntanglement() {
        this.quantumScene = new SceneComponent('quantum-entanglement-demo');
        if (!this.quantumScene.container) return;

        this.createQuantumEntanglementCubes();
        this.addQuantumClickControls();
    }

    // Creates two blue cubes that will be entangled (connected) together
    createQuantumEntanglementCubes() {
        const cubeComponent = new CubeComponent(0x3b82f6);

        this.quantumCube1 = cubeComponent.create();
        this.quantumCube1.position.y = 1.2;
        this.quantumValue1 = '1';
        this.quantumText1 = cubeComponent.addText(this.quantumCube1, this.quantumValue1);

        this.quantumCube2 = cubeComponent.create();
        this.quantumCube2.position.y = -1.2;
        this.quantumValue2 = '0';
        this.quantumText2 = cubeComponent.addText(this.quantumCube2, this.quantumValue2);

        this.quantumScene.add(this.quantumCube1);
        this.quantumScene.add(this.quantumCube2);
    }

    // Sets up clicking for classical cubes - each cube changes only itself
    addClassicalClickControls() {
        this.classicalScene.addClickControls((raycaster) => {
            const intersects1 = raycaster.intersectObject(this.classicalCube1);
            if (intersects1.length > 0) {
                this.classicalValue1 = this.classicalValue1 === '0' ? '1' : '0';
                this.updateClassicalText(1);
                return;
            }

            const intersects2 = raycaster.intersectObject(this.classicalCube2);
            if (intersects2.length > 0) {
                this.classicalValue2 = this.classicalValue2 === '0' ? '1' : '0';
                this.updateClassicalText(2);
            }
        });
    }

    // Changes both quantum cubes when one is clicked to show entanglement effect
    toggleClassicalValue(testedValue) {
        const newValue = testedValue === '0' ? '1' : '0';
        
        if (this.quantumValue1 === testedValue) {
            this.quantumValue1 = newValue;
            this.quantumValue2 = newValue === '1' ? '0' : '1';
        } else {
            this.quantumValue2 = newValue;
            this.quantumValue1 = newValue === '1' ? '0' : '1';
        }
        
        this.updateQuantumText(1);
        this.updateQuantumText(2);
        return;
    }

    // Sets up clicking for quantum cubes. Clicking one affects both cubes
    addQuantumClickControls() {
        this.quantumScene.addClickControls((raycaster) => {
            const intersects1 = raycaster.intersectObject(this.quantumCube1);
            if (intersects1.length > 0) {
                this.toggleClassicalValue(this.quantumValue1);
            }

            const intersects2 = raycaster.intersectObject(this.quantumCube2);
            if (intersects2.length > 0) {
                this.toggleClassicalValue(this.quantumValue2);
            }
        });
    }

    // Updates the text display on a classical cube when its value changes
    updateClassicalText(cubeNumber) {
        if (cubeNumber === 1) {
            this.classicalCube1.remove(this.classicalText1);
            const cubeComponent = new CubeComponent(0x6b7280);
            this.classicalText1 = cubeComponent.addText(this.classicalCube1, this.classicalValue1);
        } else {
            this.classicalCube2.remove(this.classicalText2);
            const cubeComponent = new CubeComponent(0x6b7280);
            this.classicalText2 = cubeComponent.addText(this.classicalCube2, this.classicalValue2);
        }
    }

    // Updates the text display on a quantum cube when its value changes
    updateQuantumText(cubeNumber) {
        if (cubeNumber === 1) {
            this.quantumCube1.remove(this.quantumText1);
            const cubeComponent = new CubeComponent(0x3b82f6);
            this.quantumText1 = cubeComponent.addText(this.quantumCube1, this.quantumValue1);
        } else {
            this.quantumCube2.remove(this.quantumText2);
            const cubeComponent = new CubeComponent(0x3b82f6);
            this.quantumText2 = cubeComponent.addText(this.quantumCube2, this.quantumValue2);
        }
    }

    // Continuously renders both the classical and quantum demonstration scenes
    animate = () => {
        requestAnimationFrame(this.animate);
        
        this.classicalScene.render();
        this.quantumScene.render();
    }
}