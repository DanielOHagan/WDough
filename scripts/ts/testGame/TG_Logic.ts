namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTestTexture : WDOH.ITexture | null;
        private mPartiallyTransparentTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        private mColourChangeTime = 0;
        private mColours : WDOH.Vector4[] = [];

        private mTestGridWidth = 100;
        private mTestGridHeight = 500;
        private mTestGridMinColourIndex : number = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);
        private mTestGridQuads : WDOH.Quad[] = [];
        private mQuadHoverColour : WDOH.Vector4 = new WDOH.Vector4(1, 0, 1, 1);

        private mCursorWorldPos : WDOH.Vector4 = new WDOH.Vector4(0, 0, 0, 0);
        private mCursorQuad : WDOH.Quad = new WDOH.Quad(new WDOH.Vector3(0, 0, 0.01), new WDOH.Vector2(0.025, 0.025), new WDOH.Vector4(0, 0, 1, 1), 0, null);

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mTestTexture = null;
            this.mPartiallyTransparentTexture = null;
            this.mCanRun = false;
        }

        public init() : void {
            this.mTestTexture = WDOH.TextureLoader.loadTextureFromFile(
                "res/TG/images/testTexture.png",
                WDOH.ETextureBindingPoint.TEX_2D
            );
            this.mPartiallyTransparentTexture = WDOH.TextureLoader.loadTextureFromFile(
                "res/TG/images/partiallyTransparent.png",
                WDOH.ETextureBindingPoint.TEX_2D
            );

            //Set up cursor
            this.mCursorQuad.mTexture = this.mPartiallyTransparentTexture;
            
            for (let i = 0; i < this.mTestGridHeight; i++) {
                this.mColours[i] = new WDOH.Vector4(1, 1, 1, 1);
            }

            this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);

            //Once everything has loaded flag as ready to run
            this.mCanRun = true;
        }

        public canRun() : boolean {
            return this.mCanRun;
        }
        
        public update(deltaTime : number) : void {

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());

            //Update 
            this.updateCursorWorldPos(WDOH.Input.get().getMouseScreenPos().x, WDOH.Input.get().getMouseScreenPos().y);

            this.mColourChangeTime += deltaTime;

            //Draw test grid
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

                        // this.mTestGridQuads[quadIndex].mTexture = y === 0 ? this.mTestTexture : this.mPartiallyTransparentTexture;
                        // this.mTestGridQuads[quadIndex].mTexture = this.mTestTexture;

                        //If cursor is inside quad
                        if (this.mTestGridQuads[quadIndex].isVec2Inside(new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y))) {
                            this.mTestGridQuads[quadIndex].mColour = this.mQuadHoverColour;
                            // mApplication.getRenderer().render2D().drawQuad(this.mTestGridQuads[quadIndex]);
                        } else {
                            this.mTestGridQuads[quadIndex].mColour = this.mColours[y];
                            // mApplication.getRenderer().render2D().drawTexturedQuad(this.mTestGridQuads[quadIndex]);
                        }
                        
                        //this.mTestGridQuads[quadIndex].mTexture = this.mNumTextures[y + 1];
                        // mApplication.getRenderer().render2D().drawQuad(this.mTestGridQuads[quadIndex]);
                    }
                }
                mApplication.getRenderer().render2D().drawAllQuads(this.mTestGridQuads);
                // mApplication.getRenderer().render2D().drawAllTexturedQuads(this.mTestGridQuads);


                let testTextureQuad : WDOH.Quad = new WDOH.Quad(new WDOH.Vector3(0.9, 0.9, 0.2), new WDOH.Vector2(0.3, 0.3), new WDOH.Vector4(0, 1, 0, 1), 0, this.mTestTexture);

                mApplication.getRenderer().render2D().drawTexturedQuad(testTextureQuad);

                // mApplication.getRenderer().render2D().drawAllTexturedQuads(this.mTestGridQuads);
                // mApplication.getRenderer().render2D().drawAllQuads(this.mTestGridQuads);
            }

            //Draw cursor quad (this is drawn last because the cursor is typically "on top" of everything else)
            {
                const cursorQuadSize : WDOH.Vector2 = this.mCursorQuad.mSize;
                //Place in centre of Quad
                this.mCursorQuad.mPosition.x = this.mCursorWorldPos.x - (cursorQuadSize.x / 2);
                this.mCursorQuad.mPosition.y = this.mCursorWorldPos.y - (cursorQuadSize.y / 2);

                mApplication.getRenderer().render2D().drawTexturedQuad(this.mCursorQuad);
                //mApplication.getRenderer().render2D().drawQuad(this.mCursorQuad);
            }

            mApplication.getRenderer().endScene();
        }

        public onEvent(event : WDOH.AEvent) : void {
            
        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {

            if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_G && keyEvent.getType() === WDOH.EEventType.INPUT_KEY_PRESS) {
                this.mTestGridWidth++;
                this.mTestGridMinColourIndex = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);

                this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
            } else if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_H && keyEvent.getType() === WDOH.EEventType.INPUT_KEY_PRESS) {
                this.mTestGridWidth--;
                this.mTestGridMinColourIndex = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);

                this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
            }

            if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_B && keyEvent.getType() === WDOH.EEventType.INPUT_KEY_PRESS) {
                this.mTestGridHeight++;
                this.mTestGridMinColourIndex = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);

                this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
            } else if (keyEvent.getInputCode() === WDOH.EKeyInputCode.KEY_N && keyEvent.getType() === WDOH.EEventType.INPUT_KEY_PRESS) {
                this.mTestGridHeight--;
                this.mTestGridMinColourIndex = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);

                this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
            }
        }

        public onMouseEvent(mouseEvent : WDOH.MouseEvent) : void {
            
        }

        public onMouseMoveEvent(mouseMoveEvent : WDOH.MouseMoveEvent) : void {

        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }

        public cleanUp() : void {
            this.mTestTexture?.delete();
            this.mPartiallyTransparentTexture?.delete();
        }

        private populateTestGrid(countX : number, countY : number) : void {

            mApplication.getLogger().infoApp("Test grid contains: " + countX * countY + " Quads.");

            const size : WDOH.Vector2 = new WDOH.Vector2(0.04, 0.04);
            const quadGapDistanceX : number = (size.x * 1.5);
            const quadGapDistanceY : number = (size.y * 1.5);

            for (let x = 0; x < countX; x++) {
                for (let y = 0; y < countY; y++) {
                    let pos : WDOH.Vector3 = new WDOH.Vector3(x * quadGapDistanceX, y * quadGapDistanceY, 0.0);
                    pos.x -= 0.5;
                    pos.y -= 0.5;

                    let rotation : number = Math.random() < 0.02 ? 45 : 0;
                    
                    this.mTestGridQuads[x * this.mTestGridWidth + y] = new WDOH.Quad(pos, size, this.mColours[y], rotation, null);
                }
            }
        }

        private updateCursorWorldPos(posX : number, posY : number) : void {
            this.mCursorWorldPos = mApplication.getCanvas().convertScreenToCanvasSpace(
                this.mOrthoCameraController.getPosition().x,
                this.mOrthoCameraController.getPosition().y,
                posX,
                posY,
                this.mOrthoCameraController.getZoomLevel(),
                this.mOrthoCameraController.getZoomLevel(),
                0,
                0,
                // this.mOrthoCameraController.getRotation()
            );
        }
    }
}