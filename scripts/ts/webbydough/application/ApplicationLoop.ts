namespace WDOH {
    
    export class ApplicationLoop {
        
        public static readonly DEFAULT_TARGET_FPS : number = 30;
        
        private mLastCycleTime : number;
        
        private mLimitBackgroundFps : boolean;
        private mFps : number;
        private mTargetFps : number;
        private mFpsCounterTime : number;
        private mPreviousFps : number;
        private mTargetFrameTime : number;
        private mCurrentFrameTime : number;

        public constructor(targetFps : number, limitBackgroundFps : boolean) {
            this.mFps = 0;
            this.mTargetFps = targetFps;
            this.mFpsCounterTime = 0;
            this.mPreviousFps = 0;
            this.mTargetFrameTime = 1 / targetFps;
            this.mLimitBackgroundFps = limitBackgroundFps;

            this.mCurrentFrameTime = 0;
            this.mLastCycleTime = Time.getCurrentTimeSeconds();
        }

        private mLastFrameExtraTime : number = 0;

        public run() : void {

            if (mApplication.isRunning()) {
                requestAnimationFrame(this.run.bind(this));
                
                //Update Delta Time
                let currentTime : number = Time.getCurrentTimeSeconds();
                let deltaTime = currentTime - this.mLastCycleTime;
                
                //If still in the time slot for previous frame
                // then don't call mApplication.update
                this.mCurrentFrameTime += deltaTime;
                let updateFrame : boolean;
                
                if (this.mCurrentFrameTime + this.mLastFrameExtraTime < this.mTargetFrameTime) {
                    updateFrame = false;
                } else {
                    this.mLastFrameExtraTime = this.mCurrentFrameTime + this.mLastFrameExtraTime - this.mTargetFrameTime;

                    this.mCurrentFrameTime = 0;
                    updateFrame = true;
                }

                //Update frame data each second
                this.mFpsCounterTime += deltaTime;
                if (this.mFpsCounterTime > 1) {
                    this.mPreviousFps = this.mFps;
                    this.mFps = 0;
                    this.mFpsCounterTime = 0;

                    //To display FPS every SECOND, call displayFps here
                    //mApplication.displayFps(this.mPreviousFps);
                }
                
                if (updateFrame) {
                    this.mFps++;
                    mApplication.update(deltaTime);

                    //To display FPS every FRAME, call displayFps here
                    //mApplication.displayFps(this.mPreviousFps);
                }

                this.mLastCycleTime = currentTime;
            }
        }

        //When changing mTargetFps USE THIS METHOD
        public setTargetFps(targetFps : number) : void {
            this.mTargetFps = targetFps;
            this.mTargetFrameTime = 1 / targetFps;
        }

        public getTargetFps() : number {
            return this.mTargetFps;
        }

        public getFps() : number {
            //Return the last full second's FPS count
            return this.mPreviousFps;
        }
    }
}