namespace wDOH {

    export interface ICamera {

        updateProjectionViewMatrix() : void;

        setPosition(pos : Vector3) : void;
        getPosition() : Vector3;
        resetPosition() : void;

        setRotation(rotation : number) : void;
        getRotation() : number;
        resetRotation() : void;

        isProjectionViewMatrixUpdated() : boolean;

        getProjectionMatrix() : Matrix4x4;
        getViewMatrix() : Matrix4x4;
        getProjectionViewMatrix() : Matrix4x4;
    }
}