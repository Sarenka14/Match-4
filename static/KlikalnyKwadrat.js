export default new class KlikalnyKwadrat {
    constructor() {
        const geometryPomaranczowegoKwadratu = new THREE.BoxGeometry(9, 9, 5);
        const materialPomaranczowy = new THREE.MeshPhongMaterial({
            color: 0xFF8C00,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.1,
            shininess: 50
        });

        this.kwadrat = new THREE.Mesh(geometryPomaranczowegoKwadratu, materialPomaranczowy);
    }
}