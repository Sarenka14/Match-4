import Plansza from "./Plansza.js";
import KlikalnyKwadrat from "./KlikalnyKwadrat.js";

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

        this.pionki = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ]

        //światła
        this.light = new THREE.SpotLight(0xffffff, 0.5)
        this.light.position.set(50, 70, 50)
        this.light.target = this.scene
        this.scene.add(this.light)

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
        this.scene.add(this.ambientLight)

        //plansza
        this.scene.add(Plansza.board)

        const geometryCylindra = new THREE.CylinderGeometry(4.5, 4.5, 5, 16)
        const materialNiebieski = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1,
            shininess: 50
        });

        //krążek
        /*for (let i = 0; i < 6; i++) {
            const krazek = new THREE.Mesh(geometryCylindra, materialNiebieski);
            krazek.position.set(-10, (i * 9) - 30, 0)
            krazek.rotation.x = 0.5 * Math.PI;
            this.scene.add(krazek)
        }*/

        //kwadraty
        /*for (let i = 0; i < 7; i++) {
            const pomaranczowyKwadrat = KlikalnyKwadrat.kwadrat
            pomaranczowyKwadrat.position.set((i * 10) - 30, 24, 0)
            this.scene.add(pomaranczowyKwadrat)
        }*/
        this.tablicaKwadratow = []
        for (let i = 0; i < 7; i++) {
            const geometryPomaranczowegoKwadratu = new THREE.BoxGeometry(9, 9, 5);
            const materialPomaranczowy = new THREE.MeshPhongMaterial({
                color: 0xFF8C00,
                side: THREE.DoubleSide,
                wireframe: false,
                transparent: true,
                opacity: 0.1,
                shininess: 50
            });
            const pomaranczowyKwadrat = new THREE.Mesh(geometryPomaranczowegoKwadratu, materialPomaranczowy);
            pomaranczowyKwadrat.position.set((i * 10) - 30, 24, 0)
            this.tablicaKwadratow[i] = pomaranczowyKwadrat
            this.scene.add(pomaranczowyKwadrat)
        }


        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 50, 100)
        this.camera.lookAt(this.scene.position)

        this.render() // wywołanie metody render



        //-----------------------reycaster----------------------------
        const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
        const mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

        window.addEventListener("mousedown", (e) => {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0 && intersects[0].object.material.color.getHex() == 0xFF8C00) {
                intersects[0].object.material.color.setHex(0xFFFF00)
                setTimeout(() => { intersects[0].object.material.color.setHex(0xFF8C00); }, 100);


                for (let i = 0; i < 7; i++) {
                    if (this.tablicaKwadratow[i].material.color.getHex() == 0xFFFF00) {
                        //console.log(i)
                        const krazek = new THREE.Mesh(geometryCylindra, materialNiebieski);
                        krazek.position.set((i * 10) - 30, 100, 0)
                        krazek.rotation.x = 0.5 * Math.PI;
                        this.scene.add(krazek)

                        for (let j = 5; j >= 0; j--) {
                            if (this.pionki[j][i] == 0) {
                                this.pionki[j][i] = 1
                                //console.log(this.pionki)

                                let wysokosc
                                if (j == 5) {
                                    wysokosc = -30
                                } else if (j == 4) {
                                    wysokosc = -21
                                } else if (j == 3) {
                                    wysokosc = -12
                                } else if (j == 2) {
                                    wysokosc = -3
                                } else if (j == 1) {
                                    wysokosc = 6
                                } else{
                                    wysokosc = 15
                                }

                                new TWEEN.Tween(krazek.position) // co
                                    .to({ x: (i * 10) - 30, y: wysokosc, z: 0 }, 500) // do jakiej pozycji, w jakim czasie
                                    .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                    .start()

                                //console.log(wysokosc)
                                break
                            }
                        }






                    }
                }
            }




        });



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

        if (playerWhiteLoggedIn) {
            if (!renderWhite) {
                this.camera.position.set(0, 50, 100)
                this.light.position.set(50, 70, 50)
                //console.log("bialy")
                renderWhite = true
            }
        }
        if (playerBlackLoggedIn) {
            if (!renderBlack) {
                this.camera.position.set(0, 50, -100)
                this.light.position.set(50, 70, -50)
                //console.log("czarny")
                renderBlack = true
            }
        }
    }
}
