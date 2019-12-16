namespace TestGame {

    export class TG_Logic implements wDOH.IApplicationLogic {
        
        private mShaderMangaer : wDOH.ShaderManager | null = null;

        private vertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform mat4 uProjectionViewMatrix;",
            "",
            "in vec3 aVertPos;",
            "",
            "void main() {",
                "gl_Position = uProjectionViewMatrix * vec4(aVertPos, 1.0);",
            "}"
        ].join("\n");
            
        private fragmentSrc = [
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

        private mSquareVertices : number[] = [
            //top left
            -0.5,  0.5, 0.0,
            //top right
            0.5,  0.5, 0.0,
            //bottom right
            0.5, -0.5, 0.0,
            //bottom left
            -0.5, -0.5, 0.0
        ];

        private mSquareIndices : number[] = [
            0, 1, 2,
            2, 3, 0
        ];

        private mFlatColourShader : wDOH.IShader | null = null;
        private mFlatColour : wDOH.Vector4 = new wDOH.Vector4(1.0, 1.0, 0.0, 1.0);

        private squareVAO : wDOH.IVertexArray | null = null;

        private mOrthoCamera : wDOH.OrthographicCamera = new wDOH.OrthographicCamera(-1.6, 1.6, -0.9, 0.9);

        public init() : void {
            console.log("TG_Logic: init");

            this.mShaderMangaer = new wDOH.ShaderManager();

            let sources : Map<wDOH.EShaderType, string> = new Map();
            sources.set(wDOH.EShaderType.VERTEX, this.vertexSrc);
            sources.set(wDOH.EShaderType.FRAGMENT, this.fragmentSrc);

            this.mFlatColourShader = this.mShaderMangaer.create("FlatColourShader", sources);

            if (this.mFlatColourShader !== null) {
                this.mFlatColourShader.createUniform("uColour");
            }

            this.squareVAO = new wDOH.VertexArrayWebGL();
            let squareVBO : wDOH.IVertexBufer = new wDOH.VertexBufferWebGL(
                this.mSquareVertices,
                this.mSquareVertices.length * Float32Array.BYTES_PER_ELEMENT
            );
            squareVBO.setBufferLayout(new wDOH.BufferLayout([
                new wDOH.BufferElement("aVertPos", wDOH.EDataType.FLOAT3)
            ]))
            this.squareVAO.addVertexBuffer(squareVBO);
            let squareIB : wDOH.IIndexBuffer = new wDOH.IndexBufferWebGL(this.mSquareIndices);
            this.squareVAO.setIndexBuffer(squareIB);
        }
        
        public update(deltaTime: number) : void {

            if (Math.random() * 10 <= 0.5) {
                //NOTE:: The *Camera* is being moved NOT the scene!
                let pos : wDOH.Vector3 = new wDOH.Vector3(this.mOrthoCamera.getPosition().x + 0.1, 0, 1);
                this.mOrthoCamera.setPosition(pos);
            }

            mApplication.getRenderer().beginScene(this.mOrthoCamera);
            
            if (this.mFlatColourShader !== null) {
                this.mFlatColourShader.bind();
                (this.mFlatColourShader as wDOH.ShaderWebGL).setUniform4f("uColour", this.mFlatColour);

                if (this.squareVAO !== null) {
                    mApplication.getRenderer().submitShader(this.mFlatColourShader, this.squareVAO, new wDOH.Matrix4x4());
                }
            }


            mApplication.getRenderer().endScene();
        }
    }
}