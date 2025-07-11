export class CubeComponent {
    // Sets up the basic properties for creating a cube (color, size, transparency)
    constructor(color, size = 1.5, opacity = 0.05) {
        this.size = size;
        this.color = color;
        this.opacity = opacity;
    }

    // Creates a 3D cube with the specified properties and adds a wireframe outline
    create() {
        const geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        const material = new THREE.MeshPhongMaterial({
            color: this.color,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide
        });

        const cube = new THREE.Mesh(geometry, material);
        
        cube.rotation.x = 0.2;
        cube.rotation.y = 0.3;
        
        const wireframeColor = this.color === 0x6b7280 ? 0x374151 : 0x1e40af;
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: wireframeColor, opacity: 0.8, transparent: true })
        );
        cube.add(wireframe);

        return cube;
    }

    // Creates 3D text shapes - makes a ring shape for "0" and a line shape for "1"
    static createText(text, color = 0xffffff) {
        let textMesh;
        
        if (text === '0') {
            const geometry = new THREE.TorusGeometry(0.25, 0.08, 16, 32);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: false,
                opacity: 1.0
            });
            textMesh = new THREE.Mesh(geometry, material);
            textMesh.scale.set(1, 1.3, 1);
        } else {
            const geometry = new THREE.BoxGeometry(0.1, 0.6, 0.05);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: false,
                opacity: 1.0
            });
            textMesh = new THREE.Mesh(geometry, material);
        }
        
        return textMesh;
    }

    // Attaches a text shape (0 or 1) to a cube at a specific position
    addText(cube, text, x = 0, y = 0, z = 0) {
        const textMesh = CubeComponent.createText(text);
        textMesh.position.set(x, y, z);
        cube.add(textMesh);
        return textMesh;
    }
}