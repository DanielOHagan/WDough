namespace WDOH {

    export class Application {

        private mCanvas : Canvas;
        private mAppLogic : IApplicationLogic;
        private mAppLoop : ApplicationLoop;
        private mRenderer : Renderer;
        private mLogger : Logger;
        private mResourceList : ResourceList;
        private mAppName : string | null;
        private mDebugOutput : DebugOutput;

        private mRunning : boolean;
        private mFocused : boolean;
        private mDebugging : boolean;

        public constructor(appLogic : IApplicationLogic, appName : string | null) {
            this.mCanvas = new Canvas(window.innerWidth, window.innerHeight);
            this.mRenderer = new Renderer();
            this.mAppLoop = new ApplicationLoop(ApplicationLoop.DEFAULT_TARGET_FPS);
            this.mAppLogic = appLogic;
            this.mRunning = false;
            this.mFocused = true;
            this.mLogger = new Logger(appName);
            this.mResourceList = new ResourceList();
            this.mAppName = appName;
            this.mDebugOutput = new DebugOutput();


            this.mDebugging = true;
        }

        public init(/*initSettings : ApplicationInitialisationSettings, appSettings : ApplicationSettings*/) : void {
            //Attach canvas to body
            this.mCanvas.attachCanvas(Canvas.DEFAULT_CANVAS_WRAPPER_ID);

            this.initDebug();

            this.mRenderer.init();

            //Set viewport for initial frame
            this.mRenderer.getRendererAPI().setViewport(
                0,
                0,
                this.mCanvas.getNodeWidth(),
                this.mCanvas.getNodeHeight()
            );

            this.mAppLogic.init();

            //Rendering context set-up
            this.mRenderer.getRendererAPI().setClearColour(Renderer.DEFAULT_CLEAR_COLOUR);

            Input.get().init(true, true, []);

            this.mCanvas.updateTitle();
        }

        public cleanUp() : void {
            this.mAppLogic.cleanUp();
            this.mRenderer.cleanUp();
        }

        public run() : void {
            if (!this.mAppLogic.canRun()) {
                this.throwError("Applicaiton Logic can not run.");
            }
            this.mRunning = true;
            this.mAppLoop.run();
        }

        public end() : void {
            if (this.mRunning) {
                this.mRunning = false;

                this.cleanUp();
            } else {
                _Logger().infoWDOH("Unable to end, application not running.");
            }
        }

        public update(deltaTime : number) : void {
            this.mRenderer.getRendererAPI().clear();
            this.updateDebugOutput();
            this.mAppLogic.update(deltaTime);
        }

        public throwError(errMsg : string) : void {
            //TODO : : Create an "Error" object containing Message, Origin, Timestamp, etc....
            _Logger().errWDOH(`Throwing Error & stopping execution : ${errMsg}`);
            throw new Error(errMsg);
        }

        //-----Events-----
        //This is primarily a 'catch all' event for any AEvent instances.
        //It is faster and recommended to call the specific on____Event() methods when
        // it is known which events will be passed.
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
                    _Logger().errWDOH("Unrecognised, or NONE, event catagory.");
                    break;
            }
        }

        public onKeyEvent(keyEvent : KeyEvent) : void {
            if (!keyEvent.shouldIgnore()) {
                this.mAppLogic.onKeyEvent(keyEvent);
            }
        }

        public onMouseEvent(mouseEvent : MouseEvent) : void {
            if (!mouseEvent.shouldIgnore()) {
                this.mAppLogic.onMouseEvent(mouseEvent);
            }
        }

        public onCanvasEvent(event : AEvent) : void {
            switch (event.getType()) {
                case EEventType.CANVAS_RESIZE:
                    this.resizeViewport(event as CanvasResizeEvent);
                    break;

                case EEventType.NONE:
                default:
                    this.throwError("Unrecognised, or NONE, event type.")
            }
        }

        public onApplicationEvent(event : AEvent) : void {
            switch (event.getType()) {
                case EEventType.APPLICATION_FOCUS_CHANGE :
                    this.mFocused = (event as FocusChangeEvent).isFocused();
                    this.mAppLoop.onFocusChange(this.mFocused);
                    break;

                case EEventType.NONE:
                default:
                    this.throwError("Unrecognised, or NONE, event type.")
            }
        }

        private resizeViewport(resizeEvent : CanvasResizeEvent) : void {
            if (this.mCanvas.resizable() && this.mCanvas.areSizesValid(resizeEvent.width, resizeEvent.height)) {
                const aspectRatio : number = resizeEvent.width / resizeEvent.height;
                //Update canvas node
                this.mCanvas.resize(resizeEvent.width, resizeEvent.height);
                this.mCanvas.setAspectRatio(aspectRatio);

                //Update Application
                this.mAppLogic.onCanvasResize(aspectRatio);

                //Update renderer viewport
                this.mRenderer.getRendererAPI().setViewport(0, 0, resizeEvent.width, resizeEvent.height);
            }
        }

        public initDebug() : void {
            let generalCategory : DebugOutputCategory | null = _DebugOutput().addCategory("General");
            if (generalCategory !== null) {
                generalCategory.addItem("Total Runtime", "");
                generalCategory.addItem("FPS", "");
                generalCategory.addItem("Target FPS", this.mAppLoop.getTargetFps().toString());
                {
                    const cursorPos : Vector2 = Input.get().getMouseScreenPos();
                    generalCategory.addItem("Cursor Screen Pos", "X: " + cursorPos.x + " Y: " + cursorPos.y);
                }
            }

            this.mCanvas.attachDebugOutput();
            _DebugOutput().display(this.mDebugging);
        }

        public updateDebugOutput() : void {
            let generalCategory : DebugOutputCategory | null = _DebugOutput().getCategoryByName("General");
            if (generalCategory !== null) {
                generalCategory.updateValue("FPS", this.mAppLoop.getFps().toString());
                generalCategory.updateValue("Target FPS", this.mAppLoop.getTargetFps().toString());
                {
                    const cursorPos : Vector2 = Input.get().getMouseScreenPos();
                    generalCategory.updateValue("Cursor Screen Pos", "X: " + cursorPos.x + " Y: " + cursorPos.y);
                }
            }
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

        public isFocused() : boolean {
            return this.mFocused;
        }

        public getLogger() : Logger {
            return this.mLogger;
        }

        public getDebugOutput() : DebugOutput {
            return this.mDebugOutput;
        }

        public getAppName() : string | null {
            return this.mAppName;
        }

        public getResourceList() : ResourceList {
            return this.mResourceList;
        }

        public getCanvas() : Canvas {
            return this.mCanvas;
        }
    }
}
