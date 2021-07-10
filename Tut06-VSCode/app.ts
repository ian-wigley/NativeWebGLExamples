declare var mat4: any;
declare var vec3: any;

import Plane = require("./Plane");
import Cube = require("./Cube");
import ShaderProgram = require("./ShaderProgram");

class App {

    private gl: WebGLRenderingContext;

    private zNear: number = 0.1;
    private zFar: number = 100.0;
    private aspect: number = 0;
    // In radians
    private fieldOfView: number = 45 * Math.PI / 180;

    private pMatrix = mat4.create();

    private shaderProgram;
    private sp: ShaderProgram;

    private plane: Plane;
    private cube: Cube;

    public Initialise() {
        var canvas = document.getElementById("CanvasGL");
        this.InitGL(canvas)
        this.sp = new ShaderProgram(this.gl);
        this.shaderProgram = this.sp.GetShaderProgram();

        this.SetUpCamera();

        this.plane = new Plane(this.shaderProgram, this.gl, this.pMatrix);
        this.cube = new Cube(this.shaderProgram, this.gl, this.pMatrix);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    public Run() {
        setInterval(() => this.DrawScene(), 10);
    }

    private SetUpCamera(): void {
        this.aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        mat4.perspective(this.pMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
    }

    private InitGL(canvas) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];
        for (const name of names) {
            try {
                this.gl = canvas.getContext(name);
            } catch (e) { }
            if (this.gl) {
                break;
            }
        }
        if (this.gl == null) {
            alert("Could not initialise WebGL");
            return null;
        }
    }

    private DrawScene() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.plane.Draw();
        this.cube.Draw();
    }
}
export = App;