namespace WDOH {

    export var mContext : WebGL2RenderingContext;

    export class Canvas {
        
        public static readonly DEFAULT_CANVAS_ID = "wdoh-canvas";
        public static readonly DEFAULT_CANVAS_WRAPPER_ID = "defualt-wdoh-canvas-wrapper";
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
            canvasId ? : string
        ) {
            this.mCanvasNode = this.createCanvasNode(canvasId);

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
                throw new Error(
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
        }

        private createCanvasNode(canvasId ? : string) : HTMLCanvasElement {
            let canvasNode : HTMLCanvasElement;

            if (canvasId === undefined) {
                canvasNode = document.createElement("canvas") as HTMLCanvasElement;
                canvasNode.setAttribute("id", Canvas.DEFAULT_CANVAS_ID);
            } else {
                canvasNode = document.getElementById(canvasId) as HTMLCanvasElement;
            }

            if (canvasNode === undefined || canvasNode === null) {
                throw new Error("Unable to create node");
            }

            return canvasNode;
        }

        private createRenderingContext() : WebGL2RenderingContext {
            if (this.mCanvasNode === null || this.mCanvasNode === undefined) {
                throw new Error("Canvas not yet defined, unable to create rendering context.");
            }

            let context : WebGL2RenderingContext = this.mCanvasNode.getContext(Canvas.WEBGL_2_CONTEXT_STRING) as WebGL2RenderingContext;

            if (context === null) {
                throw new Error("Unable to create rendering context, WebGL2 support is required.");
            }

            return context;
        }

        public attachCanvas(nodeId : string = "body") {
            if (nodeId === "body") {
                //Attach to body
                document.body.appendChild(this.mCanvasNode);
            } else {
                //Attach to specified node
                let node = document.getElementById(nodeId);

                if (node === null) {
                    throw new Error("Unable to find node with ID: " + nodeId);
                }

                node.appendChild(this.mCanvasNode);
            }
        }

        public enableResizeEvents(resizable : boolean) : void {
            this.mResizable = resizable;
            
            if (this.mResizable) {
                //Set resize event
                window.onresize = function() {
                    this.mApplication.onEvent(new CanvasResizeEvent(window.innerWidth, window.innerHeight));
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
            //TODO:: Run checks when setting these values (e.g. if maxValue is larger than minValue)

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
                height < this.mMinHeight ||
                
                (
                    this.mMaxSizeEnabled &&
                    (
                        width > this.mMaxWidth ||
                        height > this.mMaxHeight
                    )
                )
            );
        }

        public convertScreenToWorldSpace(
            offsetX : number,
            offsetY : number,
            screenX : number,
            screenY : number,
            // scaleX : number,
            // scaleY : number,
            z : number,
            w : number
            // rotationRads : number
        ) : Vector4 {

            let worldX = ((screenX / this.mCanvasNode.clientWidth * 2 - 1) + offsetX / this.mAspectRatio) * this.mAspectRatio;
            let worldY = (screenY / this.mCanvasNode.clientHeight * -2 + 1) + offsetY;

            return new Vector4(worldX, worldY, z, w);
        }

        private setWindowCallbacks() : void {
            //Set callbacks
            window.onblur = function() {
                mApplication.onEvent(new FocusChangeEvent(false));
            }

            window.onfocus = function() {
                mApplication.onEvent(new FocusChangeEvent(true));
            }
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