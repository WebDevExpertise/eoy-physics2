import { CubeComponent } from '../components/CubeComponent.js';
import { SceneComponent } from '../components/SceneComponent.js';

export class SuperpositionDemo {
    constructor() {
        this.hasBeenRotated = false;
        this.initClassicalBit();
        this.initQuantumBit();
        this.animate();
    }

    initClassicalBit() {
        this.classicalScene = new SceneComponent('classical-bit-demo');
        if (!this.classicalScene.container) return;

        this.createClassicalBitCube();
        this.addClassicalMouseControls();
    }

    createClassicalBitCube() {
        const cubeComponent = new CubeComponent(0x6b7280);
        this.classicalCube = cubeComponent.create();
        
        cubeComponent.addText(this.classicalCube, '1');
        
        this.classicalScene.add(this.classicalCube);
    }

    initQuantumBit() {
        this.quantumScene = new SceneComponent('quantum-bit-demo');
        if (!this.quantumScene.container) return;

        this.createQuantumBitCube();
        this.addQuantumMouseControls();
    }

    createQuantumBitCube() {
        const cubeComponent = new CubeComponent(0x3b82f6);
        this.quantumCube = cubeComponent.create();

        this.text0Front = CubeComponent.createText('0');
        this.text1Right = CubeComponent.createText('1');
        this.text0Back = CubeComponent.createText('0');
        this.text1Left = CubeComponent.createText('1');

        this.text1Right.rotation.y = -Math.PI / 2;
        this.text0Back.rotation.y = Math.PI;
        this.text1Left.rotation.y = Math.PI / 2;

        this.quantumCube.add(this.text0Front, this.text1Right, this.text0Back, this.text1Left);

        this.text0Front.visible = true;
        this.text1Right.visible = false;
        this.text0Back.visible = false;
        this.text1Left.visible = false;

        this.quantumScene.add(this.quantumCube);
    }

    addClassicalMouseControls() {
        this.classicalScene.addMouseControls(this.classicalCube, (cube, deltaX) => {
            cube.rotation.y += deltaX * 0.008;
        });
    }

    addQuantumMouseControls() {
        this.quantumScene.addMouseControls(this.quantumCube, (cube, deltaX) => {
            cube.rotation.y += deltaX * 0.008;
            this.hasBeenRotated = true;
            this.updateTextVisibility();
        });
    }

    updateTextVisibility() {
        const rotY = ((this.quantumCube.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const deg = rotY * 180 / Math.PI;
        
        this.text0Front.visible = false;
        this.text1Right.visible = false;
        this.text0Back.visible = false;
        this.text1Left.visible = false;
        
        if ((deg >= 315) || (deg < 45)) {
            this.text0Front.visible = true;
        } else if (deg >= 45 && deg < 135) {
            this.text1Right.visible = true;
        } else if (deg >= 135 && deg < 225) {
            this.text0Back.visible = true;
        } else if (deg >= 225 && deg < 315) {
            this.text1Left.visible = true;
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.hasBeenRotated) {
            this.updateTextVisibility();
        }
        
        this.classicalScene.render();
        this.quantumScene.render();
    }
}