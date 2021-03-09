namespace WDOH {

    export class Renderer2D implements IRenderer {

        public constructor() {}
        
        public init() : void {
            Renderer2DStorage.init();
        }

        public beginScene(camera : ICamera) {
            if (Renderer2DStorage.isReady()) {

                //Set up default shader
                let textureShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);

                if (textureShader === null) {
                    throw new Error("Texture Shader is null");
                }

                textureShader.bind();
                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());

                //TODO:: (One Optimisation could be to set scene data for what batches are going to be used until the end of the scene so the renderer knows what that to initialise)
                //Create first Quad Batch if none exist
                if (Renderer2DStorage.mRenderBatchQuadIndex < 0) {
                    Renderer2DStorage.createNewQuadBatch(null);
                }
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
                let batch : ARenderBatch<AGeometry2D> = Renderer2DStorage.mRenderBatchQuadArray[batchIndex];
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
                if (quad.mRotation !== 0) {
                    //TODO:: apply rotation to Quad position
                }

                let index : number = 0;
                for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                    if (batch.add(quad, ARenderBatch.DEFUALT_WHITE_TEXTURE_SLOT)) {
                        break;
                    }

                    //If at last batch then create new badge 
                    if (index === Renderer2DStorage.mRenderBatchQuadIndex) {
                        //Add to new batch
                        Renderer2DStorage.createNewQuadBatch([quad]);
                        break;
                    }

                    index++;
                }
            }
        }

        public drawAllQuads(quadArray : Quad[]) : void {
            if (Renderer2DStorage.isReady()) {
                
                //TODO:: This could maybe be optimised better
                //Split source array into smaller ones to fit into batches
                let splitQuadArray : Array<Quad[]> = [];
                let sourceArrayLength : number = quadArray.length;
                let splitCount : number = 0;
                
                while(sourceArrayLength > Renderer2DStorage.mRenderBatchMaxQuadCount) {
                    splitQuadArray.push(quadArray.slice(
                        splitCount * Renderer2DStorage.mRenderBatchMaxQuadCount,
                        Renderer2DStorage.mRenderBatchMaxQuadCount
                    ));
                }

                //Add quad array if no splits were made
                if (splitQuadArray.length < 1) splitQuadArray.push(quadArray);

                for (let quads of splitQuadArray) {
                    let index : number = 0;
                    for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                        if (batch.addAll(quads, RenderBatchQuad.DEFUALT_WHITE_TEXTURE_SLOT)) {
                            break;
                        }
                        
                        //If at last batch then create new badge 
                        if (index === Renderer2DStorage.mRenderBatchQuadIndex) {
                            //Add to new batch
                            Renderer2DStorage.createNewQuadBatch(quads);
                            break;
                        }
                        
                        index++;
                    }
                }
            }
        }

        public drawTexturedQuad(quad : Quad) : void {
            if (Renderer2DStorage.isReady()) {
                if (quad.mRotation !== 0) {
                    //TODO:: Apply rotation
                }

                if (quad.mTexture !== null) {
                    let added : boolean = false;

                    //Loop through to find a batch with texture and space
                    for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                        if (batch.hasTextureId(quad.mTexture.getId()) && batch.hasSpace(1) && batch.addTextured(quad)) {
                            added = true;
                            break;
                        }
                    }

                    if (!added) {
                        let index : number = -1;
                        
                        //Loop through to find batch with space for quad and texture
                        for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                            if (batch.addTextured(quad)) {
                                break;
                            }

                            index++;
                        }

                        if (index === Renderer2DStorage.mRenderBatchQuadIndex) {
                            //Create new batch 
                            Renderer2DStorage.createNewTexturedQuadBatch([quad]);
                        }
                    }
                }
            }
        }

        public drawAllTexturedQuads(quadArray : Quad[]) : void {
            if (Renderer2DStorage.isReady()) {

            }
        }

        public drawAllSameTexturedQuads(quadArray : Quad[]) : void {
            if (Renderer2DStorage.isReady()) {


            }
        }
        
        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }
    }
}