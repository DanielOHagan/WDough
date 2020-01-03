namespace WDOH {

    export class BufferElement {
        public name : string; //Name corresponding to Shader Atrib
        public dataType : EDataType;
        public offset : number;
        public size : number; //Length of buffer element in bytes
        public normalised : boolean;

        public constructor(
            name : string,
            dataType : EDataType,
            offset : number = 0,
            normalised : boolean = false
        ) {
            this.name = name;
            this.dataType = dataType;
            this.offset = offset;
            this.size = DataType.getDataTypeSize(dataType);
            this.normalised = normalised;
        }
    }

    export class BufferLayout {

        //Maybe change the BufferElement[] into another type to allow for easier changing of elements at runtime
        private mBufferElements : BufferElement[];
        private mStride : number;

        public constructor(bufferElements : BufferElement[]) {
            this.mBufferElements = bufferElements;
            this.mStride = 0;

            this.calculateOffsetAndStride();
        }

        private calculateOffsetAndStride() : void {
            let offset : number = 0;
            this.mStride = 0;

            for (let element of this.mBufferElements) {
                element.offset = offset;
                offset += element.size;
                this.mStride += element.size;
            }
        }

        public getBufferElements() : BufferElement[] {
            return this.mBufferElements;
        }

        public getStride() : number {
            return this.mStride;
        }
    }
}