namespace WDOH {

    export abstract class ARenderBatch<T extends AGeometry2D> {

        public static readonly DEFUALT_WHITE_TEXTURE_SLOT : number = 0;

        public readonly MAX_GEOMETRY_COUNT : number;
        public readonly MAX_VERTEX_COUNT : number;
        public readonly MAX_INDEX_COUNT  : number;
        public readonly MAX_TEXTURE_SLOT_INDEX : number;

        protected mData : number[];
        protected mDataIndex : number;
        protected mTextureSlots : Map<number, ITexture>;
        protected mNextTextureSlotIndex : number;
        protected mVertexCount : number;
        protected mIndexCount : number;

        //TODO:: Maybe add a bounding box that includes all AGeo in this batch,
        // which can be checked before rendering if any are in the displayed area.
        // When adding a quad, check if the pos + or - size is greater or less than the current bounding box.

        protected constructor(maxGeometryCount : number, maxVertexCount : number, maxIndexCount : number, maxTexSlotIndex : number) {
            this.MAX_GEOMETRY_COUNT = maxGeometryCount;
            this.MAX_VERTEX_COUNT = maxVertexCount;
            this.MAX_INDEX_COUNT = maxIndexCount;
            this.MAX_TEXTURE_SLOT_INDEX = maxTexSlotIndex;

            this.mData = [];
            this.mDataIndex = 0;
            this.mTextureSlots = new Map();
            this.mTextureSlots.set(ARenderBatch.DEFUALT_WHITE_TEXTURE_SLOT, Renderer2DStorage.mWhiteTexture);
            this.mNextTextureSlotIndex = 1;
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
        public abstract addAll(geometryArray : T[], textureSlotIndex : number) : boolean;

        // /**
        //  * Attempt to add items to array and return array of objects not added.
        //  * 
        //  * @param geometryArray The geometry objects attempting to be added to batch
        //  * 
        //  * @returns The remaining items in the array that were unable to be added to batch.
        //  *  Or null if all items were added successfully.
        //  */
        // public abstract addAllPossible(geometryArray : T[]) : T[] | null;

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
            this.mTextureSlots.set(ARenderBatch.DEFUALT_WHITE_TEXTURE_SLOT, Renderer2DStorage.mWhiteTexture);
            this.mNextTextureSlotIndex = 1;
        }

        /**
         * Checks if the texture is being stored in batch.
         * @param textureId Id of the texture.
         * @returns True if texture is found, false if not.
         */
        public hasTextureId(textureId : number) : boolean {
            for (let texture of this.mTextureSlots.values()) {
                if (textureId === texture.getId()) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Get the texture slot index of the given texture.
         * This method assumes that the texture is already stored in mTextureSlots
         * @param textureId Id of the texture.
         * @returns Texture slot index of the texture, or -1 if not found
         */
        public getTextureSlotIndex(textureId : number) : number {
            let textureSlotIndex : number = 0;
            
            for (let texture of this.mTextureSlots.values()) {
                if (texture === null || texture.getId() === Renderer2DStorage.mWhiteTexture.getId()) {
                    textureSlotIndex++;
                    continue;   
                }
                
                if (textureId === texture.getId()) {
                    return textureSlotIndex;
                }

                textureSlotIndex++;
            }

            mApplication.getLogger().warnApp("TexId: " + textureId + " not found in batch");

            return -1;
        }

        /**
         * Returns true/false if batch has enough space for given number
         *  of vertices.
         * Logs error if given vertexCount is negative.
         * @param vertexCount 
         * @returns Boolean for if batch has enough space for vertexCount
         */
        public hasSpace(vertexCount : number) : boolean {
            if (vertexCount < 0) {
                mApplication.getLogger().errWDOH("batch.hasSpace() given negative argument.");
                return false;
            }

            return this.mVertexCount + vertexCount <= this.MAX_VERTEX_COUNT;
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

        public hasTextureSlotsAvailable() : boolean {
            return this.mNextTextureSlotIndex <= this.MAX_TEXTURE_SLOT_INDEX;
        }
    }
}