namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTextureManager : WDOH.TextureManager;

        //TODO:: These should be in mTextureManager, NOT class members in ApplicationLogic
        private mTestTexture : WDOH.ITexture | null;
        private mOtherTestTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mTextureManager = new WDOH.TextureManager();
            this.mTestTexture = null;
            this.mOtherTestTexture = null;
            this.mCanRun = false;
        }

        public init() : void {
            console.log("TG_Logic: init");

            //Texture
            this.mTestTexture = this.mTextureManager.createTexture("res/TG/images/testTexture.png", WDOH.ETextureBindingPoint.TEX_2D);
            this.mOtherTestTexture = this.mTextureManager.createTexture("res/TG/images/partiallyTransparent.png", WDOH.ETextureBindingPoint.TEX_2D);

            this.mCanRun = true;
        }

        public canRun() : boolean {
            return this.mCanRun;
        }
        
        public update(deltaTime : number) : void {

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());

            //Draw green quad
            // mApplication.getRenderer().render2D().drawColouredQuad(
            //     new WDOH.Vector3(0, 0, 0),
            //     new WDOH.Vector2(1, 1),
            //     0,
            //     new WDOH.Vector4(0, 1, 0, 1)
            // );

            {
                //Draw quad grid that appears upper right
                let size : WDOH.Vector2 = new WDOH.Vector2(0.025, 0.025);

                for (let x = 0; x < 20; x++) {
                    for (let y = 0; y < 20; y++) {
                        let pos : WDOH.Vector3 = new WDOH.Vector3(x * 0.03, y * 0.03, 0.0);
                        
                        pos.x += 1.45;
                        pos.y += 0.4;
                        
                        let colour : WDOH.Vector4 = Math.random() < 0.8 ? new WDOH.Vector4(0, 1, 0, 1) : new WDOH.Vector4(1, 1, 0, 1);
                        let rotation : number = Math.random() < 0.02 ? 45 : 0;

                        mApplication.getRenderer().render2D().drawColouredQuad(pos, size, rotation, colour);
                    }
                }
            }

            //Draw textures
            if (this.mTestTexture !== null && this.mOtherTestTexture !== null) {
                mApplication.getRenderer().render2D().drawTexturedQuad(
                    new WDOH.Vector3(0, 0, 0),
                    new WDOH.Vector2(1, 1),
                    0,
                    this.mTestTexture
                );

                mApplication.getRenderer().render2D().drawTexturedQuad(
                    new WDOH.Vector3(0, 0, 0.1),
                    new WDOH.Vector2(1, 1),
                    0,
                    this.mOtherTestTexture
                );
            }

            mApplication.getRenderer().endScene();
        }

        public onEvent(event : WDOH.AEvent) : void {
            //No app logic related events have been created yet so this method throws an error
            throw new Error("Method not implemented.");
        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {

            //Camera Translation
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_W)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, 0.04, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_S)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, -0.04, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_D)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0.04, 0, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_A)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(-0.04, 0, 0));
            }

            //Camera Rotation
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_Q)) {
                this.mOrthoCameraController.rotateDegrees(-5);
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_E)) {
                this.mOrthoCameraController.rotateDegrees(5);
            }


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