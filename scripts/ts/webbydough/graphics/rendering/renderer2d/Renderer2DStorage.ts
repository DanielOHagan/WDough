namespace WDOH {

    //This class is used just to outline the contents of a single QuadVertex for the batch renderer
    abstract class QuadVertex {

        public static readonly BYTE_SIZE : number = 10 * 4;
        
        private static readonly mPosition : Vector3;
        private static readonly mColour : Vector4;
        private static readonly mTexCoord : Vector2;
        private static readonly mTexIndex : number;

        private constructor() {}
    }

    export class Renderer2DStorage {

        //TODO:: Go through this and make most of it none-static, I really should have done it that way from the start

        public static readonly TEXTURE_SHADER : string = "texture2d";

        private static readonly WDOH_SHADER_DIR : string = "res/WDOH/shaders";
        private static readonly REQUIRED_SHADERS : string[] = [Renderer2DStorage.TEXTURE_SHADER]

        public static readonly UNIFORM_NAME_PROJ_VIEW_MAT : string = "uProjectionViewMatrix";
        public static readonly UNIFORM_NAME_TRANSFORMATION_MAT : string = "uTransformationMatrix";
        public static readonly UNIFORM_NAME_TEXTURE_ARRAY : string = "uTextures";
        
        
        public static readonly BATCH_MAX_QUAD_COUNT = 15_000;
        public static readonly BATCH_MAX_VERTICES = Renderer2DStorage.BATCH_MAX_QUAD_COUNT * 4;
        public static readonly BATCH_MAX_INDICES = Renderer2DStorage.BATCH_MAX_QUAD_COUNT * 6;
        public static readonly BATCH_MAX_TEXTURE_SLOT_INDEX : number = 7;
        
        //Shaders
        public static mShaderLibrary : ShaderLibrary;

        //Quad
        public static mQuadVao : IVertexArray;
        public static mQuadVbo : IVertexBuffer;
        public static mQuadIndexCount : number;
        //Batch Objects
        public static mCurrentQuadBatch : number[];
        public static mCurrentQuadBatchIndex : number;
        public static mCurrentBatchTextureIds : number[];

        //Textures
        public static mWhiteTexture : ITexture;
        public static mBatchTextureSlots : Map<number, ITexture>;
        public static mBatchTextureSlotIndex : number;

        public static mRequiredShadersLoaded : boolean;
        public static mRequiredShadersInitialised : boolean;

        private constructor() {}
        
        public static init() : void {
            Renderer2DStorage.mCurrentQuadBatchIndex = 0;
            Renderer2DStorage.mCurrentBatchTextureIds = [];
            Renderer2DStorage.mRequiredShadersLoaded = false;
            Renderer2DStorage.mRequiredShadersInitialised = false;

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
                for (let i = 0; i < Renderer2DStorage.BATCH_MAX_TEXTURE_SLOT_INDEX; i++) {
                    samplerIndexes[i] = i;
                }

                textureShader.bind();
                textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TEXTURE_ARRAY);
                textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);

                textureShader.setUniformIntArray("uTextures", samplerIndexes);

                Renderer2DStorage.mRequiredShadersInitialised = true;
            } else {
                Renderer2DStorage.mRequiredShadersInitialised = false;
            }
        }

        private static initVertexArrays() : void {
            //-----Quad Start-----
            Renderer2DStorage.mQuadVao = new VertexArrayWebGL();
            Renderer2DStorage.mQuadVbo = VertexBufferWebGL.createDynamicBuffer(
                Renderer2DStorage.BATCH_MAX_VERTICES * QuadVertex.BYTE_SIZE,
                EDataType.FLOAT
            );
            Renderer2DStorage.mQuadVbo.setBufferLayout(new BufferLayout([
                new BufferElement("aVertPos", EDataType.FLOAT3),
                new BufferElement("aColour", EDataType.FLOAT4),
                new BufferElement("aTexCoord", EDataType.FLOAT2),
                new BufferElement("aTexIndex", EDataType.FLOAT)
            ]));
            Renderer2DStorage.mQuadVao.addVertexBuffer(Renderer2DStorage.mQuadVbo);

            Renderer2DStorage.mCurrentQuadBatch = [];

            let quadIndices : number[] = [];
            let offset : number = 0;
            for (let i = 0; i < Renderer2DStorage.BATCH_MAX_INDICES; i += 6) {
                quadIndices[i + 0] = offset + 0;
                quadIndices[i + 1] = offset + 1;
                quadIndices[i + 2] = offset + 2;

                quadIndices[i + 3] = offset + 2;
                quadIndices[i + 4] = offset + 3;
                quadIndices[i + 5] = offset + 0;

                offset += 4;
            }
            let quadIb : IIndexBuffer = new IndexBufferWebGL(quadIndices, Renderer2DStorage.BATCH_MAX_INDICES);
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
            Renderer2DStorage.mBatchTextureSlots = new Map();

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

        public static cleanUp() : void {
            //Quad
            Renderer2DStorage.mQuadVao.cleanUp();
            Renderer2DStorage.mQuadVbo.cleanUp();
            Renderer2DStorage.mQuadIndexCount = 0;

            //Textures
            Renderer2DStorage.mWhiteTexture.cleanUp();
        }
    }
}