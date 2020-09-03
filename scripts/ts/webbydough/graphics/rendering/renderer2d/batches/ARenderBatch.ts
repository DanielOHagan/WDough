namespace WDOH {

    export abstract class ARenderBatch<T extends AGeometry> {

        public readonly MAX_GEOMETRY_COUNT : number;
        public readonly MAX_VERTEX_COUNT : number;
        public readonly MAX_INDEX_COUNT  : number;

        protected mData : number[];
        protected mDataIndex : number;
        protected mTextureSlots : Map<number, ITexture>;
        protected mTextureSlotIndex : number;
        protected mVertexCount : number;
        protected mIndexCount : number;

        protected constructor(maxGeometryCount : number) {
            this.MAX_GEOMETRY_COUNT = maxGeometryCount;
            this.MAX_VERTEX_COUNT = maxGeometryCount * 4;
            this.MAX_INDEX_COUNT = maxGeometryCount * 6;

            this.mData = [];
            this.mDataIndex = 0;
            this.mTextureSlots = new Map();
            this.mTextureSlots.set(0, Renderer2DStorage.mWhiteTexture);
            this.mTextureSlotIndex = 1;
            this.mVertexCount = 0;
            this.mIndexCount = 0;
        }

        /**
         * Add a piece of geometry to this batch and return boolean whether
         *  it was added.
         * 
         * @param geometry The geometry object being added to the batch.
         * 
         * @return True if geometry has been added to the batch, False if the 
         *  geometry could not be added to batch due to lack of space or 
         *  another reason
         */
        public abstract add(geometry : T, textureSlotIndex : number) : boolean;

        /**
         * 
         * @param geometry
         */
        public abstract addTextured(geometry : T, textureSlotIndex : number) : boolean;

        /**
         * Add an array of geometry to this batch and return boolean whether
         *  it was added.
         * 
         * @param geometry The geometry objects being added to the batch
         * 
         * @return True if geometry array has been added to the batch, False if the 
         *  geometry could not be added to batch due to lack of space or 
         *  another reason
         */
        public abstract addAll(geometryArray : T[]) : boolean;

        /**
         * Set the values of this batch to those of the one passed as an argument.
         * 
         * @param batch The batch of the same type to copy values from.
         */
        public abstract copy(batch : ARenderBatch<T>) : void;

        /**
         * Get the batch ready for rendering.
         */
        public abstract bind() : void;

        /**
         * Set all instance data to default values.
         */
        public clear() : void {
            this.mData = [];
            this.mDataIndex = 0;
            this.mTextureSlots.clear();
            this.mTextureSlots.set(0, Renderer2DStorage.mWhiteTexture);
            this.mTextureSlotIndex = 1;
        }

        public hasTextureId(textureId : number) : boolean {
            for (let id of this.mTextureSlots.keys()) {
                if (textureId === id) {
                    return true;
                }
            }

            return false;
        }

        public getTextureSlotIndex(textureId : number) : number {
            let textureSlotIndex : number = 0;
            
            for (let texture of this.mTextureSlots.values()) {
                textureSlotIndex++;

                if (textureId === texture.getId()) {
                    return textureSlotIndex;
                }
            }

            return textureSlotIndex;
        }

        public getData() : number[] {
            return this.mData;
        }

        public getVertexCount() : number {
            return this.mVertexCount;
        }

        public getIndexCount() : number {
            return this.mIndexCount;
        }
    }
}