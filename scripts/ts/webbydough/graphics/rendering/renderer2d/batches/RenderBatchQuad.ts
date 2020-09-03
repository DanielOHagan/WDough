namespace WDOH {

    export class RenderBatchQuad extends ARenderBatch<Quad> {

        public static readonly BYTE_SIZE : number = 10 * 4;

        public constructor(maxGeometryCount : number) {
            super(maxGeometryCount);
        }

        public add(quad : Quad, textureSlotIndex : number | null) : boolean {
            if (this.mVertexCount + 4 < this.MAX_VERTEX_COUNT) {
                let texCoordsIndex : number = 0;
                let texIndex : number = textureSlotIndex !== null ? textureSlotIndex : 0;

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

                return true;

            } else {
                return false;
            }
        }

        public addTextured(quad : Quad) : boolean {
            if (this.mTextureSlots.size < Renderer2DStorage.BATCH_MAX_TEXTURE_SLOT_INDEX) {
                let textureSlotIndex : number | null = null;

                if (quad.mTexture !== null) {
                    textureSlotIndex = this.getTextureSlotIndex(quad.mTexture.getId());
                }

                return this.add(quad, textureSlotIndex);
            }

            return false;
        }

        public addAll(quadArray : Quad[]) : boolean {
            //TODO:: Sort into those with the same texture so the texIndex doesn't have to be
            //  querried each time.

            if (this.mVertexCount + (quadArray.length * 4) < this.MAX_VERTEX_COUNT) {
                for (let quad of quadArray) {
                    let texCoordsIndex : number = 0;
                    let texIndex : number = quad.mTexture !== null ? this.getTextureSlotIndex(quad.mTexture.getId()) : 0;

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

            } else {
                return false;
            }
        }

        public copy(copy : ARenderBatch<Quad>) : void {
            //TODO:: This
        }

        public bind() : void {
            let slotIndex : number = 0;

            for (let texture of this.mTextureSlots.values()) {                
                if (texture?.hasLoaded()) {
                    texture.bind();
                    texture.activate(slotIndex);
                } else {
                    //Set unused texture slots to white texture
                    Renderer2DStorage.mWhiteTexture.bind();
                    Renderer2DStorage.mWhiteTexture.activate(slotIndex);
                }

                slotIndex++;
            }

            for (let i = this.mTextureSlotIndex; i < Renderer2DStorage.BATCH_MAX_TEXTURE_SLOT_INDEX; i++) {
                //Set unused texture slots to white texture
                Renderer2DStorage.mWhiteTexture.bind();
                Renderer2DStorage.mWhiteTexture.activate(i);
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