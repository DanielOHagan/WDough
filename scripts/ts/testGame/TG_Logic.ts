namespace TestGame {

    /**
     * This is just a test for the engine and should not be used
     * as an example for how to properly use features.
     */
    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mTestTexture : WDOH.ITexture | null;
        private mPartiallyTransparentTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        private mColours : WDOH.Vector4[] = [];

        private mTestGridWidth = 25;
        private mTestGridHeight = 25;
        private mTestGridQuads2dArray : WDOH.Quad[][] = [];
        private mQuadHoverColour : WDOH.Vector4 = new WDOH.Vector4(1, 0, 1, 1);

        private static readonly WORLD_PLANE_SIZE : WDOH.Vector2 = new WDOH.Vector2(10, 10);
        private mWorldPlaneQuadPos : WDOH.Vector4 | null = null;
        private mWorldPlaneQuad : WDOH.Quad | null = null;
        private mWorldBoundingBox : WDOH.BoundingBox2D<WDOH.Quad> | null = null;
        private mCollisionQuadTree : WDOH.QuadTree<WDOH.BoundingBox2D<WDOH.Quad>> | null = null

        private mNumberTextures : WDOH.ITexture[] = [];
        private mNumTexturesCount : number = 21;

        private mCursorWorldPos : WDOH.Vector4 = new WDOH.Vector4(0, 0, 0, 0);
        private mCursorQuad : WDOH.Quad = new WDOH.Quad(new WDOH.Vector3(0, 0, 1), new WDOH.Vector2(0.025, 0.025), new WDOH.Vector4(0, 0, 1, 1), 0, null);

        private mTotalRuntimeTimer : WDOH.Timer;

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mTestTexture = null;
            this.mPartiallyTransparentTexture = null;
            this.mCanRun = false;

            this.mTotalRuntimeTimer = new WDOH.Timer("AppLogic Runtime Timer", false);
        }

        public init() : void {
            this.mTotalRuntimeTimer.start();

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
                    `res/TG/images/numTextures/texture${i}.png`,
                    WDOH.ETextureBindingPoint.TEX_2D
                );
            }

            this.mWorldPlaneQuadPos = new WDOH.Vector4(0 - TG_Logic.WORLD_PLANE_SIZE.x / 2, 0 - TG_Logic.WORLD_PLANE_SIZE.y / 2, 1, 0);
            this.mWorldPlaneQuad = new WDOH.Quad(
                new WDOH.Vector3(this.mWorldPlaneQuadPos.x, this.mWorldPlaneQuadPos.y, 1),
                TG_Logic.WORLD_PLANE_SIZE,
                new WDOH.Vector4(1, 0, 1, 0.15),
                0,
                null
            );
            this.mWorldBoundingBox = new WDOH.BoundingBox2D(this.mWorldPlaneQuad);
            // this.mCollisionQuadTree = new QuadTree(0, this.mWorldBoundingBox);
            this.mCollisionQuadTree = new WDOH.QuadTree(this.mWorldBoundingBox, null);

            this.populateTestGrid2dArray(this.mTestGridWidth, this.mTestGridHeight);

            //Once everything has loaded flag as ready to run
            this.mCanRun = true;
        }

        public canRun() : boolean {
            return this.mCanRun;
        }

        public update(deltaTime : number) : void {

            this.mOrthoCameraController.onUpdate(deltaTime);

            WDOH._Renderer().beginScene(this.mOrthoCameraController.getCamera());

            //Simple example of in app updates to debug output
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_J)) {
                WDOH._DebugOutput().display(false);
            } else if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_K)) {
                WDOH._DebugOutput().display(true);
            }

            //Update
            this.updateCursorWorldPos(WDOH.Input.get().getMouseScreenPos().x, WDOH.Input.get().getMouseScreenPos().y);

            for (let x = 0; x < this.mTestGridWidth; x++) {
                WDOH._Renderer2D().drawAllIfTextured(this.mTestGridQuads2dArray[x]);
            }

            if (this.mCollisionQuadTree !== null && WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_M)) {
                this.mCollisionQuadTree.DEBUG_drawEndBranches();
            }

            this.drawCursor();

            WDOH._Renderer().endScene();

            WDOH._DebugOutput().getCategoryByName("General")?.updateValue(
                "Total Runtime",
                Math.trunc(WDOH.Time.convertMillisToSeconds(this.mTotalRuntimeTimer.getTotalTickingTime())).toString() + "s"
            );
        }

        public onEvent(event : WDOH.AEvent) : void {

        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {

        }

        public onMouseEvent(mouseEvent : WDOH.MouseEvent) : void {
            if (mouseEvent.getType() === WDOH.EEventType.INPUT_MOUSE_BUTTON_DOWN) {
                if ((mouseEvent as WDOH.MouseButtonDownEvent).getInputCode() === WDOH.EMouseInputCode.BUTTON_MAIN) {
                    let mousePosVec2 : WDOH.Vector2 = new WDOH.Vector2(this.mCursorWorldPos.x, this.mCursorWorldPos.y);
                    if (this.mCollisionQuadTree !== null) {
                        for (let boundingBox of this.mCollisionQuadTree.retrieveAllInQuadByPoint(mousePosVec2)) {
                            if (boundingBox.isVec2Inside(mousePosVec2)) {
                                boundingBox.getWrappedNode().mTexture = null;
                                boundingBox.getWrappedNode().mColour = new WDOH.Vector4(1, 1, 0, 0.5);
                            }
                        }
                    }
                }
            }
        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }

        public cleanUp() : void {
            this.mTestTexture?.cleanUp();
            this.mPartiallyTransparentTexture?.cleanUp();
            for (let numberedTexture of this.mNumberTextures) {
                numberedTexture.cleanUp();
            }

            this.mTotalRuntimeTimer.stop();
        }

        public populateTestGrid2dArray(countX : number, countY : number) : void {
            WDOH._Logger().infoApp(`Test grid constains ${countX * countY} Quads.`)

            const size : WDOH.Vector2 = new WDOH.Vector2(0.05, 0.05);
            const quadGapDistanceX : number = (size.x * 1.5);
            const quadGapDistanceY : number = (size.y * 1.5);

            for (let y = 0; y < countY; y++) {
                let xQuads : WDOH.Quad[] = [];
                for (let x = 0; x < countX; x++) {
                    let pos : WDOH.Vector3 = new WDOH.Vector3(x * quadGapDistanceX, y * quadGapDistanceY, 0.1);
                    // pos.x -= 0.5;
                    // pos.y -= 0.5;

                    let rotation : number = Math.random() < 0.5 ? 45 : 0;

                    // if (Math.random() < 0.3) 
                    //     pos.rotateZ(MathsradToDeg(45));

                    let quad : WDOH.Quad = new WDOH.Quad(pos, size, this.mColours[y], rotation, this.mNumberTextures[y % this.mNumTexturesCount]);

                    xQuads.push(quad);
                    if (this.mCollisionQuadTree !== null) {
                        let boundingBox : WDOH.BoundingBox2D<WDOH.Quad> = new WDOH.BoundingBox2D<WDOH.Quad>(quad);
                        this.mCollisionQuadTree.add(boundingBox);
                    }
                }
                this.mTestGridQuads2dArray.push(xQuads);
            }

            //DEBUG::
            // Set quad texture number to their level in the mCollisionQuadTree
            if (this.mCollisionQuadTree !== null) {
                for (let boundingBox of this.mCollisionQuadTree.getAllObjectsInTree()) {
                    boundingBox.getWrappedNode().mTexture = this.mNumberTextures[this.mCollisionQuadTree.DEBUG_getLevelFromObject(boundingBox)];
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
                this.mOrthoCameraController.getRotation()
            );
        }

        private drawCursor() {
            const cursorQuadSize : WDOH.Vector2 = this.mCursorQuad.mSize;
            //Centre quad at cursor point
            this.mCursorQuad.mPosition.x = this.mCursorWorldPos.x - (cursorQuadSize.x / 2);
            this.mCursorQuad.mPosition.y = this.mCursorWorldPos.y - (cursorQuadSize.y / 2);

            WDOH._Renderer2D().drawTexturedQuad(this.mCursorQuad);
            // mApplication.getRenderer().render2D().drawTexturedQuad(this.mCursorQuad);
            //mApplication.getRenderer().render2D().drawQuad(this.mCursorQuad);
        }
    }
}
