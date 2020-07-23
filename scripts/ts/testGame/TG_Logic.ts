namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTestTexture : WDOH.ITexture | null;
        private mPartiallyTransparentTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        private time = 0;
        private mColours : WDOH.Vector4[] = [];

        private readonly mTestGridWidth = 50;
        private readonly mTestGridHeight = 50;
        private readonly mTestGridMinColourIndex : number = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mTestTexture = null;
            this.mPartiallyTransparentTexture = null;
            this.mCanRun = false;
        }

        public init() : void {
            mApplication.getLogger().infoApp("Logic init");

            this.mTestTexture = WDOH.TextureLoader.loadTextureFromFile(
                "res/TG/images/testTexture.png",
                WDOH.ETextureBindingPoint.TEX_2D
            );
            this.mPartiallyTransparentTexture = WDOH.TextureLoader.loadTextureFromFile(
                "res/TG/images/partiallyTransparent.png",
                WDOH.ETextureBindingPoint.TEX_2D
            );

            this.mCanRun = true;

            for (let i = 0; i < 100; i++) {
                this.mColours[i] = new WDOH.Vector4(1, 1, 1, 1);
            }

            mApplication.getLogger().infoApp("Test grid contains: " + this.mTestGridWidth * this.mTestGridHeight + " Quads.");
        }

        public canRun() : boolean {
            return this.mCanRun;
        }
        
        public update(deltaTime : number) : void {

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());

            //Draw coloured quad
            // mApplication.getRenderer().render2D().drawQuad(
                // new WDOH.Vector3(0, 0, 0),
                // new WDOH.Vector2(1, 1),
                // new WDOH.Vector4(0, 1, 0, 1)
            // );

            this.time += deltaTime;
            
            {

                let size : WDOH.Vector2 = new WDOH.Vector2(0.025, 0.025);

                for (let x = 0; x < this.mTestGridWidth; x++) {

                    for (let y = 0; y < this.mTestGridHeight; y++) {
                        let pos : WDOH.Vector3 = new WDOH.Vector3(x * 0.03, y * 0.03, 0.0);
                        
                        pos.x -= 0.45;
                        pos.y -= 0.4;

                        let ran = Math.random();

                        if (this.time > 1) {
                            if (ran < 0.2) {
                                this.mColours[y] = new WDOH.Vector4(0, 1, 0, 1);
                            } else if (ran > 0.2 && ran < 0.3) {
                                this.mColours[y] = new WDOH.Vector4(1, 1, 0, 1)
                            } else if (ran > 0.4 && ran < 0.5) {
                                this.mColours[y] = new WDOH.Vector4(1, 0, 0, 1);
                            } else if (ran > 0.5 && ran < 0.6) {
                                this.mColours[y] = new WDOH.Vector4(1, 1, 1, 1);
                            } else if (ran > 0.6 && ran < 0.7) {
                                this.mColours[y] = new WDOH.Vector4(0, 0, 1, 1);
                            } else if (ran > 0.7 && ran < 0.8) {
                                this.mColours[y] = new WDOH.Vector4(1, 1, 1, 1);
                            } else if (ran > 0.8) {
                                this.mColours[y] = new WDOH.Vector4(0, 0, 0, 1);
                            }

                            if (y === this.mTestGridMinColourIndex) {
                                this.time = 0; //Check if all mColour[y] have been set then loop round
                            }
                        }
                        
                        let rotation : number = Math.random() < 0.02 ? 45 : 0;

                        mApplication.getRenderer().render2D().drawQuad(pos, size, this.mColours[y]);
                    }
                }
            }

            // mApplication.getRenderer().render2D().drawQuad(new WDOH.Vector3(-0.6, -0.3, 0), new WDOH.Vector2(0.4, 0.4), new WDOH.Vector4(0, 0, 1, 1));

            // if (this.mTestTexture !== null) {
                // mApplication.getRenderer().render2D().drawTexturedQuad(new WDOH.Vector3(0, 0, 0), new WDOH.Vector2(0.4, 0.4), this.mTestTexture);
                // mApplication.getRenderer().render2D().drawTexturedQuad(new WDOH.Vector3(-1.6, -0.3, 0), new WDOH.Vector2(0.4, 0.4), this.mTestTexture);
            // }

            // if (this.mTransparentTexture !== null) {
                // mApplication.getRenderer().render2D().drawTexturedQuad(new WDOH.Vector3(0.6, 0.3, 0), new WDOH.Vector2(0.1, 0.3), this.mTransparentTexture)
                // mApplication.getRenderer().render2D().drawTexturedQuad(new WDOH.Vector3(0.9, 0.8, 0), new WDOH.Vector2(0.05, 0.03), this.mTransparentTexture)
            // }
            
            // if (this.mTransparentTexture !== null) {
            // }
            

            //Draw textures
            // if (this.mTestTexture !== null && this.mTransparentTexture !== null) {
            //     mApplication.getRenderer().render2D().drawTexturedQuad(
            //         new WDOH.Vector3(0, 0, 0),
            //         new WDOH.Vector2(1, 1),
            //         0,
            //         this.mTestTexture
            //     );

            //     mApplication.getRenderer().render2D().drawTexturedQuad(
            //         new WDOH.Vector3(0, 0, 0.1),
            //         new WDOH.Vector2(1, 1),
            //         0,
            //         this.mTransparentTexture
            //     );
            // }

            mApplication.getRenderer().endScene();
        }

        public onEvent(event : WDOH.AEvent) : void {
            
        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {

            //Camera Translation

            //Event example
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_W) {
            //     this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, 0.04, 0));
            // }
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_S) {
            //     this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, -0.04, 0));
            // }
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_D) {
            //     this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0.04, 0, 0));
            // }
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_A) {
            //     this.mOrthoCameraController.translatePosition(new WDOH.Vector3(-0.04, 0, 0));
            // }

            // //Camera Rotation
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_Q) {
            //     this.mOrthoCameraController.rotateDegrees(-5);
            // }
            // if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_E) {
            //     this.mOrthoCameraController.rotateDegrees(5);
            // }


        }

        public onMouseEvent(mouseEvent : WDOH.MouseEvent) : void {
            
        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }

        public cleanUp() : void {
            
        }
    }
}