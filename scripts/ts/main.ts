//Engine entry point

let mApplication : wDOH.Application | null = null;

window.onload = function () {
    let mApplication = new wDOH.Application(new this.TestGame.TG_Logic());
    
    if (mApplication !== null) {
        mApplication.init();
        mApplication.run();
    }
}