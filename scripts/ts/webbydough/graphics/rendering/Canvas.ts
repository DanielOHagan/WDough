namespace WDOH {

    export var mContext : WebGL2RenderingContext;

    /**
     * Wrapper class for the context viewport
     */
    export class Canvas {
        
        private readonly mWebGLContext : string = "webgl2";

        private mCanvasNode : HTMLCanvasElement;

        public constructor(canvasId ? : string) {
            this.mCanvasNode = this.createCanvasNode(canvasId);
            
            //TDOD:: Make Resizing
            //TEMP size changing here
            this.mCanvasNode.width = 1280;
            this.mCanvasNode.height = 720;
            
            mContext = this.createRenderingContext();
        }

        private createCanvasNode(canvasId ? : string) : HTMLCanvasElement {
            let canvasNode : HTMLCanvasElement;

            if (canvasId === undefined) {
                canvasNode = document.createElement("canvas") as HTMLCanvasElement;
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

        public getCanvasNode() : HTMLCanvasElement {
            return this.mCanvasNode;
        }
    }
}