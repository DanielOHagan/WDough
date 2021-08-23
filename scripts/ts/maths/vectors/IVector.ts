namespace WDOH {

    export interface IVector<T> {

        mult(multiplier : number) : T;
        divide(div : number) : T;

        cross(vec : T) : T;
        dot(vec : T) : T;

    }
}
