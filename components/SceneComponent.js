export class SceneComponent {
    // Sets up a 3D scene with camera, renderer, and lighting in the specified container
    constructor(containerId, camera = null) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            return;
        }

        this.scene = new THREE.Scene();
        this.camera = camera || new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.setupRenderer();
        this.setupLighting();
        this.setupCamera();
    }

    // Configures the renderer settings and adds automatic resizing when container changes size
    setupRenderer() {
        this.updateSize();
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Automatically watches for container size changes and adjusts the 3D view accordingly
        this.resizeObserver = new ResizeObserver(() => {
            this.updateSize();
        });
        this.resizeObserver.observe(this.container);
    }

    // Updates the 3D view size to match the container, with minimum size limits for small screens
    updateSize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        // Makes sure the 3D view isn't too small on narrow screens
        const minWidth = Math.max(width, 250);
        const minHeight = Math.max(height, 300);
        
        this.renderer.setSize(minWidth, minHeight);
        this.camera.aspect = minWidth / minHeight;
        this.camera.updateProjectionMatrix();
        
        // Makes the 3D canvas fit perfectly inside its container
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.objectFit = 'contain';
    }

    // Adds lights to the scene so objects can be seen clearly
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        this.scene.add(ambientLight, pointLight);
    }

    // Positions the camera to get a good view of the 3D objects
    setupCamera() {
        this.camera.position.z = 4;
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.lookAt(0, 0, 0);
    }

    // Adds a 3D object to the scene so it can be displayed
    add(object) {
        this.scene.add(object);
    }

    // Draws the current frame of the 3D scene
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    // Sets up click detection for interactive 3D objects
    addClickControls(callback) {
        this.container.addEventListener('click', (event) => {
            const rect = this.container.getBoundingClientRect();
            const mouse = new THREE.Vector2();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            callback(raycaster, mouse, event);
        });
    }

    // Sets up mouse drag controls to rotate or move 3D objects
    addMouseControls(target, callback) {
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;

        this.container.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.container.addEventListener('mousemove', (event) => {
            if (!isMouseDown) return;

            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            callback(target, deltaX, deltaY);

            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        this.container.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        this.container.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
    }

    // Cleans up resources when the scene is no longer needed to prevent memory leaks
    cleanup() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}