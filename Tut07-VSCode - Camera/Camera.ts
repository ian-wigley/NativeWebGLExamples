import * as mat4 from "./glmatrix/mat4.js"
import * as vec3 from "./glmatrix/vec3.js"

export class Camera {

    public x: number = 1;
    public y: number = 1;
    public z: number = 2;

    private zNear: number = 0.1;
    private zFar: number = 100.0;
    private aspect: number = 0;
    private movement_speed: number = 6;
    // In radians
    private fieldOfView: number = 45 * Math.PI / 180;
    private gl: WebGLRenderingContext;
    private projectionMatrix = mat4.create();

    private position = vec3.fromValues(this.x, this.y, this.z);
    private world_up = vec3.fromValues(0, 1, 0);
    private front = vec3.fromValues(0, 0, -1);

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public Initialise(): object {
        this.aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        mat4.perspective(this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
        return this.projectionMatrix;
    }

    public MoveForward(value: number): void {
        this.z = value;
        let velocity = this.movement_speed * value
        this.position[2] += velocity;
    }

    public Update(): void {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    public get_view_matrix(): object {
        let viewMatrix = mat4.create();
        let vectorial = vec3.fromValues(
            this.position[0] + this.front[0],
            this.position[1] + this.front[1],
            this.position[2] + this.front[2],
        )
        return mat4.lookAt(viewMatrix, this.position, vectorial, this.world_up);
    }

    public get_projection_matrix(): object {
        return this.projectionMatrix;
    }

}