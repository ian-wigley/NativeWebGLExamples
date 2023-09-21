import { BaseModel } from "./BaseModel.js";
import * as mat4 from "./glmatrix/mat4.js"
import * as vec3 from "./glmatrix/vec3.js"

export class Plane extends BaseModel {

    constructor(shaderProgram: object, gl: WebGLRenderingContext, pMatrix: object) {
        super(shaderProgram, gl, pMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0, 0, -7.0))
    }

    public init(vertices, indices): void {
        this.vertices = vertices;
        // this.indices = indices;
        this.initBuffers();
    }

    private initBuffers(): void {
        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);

        // this.vertices = [
        //     -1.0, -1.0, 0.0,
        //     0.0, -1.0, 0.0,
        //     -1.0, 0.0, 0.0,
        //     0.0, 0.0, 0.0,
        // ];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 4;

        this.vertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.colors = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = 4;
        this.vertexColorBuffer.numItems = 4;

        this.vertexIndexBuffer = this.gl.createBuffer();

        this.indices = [0, 1, 3, 0, 2, 3, 0];

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public draw(projectionMatrix: object, viewMatrix: object): void {

        this.projectionMatrix = projectionMatrix;
        this.viewMatrix = viewMatrix;

        mat4.translate(this.modelMatrix, this.modelMatrix, [this.x, this.y, this.z]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, 0.01, vec3.fromValues(1, 0, 0));

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT,
            false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, this.gl.FLOAT,
            false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.setMatrixUniforms();

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.SCISSOR_TEST);

        this.gl.drawElements(this.gl.LINE_STRIP, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}