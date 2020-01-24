namespace WDOH {

    export class DebugToolsWebGL {

        private constructor() {};

        public static printBufferParam(buffer : number, param : number) : void {
            console.log(mContext.getBufferParameter(buffer, param));
        }

        public static printBufferSize(buffer : number) : void {
            this.printBufferParam(buffer, mContext.BUFFER_SIZE);
        }
    }
}