namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTestTexture : WDOH.ITexture | null;
        private mPartiallyTransparentTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        private mColourChangeTime = 0;
        private mColours : WDOH.Vector4[] = [];

        private readonly mTestGridWidth = 50;
        private readonly mTestGridHeight = 50;
        private readonly mTestGridMinColourIndex : number = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);
        private mTestGridQuads : WDOH.Quad[] = [];
        private mQuadHoverColour : WDOH.Vector4 = new WDOH.Vector4(1, 0, 1, 1);

        private mCursorWorldPos : WDOH.Vector4 = new WDOH.Vector4(0, 0, 0, 0);

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

            for (let i = 0; i < this.mTestGridHeight; i++) {
                this.mColours[i] = new WDOH.Vector4(1, 1, 1, 1);
            }

            mApplication.getLogger().infoApp("Test grid contains: " + this.mTestGridWidth * this.mTestGridHeight + " Quads.");

            this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
        }

        public canRun() : boolean {
            return this.mCanRun;
        }
        
        public update(deltaTime : number) : void {

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());

            //Update 
            this.updateCursorWorldPos(WDOH.Input.get().getMouseScreenPos().x, WDOH.Input.get().getMouseScreenPos().y);

            //Draw coloured quad
            // mApplication.getRenderer().render2D().drawQuad(
                // new WDOH.Vector3(0, 0, 0),
                // new WDOH.Vector2(1, 1),
                // new WDOH.Vector4(0, 1, 0, 1)
            // );

            this.mColourChangeTime += deltaTime;

            {
                for (let x = 0; x < this.mTestGridWidth; x++) {

                    for (let y = 0; y < this.mTestGridHeight; y++) {                        
                        
                        let ran = Math.random();
                        let quadIndex : number = x * this.mTestGridWidth + y;

                        //Update colours
                        if (this.mColourChangeTime > 1) {
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
                                this.mColourChangeTime = 0; //Check if all mColour[y] have been set then loop round
                            }
                        }

                        //If cursor is inside quad
                        if (this.mTestGridQuads[quadIndex].isVec2Inside(new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y))) {
                            this.mTestGridQuads[quadIndex].mColour = this.mQuadHoverColour;
                        } else {
                            this.mTestGridQuads[quadIndex].mColour = this.mColours[y];
                        }

                        mApplication.getRenderer().render2D().drawQuad(
                            this.mTestGridQuads[quadIndex].mPosition,
                            this.mTestGridQuads[quadIndex].mSize,
                            this.mTestGridQuads[quadIndex].mColour
                        );
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

            //Draw cursor quad
            {
                const cursorQuadSize : WDOH.Vector2 = new WDOH.Vector2(0.02, 0.02);
                //Place in centre of Quad
                let cursorQuadPos : WDOH.Vector3 = new WDOH.Vector3(
                    this.mCursorWorldPos.x - (cursorQuadSize.x / 2),
                    this.mCursorWorldPos.y - (cursorQuadSize.y / 2),
                    0
                );
                mApplication.getRenderer().render2D().drawQuad(cursorQuadPos, cursorQuadSize, new WDOH.Vector4(0, 0, 1, 1));
            }

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

        public onMouseMoveEvent(mouseMoveEvent : WDOH.MouseMoveEvent) : void {

        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }

        public cleanUp() : void {
            
        }

        private populateTestGrid(countX : number, countY : number) : void {

            const size : WDOH.Vector2 = new WDOH.Vector2(0.04, 0.04);
            const quadGapDistanceX : number = (size.x * 1.5);
            const quadGapDistanceY : number = (size.y * 1.5);

            //I think that mouse pos is fine, I think that size is in a 0 - 1 space,
            // e.g the right bound pos is 0.05 (pos.x = 0.00, size.x = 0.05) and in that same position the mouse position is 0.025 (half)

            for (let i = 0; i < this.mTestGridQuads.length; i++) {
                this.mTestGridQuads[i];
            }

            for (let x = 0; x < countX; x++) {
                for (let y = 0; y < countY; y++) {
                    let pos : WDOH.Vector3 = new WDOH.Vector3(x * quadGapDistanceX, y * quadGapDistanceY, 0.0);
                    pos.x -= 0.5;
                    pos.y -= 0.5;

                    let rotation : number = Math.random() < 0.02 ? 45 : 0;
                    
                    this.mTestGridQuads[x * this.mTestGridWidth + y] = new WDOH.Quad(pos, size, this.mColours[y]);
                }
            }
        }

        private updateCursorWorldPos(posX : number, posY : number) : void {
            this.mCursorWorldPos = mApplication.getCanvas().convertScreenToWorldSpace(
                this.mOrthoCameraController.getPosition().x,
                this.mOrthoCameraController.getPosition().y,
                posX,
                posY,
                // this.mOrthoCameraController.getZoomScale(),
                // this.mOrthoCameraController.getZoomScale(),
                0,
                0,
                // this.mOrthoCameraController.getRotation()
            );
        }
    }
}