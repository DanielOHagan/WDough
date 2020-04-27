
namespace WDOH {

    export class Application {

        private mCanvas : Canvas;
        private mAppLogic : IApplicationLogic;
        private mAppLoop : ApplicationLoop;
        private mRenderer : Renderer;
        private mLogger : Logger;

        // private mDebug : boolean;
        private mRunning : boolean;
        private mFocused : boolean;

        public constructor(appLogic : IApplicationLogic, appName : string | null) {
            this.mCanvas = new Canvas(window.innerWidth, window.innerHeight);
            this.mRenderer = new Renderer();
            this.mAppLoop = new ApplicationLoop(ApplicationLoop.DEFAULT_TARGET_FPS);
            this.mAppLogic = appLogic;
            this.mRunning = false;
            this.mFocused = true;
            this.mLogger = new Logger(appName);
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
            if (!this.mAppLogic.canRun()) {
                throw new Error("Unable to run, application logic is not able to run.")
            }
            this.mRunning = true;
            this.mAppLoop.run();
        }

        public update(deltaTime : number) : void {

            mContext.clear(mContext.COLOR_BUFFER_BIT);

            this.mAppLogic.update(deltaTime);
        }

        //-----Events-----
        //This is primarily a 'catch all' event for any AEvent instances
        //It is faster and recommended to call the specific on____Event() methods when
        // it is known which events will be passed
        public onEvent(event : AEvent) : void {
            switch (event.getCatagory()) {
                case EEventCatagory.INPUT_KEY:
                    this.onKeyEvent(event as KeyEvent);
                    break;
                case EEventCatagory.INPUT_MOUSE:
                    this.onMouseEvent(event as MouseEvent);
                    break;
                case EEventCatagory.CANVAS:
                    this.onCanvasEvent(event);
                    break;
                case EEventCatagory.APPLICATION:
                    this.onApplicationEvent(event);
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

        public onApplicationEvent(event : AEvent) : void {
            switch (event.getType()) {
                case EEventType.APPLICATION_FOCUS_CHANGE:
                    this.mFocused = (event as FocusChangeEvent).isFocused();
                    this.mAppLoop.onFocusChange(this.mFocused);
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

        public displayFps(fps : number) : void {
            this.mLogger.infoWDOH("FPS: " + fps);
        }

        private cleanUp() : void {
            this.mAppLogic.cleanUp();
            this.mRenderer.cleanUp();
        }

        //-----Setters-----
        public setFocused(focused : boolean) : void {
            this.mFocused = focused;
        }

        //-----Getters-----
        public getApplicationLogic() : IApplicationLogic {
            return this.mAppLogic;
        }

        public getRenderer() : Renderer {
            return this.mRenderer;
        }

        public isRunning() : boolean {
            return this.mRunning;
        }

        public getLogger() : Logger {
            return this.mLogger;
        }

        public isFocused() : boolean {
            return this.mFocused;
        }
    }
}