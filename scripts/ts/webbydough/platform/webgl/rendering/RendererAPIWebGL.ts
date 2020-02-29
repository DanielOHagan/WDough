namespace WDOH {

    export class RendererAPIWebGL implements IRendererAPI {

        public init(): void {
            mContext.enable(mContext.BLEND);
            mContext.blendFuncSeparate(mContext.SRC_ALPHA, mContext.ONE_MINUS_SRC_ALPHA, mContext.ONE, mContext.ONE);

            mContext.enable(mContext.DEPTH_TEST);
        }
        
        public setClearColour(colour : Vector4) : void {
            mContext.clearColor(colour.x, colour.y, colour.z, colour.w);
        }
        
        public setViewport(x : number, y : number, width : number, height : number) : void {
            mContext.viewport(x, y, width, height);
        }

        public clear() : void {
            mContext.clear(mContext.COLOR_BUFFER_BIT | mContext.DEPTH_BUFFER_BIT);
        }

        public drawIndexed(count : number) : void {
            mContext.drawElements(mContext.TRIANGLES, count, mContext.UNSIGNED_INT, 0);
        }
    }
}