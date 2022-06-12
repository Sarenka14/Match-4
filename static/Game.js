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
        const materialBialy = new THREE.MeshPhongMaterial({
            color: 0xDCDCDC,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1,
            shininess: 50
        });
        const materialCzerwony = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            wireframe: false,
            transparent: true,
            opacity: 1,
            shininess: 50
        });

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

        this.kolejBialego = true
        this.kolejCzarnego = false

        document.getElementById("root").append(this.renderer.domElement);

        this.camera.position.set(0, 50, 100)
        this.camera.lookAt(this.scene.position)

        this.render() // wywołanie metody render

        //-----------------------reycaster----------------------------
        const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
        const mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

        this.checkMove = () => {
            if (playerBlackLoggedIn) {
                fetch("/odeslanieOdBialego", { method: "post" })
                    .then(response => response.json())
                    .then(
                        data => {
                            if (data.kolumnaBiala != 2137) {

                                for (let j = 5; j >= 0; j--) {
                                    if (this.pionki[j][data.kolumnaBiala] == 0) {
                                        this.pionki[j][data.kolumnaBiala] = 1
                                        const krazek = new THREE.Mesh(geometryCylindra, materialBialy);
                                        krazek.position.set((data.kolumnaBiala * 10) - 30, 100, 0)
                                        krazek.rotation.x = 0.5 * Math.PI;
                                        this.scene.add(krazek)

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
                                        } else {
                                            wysokosc = 15
                                        }

                                        new TWEEN.Tween(krazek.position) // co
                                            .to({ x: (data.kolumnaBiala * 10) - 30, y: wysokosc, z: 0 }, 500) // do jakiej pozycji, w jakim czasie
                                            .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                            .start()


                                        this.kolejCzarnego = true
                                        document.getElementById("kolejBg").style.display = "none";
                                        break
                                    }
                                }
                            }

                        }
                    )
            } else if (playerWhiteLoggedIn) {
                fetch("/odeslanieOdCzarnego", { method: "post" })
                    .then(response => response.json())
                    .then(
                        data => {
                            if (data.kolumnaCzarna != 2137) {
                                for (let j = 5; j >= 0; j--) {
                                    if (this.pionki[j][data.kolumnaCzarna] == 0) {
                                        this.pionki[j][data.kolumnaCzarna] = 2
                                        const krazek = new THREE.Mesh(geometryCylindra, materialCzerwony);
                                        krazek.position.set((data.kolumnaCzarna * 10) - 30, 100, 0)
                                        krazek.rotation.x = 0.5 * Math.PI;

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
                                        } else {
                                            wysokosc = 15
                                        }

                                        new TWEEN.Tween(krazek.position) // co
                                            .to({ x: (data.kolumnaCzarna * 10) - 30, y: wysokosc, z: 0 }, 500) // do jakiej pozycji, w jakim czasie
                                            .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                            .start()

                                        this.kolejBialego = true
                                        document.getElementById("kolejBg").style.display = "none";

                                        this.scene.add(krazek)
                                        break
                                    }
                                }
                            }

                        }
                    )
            }

        }

        this.checkEndKolumna = () => {
            try {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (this.pionki[i][j] == 1 && this.pionki[i + 1][j] == 1 && this.pionki[i + 2][j] == 1 && this.pionki[i + 3][j] == 1) {
                            console.log("Bialy wygrał w kolumnie")
                        } else if (this.pionki[i][j] == 2 && this.pionki[i + 1][j] == 2 && this.pionki[i + 2][j] == 2 && this.pionki[i + 3][j] == 2) {
                            console.log("Czarny wygrał w kolumnie")
                        }
                    }
                }
            } catch (error) { }
        }

        this.checkEndRzad = () => {
            try {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (this.pionki[i][j] == 1 && this.pionki[i][j + 1] == 1 && this.pionki[i][j + 2] == 1 && this.pionki[i][j + 3] == 1) {
                            console.log("Bialy wygral w rzedzie")
                        }
                        if (this.pionki[i][j] == 2 && this.pionki[i][j + 1] == 2 && this.pionki[i][j + 2] == 2 && this.pionki[i][j + 3] == 2) {
                            console.log("Czarny wygral w rzedzie")
                        }
                    }
                }
            } catch (error) { }
        }

        this.checkSkos1 = () => {
            try {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (this.pionki[i][j] == 1 && this.pionki[i + 1][j + 1] == 1 && this.pionki[i + 2][j + 2] == 1 && this.pionki[i + 3][j + 3] == 1) {
                            console.log("Bialy wygral na skos 1")
                        }
                        if (this.pionki[i][j] == 2 && this.pionki[i + 1][j + 1] == 2 && this.pionki[i + 2][j + 2] == 2 && this.pionki[i + 3][j + 3] == 2) {
                            console.log("Czarny wygral na skos 1")
                        }
                    }
                }
            } catch (error) { }
        }

        this.checkSkos2 = () => {
            try {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (this.pionki[i + 3][j] == 1 && this.pionki[i + 2][j + 1] == 1 && this.pionki[i + 1][j + 2] == 1 && this.pionki[i][j + 3] == 1) {
                            console.log("Bialy wygral na skos 2")
                        }
                        if (this.pionki[i + 3][j] == 2 && this.pionki[i + 2][j + 1] == 2 && this.pionki[i + 1][j + 2] == 2 && this.pionki[i][j + 3] == 2) {
                            console.log("Czarny wygral na skos 2")
                        }
                    }
                }
            } catch (error) { }
        }

        window.addEventListener("mousedown", (e) => {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);
            if (playerWhiteLoggedIn && waitForBlack && this.kolejBialego) {
                if (intersects.length > 0 && intersects[0].object.material.color.getHex() == 0xFF8C00) {
                    intersects[0].object.material.color.setHex(0xFFFF00)
                    setTimeout(() => { intersects[0].object.material.color.setHex(0xFF8C00); }, 100);

                    for (let i = 0; i < 7; i++) {
                        if (this.tablicaKwadratow[i].material.color.getHex() == 0xFFFF00) {
                            const krazek = new THREE.Mesh(geometryCylindra, materialBialy);
                            krazek.position.set((i * 10) - 30, 100, 0)
                            krazek.rotation.x = 0.5 * Math.PI;
                            this.scene.add(krazek)
                            if (this.pionki[0][i] == 0) {
                                fetch("/ruchBialego", { method: "post", body: JSON.stringify({ i }) })
                            }
                            this.kolejBialego = false
                            document.getElementById("kolejBg").style.display = "block";


                            for (let j = 5; j >= 0; j--) {
                                if (this.pionki[j][i] == 0) {
                                    this.pionki[j][i] = 1

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
                                    } else {
                                        wysokosc = 15
                                    }

                                    new TWEEN.Tween(krazek.position) // co
                                        .to({ x: (i * 10) - 30, y: wysokosc, z: 0 }, 500) // do jakiej pozycji, w jakim czasie
                                        .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                        .start()

                                    break
                                }
                            }
                        }







                    }
                }
            } else if (playerBlackLoggedIn && this.kolejCzarnego) {
                if (intersects.length > 0 && intersects[0].object.material.color.getHex() == 0xFF8C00) {
                    intersects[0].object.material.color.setHex(0xFFFF00)
                    setTimeout(() => { intersects[0].object.material.color.setHex(0xFF8C00); }, 100);

                    for (let i = 0; i < 7; i++) {
                        if (this.tablicaKwadratow[i].material.color.getHex() == 0xFFFF00) {
                            const krazek = new THREE.Mesh(geometryCylindra, materialCzerwony);
                            krazek.position.set((i * 10) - 30, 100, 0)
                            krazek.rotation.x = 0.5 * Math.PI;
                            this.scene.add(krazek)
                            if (this.pionki[0][i] == 0) {
                                fetch("/ruchCzarnego", { method: "post", body: JSON.stringify({ i }) })
                            }
                            this.kolejCzarnego = false
                            document.getElementById("kolejBg").style.display = "block";

                            for (let j = 5; j >= 0; j--) {
                                if (this.pionki[j][i] == 0) {
                                    this.pionki[j][i] = 2

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
                                    } else {
                                        wysokosc = 15
                                    }

                                    new TWEEN.Tween(krazek.position) // co
                                        .to({ x: (i * 10) - 30, y: wysokosc, z: 0 }, 500) // do jakiej pozycji, w jakim czasie
                                        .easing(TWEEN.Easing.Cubic.Out) // typ easingu (zmiana w czasie)
                                        .start()

                                    break
                                }
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

        setInterval(this.checkMove, 100);
        setInterval(this.checkEndKolumna, 500);
        setInterval(this.checkEndRzad, 500);
        setInterval(this.checkSkos1, 500);
        setInterval(this.checkSkos2, 500);
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
                renderWhite = true
            }
        }
        if (playerBlackLoggedIn) {
            if (!renderBlack) {
                this.camera.position.set(0, 50, -100)
                this.light.position.set(50, 70, -50)
                renderBlack = true
            }
        }
    }
}
