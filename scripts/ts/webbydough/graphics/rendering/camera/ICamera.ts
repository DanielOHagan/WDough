namespace WDOH {

    export interface ICamera {

        updateProjectionViewMatrix() : void;
        updateViewMatrix() : void;

        setPosition(pos : Vector3) : void;
        getPosition() : Vector3;
        resetPosition() : void;

        setRotation(rotation : number) : void;
        getRotation() : number;
        resetRotation() : void;

        getProjectionMatrix() : Matrix4x4;
        getViewMatrix() : Matrix4x4;
        getProjectionViewMatrix() : Matrix4x4;
    }
}
