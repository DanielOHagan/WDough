namespace WDOH {

    export class Renderer2D implements IRenderer {

        public constructor() {}
        
        public init() : void {
            Renderer2DStorage.init();
        }

        public beginScene(camera : ICamera) {
            if (Renderer2DStorage.isReady()) {

                let textureShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);

                if (textureShader === null) {
                    throw new Error("Texture Shader is null");
                }

                textureShader.bind();
                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());

            } else {
                Renderer2DStorage.checkShadersLoaded();

                //Attempt to re-initialise required shaders if all are loaded but not initialised
                if (!Renderer2DStorage.mRequiredShadersInitialised && Renderer2DStorage.mRequiredShadersLoaded) {
                    Renderer2DStorage.initShaders();
                }
            }
        }

        public endScene() : void {
            this.flush();
        }

        public flush() : void {
            for (let batchIndex : number = 0; batchIndex <= Renderer2DStorage.mRenderBatchQuadIndex; batchIndex++) {
                let batch : ARenderBatch<AGeometry> = Renderer2DStorage.mRenderBatchQuadArray[batchIndex];
                Renderer2DStorage.mQuadVbo.setData(batch.getData(), 0);
                
                //Draw batch
                batch.bind();
                mApplication.getRenderer().getRendererAPI().drawIndexed(batch.getIndexCount());

                //Clear batch
                batch.clear();
            }

            this.resetBatches();
        }

        private resetBatches() : void {
            Renderer2DStorage.mRenderBatchQuadArray = [];
            Renderer2DStorage.mRenderBatchQuadIndex = -1;
        }

        public drawQuad(quad : Quad) : void {
            if (Renderer2DStorage.isReady()) {
                Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER)?.bind();

                if (quad.mRotation !== 0) {
                    //TODO:: apply rotation to Quad position
                }

                //Create first Quad Batch if none exist
                if (Renderer2DStorage.mRenderBatchQuadIndex < 0) {
                    Renderer2DStorage.createNewQuadBatch(null, null);
                }

                let index : number = 0;
                for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                    if (batch.add(quad, 0)) {
                        break;
                    }

                    //If at last batch then create new badge 
                    if (index === Renderer2DStorage.mRenderBatchQuadIndex) {
                        //Add to new batch
                        Renderer2DStorage.createNewQuadBatch(quad, 0);
                        break;
                    }

                    index++;
                }
            }
        }

        public drawTexturedQuad(quad : Quad) : void {
            if (Renderer2DStorage.isReady()) {
                Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER)?.bind();

                if (quad.mRotation !== 0) {
                    //TODO:: apply rotation to Quad position
                }

                //Create first Quad Batch if none exist
                if (Renderer2DStorage.mRenderBatchQuadArray.length < 1) {
                    Renderer2DStorage.createNewQuadBatch(null, null);
                }

                //If textured search for texture in batches
                if (quad.mTexture !== null && quad.mTexture.hasLoaded()) {

                    let index : number = 0;
                    for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                        if (batch.hasTextureId(quad.mTexture.getId()) && batch.addTextured(quad)) {
                            break;
                        }

                        index++;
    
                        //If at last batch then create new badge 
                        if (index === Renderer2DStorage.mRenderBatchQuadIndex) {
                            //Add to new batch
                            Renderer2DStorage.createNewQuadBatch(quad, null);
                            break;
                        }
                    }
                } else {
                    mApplication.getLogger().warnApp("Texture is null or not loaded for Quad drawing.");
                }
            }
        }
        
        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }
    }
}