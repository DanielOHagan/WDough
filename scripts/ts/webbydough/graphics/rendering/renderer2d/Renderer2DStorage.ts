namespace WDOH {

    export class Renderer2DStorage {

        public static readonly FLAT_COLOUR_SHADER : string = "FlatColour";
        public static readonly TEXTURE_SHADER : string = "Texture";

        public static readonly UNIFORM_NAME_PROJ_VIEW_MAT : string = "uProjectionViewMatrix";
        public static readonly UNIFORM_NAME_TRANSFORMATION_MAT : string = "uTransformationMatrix";
        //TODO:: Add more static uniform names for frequent use

        //TODO:: Make this non WebGL specific

        //TODO:: Remove shader source code from here

        public static mShaderLibrary : ShaderLibrary;
        public static mQuadVao : IVertexArray;

        private constructor() {}

        public static init() : void {
            Renderer2DStorage.mShaderLibrary = new ShaderLibrary();

            this.createShaders();
            this.createVertexArrays();
        }

        private static createShaders() : void {

            //TODO:: Have this src somewhere else
            let flatColourVertSrc : string = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "uniform mat4 " + Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT + ";",
                "uniform mat4 " + Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT + ";",
                "",
                "in vec3 aVertPos;",
                "",
                "void main() {",
                    "gl_Position = " + Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT + " * " + 
                                        Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT +
                                        " * vec4(aVertPos, 1.0);",
                "}"
            ].join("\n");
            let flatColourFragSrc : string = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "uniform vec4 uColour;",
                "",
                "out vec4 fragColour;",
                "",
                "void main() {",
                    "fragColour = uColour;",
                "}"
            ].join("\n");

            let textureVertexSrc : string = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "uniform mat4 " + Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT + ";",
                "uniform mat4 " + Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT + ";",
                "",
                "in vec3 aVertPos;",
                "in vec2 aTexCoord;",
                "",
                "out vec2 vTexCoord;",
                "",
                "void main() {",
                    "vTexCoord = aTexCoord;",
                    "gl_Position = " + Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT + " * " +
                                        Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT +
                                        " * vec4(aVertPos, 1.0);",
                "}"
            ].join("\n");
            let textureFragSrc : string = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "uniform sampler2D uTexture;",
                "",
                "in vec2 vTexCoord;",
                "",
                "out vec4 fragColour;",
                "",
                "void main() {",
                    "fragColour = texture(uTexture, vTexCoord);",
                "}"
            ].join("\n");

            //Shader initialisation and compilation
            let flatColourSrcs : Map<EShaderType, string> = new Map();
            flatColourSrcs.set(EShaderType.VERTEX, flatColourVertSrc);
            flatColourSrcs.set(EShaderType.FRAGMENT, flatColourFragSrc);

            let textureSrcs : Map<EShaderType, string> = new Map();
            textureSrcs.set(EShaderType.VERTEX, textureVertexSrc);
            textureSrcs.set(EShaderType.FRAGMENT, textureFragSrc);

            let flatColourShader : IShader | null = this.mShaderLibrary.create(Renderer2DStorage.FLAT_COLOUR_SHADER, flatColourSrcs);
            if (flatColourShader === null) {
                throw new Error("Renderer2DStorage: Failed to create Shader: " + Renderer2DStorage.FLAT_COLOUR_SHADER);
            }
            flatColourShader.bind();
            flatColourShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);
            flatColourShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT);
            flatColourShader.createUniform("uColour");

            let textureShader : IShader | null = this.mShaderLibrary.create(Renderer2DStorage.TEXTURE_SHADER, textureSrcs);
            if (textureShader === null) {
                throw new Error("Renderer2DStorage: Failed to create Shader: " + Renderer2DStorage.TEXTURE_SHADER);
            }
            textureShader.bind();
            textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT);
            textureShader.createUniform(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT);
            textureShader.createUniform("uTexture");
            textureShader.setUniformInt("uTexture", 0); //Set default texture slot to 0
        }

        private static createVertexArrays() : void {
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

        public static cleanUp() : void {
            Renderer2DStorage.mShaderLibrary.clear();
        }
    }
}