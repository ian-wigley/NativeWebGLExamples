import * as mat4 from "./glmatrix/mat4.js"

export class Camera {

    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    private zNear: number = 0.1;
    private zFar: number = 100.0;
    private aspect: number = 0;
    // In radians
    private fieldOfView: number = 45 * Math.PI / 180;
    private gl: WebGLRenderingContext;
    private pMatrix = mat4.create();

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public Initialise(): void {
        this.aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        mat4.perspective(this.pMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
        return this.pMatrix;
    }

    public MoveForward(amount: number) {
        this.z = amount;
    }

    public Update() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}