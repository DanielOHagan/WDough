namespace WDOH {

    export class Renderer2D implements IRenderer {

        public constructor() {

        }
        
        public init() : void {
            Renderer2DStorage.init();
        }

        public beginScene(camera : ICamera) {
            if (Renderer2DStorage.isReady()) {
                Renderer2DStorage.mQuadIndexCount = 0;

                let textureShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);

                if (textureShader === null) {
                    throw new Error("Texture Shader is null");
                }

                textureShader.bind();
                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());

                this.resetBatch();

            } else {
                Renderer2DStorage.checkShadersLoaded();

                //Attempt to re-initialise required shaders if they all are loaded
                if (!Renderer2DStorage.mRequiredShadersInitialised && Renderer2DStorage.mRequiredShadersLoaded) {
                    Renderer2DStorage.initShaders();
                }
            }
        }

        public endScene() : void {

            Renderer2DStorage.mQuadVbo.setData(Renderer2DStorage.mCurrentQuadBatch, 0);

            this.flush();
        }

        public flush() : void {

            for (let i = 0; i <= Renderer2DStorage.mBatchTextureSlotIndex; i++) {
                let texture : ITexture | undefined = Renderer2DStorage.mBatchTextureSlots.get(i);

                if (texture?.hasLoaded()) {
                    texture.bind();
                    texture.activate(i);

                    // console.log(i + " " + texture.getId());
                }
            }

            //TEMP:
            //mApplication.getLogger().infoWDOH("Renderer Batch Texture Count: " + Renderer2DStorage.mBatchTextureSlots.size);
            //mApplication.getLogger().infoWDOH("Renderer Batch Texture Slot index: " + Renderer2DStorage.mBatchTextureSlotIndex);

            mApplication.getRenderer().getRendererAPI().drawIndexed(Renderer2DStorage.mQuadIndexCount);

            this.resetBatch();
        }

        private resetBatch() : void {
            Renderer2DStorage.mCurrentQuadBatch = [];
            Renderer2DStorage.mCurrentQuadBatchIndex = 0;
            Renderer2DStorage.mQuadIndexCount = 0;

            Renderer2DStorage.mBatchTextureSlots.clear();
            Renderer2DStorage.mBatchTextureSlots.set(0, Renderer2DStorage.mWhiteTexture);
            Renderer2DStorage.mCurrentBatchTextureIds = [Renderer2DStorage.mWhiteTexture.getId()];
            Renderer2DStorage.mBatchTextureSlotIndex = 1;
        }

        public drawQuad(pos : Vector3, size : Vector2, colour : Vector4) : void {
            if (Renderer2DStorage.isReady()) {
                Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER)?.bind();

                let batchIndex : number = Renderer2DStorage.mCurrentQuadBatchIndex;
                const texIndex : number = 0;

                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x, pos.y, pos.z, colour.x, colour.y, colour.z, colour.w, 0, 0, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x + size.x, pos.y, pos.z, colour.x, colour.y, colour.z, colour.w, 1, 0, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x + size.x, pos.y + size.y, pos.z, colour.x, colour.y, colour.z, colour.w, 1, 1, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x, pos.y + size.y, pos.z, colour.x, colour.y, colour.z, colour.w, 0, 1, texIndex);

                this.iterateBatchContent(6, batchIndex);
            }
        }

        public drawRotatedQuad(pos : Vector3, size : Vector2, rotation : number, colour : Vector4) : void {

        }

        public drawTexturedQuad(pos : Vector3, size : Vector2, texture : ITexture) : void {
            if (Renderer2DStorage.isReady() && texture.hasLoaded()) {
                Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER)?.bind();

                let batchIndex : number = Renderer2DStorage.mCurrentQuadBatchIndex;
                const colour : Vector4 = new Vector4(1, 1, 1, 1);

                let texIndex : number = 0;
                let largestUsedIndex : number = 0;

                //Search if texture is already in batch
                for (let i = 1; i < Renderer2DStorage.BATCH_MAX_TEXTURE_SLOT_INDEX; i++) {
                    if (Renderer2DStorage.mBatchTextureSlots.get(i) !== undefined) {
                        largestUsedIndex = i;
                    }

                    if (Renderer2DStorage.mCurrentBatchTextureIds[i] === texture.getId()) {
                        texIndex = i;
                        break;
                    }
                }
                
                //Add texture to batch
                if (texIndex === 0) {
                    if (largestUsedIndex !== Renderer2DStorage.BATCH_MAX_TEXTURE_SLOT_INDEX - 1)  {
                        texIndex = largestUsedIndex + 1;
                        
                        Renderer2DStorage.mBatchTextureSlots.set(texIndex, texture);
                        Renderer2DStorage.mCurrentBatchTextureIds[Renderer2DStorage.mCurrentBatchTextureIds.length] = texture.getId();

                        Renderer2DStorage.mBatchTextureSlotIndex = texIndex;

                        // console.log(texIndex);
                    } else {
                        mApplication.getLogger().errWDOH("Can't draw textured quad, max amount of batch texture slots used.");
                    }
                }
                
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x, pos.y, pos.z, colour.x, colour.y, colour.z, colour.w, 0, 0, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x + size.x, pos.y, pos.z, colour.x, colour.y, colour.z, colour.w, 1, 0, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x + size.x, pos.y + size.y, pos.z, colour.x, colour.y, colour.z, colour.w, 1, 1, texIndex);
                batchIndex = this.addQuadVertexToBatch(batchIndex, pos.x, pos.y + size.y, pos.z, colour.x, colour.y, colour.z, colour.w, 0, 1, texIndex);
                
                this.iterateBatchContent(6, batchIndex);
            }
        }

        public drawRotatedTexturedQuad(pos : Vector3, size : Vector2, rotation : number, texture : ITexture) : void {

        }

        private addQuadVertexToBatch(
            batchIndex : number,
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
        ) : number {
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = posX;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = posY;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = posZ;
            batchIndex++;

            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = colourR;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = colourG;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = colourB;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = colourA;
            batchIndex++;
            
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = texCoordU;
            batchIndex++;
            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = texCoordV;
            batchIndex++;

            Renderer2DStorage.mCurrentQuadBatch[batchIndex] = texIndex;
            batchIndex++;

            return batchIndex;
        }

        private iterateBatchContent(indexCountDelta : number, batchIndex : number) : void {
            Renderer2DStorage.mQuadIndexCount += indexCountDelta;
            Renderer2DStorage.mCurrentQuadBatchIndex = batchIndex;
        }
        
        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }
    }
}