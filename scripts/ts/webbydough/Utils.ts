namespace WDOH {

    //Global namespace functions for cleaner code.
    export function _Renderer() : Renderer {
        return mApplication.getRenderer();
    }

    export function _Renderer2D() : Renderer2D {
        return mApplication.getRenderer().render2D();
    }

    export function _Logger() : Logger {
        return mApplication.getLogger();
    }

    export function _DebugOutput() : DebugOutput {
        return mApplication.getDebugOutput();
    }
}
