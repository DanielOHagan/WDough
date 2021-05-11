namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTestTexture : WDOH.ITexture | null;
        private mPartiallyTransparentTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        private mColourChangeTime = 0;
        private mColours : WDOH.Vector4[] = [];

        private mTestGridWidth = 25;
        private mTestGridHeight = 25;
        private mTestGridMinColourIndex : number = Math.min(this.mTestGridWidth - 1, this.mTestGridHeight - 1);
        private mTestGridQuads : WDOH.Quad[] = [];
        private mTestGridBoundingBoxes : WDOH.BoundingBox2D<WDOH.Quad>[] = [];
        private TESTING_testGridQuad2dArray = true;
        private TESTING_drawAll_only = true;
        private mTestGridQuads2dArray : WDOH.Quad[][] = [];
        private mQuadHoverColour : WDOH.Vector4 = new WDOH.Vector4(1, 0, 1, 1);

        private mNumberTextures : WDOH.ITexture[] = [];
        private mNumTexturesCount : number = 21;

        private mCursorWorldPos : WDOH.Vector4 = new WDOH.Vector4(0, 0, 0, 0);
        private mCursorQuad : WDOH.Quad = new WDOH.Quad(new WDOH.Vector3(0, 0, 1), new WDOH.Vector2(0.025, 0.025), new WDOH.Vector4(0, 0, 1, 1), 0, null);

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

            for (let i : number = 0; i < this.mNumTexturesCount; i++) {
                this.mNumberTextures[i] = WDOH.TextureLoader.loadTextureFromFile(
                    "res/TG/images/numTextures/texture" + i + ".png",
                    WDOH.ETextureBindingPoint.TEX_2D
                );
            }

            if (this.TESTING_testGridQuad2dArray) {
                this.populateTestGrid2dArray(this.mTestGridWidth, this.mTestGridHeight);
            } else {
                this.populateTestGrid(this.mTestGridWidth, this.mTestGridHeight);
            }

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

                    // for (let y = 0; y < this.mTestGridHeight; y++) {

                    //     let ran = Math.random();

                    //     //Update colours
                    //     if (this.mColourChangeTime > 1) {
                    //         if (ran < 0.2) {
                    //             this.mColours[y] = new WDOH.Vector4(0, 1, 0, 1);
                    //         } else if (ran > 0.2 && ran < 0.3) {
                    //             this.mColours[y] = new WDOH.Vector4(1, 1, 0, 1)
                    //         } else if (ran > 0.4 && ran < 0.5) {
                    //             this.mColours[y] = new WDOH.Vector4(1, 0, 0, 1);
                    //         } else if (ran > 0.5 && ran < 0.6) {
                    //             this.mColours[y] = new WDOH.Vector4(1, 1, 1, 1);
                    //         } else if (ran > 0.6 && ran < 0.7) {
                    //             this.mColours[y] = new WDOH.Vector4(0, 0, 1, 1);
                    //         } else if (ran > 0.7 && ran < 0.8) {
                    //             this.mColours[y] = new WDOH.Vector4(1, 1, 1, 1);
                    //         } else if (ran > 0.8) {
                    //             this.mColours[y] = new WDOH.Vector4(0, 0, 0, 1);
                    //         }
                            
                    //         if (y === this.mTestGridMinColourIndex) {
                    //             this.mColourChangeTime = 0; //Check if all mColour[y] have been set then loop round
                    //         }
                    //     }

                    //     // this.mTestGridQuads[quadIndex].mTexture = y === 0 ? this.mTestTexture : this.mPartiallyTransparentTexture;
                    //     // this.mTestGridQuads[quadIndex].mTexture = this.mTestTexture;

                    //     //If cursor is inside quad
                    //     // if (!this.TESTING_testGridQuad2dArray) {
                    //     //     if (this.mTestGridQuads[quadIndex].isVec2Inside(new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y))) {
                    //     //         this.mTestGridQuads[quadIndex].mColour = this.mQuadHoverColour;
                    //     //         // mApplication.getRenderer().render2D().drawQuad(this.mTestGridQuads[quadIndex]);
                    //     //     } else {
                    //     //         this.mTestGridQuads[quadIndex].mColour = this.mColours[y];
                    //     //         // mApplication.getRenderer().render2D().drawTexturedQuad(this.mTestGridQuads[quadIndex]);
                    //     //     }
                    //     // }
                    // }

                    if (this.TESTING_testGridQuad2dArray) {
                        if (this.TESTING_drawAll_only || true) {
                            mApplication.getRenderer().render2D().drawAllIfTextured(this.mTestGridQuads2dArray[x]);
                            // mApplication.getRenderer().render2D().drawAllQuads(this.mTestGridQuads2dArray[x]);
                        } else {
                            //If you know that some textures are the same then rendering like this is A LOT faster than just drawAllTextured
                            mApplication.getRenderer().render2D().drawAllSameTexturedQuads(this.mTestGridQuads2dArray[x]);

                            //This is slower but requires less batches
                            //mApplication.getRenderer().render2D().drawAllSameTexturedQuadsFillEmpty(this.mTestGridQuads2dArray[x]);
                        }
                    } else {
                    }
                }
                
                if (!this.TESTING_testGridQuad2dArray) {
                    mApplication.getRenderer().render2D().drawAllTexturedQuads(this.mTestGridQuads);
                }

                let testTextureQuad : WDOH.Quad = new WDOH.Quad(new WDOH.Vector3(0.9, 0.9, 0.9), new WDOH.Vector2(0.3, 0.3), new WDOH.Vector4(0, 1, 0, 1), 0, this.mTestTexture);
                let testQuadBoundingBox2D : WDOH.BoundingBox2D<WDOH.Quad> = new WDOH.BoundingBox2D(testTextureQuad);
                if (testQuadBoundingBox2D.isVec2Inside(new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y))) {
                    mApplication.getRenderer().render2D().drawQuad(testTextureQuad);
                } else {
                    mApplication.getRenderer().render2D().drawTexturedQuad(testTextureQuad);
                }
            }

            //Draw cursor quad (this is drawn last because the cursor is typically "on top" of everything else)
            this.drawCursor();

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
            if (mouseEvent.getType() === WDOH.EEventType.INPUT_MOUSE_BUTTON_DOWN) {
                if ((mouseEvent as WDOH.MouseButtonDownEvent).getInputCode() === WDOH.EMouseInputCode.BUTTON_MAIN) {
                    for (let boundingbox of this.mTestGridBoundingBoxes) {
                        if (boundingbox.isVec2Inside(new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y))) {
                            boundingbox.getWrappedNode().mTexture = null;
                            boundingbox.getWrappedNode().mColour = new WDOH.Vector4(1, 0, 1, 1);
                        }
                    }
                }
            }
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
                    
                    this.mTestGridQuads[x * this.mTestGridWidth + y] = new WDOH.Quad(pos, size, this.mColours[y], rotation, this.mNumberTextures[y % this.mNumTexturesCount]);
                }
            }
        }

        public populateTestGrid2dArray(countX : number, countY : number) : void {
            mApplication.getLogger().infoApp("Test grid contains: " + countX * countY + " Quads.");

            const size : WDOH.Vector2 = new WDOH.Vector2(0.04, 0.04);
            const quadGapDistanceX : number = (size.x * 1.5);
            const quadGapDistanceY : number = (size.y * 1.5);

            for (let y = 0; y < countY; y++) {
                let xQuads : WDOH.Quad[] = [];
                for (let x = 0; x < countX; x++) {
                    let pos : WDOH.Vector3 = new WDOH.Vector3(x * quadGapDistanceX, y * quadGapDistanceY, 0.5);
                    pos.x -= 0.5;
                    pos.y -= 0.5;

                    let rotation : number = Math.random() < 0.02 ? 45 : 0;
                    
                    let quad : WDOH.Quad = new WDOH.Quad(pos, size, this.mColours[y], rotation, this.mNumberTextures[y % this.mNumTexturesCount]);
                    
                    xQuads.push(quad);
                    this.mTestGridBoundingBoxes.push(new WDOH.BoundingBox2D(quad));
                }
                this.mTestGridQuads2dArray.push(xQuads);
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

        private drawCursor() {
            const cursorQuadSize : WDOH.Vector2 = this.mCursorQuad.mSize;
            //Centre quad at cursor point
            this.mCursorQuad.mPosition.x = this.mCursorWorldPos.x - (cursorQuadSize.x / 2);
            this.mCursorQuad.mPosition.y = this.mCursorWorldPos.y - (cursorQuadSize.y / 2);

            mApplication.getRenderer().render2D().drawTexturedQuad(this.mCursorQuad);
            //mApplication.getRenderer().render2D().drawQuad(this.mCursorQuad);
        }
    }
}
