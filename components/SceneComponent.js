export class SceneComponent {
    constructor(containerId, camera = null) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} not found`);
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

    setupRenderer() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        this.scene.add(ambientLight, pointLight);
    }

    setupCamera() {
        this.camera.position.z = 4;
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.lookAt(0, 0, 0);
    }

    add(object) {
        this.scene.add(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

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
}