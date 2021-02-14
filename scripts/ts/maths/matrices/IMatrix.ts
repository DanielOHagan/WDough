namespace WDOH {

    export interface IMatrix<T> {

        identity() : T;

        mulNum(num : number) : T;
        mulMat4x4(mat : Matrix4x4) : T;

        ortho(
            left : number,
            right : number,
            bottom : number,
            top : number,
            nearZ : number,
            farZ : number
        ) : T;

        translateVec2(vec : Vector2) : T;
        translateVec3(vec : Vector3) : T;

        invert() : T;

        rotateRads(angleRads : number, axis : Vector3) : T;

        scaleScalar(scale : number) : T;
        scaleXYZ(x : number, y : number, z : number) : T;

        asArray() : number[];

        set(mat : T) : void;
    }

}