namespace WDOH {

    export var mContext : WebGL2RenderingContext;

    export class Canvas {
        
        public static readonly DEFAULT_CANVAS_ID = "wdoh-canvas";
        public static readonly DEFAULT_CANVAS_WRAPPER_ID = "defualt-wdoh-canvas-wrapper";

        private readonly mWebGLContext : string = "webgl2";

        private mCanvasNode : HTMLCanvasElement;

        private mResizable : boolean;
        private mMinWidth : number;
        private mMaxWidth : number;
        private mMinHeight : number;
        private mMaxHeight : number;

        public constructor(width : number, height : number, canvasId ? : string) {
            this.mCanvasNode = this.createCanvasNode(canvasId);

            this.mResizable = true;
            this.mMinWidth = 0;
            this.mMinHeight = 0;
            this.mMaxWidth = 1920;
            this.mMaxHeight = 1080;

            this.setSizeParameters(
                this.mMinWidth,
                this.mMinHeight,
                this.mMaxWidth,
                this.mMaxHeight
            );

            if (!this.areSizesValid(width, height)) {
                throw new Error(
                    `Canvas creation sizes outside of allowed parameters:
                    Min Width: ${this.mMinWidth}, Min Height: ${this.mMinHeight},
                    Max Width: ${this.mMaxWidth}, Max Height: ${this.mMaxHeight}.
                    Given Sizes: Width: ${width}, Height: ${height}`
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

            return this.mCanvasNode.getContext(this.mWebGLContext) as WebGL2RenderingContext;
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
            if (this.mResizable) {
                //Check min/max size parameters
                if (this.areSizesValid(width, height)) {
                    this.mCanvasNode.width = width;
                    this.mCanvasNode.height = height;
                }
            }
        }

        public setSizeParameters(
            minWidth : number,
            minHeight : number,
            maxWidth : number,
            maxHeight : number
        ) : void {

            //TODO:: Run checks when setting these values (e.g. if maxValue is larger than minValue)

            this.mMinWidth = minWidth;
            this.mMinHeight = minHeight;
            this.mMaxWidth = maxWidth;
            this.mMaxHeight = maxHeight;

            this.mCanvasNode.style.minWidth = minWidth.toString();
            this.mCanvasNode.style.minHeight = minHeight.toString();
            this.mCanvasNode.style.maxWidth = maxWidth.toString();
            this.mCanvasNode.style.maxHeight = maxHeight.toString();
        }

        private areSizesValid(width : number, height : number) : boolean {
            return !(
                width < this.mMinWidth ||
                width > this.mMaxWidth ||
                height < this.mMinHeight ||
                height > this.mMaxHeight
            );
        }

        private setWindowCallbacks() : void {
            //Set callbacks
            window.onblur = function() {
                this.mApplication.onEvent(new FocusChangeEvent(false));
            }

            window.onfocus = function() {
                this.mApplication.onEvent(new FocusChangeEvent(true));
            }
        }

        public resizable() : boolean {
            return this.mResizable;
        }

        public getCanvasNode() : HTMLCanvasElement {
            return this.mCanvasNode;
        }
    }
}