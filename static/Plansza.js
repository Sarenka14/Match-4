export default new class Plansza {
    constructor() {
        this.board = new THREE.Object3D()

        const geometryPodstawy = new THREE.BoxGeometry(70, 1, 5);
        const materialNiebieski = new THREE.MeshPhongMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1,
            shininess: 50
        });
        const materialPrzezroczysty = new THREE.MeshPhongMaterial({
            color: 0xDCDCDC,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 0.2,
            shininess: 50
        });
        const podstawa = new THREE.Mesh(geometryPodstawy, materialNiebieski);
        podstawa.position.y = -35
        this.board.add(podstawa);

        const geomentryKolumny = new THREE.BoxGeometry(1, 60, 5);

        for (let i = 0; i < 8; i++) {
            const kolumna = new THREE.Mesh(geomentryKolumny, materialNiebieski);
            kolumna.position.set((i * 10) - 35, -5.5, 0)
            this.board.add(kolumna);
        }

        const geometrySciany = new THREE.BoxGeometry(71, 60, 1);
        const sciana1 = new THREE.Mesh(geometrySciany, materialPrzezroczysty);
        sciana1.position.set(0, -5.5, -3)
        //this.board.add(sciana1);
        const sciana2 = new THREE.Mesh(geometrySciany, materialPrzezroczysty)
        sciana2.position.set(0, -5.5, 3)
        //this.board.add(sciana2);
        
    }
}