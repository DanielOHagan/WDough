
namespace WDOH {

    export class Application {

        private mCanvas : Canvas;
        private mAppLogic : IApplicationLogic;
        private mRenderer : Renderer;

        public constructor(appLogic : IApplicationLogic) {
            this.mCanvas = new Canvas(window.innerWidth, window.innerHeight);
            this.mRenderer = new Renderer();
            this.mAppLogic = appLogic;
        }

        public init() : void {

            //Attach canvas to body
            this.mCanvas.attachCanvas(Canvas.DEFAULT_CANVAS_WRAPPER_ID);

            this.mRenderer.init();

            //Set viewport for initial frame
            this.mRenderer.getRendererAPI().setViewport(
                0,
                0,
                this.mCanvas.getCanvasNode().width,
                this.mCanvas.getCanvasNode().height
            );

            this.mAppLogic.init();

            //Rendering context set-up
            mContext.clearColor(1.0, 0.0, 1.0, 1.0);

        }

        public run() : void {
            this.loop();
        }

        private loop() : void {

            mContext.clear(mContext.COLOR_BUFFER_BIT);

            this.mAppLogic.update(0);

            requestAnimationFrame(this.loop.bind(this));
        }

        //-----Events-----
        public onEvent(event : IEvent) : void {
            switch (event.getCatagory()) {
                case EEventCatagory.CANVAS:
                    this.onCanvasEvent(event);
                    break;
                case EEventCatagory.NONE:
                default:
                    throw new Error("Unrecognised, or NONE, event catagory.");
                    break;
            }
        }

        public onCanvasEvent(event : IEvent) : void {
            switch (event.getType()) {
                case EEventType.CANVAS_RESIZE:
                    this.resizeViewport(event as CanvasResizeEvent);
                    break;
                case EEventType.NONE:
                default:
                    throw new Error("Unrecognised, or NONE, event type.");
                    break;
            }
        }

        private resizeViewport(resizeEvent : CanvasResizeEvent) : void {
            if (this.mCanvas.resizable()) {
                resizeEvent.invoke();

                //Update canvas node
                this.mCanvas.resize(resizeEvent.width, resizeEvent.height);

                //Update Application (an application would typically update camera projections)
                this.mAppLogic.onCanvasResize(resizeEvent.width / resizeEvent.height);

                //Update renderer viewport
                this.mRenderer.getRendererAPI().setViewport(0, 0, resizeEvent.width, resizeEvent.height);
            }
        }

        //-----Getters-----
        public getApplicationLogic() : IApplicationLogic {
            return this.mAppLogic;
        }

        public getRenderer() : Renderer {
            return this.mRenderer;
        }
    }
}