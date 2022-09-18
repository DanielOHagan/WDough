namespace WDOH {

    export class ShaderWebGL implements IShader {

        private mName : string;
        private mProgram : WebGLProgram | null;

        private mUniformLocations : { [uniformName : string] : WebGLUniformLocation };

        private constructor(name : string, sources : Map<EShaderType, string>) {
            this.mName = name;
            this.mProgram = null;
            this.mUniformLocations = {};

            this.compileShaderSources(sources);
        }

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

            for (let shaderType of sources.keys()) {
                let shader : WebGLShader | null = mContext.createShader(this.shaderTypeToGLShaderType(shaderType));

                if (shader === null) {
                    throw new Error(
                        "Failed to create shader!" +
                        "Name: " + this.mName
                    );
                }

                let shaderSrc : string | undefined = sources.get(shaderType);
                if (shaderSrc === undefined) {
                    throw new Error("Unable to get shader source for type: " +
                        (shaderType === mContext.VERTEX_SHADER ? "Vertex" : "Fragment")
                    );
                }
                mContext.shaderSource(shader, shaderSrc);

                mContext.compileShader(shader);
                mContext.attachShader(program, shader);

                compiledShaders[compiledShadersIndex] = shader;
                compiledShadersIndex++;
            }

            mContext.linkProgram(program);
            if (!mContext.getProgramParameter(program, mContext.LINK_STATUS)) {

                let errorMessage : string = "Program failed to link:";

                for (let shader of compiledShaders) {
                    if (!mContext.getShaderParameter(shader, mContext.COMPILE_STATUS)) {
                        errorMessage += "\nShader: '" + this.mName + "' failed to compile.\n";
                        errorMessage += mContext.getShaderInfoLog(shader);
                    }

                    mContext.deleteShader(shader);
                }

                mContext.deleteProgram(program);

                throw new Error(errorMessage);
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

            throw new Error("Unknown Shader Type : " + shaderType);
        }

        public createUniform(uniformName : string) : void {
            if (this.mProgram === null) {
                throw new Error("Shader Program not initialised.");
            }

            let uniformLocation : WebGLUniformLocation | null = mContext.getUniformLocation(this.mProgram, uniformName);

            if (uniformLocation === null) {
                throw new Error(`Failed to create uniform: ${uniformName}`);
            }

            this.mUniformLocations[uniformName] = uniformLocation;
        }

        public createUniforms(uniformNames : string[]) : void {
            for (let name of uniformNames) {
                this.createUniform(name);
            }
        }

        public setUniformInt(uniformName : string, value : number) : void {
            //Remove decimal value
            value = Math.trunc(value);

            mContext.uniform1i(this.getUniformLocation(uniformName), value);
        }

        public setUniformInt2(uniformName : string, vec : Vector2) : void {
            //Remove decimal value
            vec.x = Math.trunc(vec.x);
            vec.y = Math.trunc(vec.y);

            mContext.uniform2i(this.getUniformLocation(uniformName), vec.x, vec.y);
        }

        public setUniformInt3(uniformName : string, vec : Vector3) : void {
            //Remove decimal value
            vec.x = Math.trunc(vec.x);
            vec.y = Math.trunc(vec.y);
            vec.z = Math.trunc(vec.z);

            mContext.uniform3i(this.getUniformLocation(uniformName), vec.x, vec.y, vec.z);
        }

        public setUniformInt4(uniformName : string, vec : Vector4) : void {
            //Remove decimal value
            vec.x = Math.trunc(vec.x);
            vec.y = Math.trunc(vec.y);
            vec.z = Math.trunc(vec.z);
            vec.w = Math.trunc(vec.w);

            mContext.uniform4i(this.getUniformLocation(uniformName), vec.x, vec.y, vec.z, vec.w);
        }

        public setUniformIntArray(uniformName : string, array : number[]) : void {
            //Remove decimal value
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.trunc(array[i]);
            }

            mContext.uniform1iv(this.getUniformLocation(uniformName), array, 0, array.length);
        }

        public setUniformFloat(uniformName : string, value : number) : void {
            mContext.uniform1f(this.getUniformLocation(uniformName), value);
        }

        public setUniformFloat2(uniformName : string, vec : Vector2) : void {
            mContext.uniform2f(this.getUniformLocation(uniformName), vec.x, vec.y);
        }

        public setUniformFloat3(uniformName : string, vec : Vector3) : void {
            mContext.uniform3f(this.getUniformLocation(uniformName), vec.x, vec.y, vec.z);
        }

        public setUniformFloat4(uniformName : string, vec : Vector4) : void {
            mContext.uniform4f(this.getUniformLocation(uniformName), vec.x, vec.y, vec.z, vec.w);
        }

        public setUniformMat4(uniformName : string, mat : Matrix4x4) : void {
            mContext.uniformMatrix4fv(this.getUniformLocation(uniformName), false, new Float32Array(mat.asArray()));
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
