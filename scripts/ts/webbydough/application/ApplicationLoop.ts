namespace WDOH {

    export class ApplicationLoop {

        public static readonly DEFAULT_TARGET_FPS : number = 60;

        private mLastCycleTime : number;

        private mLimitBackgroundFps : boolean;
        private mTargetFps : number;
        private mTargetFrameTime : number;
        private mCurrentFrameTime : number;

        public constructor(targetFps : number, limitBackgroundFps : boolean) {
            this.mTargetFps = targetFps;
            this.mTargetFrameTime = 1 / targetFps;
            this.mLimitBackgroundFps = limitBackgroundFps;

            this.mCurrentFrameTime = 0;
            this.mLastCycleTime = Time.getCurrentTimeSeconds();
        }

        public run() : void {

            if (mApplication.isRunning()) {
                requestAnimationFrame(this.run.bind(this));
                
                //Update Delta Time
                let currentTime : number = Time.getCurrentTimeSeconds();
                let deltaTime = currentTime - this.mLastCycleTime;
                
                //If still in the time slot for previous frame,
                // don't call mApplication.update
                this.mCurrentFrameTime += deltaTime;
                let updateFrame : boolean;
                
                if (this.mCurrentFrameTime < this.mTargetFrameTime) {
                    updateFrame = false;
                } else {
                    this.mCurrentFrameTime = 0;
                    updateFrame = true;
                }
                
                if (updateFrame) {
                    mApplication.update(deltaTime);
                }

                this.mLastCycleTime = currentTime;
            }
        }

        //When changing mTargetFps USE THIS METHOD
        public setTargetFps(targetFps : number) : void {
            this.mTargetFps = targetFps;
            this.mTargetFrameTime = 1 / targetFps;
        }
    }
}