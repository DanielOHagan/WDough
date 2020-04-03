namespace WDOH {

    export class Renderer2DStorage {

        private static readonly WDOH_SHADER_DIR : string = "res/WDOH/shaders";

        public static readonly FLAT_COLOUR_SHADER : string = "flatcolour";
        public static readonly TEXTURE_SHADER : string = "texture";
        
        public static readonly UNIFORM_NAME_PROJ_VIEW_MAT : string = "uProjectionViewMatrix";
        public static readonly UNIFORM_NAME_TRANSFORMATION_MAT : string = "uTransformationMatrix";
        
        private static readonly REQUIRED_SHADERS : string[] = [Renderer2DStorage.FLAT_COLOUR_SHADER, Renderer2DStorage.TEXTURE_SHADER]
        
        //Shaders
        public static mShaderLibrary : ShaderLibrary;
        //VAOs
        public static mQuadVao : IVertexArray;
        //Textures
        public static mWhiteTexture : ITexture;

        public static mRequiredShadersLoaded : boolean;
        public static mRequiredShadersInitialised : boolean;

        private constructor() {}

        public static init() : void {
            Renderer2DStorage.mShaderLibrary = new ShaderLibrary();
            Renderer2DStorage.mRequiredShadersLoaded = false;
            Renderer2DStorage.mRequiredShadersInitialised = false;

            Renderer2DStorage.initShaders();
            Renderer2DStorage.initVertexArrays();
            Renderer2DStorage.initTextures();
        }

        public static initRequiredShaders() : void {
            let flatColourShader : IShader | null = this.mShaderLibrary.get(Renderer2DStorage.FLAT_COLOUR_SHADER);
            if (flatColourShader === null) {
                throw new Error("Renderer2DStorage: Failed to create Shader: " + Renderer2DStorage.FLAT_COLOUR_SHADER);
            }
            flatColourShader.bind();
            flatColourShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);
            flatColourShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT);
            flatColourShader.createUniform("uColour");

            let textureShader : IShader | null = this.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);
            if (textureShader === null) {
                throw new Error("Renderer2DStorage: Failed to create Shader: " + Renderer2DStorage.TEXTURE_SHADER);
            }
            textureShader.bind();
            textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);
            textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT);
            textureShader.createUniform("uTexture");
            textureShader.setUniformInt("uTexture", 0); //Set default texture slot to 0

            Renderer2DStorage.mRequiredShadersInitialised = true;
        }

        private static initShaders() : void {

            ShaderReader.loadShaderFileIntoStorage(Renderer2DStorage.WDOH_SHADER_DIR + "/flatColour.glsl");
            ShaderReader.loadShaderFileIntoStorage(Renderer2DStorage.WDOH_SHADER_DIR + "/texture.glsl");
            
        }

        private static initVertexArrays() : void {
            //-----Quad Start-----
            let quadVertices : number[] = [
                //Set out as (Position) X Y Z, (TexCoord) U V
                -0.5,  0.5, 0.0, 0.0, 0.0,
                 0.5,  0.5, 0.0, 1.0, 0.0,
                 0.5, -0.5, 0.0, 1.0, 1.0,
                -0.5, -0.5, 0.0, 0.0, 1.0
            ];
    
            let quadIndices : number[] = [
                0, 1, 2,
                2, 3, 0
            ];

            Renderer2DStorage.mQuadVao = new VertexArrayWebGL();
            let squareVBO : IVertexBufer = new VertexBufferWebGL(
                quadVertices,
                WDOH.EDataType.FLOAT
            );
            squareVBO.setBufferLayout(new BufferLayout([
                new BufferElement("aVertPos", EDataType.FLOAT3),
                new BufferElement("aTexCoord", EDataType.FLOAT2)
            ]));
            Renderer2DStorage.mQuadVao.addVertexBuffer(squareVBO);

            let squareIB : IIndexBuffer = new IndexBufferWebGL(quadIndices);
            Renderer2DStorage.mQuadVao.setIndexBuffer(squareIB);
            //-----Quad End-----
        }

        private static initTextures() : void {
            //TODO:: Store a white texture
            
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
            //Shaders
            Renderer2DStorage.mShaderLibrary.clear();
            
            //VAOs
            Renderer2DStorage.mQuadVao.cleanUp();

            //Textures
            Renderer2DStorage.mWhiteTexture.cleanUp();
        }
    }
}