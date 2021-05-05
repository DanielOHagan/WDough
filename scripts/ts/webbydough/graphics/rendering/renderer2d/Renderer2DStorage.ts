namespace WDOH {

    export class Renderer2DStorage {

        //TODO:: Go through this and make most of it none-static, I really should have done it that way from the start

        public static readonly TEXTURE_SHADER : string = "texture2d";
        private static readonly WDOH_SHADER_DIR : string = "res/WDOH/shaders";
        private static readonly REQUIRED_SHADERS : string[] = [Renderer2DStorage.TEXTURE_SHADER]

        //Shader Uniform names
        public static readonly UNIFORM_NAME_PROJ_VIEW_MAT : string = "uProjectionViewMatrix";
        public static readonly UNIFORM_NAME_TRANSFORMATION_MAT : string = "uTransformationMatrix";
        public static readonly UNIFORM_NAME_TEXTURE_ARRAY : string = "uTextures";
        
        //Batch Objects
        public static mRenderBatchQuadArray : RenderBatchQuad[];
        public static mRenderBatchQuadIndex : number;
        public static mRenderBatchMaxQuadCount : number;
        public static mRenderBatchQuadMaxVertices : number;
        public static mRenderBatchQuadMaxIndices : number;
        public static mRenderBatchQuadMaxTextureSlotIndex : number; //Slot indexing starts at 0 (So setting this to 7 means 8 slots)

        //-----Static Storage Objects-----
        //Quad
        public static mQuadVao : IVertexArray;
        public static mQuadVbo : IVertexBuffer;
        //Textures
        public static mWhiteTexture : ITexture;
        //Shaders
        public static mShaderLibrary : ShaderLibrary;
        
        public static mRequiredShadersLoaded : boolean;
        public static mRequiredShadersInitialised : boolean;


        private constructor() {}
        
        public static init() : void {
            Renderer2DStorage.mRenderBatchQuadArray = [];
            Renderer2DStorage.mRequiredShadersLoaded = false;
            Renderer2DStorage.mRequiredShadersInitialised = false;
            Renderer2DStorage.mRenderBatchQuadIndex = -1; //Init to -1 so first "createNewQuadBatch" increments to 0 on first call
            Renderer2DStorage.mRenderBatchMaxQuadCount = 15_000;
            Renderer2DStorage.mRenderBatchQuadMaxVertices = Renderer2DStorage.mRenderBatchMaxQuadCount * 4;
            Renderer2DStorage.mRenderBatchQuadMaxIndices = Renderer2DStorage.mRenderBatchMaxQuadCount * 6;
            Renderer2DStorage.mRenderBatchQuadMaxTextureSlotIndex = 7;

            Renderer2DStorage.loadShaders();
            Renderer2DStorage.initVertexArrays();
            
            Renderer2DStorage.initShaders();
            Renderer2DStorage.initTextures();
        }

        private static loadShaders() : void {
            Renderer2DStorage.mShaderLibrary = new ShaderLibrary();
            ShaderReader.loadShaderFileIntoStorage(Renderer2DStorage.WDOH_SHADER_DIR + "/" + Renderer2DStorage.TEXTURE_SHADER + ".glsl");
        }

        public static initShaders() : void {
            if (ShaderReader.isShaderLoaded(Renderer2DStorage.TEXTURE_SHADER)) {
                let textureShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);
                if (textureShader === null) {
                    throw new Error("Texture shader null");
                }

                //Upload texture sampler indexes
                let samplerIndexes : number[] = [];
                for (let i = 0; i < Renderer2DStorage.mRenderBatchQuadMaxTextureSlotIndex + 1; i++) {
                    samplerIndexes[i] = i;
                }

                textureShader.bind();
                textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TEXTURE_ARRAY);
                textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);

                textureShader.setUniformIntArray(Renderer2DStorage.UNIFORM_NAME_TEXTURE_ARRAY, samplerIndexes);

                Renderer2DStorage.mRequiredShadersInitialised = true;
            } else {
                Renderer2DStorage.mRequiredShadersInitialised = false;
            }
        }

        private static initVertexArrays() : void {
            //-----Quad Start-----
            Renderer2DStorage.mQuadVao = new VertexArrayWebGL();
            Renderer2DStorage.mQuadVbo = VertexBufferWebGL.createDynamicBuffer(
                Renderer2DStorage.mRenderBatchQuadMaxVertices * RenderBatchQuad.BYTE_SIZE,
                EDataType.FLOAT
            );
            Renderer2DStorage.mQuadVbo.setBufferLayout(new BufferLayout([
                new BufferElement("aVertPos", EDataType.FLOAT3),
                new BufferElement("aColour", EDataType.FLOAT4),
                new BufferElement("aTexCoord", EDataType.FLOAT2),
                new BufferElement("aTexIndex", EDataType.FLOAT)
            ]));
            Renderer2DStorage.mQuadVao.addVertexBuffer(Renderer2DStorage.mQuadVbo);

            let quadIndices : number[] = [];
            let offset : number = 0;
            for (let i = 0; i < Renderer2DStorage.mRenderBatchQuadMaxIndices; i += 6) {
                quadIndices[i + 0] = offset + 0;
                quadIndices[i + 1] = offset + 1;
                quadIndices[i + 2] = offset + 2;

                quadIndices[i + 3] = offset + 2;
                quadIndices[i + 4] = offset + 3;
                quadIndices[i + 5] = offset + 0;

                offset += 4;
            }
            let quadIb : IIndexBuffer = new IndexBufferWebGL(quadIndices, Renderer2DStorage.mRenderBatchQuadMaxIndices);
            Renderer2DStorage.mQuadVao.setIndexBuffer(quadIb);
            //-----Quad End-----
        }

        private static initTextures() : void {
            Renderer2DStorage.mWhiteTexture = TextureLoader.generateColourTexture(
                1,
                1,
                new Uint8Array([255, 255, 255, 255]),
                ETextureBindingPoint.TEX_2D
            );
        }

        public static isReady() : boolean {
            return Renderer2DStorage.mRequiredShadersLoaded && Renderer2DStorage.mRequiredShadersInitialised;
        }

        public static checkShadersLoaded() : void {
            //Check if all required shaders have loaded
            let requiredShaders : string[] = Renderer2DStorage.REQUIRED_SHADERS;
            let loadedShaders : string[] = ShaderReader.getShaderFileNamesByLoadStatus(true);

            let allRequiredShadersLoaded : boolean = false;

            for (let requiredIndex = 0; requiredIndex < requiredShaders.length; requiredIndex++) {
                for (let loadedIndex = 0; loadedIndex < loadedShaders.length; loadedIndex++) {
                    if (requiredShaders[requiredIndex] === loadedShaders[loadedIndex]) {
                        
                        if (requiredIndex === requiredShaders.length - 1) {
                            allRequiredShadersLoaded = true;
                            break;
                        }                     

                        requiredIndex++;
                        loadedIndex = 0;
                    }
                }
                
                if (allRequiredShadersLoaded === true) {
                    break;
                }
            }

            Renderer2DStorage.mRequiredShadersLoaded = allRequiredShadersLoaded;
        }

        public static requiredShadersInitialised() : boolean {
            return Renderer2DStorage.mRequiredShadersInitialised;
        }

        /**
         * Create a new instance of a RenderBatchQuad and in the mRenderBatchQuadArray and
         * update mRenderBatchQuadIndex to point to the next position.
         */
        public static instantiateNewQuadBatch() : void {
            //TODO:: Add a MAX_BATCH_COUNT
            Renderer2DStorage.mRenderBatchQuadIndex++;
            Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex] =
                new RenderBatchQuad(
                    Renderer2DStorage.mRenderBatchMaxQuadCount,
                    Renderer2DStorage.mRenderBatchQuadMaxTextureSlotIndex
                );
        }

        public static createNewQuadBatch(quadArray : Quad[] | null) : void {
            Renderer2DStorage.instantiateNewQuadBatch();

            if (quadArray !== null) {
                Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex]
                    .addAll(quadArray, RenderBatchQuad.DEFUALT_WHITE_TEXTURE_SLOT);
            }
        }

        public static createNewTexturedQuadBatch(quadArray : Quad[]) : void {
            Renderer2DStorage.instantiateNewQuadBatch();

            if (quadArray.length > 1) {
                Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex]
                    .addAllTextured(quadArray);
            } else {
                Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex]
                    .addTextured(quadArray[0]);
            }
        }

        public static createNewSameTexturedQuadBatch(quadArray : Quad[]) : void {
            Renderer2DStorage.instantiateNewQuadBatch();

            if (quadArray[0].mTexture !== null) {
                Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex]
                    .addAll(
                        quadArray,
                        Renderer2DStorage.mRenderBatchQuadArray[Renderer2DStorage.mRenderBatchQuadIndex]
                            .addNewTexture(quadArray[0].mTexture)
                    );
            }
        }

        public static cleanUp() : void {
            //Batches
            Renderer2DStorage.mRenderBatchQuadArray = [];
            Renderer2DStorage.mRenderBatchQuadIndex = -1;

            //Quad
            Renderer2DStorage.mQuadVao.cleanUp();
            Renderer2DStorage.mQuadVbo.cleanUp();

            //Textures
            Renderer2DStorage.mWhiteTexture.cleanUp();
        }
    }
}