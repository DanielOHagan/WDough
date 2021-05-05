namespace WDOH {

    export class RenderBatchQuad extends ARenderBatch<Quad> {

        public static readonly BYTE_SIZE : number = 10 * 4;

        public constructor(maxGeometryCount : number, maxTextSlotIndex : number) {
            super(maxGeometryCount, maxGeometryCount * 4, maxGeometryCount * 6, maxTextSlotIndex);
        }

        public add(quad : Quad, textureSlotIndex : number) : boolean {
            //Add data to batch buffer
            if (this.mVertexCount + 4 < this.MAX_VERTEX_COUNT) {
                let texCoordsIndex : number = 0;

                this.addQuadVertexToBatch(
                    quad.mPosition.x,
                    quad.mPosition.y,
                    quad.mPosition.z,
                    quad.mColour.x,
                    quad.mColour.y,
                    quad.mColour.z,
                    quad.mColour.w,
                    quad.mTextureCoordsU[texCoordsIndex],
                    quad.mTextureCoordsV[texCoordsIndex],
                    textureSlotIndex
                );
                texCoordsIndex++;
                
                this.addQuadVertexToBatch(
                    quad.mPosition.x + quad.mSize.x,
                    quad.mPosition.y,
                    quad.mPosition.z,
                    quad.mColour.x,
                    quad.mColour.y,
                    quad.mColour.z,
                    quad.mColour.w,
                    quad.mTextureCoordsU[texCoordsIndex],
                    quad.mTextureCoordsV[texCoordsIndex],
                    textureSlotIndex
                );
                texCoordsIndex++;

                this.addQuadVertexToBatch(
                    quad.mPosition.x + quad.mSize.x,
                    quad.mPosition.y + quad.mSize.y,
                    quad.mPosition.z,
                    quad.mColour.x,
                    quad.mColour.y,
                    quad.mColour.z,
                    quad.mColour.w,
                    quad.mTextureCoordsU[texCoordsIndex],
                    quad.mTextureCoordsV[texCoordsIndex],
                    textureSlotIndex
                );
                texCoordsIndex++;

                this.addQuadVertexToBatch(
                    quad.mPosition.x,
                    quad.mPosition.y + quad.mSize.y,
                    quad.mPosition.z,
                    quad.mColour.x,
                    quad.mColour.y,
                    quad.mColour.z,
                    quad.mColour.w,
                    quad.mTextureCoordsU[texCoordsIndex],
                    quad.mTextureCoordsV[texCoordsIndex],
                    textureSlotIndex
                );

                this.mVertexCount += 4;
                this.mIndexCount += 6;

                return true;

            } else {
                return false;
            }
        }

        public addAll(quadArray : Quad[], textureSlotIndex : number) : boolean {
            if (this.mVertexCount + (quadArray.length * 4) < this.MAX_VERTEX_COUNT) {
                for (let quad of quadArray) {
                    let texCoordsIndex : number = 0;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        textureSlotIndex
                    );
                    texCoordsIndex++;
                    
                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        textureSlotIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        textureSlotIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        textureSlotIndex
                    );
                    
                    this.mVertexCount += 4;
                    this.mIndexCount += 6;
                }

                return true;
            }

            return false;
        }

        public addTextured(quad : Quad) : boolean {
            if (quad.mTexture !== null) { 

                let texSlotIndex : number = this.hasTextureId(quad.mTexture.getId()) ?
                    this.getTextureSlotIndex(quad.mTexture.getId()) : this.addNewTexture(quad.mTexture);

                if (texSlotIndex === -1) {
                    return false;
                }

                return this.add(quad, texSlotIndex);
            }

            return false;
        }
        
        public addAllTextured(quadArray : Quad[]) : boolean {
            if (this.mVertexCount + (quadArray.length * 4) < this.MAX_VERTEX_COUNT) {
                for (let quad of quadArray) {
                    let texCoordsIndex : number = 0;
                    let texIndex = quad.mTexture !== null ? this.getTextureSlotIndex(quad.mTexture.getId()) : 0;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;
                    
                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    
                    this.mVertexCount += 4;
                    this.mIndexCount += 6;
                }

                return true;
            }

            return false;
        }

        public addAllSameTextured(quadArray : Quad[]) : boolean {
            if (this.mVertexCount + (quadArray.length * 4) < this.MAX_VERTEX_COUNT) {
                const texIndex = quadArray[0].mTexture !== null ? this.getTextureSlotIndex(quadArray[0].mTexture.getId()) : 0;

                for (let quad of quadArray) {
                    let texCoordsIndex : number = 0;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;
                    
                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x + quad.mSize.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    texCoordsIndex++;

                    this.addQuadVertexToBatch(
                        quad.mPosition.x,
                        quad.mPosition.y + quad.mSize.y,
                        quad.mPosition.z,
                        quad.mColour.x,
                        quad.mColour.y,
                        quad.mColour.z,
                        quad.mColour.w,
                        quad.mTextureCoordsU[texCoordsIndex],
                        quad.mTextureCoordsV[texCoordsIndex],
                        texIndex
                    );
                    
                    this.mVertexCount += 4;
                    this.mIndexCount += 6;
                }

                return true;
            }

            return false;
        }

        public copy(copy : ARenderBatch<Quad>) : void {
            //TODO:: This
        }

        public bind() : void {
            let index : number = 0;
            for (let texture of this.mTextureSlots.values()) {
                if (texture === null) continue;

                texture.activate(index);
                texture.bind();

                index++;
            }
        }

        private addQuadVertexToBatch(
            posX : number,
            posY : number,
            posZ : number,
            colourR : number,
            colourG : number,
            colourB : number,
            colourA : number,
            texCoordU : number,
            texCoordV : number,
            texIndex : number
        ) : void {
            this.mData[this.mDataIndex] = posX;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = posY;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = posZ;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = colourR;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = colourG;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = colourB;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = colourA;
            this.mDataIndex++;
         
            this.mData[this.mDataIndex] = texCoordU;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = texCoordV;
            this.mDataIndex++;
            this.mData[this.mDataIndex] = texIndex;
            this.mDataIndex++;
        }
    }
}