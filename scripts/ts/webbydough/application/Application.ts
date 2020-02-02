
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

        public init(/*appSettings : ApplicationSettings*/) : void {

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

            Input.get().init(true, true, []);
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
        public onEvent(event : AEvent) : void {
            switch (event.getCatagory()) {
                case EEventCatagory.INPUT_KEY:

                    break;
                case EEventCatagory.INPUT_MOUSE:

                    break;
                case EEventCatagory.CANVAS:
                    this.onCanvasEvent(event);
                    break;
                case EEventCatagory.NONE:
                default:
                    throw new Error("Unrecognised, or NONE, event catagory.");
                    break;
            }
        }

        public onKeyEvent(keyEvent : KeyEvent) : void {
            if (!keyEvent.shouldIgnore()) {
                this.mAppLogic.onKeyEvent(keyEvent);
            }
        }

        public onMouseEvent(mouseEvent : WDOH.MouseEvent) : void {
            this.mAppLogic.onMouseEvent(mouseEvent);
        }

        public onCanvasEvent(event : AEvent) : void {
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
                //Update canvas node
                this.mCanvas.resize(resizeEvent.width, resizeEvent.height);

                //Update Application
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