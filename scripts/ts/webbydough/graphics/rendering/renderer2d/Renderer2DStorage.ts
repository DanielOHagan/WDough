namespace WDOH {

    export class Renderer2DStorage {

        public static readonly FLAT_COLOUR_SHADER = "FlatColour";
        public static readonly TEXTURE_SHADER = "Texture";

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
            let flatColourVertSrc = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "uniform mat4 uProjectionViewMatrix;",
                "uniform mat4 uTransformationViewMatrix;",
                "",
                "in vec3 aVertPos;",
                "",
                "void main() {",
                    "gl_Position = uProjectionViewMatrix * uTransformationViewMatrix * vec4(aVertPos, 1.0);",
                "}"
            ].join("\n");
            let flatColourFragSrc = [
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

            let textureVertexSrc = [
                "#version 300 es",
                "",
                "precision mediump float;",
                "",
                "",
                "uniform mat4 uProjectionViewMatrix;",
                "uniform mat4 uTransformationViewMatrix;",
                "",
                "in vec3 aVertPos;",
                "in vec2 aTexCoord;",
                "",
                "out vec2 vTexCoord;",
                "",
                "void main() {",
                    "vTexCoord = aTexCoord;",
                    "gl_Position = uProjectionViewMatrix * uTransformationViewMatrix * vec4(aVertPos, 1.0);",
                "}"
            ].join("\n");
            let textureFragSrc = [
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

            this.mShaderLibrary.create(Renderer2DStorage.FLAT_COLOUR_SHADER, flatColourSrcs);
            this.mShaderLibrary.create(Renderer2DStorage.TEXTURE_SHADER, textureSrcs);
        }

        private static createVertexArrays() : void {
            //-----Quad Start-----
            let quadVertices : number[] = [
                //Set out as (Position) X Y Z
                //top left
                -0.5,  0.5, 0.0,
                //top right
                0.5,  0.5, 0.0, 
                //bottom right
                0.5, -0.5, 0.0, 
                //bottom left
                -0.5, -0.5, 0.0,
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
                new BufferElement("aVertPos", WDOH.EDataType.FLOAT3)
            ]))
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