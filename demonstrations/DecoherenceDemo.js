import { CubeComponent } from '../components/CubeComponent.js';
import { SceneComponent } from '../components/SceneComponent.js';

export class DecoherenceDemo {
    // Sets up the demo with initial state variables and starts the animation
    constructor() {
        this.hasBeenRotated = false;
        this.isCollapsed = false;
        this.collapsedValue = null;
        this.init();
        this.animate();
    }

    // Creates the 3D scene and sets up the interactive cube
    init() {
        this.scene = new SceneComponent('decoherence-demo');
        if (!this.scene.container) return;

        this.createDecoherenceCube();
        this.addControls();
    }

    // Creates a cube with "0" and "1" text on different sides to show quantum superposition
    createDecoherenceCube() {
        const cubeComponent = new CubeComponent(0x3b82f6);
        this.cube = cubeComponent.create();

        this.text0Front = CubeComponent.createText('0');
        this.text1Right = CubeComponent.createText('1');
        this.text0Back = CubeComponent.createText('0');
        this.text1Left = CubeComponent.createText('1');

        this.text1Right.rotation.y = -Math.PI / 2;
        this.text0Back.rotation.y = Math.PI;
        this.text1Left.rotation.y = Math.PI / 2;

        this.cube.add(this.text0Front, this.text1Right, this.text0Back, this.text1Left);

        this.text0Front.visible = true;
        this.text1Right.visible = false;
        this.text0Back.visible = false;
        this.text1Left.visible = false;

        this.scene.add(this.cube);
    }

    // Sets up mouse dragging to rotate the cube and clicking to collapse/reset quantum state
    addControls() {
        this.scene.addMouseControls(this.cube, (cube, deltaX) => {
            cube.rotation.y += deltaX * 0.008;
            this.hasBeenRotated = true;
            if (!this.isCollapsed) {
                this.updateTextVisibility();
            }
        });

        this.scene.addClickControls((raycaster) => {
            const intersects = raycaster.intersectObject(this.cube);
            if (intersects.length > 0) {
                if (!this.isCollapsed) {
                    this.collapseToClassical();
                } else {
                    this.resetToQuantum();
                }
            }
        });
    }

    // Collapses the quantum state to a fixed classical value based on cube rotation
    collapseToClassical() {
        this.isCollapsed = true;
        
        const rotY = ((this.cube.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const deg = rotY * 180 / Math.PI;
        
        if ((deg >= 315) || (deg < 45)) {
            this.collapsedValue = '0';
        } else if (deg >= 45 && deg < 135) {
            this.collapsedValue = '1';
        } else if (deg >= 135 && deg < 225) {
            this.collapsedValue = '0';
        } else {
            this.collapsedValue = '1';
        }

        this.hideAllText();
        const fixedText = CubeComponent.createText(this.collapsedValue, 0xffffff);
        this.cube.add(fixedText);
        this.fixedText = fixedText;

        this.updateCubeAppearance();
        this.updateInstructions();
    }

    // Resets the cube back to quantum superposition state from collapsed classical state
    resetToQuantum() {
        this.isCollapsed = false;
        this.collapsedValue = null;
        
        if (this.fixedText) {
            this.cube.remove(this.fixedText);
            this.fixedText = null;
        }

        this.updateTextVisibility();
        this.updateCubeAppearance();
        this.updateInstructions();
    }

    // Changes the cube's color and appearance based on quantum vs classical state
    updateCubeAppearance() {
        const material = this.cube.material;
        const wireframe = this.cube.children.find(child => child.type === 'LineSegments');
        
        if (this.isCollapsed) {
            material.color.setHex(0x6b7280);
            if (wireframe) {
                wireframe.material.color.setHex(0x374151);
            }
        } else {
            material.color.setHex(0x3b82f6);
            if (wireframe) {
                wireframe.material.color.setHex(0x1e40af);
            }
        }
    }

    // Updates the instruction text shown to the user based on current state
    updateInstructions() {
        const quantumInstruction = document.getElementById('quantum-instruction');
        const classicalInstruction = document.getElementById('classical-instruction');
        const fixedValueSpan = document.getElementById('fixed-value');

        if (this.isCollapsed) {
            quantumInstruction.classList.add('hidden');
            classicalInstruction.classList.remove('hidden');
            if (fixedValueSpan) {
                fixedValueSpan.textContent = this.collapsedValue;
            }
        } else {
            quantumInstruction.classList.remove('hidden');
            classicalInstruction.classList.add('hidden');
        }
    }

    // Hides all the "0" and "1" text elements on the cube
    hideAllText() {
        this.text0Front.visible = false;
        this.text1Right.visible = false;
        this.text0Back.visible = false;
        this.text1Left.visible = false;
    }

    // Shows the correct "0" or "1" text based on which side of the cube is facing forward
    updateTextVisibility() {
        if (this.isCollapsed) return;

        const rotY = ((this.cube.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const deg = rotY * 180 / Math.PI;
        
        this.hideAllText();
        
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

    // Continuously renders the 3D scene and updates text visibility when cube rotates
    animate = () => {
        requestAnimationFrame(this.animate);
        
        if (this.hasBeenRotated && !this.isCollapsed) {
            this.updateTextVisibility();
        }
        
        this.scene.render();
    }
}
