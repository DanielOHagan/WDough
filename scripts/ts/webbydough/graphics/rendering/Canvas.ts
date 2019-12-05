namespace wDOH {

    export var mContext : WebGL2RenderingContext;

    /**
     * Wrapper class for the context viewport
     */
    export class Canvas {

        private mCanvasNode : HTMLCanvasElement;

        public constructor(canvasId ? : string) {
            this.mCanvasNode = this.createCanvasNode(canvasId);
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

            return this.mCanvasNode.getContext("webgl2") as WebGL2RenderingContext;
        }

        public attachCanvas(nodeId : string = "body") {
            if (nodeId == "body") {
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