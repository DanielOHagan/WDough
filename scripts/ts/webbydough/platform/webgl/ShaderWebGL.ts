namespace wDOH {

    export class ShaderWebGL implements IShader {

        private mName : string;
        private mProgram : WebGLProgram | null;

        private mUniformLocations : {[uniformName : string] : WebGLUniformLocation};

        private constructor(name : string, sources : Map<EShaderType, string>) {
            this.mName = name;
            this.mProgram = null;
            this.mUniformLocations = {};

            this.compileShaderSources(sources);
        };

        public static create(name : string, sources : Map<EShaderType, string>) : IShader {
            return new ShaderWebGL(name, sources);
        }

        public getName() : string {
            return this.mName;
        }

        public bind() : void {
            if (this.mProgram !== null) {
                mContext.useProgram(this.mProgram);
            }
        }

        public unBind() : void {
            mContext.useProgram(null);
        }

        public compileShaderSources(sources : Map<EShaderType, string>) {

            let program : WebGLProgram | null = mContext.createProgram();

            if (program === null) {
                throw new Error("Failed to create WebGLProgram.");
            }

            let compiledShaders : WebGLShader[] = new Array<WebGLShader>(sources.keys.length);
            let compiledShadersIndex : number = 0;

            for(let shaderType of sources.keys()) {
                let shader : WebGLShader | null = mContext.createShader(
                    this.shaderTypeToGLShaderType(shaderType)
                )

                if (shader === null) {
                    throw new Error(
                        "Failed to create shader!" + 
                        "Name: " + this.mName +

                        //TEMP: Type string conversion
                        "Type: " + (shaderType === mContext.VERTEX_SHADER ? "Vertex" : "Fragment")
                    );
                }

                let shaderSrc : string | undefined = sources.get(shaderType);
                if (shaderSrc === undefined) {
                    throw new Error("Unable to get shader source for type: " +
                        (shaderType === mContext.VERTEX_SHADER ? "Vertex" : "Fragment")
                    )
                }
                mContext.shaderSource(shader, shaderSrc)

                mContext.compileShader(shader);
                if (!mContext.getShaderParameter(shader, mContext.COMPILE_STATUS)) {
                    throw new Error("Shader: " + this.mName + " failed to compile.");
                }

                mContext.attachShader(program, shader);

                compiledShaders[compiledShadersIndex] = shader;
                compiledShadersIndex++;
            }

            mContext.linkProgram(program);
            if (!mContext.getProgramParameter(program, mContext.LINK_STATUS)) {
                
                mContext.deleteProgram(program);

                for (let shader of compiledShaders) {
                    mContext.deleteShader(shader);
                }

                throw new Error("Program failed to link.");
            }

            //Detach shaders after linking program
            for (let shader of compiledShaders) {
                mContext.detachShader(program, shader);
            }

            this.mProgram = program;
        }

        private shaderTypeToGLShaderType(shaderType : EShaderType) : number {
            if (shaderType === EShaderType.VERTEX) {
                return mContext.VERTEX_SHADER;
            }

            if (shaderType === EShaderType.FRAGMENT) {
                return mContext.FRAGMENT_SHADER;
            }

            throw new Error("Unknown Shader Type: " + shaderType);
            return -1;
        }

        public createUniform(uniformName: string) : void {
            if (this.mProgram === null) {
                throw new Error("Shader Program not initialised.");
            }

            let uniformLocation : WebGLUniformLocation | null = mContext.getUniformLocation(this.mProgram, uniformName);

            if (uniformLocation === null) {
                throw new Error(`Failed to create uniform: ${uniformName}`);
            }

            this.mUniformLocations[uniformName] = uniformLocation;
        }

        public createUniforms(uniformNames: string[]) : void {
            for (let name of uniformNames) {
                this.createUniform(name);
            }
        }

        public setUniformInt(uniformName : string, value : number) : void {
            //Remove decimal value
            value = Math.floor(value);

            mContext.uniform1i(this.getUniformLocation(uniformName), value);
        }

        public setUniform4f(uniformName : string, value : Vector4f) : void {
            mContext.uniform4f(this.getUniformLocation(uniformName), value.x, value.y, value.z, value.w);
        }

        public getUniformLocation(uniformName : string) : WebGLUniformLocation {
            let location : WebGLUniformLocation = this.mUniformLocations[uniformName];

            if (location === undefined) {
                throw new Error(`Uniform: ${uniformName}, not found in Shader: ${this.mName}.`)
            }

            return location;
        }
    }
}