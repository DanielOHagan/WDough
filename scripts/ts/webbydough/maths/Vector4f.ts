namespace wDOH {

    export class Vector4f {

        public x : number;
        public y : number;
        public z : number;
        public w : number;

        public constructor(
            x : number = 0.0,
            y : number = 0.0,
            z : number = 0.0,
            w : number = 0.0
        ) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
    }
}