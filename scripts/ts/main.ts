//Engine entry point

var mApplication : WDOH.Application;

window.onload = function () {
    mApplication = new WDOH.Application(new this.TestGame.TG_Logic());
    
    if (mApplication !== null) {
        mApplication.init();
        mApplication.run();
    }
}