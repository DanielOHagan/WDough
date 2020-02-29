namespace WDOH {

    export interface IShader {

        getName() : string;

        bind() : void;
        unBind() : void;

        compileShaderSources(sources : Map<EShaderType, string>) : void;

        createUniform(uniformName : string) : void;
        createUniforms(uniformNames : string[]) : void;

        setUniformInt(uniformName : string, value : number) : void;
        setUniformInt2(uniformName : string, vec : Vector2) : void;
        setUniformInt3(uniformName : string, vec : Vector3) : void;
        setUniformInt4(uniformName : string, vec : Vector4) : void;

        setUniformFloat(uniformName : string, value : number) : void;
        setUniformFloat2(uniformName : string, vec : Vector2) : void;
        setUniformFloat3(uniformName : string, vec : Vector3) : void;
        setUniformFloat4(uniformName : string, vec : Vector4) : void;

        setUniformMat4(name : string, mat : Matrix4x4) : void;
    }
}