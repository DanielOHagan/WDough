
namespace wDOH {

    export class Application {

        private mCanvas : Canvas;
        private mAppLogic : IApplicationLogic;

        public constructor(appLogic : IApplicationLogic) {
            this.mCanvas = new Canvas();
            this.mAppLogic = appLogic;
        }

        public init() : void {

            //Attach canvas to body
            this.mCanvas.attachCanvas();

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
    }
}