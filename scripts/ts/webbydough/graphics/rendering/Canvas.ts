namespace WDOH {

    export var mContext : WebGL2RenderingContext;

    export class Canvas {

        public static readonly DEFAULT_CANVAS_ID : string = "wdoh-canvas";
        public static readonly DEFAULT_CANVAS_WRAPPER_ID : string = "defualt-wdoh-canvas-wrapper";
        private static readonly WEBGL_CONTEXT_STRING : string = "webgl";
        private static readonly WEBGL_2_CONTEXT_STRING : string = "webgl2";

        private mCanvasNode : HTMLCanvasElement;

        private mResizable : boolean;
        private mMinWidth : number;
        private mMaxWidth : number;
        private mMinHeight : number;
        private mMaxHeight : number;
        private mMaxSizeEnabled : boolean;
        private mAspectRatio : number;

        public constructor(
            width : number,
            height : number,
            resizable : boolean = true,
            maxSizeEnable : boolean = true,
            disableContextMenu : boolean = false,
            hideNativeCursor : boolean = false,
            canvasId? : string
        ) {
            this.mCanvasNode = this.createCanvasNode(disableContextMenu, canvasId);

            this.mResizable = resizable;
            this.mMinWidth = 0;
            this.mMinHeight = 0;

            this.mMaxSizeEnabled = maxSizeEnable;
            this.mMaxWidth = 2560;
            this.mMaxHeight = 1440;
            this.mAspectRatio = width / height;

            this.setSizeParameters(
                this.mMinWidth,
                this.mMinHeight,
                null,
                this.mMaxWidth,
                this.mMaxHeight
            );

            if (!this.areSizesValid(width, height)) {
                mApplication.throwError(
                    `Canvas creation sizes outside of allowed parameters:
                        Min Width: ${this.mMinWidth}, Min Height: ${this.mMinHeight},`
                        + this.mMaxSizeEnabled ?
                        `Max Width: ${this.mMaxWidth}, Max Height: ${this.mMaxHeight}.
                        Given Sizes: Width: ${width}, Height: ${height}`
                         : `Max size not enabeld.`
                );
            }

            mContext = this.createRenderingContext();

            this.mCanvasNode.width = width;
            this.mCanvasNode.height = height;
            this.enableResizeEvents(this.mResizable);
            this.resize(width, height);

            this.setWindowCallbacks();
            this.hideNativeCursor(hideNativeCursor);
        }

        public updateTitle() : void {
            const appName : string | null = mApplication.getAppName();
            if (appName !== null) {
                document.title = appName + " - WebbyDough";
            }
        }

        private createCanvasNode(disableContextMenu : boolean, canvasId? : string) : HTMLCanvasElement {
            let canvasNode : HTMLCanvasElement;

            if (canvasId === undefined) {
                canvasNode = document.createElement("canvas") as HTMLCanvasElement;
                canvasNode.setAttribute("id", Canvas.DEFAULT_CANVAS_ID);
            } else {
                canvasNode = document.getElementById(canvasId) as HTMLCanvasElement;
            }

            if (canvasNode === undefined || canvasNode === null) {
                mApplication.throwError("Unable to create node.")
            }

            if (disableContextMenu) {
                //Disable context menu (right click menu)
                canvasNode.oncontextmenu = function (event) { event.preventDefault(), event.stopPropagation() };
            }

            return canvasNode;
        }

        private createRenderingContext() : WebGL2RenderingContext {
            if (this.mCanvasNode === null || this.mCanvasNode === undefined) {
                mApplication.throwError("Canvas not yet defined, unable to create rendering context.");
            }

            let context : WebGL2RenderingContext = this.mCanvasNode.getContext(Canvas.WEBGL_2_CONTEXT_STRING) as WebGL2RenderingContext;

            if (context === null) {
                mApplication.throwError("Unable to create rendering context, WebGL2 support is required.");
            }

            return context;
        }

        public attachCanvas(nodeId : string = "body") {
            if (nodeId === "body") {
                //Attach to body
                document.body.appendChild(this.mCanvasNode);
            } else {
                //Attach to specified node
                let node : HTMLElement | null = document.getElementById(nodeId);

                if (node === null) {
                    mApplication.throwError(`Unable to find the node with ID : ${nodeId}`);
                } else {
                    node.appendChild(this.mCanvasNode);
                }
            }
        }

        public attachDebugOutput() : void {
            document.body.appendChild(_DebugOutput().getAsHTML());
        }

        public enableResizeEvents(resizable : boolean) : void {
            this.mResizable = resizable;

            if (this.mResizable) {
                //Set resize event
                window.onresize = function () {
                    mApplication.onEvent(new CanvasResizeEvent(window.innerWidth, window.innerHeight));
                }
            } else {
                //Remove resize event 
                window.onresize = null;
            }
        }

        public resize(width : number, height : number) : void {
            this.mCanvasNode.width = width;
            this.mCanvasNode.height = height;
        }

        public setSizeParameters(
            minWidth : number,
            minHeight : number,
            enableMaxSize : boolean | null,
            maxWidth : number,
            maxHeight : number
        ) : void {
            if (enableMaxSize !== null) {
                this.mMaxSizeEnabled = enableMaxSize;
            }
            //TODO : : Run checks when setting these values (e.g. if maxValue is larger than minValue)

            this.setMinSizeParameters(minWidth, minHeight);

            if (this.mMaxSizeEnabled) {
                this.setMaxSizeParameters(maxWidth, maxHeight);
            }
        }

        public setMinSizeParameters(width : number, height : number) : void {
            this.mMinWidth = width;
            this.mMinHeight = height;
            this.mCanvasNode.style.minWidth = width.toString();
            this.mCanvasNode.style.minHeight = height.toString();
        }

        public setMaxSizeParameters(width : number, height : number) : void {
            this.mMaxWidth = width;
            this.mMaxHeight = height;
            this.mCanvasNode.style.maxWidth = width.toString();
            this.mCanvasNode.style.maxHeight = height.toString();
        }

        public areSizesValid(width : number, height : number) : boolean {
            return !(
                width < this.mMinWidth ||
                height < this.mMinHeight || (
                    this.mMaxSizeEnabled && (
                        width > this.mMaxWidth ||
                        height > this.mMaxHeight
                    )
                )
            );
        }

        //TODO : : Have multiple methods for more specific calculations that return smaller vectors (vec2 and vec3 instead of it always being a vec4)
        //TODO : : ROTATION!!!
        public convertScreenToCanvasSpace(
            offsetX : number,
            offsetY : number,
            screenX : number,
            screenY : number,
            scaleX : number,
            scaleY : number,
            z : number,
            w : number,
            rotationRadians : number
        ) : Vector4 {
            // let worldX = ((((screenX / this.mCanvasNode.clientWidth) * 2) - 1) + ((offsetX / scaleX) / this.mAspectRatio)) * this.mAspectRatio * scaleX;
            // let worldY = ((((screenY / this.mCanvasNode.clientHeight) * -2) + 1) + ((offsetY / scaleY * this.mAspectRatio) / this.mAspectRatio)) * scaleY;

            let screenPos : Vector4 = new Vector4(0, 0, z, w);

            screenPos.x = (((screenX / this.mCanvasNode.clientWidth) * 2) - 1) * this.mAspectRatio * scaleX;
            screenPos.y = (((screenY / this.mCanvasNode.clientHeight) * -2) + 1) * scaleY;

            const x1 : number = screenPos.x;
            const y1 : number = screenPos.y;

            // screenPos.rotateZ(rotationRadians);
            //_Renderer2D().drawQuad(new Quad(new Vector3(screenPos.x, screenPos.y, screenPos.z), new Vector2(0.06, 0.06), new Vector4(0, 1, 0, 1), 0, null));

            // let worldX = ((((screenX / this.mCanvasNode.clientWidth) * 2) - 1) + ((offsetX / scaleX) / this.mAspectRatio)) * this.mAspectRatio * scaleX;
            // let worldY = (((screenY / this.mCanvasNode.clientHeight) * -2) + 1) + ((offsetY / scaleY * this.mAspectRatio) / this.mAspectRatio) * scaleY;

            let offsetPos : Vector4 = new Vector4(
                (((offsetX / scaleX) / this.mAspectRatio)) * this.mAspectRatio * scaleX,
                ((offsetY / scaleY * this.mAspectRatio) / this.mAspectRatio) * scaleY,
                z,
                w
            );

            const x2 : number = offsetPos.x;
            const y2 : number = offsetPos.y;


            // _Renderer2D().drawQuad(new Quad(new Vector3(offsetPos.x, offsetPos.y, offsetPos.z), new Vector2(0.06, 0.06), new Vector4(1, 0, 1, 1), 0, null));

            let pos : Vector4 = new Vector4(x1 + x2, y1 + y2, z, w);
            // let pos : Vector4 = new Vector4(screenPos.x + offsetPos.x, screenPos.y + offsetPos.y, z, w);
            //pos.rotateZ(rotationRadians);


            return pos;
            // return new Vector4(worldX, worldY, z, w).rotateZ(rotationRadians);
            // return new Vector4(worldX, worldY, z, w);
        }

        private setWindowCallbacks() : void {
            //Set callbacks
            window.onblur = function () {
                mApplication.onEvent(new FocusChangeEvent(false));
            }

            window.onfocus = function () {
                mApplication.onEvent(new FocusChangeEvent(true));
            }
        }

        public hideNativeCursor(hideNativeCursor : boolean) : void {
            this.mCanvasNode.style.cursor = hideNativeCursor ? "none" : "auto";
        }

        public resizable() : boolean {
            return this.mResizable;
        }

        public getCanvasNode() : HTMLCanvasElement {
            return this.mCanvasNode;
        }

        public getNodeWidth() : number {
            return this.mCanvasNode.clientWidth;
        }

        public getNodeHeight() : number {
            return this.mCanvasNode.clientHeight;
        }

        public isMaxSizeEnabled() : boolean {
            return this.mMaxSizeEnabled;
        }

        public enableMaxSize(enable : boolean) : void {
            this.mMaxSizeEnabled = enable;
        }

        public setAspectRatio(aspectRatio : number) : void {
            this.mAspectRatio = aspectRatio;
        }
    }
}
