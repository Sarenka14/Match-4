import Plansza from "./Plansza.js";

export default class Game {

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xD3D3D3);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //światła
        this.light = new THREE.SpotLight(0xffffff, 0.5)
        this.light.position.set(50, 70, 50)
        this.light.target = this.scene
        this.scene.add(this.light)

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
        this.scene.add(this.ambientLight)

        //plansza
        this.scene.add(Plansza.board)


        //krążek
        const materialNiebieski = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1,
            shininess: 50
        });
        const geometryCylindra = new THREE.CylinderGeometry(4.5, 4.5, 5, 16)

        for (let i = 0; i < 6; i++) {
            const krazek = new THREE.Mesh(geometryCylindra, materialNiebieski);
            krazek.position.set(-10, (i * 9) - 30, 0)
            krazek.rotation.x = 0.5 * Math.PI;
            this.scene.add(krazek)
        }









        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 50, 100)
        this.camera.lookAt(this.scene.position)

        this.render() // wywołanie metody render

        this.onWindowResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', this.onWindowResize, false);
    }



    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        this.camera.lookAt(this.scene.position)
        TWEEN.update();

        if (this.doneW != true || this.doneB != true) {
            if (playerWhiteLoggedIn) {
                this.camera.position.set(0, 50, 100)
                this.doneW = true
            }
            if (playerBlackLoggedIn) {
                this.camera.position.set(0, 50, -100)
                this.doneB = true
            }
        }
    }
}
