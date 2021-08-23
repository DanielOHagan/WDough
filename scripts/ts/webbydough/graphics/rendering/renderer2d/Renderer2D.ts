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
                    mApplication.throwError("Texture Shader is null.");
                    return;
                }

                textureShader.bind();
                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());

                //TODO:: One Optimisation could be to set scene data for what batches are going to be used until the end of the scene so the renderer knows what that to initialise.
                //      e.g: HUD, Background, Player
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


        //TODO:: If quadArray is too large for one single buffer this method splits it into multiple arrays
        //          that can then fit into a new empty buffer. Better to use a similar technique to the Fill Empty
        //          one used in the drawAllSameTexturedQuadFillEmpty
        public drawAllQuads(quadArray : Quad[]) : void {
            //TODO:: This could maybe be optimised better
            //Split source array into smaller ones to fit into batches
            let splitQuadArray : Quad[][] = [];
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

        public drawTexturedQuad(quad : Quad) : void {
            if (quad.mRotation !== 0) {
                //TODO:: Apply rotation
            }

            if (quad.mTexture !== null) {
                let added : boolean = false;
                //Loop through to find a batch with texture and space
                for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                    if (batch.hasTextureId(quad.mTexture.getId()) /*&& batch.hasSpace(1)*/ && batch.addTextured(quad)) {
                        added = true;
                        break;
                    }
                }

                if (!added) {
                    //Create new batch 
                    Renderer2DStorage.createNewTexturedQuadBatch([quad]);
                }
            }
        }

        public drawAllTexturedQuads(quadArray : Quad[]) : void {
            for (let quad of quadArray) {
                this.drawTexturedQuad(quad);
            }
        }

        /**
         * Draw a quad if the texture class member is not null
         * 
         * @param quad The Quad to draw
         */
        public drawIfTextured(quad : Quad) : void {
            if (quad.mTexture !== null) {
                this.drawTexturedQuad(quad);
            } else {
                this.drawQuad(quad);
            }
        }

        /**
         * Draw an array of quads if their texture class member is not null.
         * 
         * @param quadArray Array quads to draw.
         */
        public drawAllIfTextured(quadArray : Quad[]) : void {
            for (let quad of quadArray) {
                this.drawIfTextured(quad);
            }
        }

        /**
         * Draw quads using the same texture.
         * Adds array to first batch with space for whole array, if none available a new
         * batch is created.
         * 
         * @param quadArray Array of quads to be draw, all assumed to be using the same texture as quadArray[0]
         */
        public drawAllSameTexturedQuads(quadArray : Quad[]) : void {
            if (quadArray[0].mTexture === null) {
                mApplication.getLogger().errApp("drawAllSameTexturedQuads quad texture is null");
                return;
            }

            let added : boolean = false;

            for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                if (
                    batch.hasTextureId(quadArray[0].mTexture.getId()) &&
                    batch.addAllSameTextured(quadArray)
                ) {
                    added = true;
                    break;
                }
            }

            if (!added) {
                if (quadArray.length > Renderer2DStorage.mRenderBatchQuadMaxVertices) {
                    mApplication.getLogger().errApp("quadArray too large for single batch");
                } else {
                    Renderer2DStorage.createNewSameTexturedQuadBatch(quadArray);
                }
            }
        }

        /**
         * Draw quads using the same texture.
         * Fill Empty will add quads to batches that have the texture as it loops through batches,
         * until all quads have been added or all batches with the texture are full. 
         * If quads remain they are added to a batch with space or a new batch is created.
         * 
         * @param quadArray Array of quads to be drawn, all assumed to be using the same texture as quadArray[0]
         */
        public drawAllSameTexturedQuadsFillEmpty(quadArray : Quad[]) : void {
            if (quadArray[0].mTexture === null) {
                mApplication.getLogger().errApp("drawAllSameTexturedQuadsFillEmpty quad texture is null");
                return;
            }

            const texId : number = quadArray[0].mTexture.getId();
            const totalQuadCount : number = quadArray.length.valueOf();
            let added : boolean = false;
            let addedCount : number = 0;
            let availableSpace : number = -1;
            let firstBatchWithSpaceIndex : number = -1;

            let index : number = 0;
            for (let batch of Renderer2DStorage.mRenderBatchQuadArray) {
                if (batch.hasTextureId(texId)) {
                    availableSpace = batch.getRemainingSpace();
                    if (availableSpace >= quadArray.length) {
                        //Add all to batch
                        added = batch.addAll(quadArray, batch.getTextureSlotIndex(texId));
                        break;
                    } else if (availableSpace > 0) {
                        //Fill remaing spaces with quads
                        if (batch.addAllSameTextured(quadArray.splice(0, availableSpace))) {
                            addedCount += availableSpace;
                            if (addedCount === totalQuadCount) added = true;
                        }
                    }
                } else if (batch.hasSpace(totalQuadCount - addedCount) && batch.hasTextureSlotsAvailable()) {
                    firstBatchWithSpaceIndex = index;
                }

                index++;
            }

            if (!added) {
                //Add to first batch with space else create new batch
                if (firstBatchWithSpaceIndex !== -1) {
                    let texIndex : number = Renderer2DStorage.mRenderBatchQuadArray[firstBatchWithSpaceIndex].addNewTexture(quadArray[0].mTexture);
                    Renderer2DStorage.mRenderBatchQuadArray[firstBatchWithSpaceIndex].addAll(quadArray, texIndex);
                } else {
                    Renderer2DStorage.createNewSameTexturedQuadBatch(quadArray);
                }
            }
        }

        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }

        public isReady() : boolean {
            return Renderer2DStorage.isReady();
        }
    }
}
