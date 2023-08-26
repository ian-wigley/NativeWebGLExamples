declare let mat4: any;
declare let vec3: any;

import Camera = require("./Camera");
import Cube = require("./Cube");
import Plane = require("./Plane");
import ShaderProgram = require("./ShaderProgram");

class App {

    private gl: WebGLRenderingContext;

    private shaderProgram;
    private sp: ShaderProgram;

    private camera: Camera;
    private cube: Cube;
    private plane: Plane;

    public Initialise() {
        var canvas = document.getElementById("CanvasGL");
        this.InitGL(canvas)
        this.sp = new ShaderProgram(this.gl);
        this.shaderProgram = this.sp.GetShaderProgram();

        this.camera = new Camera(this.gl);
        var pMatrix = this.camera.Initialise();

        this.plane = new Plane(this.shaderProgram, this.gl, pMatrix);
        this.cube = new Cube(this.shaderProgram, this.gl, pMatrix);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    public Run() {
        this.AddHitListener(document.getElementById("CanvasGL"));
        setInterval(() => this.Update(), 10);
    }

    private AddHitListener(element: HTMLElement) {
        window.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });
    }

    private onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardPress(event);
    }

    private onKeyboardPress(event: Event) {
        switch (<number>(<KeyboardEvent>event).keyCode | 0) {
            case 17:
                break;
            case 37:
                break;
            case 38:
                this.camera.MoveForward(0.1);
                break;
            case 39:
                break;
            case 40:
                this.camera.MoveForward(-0.1);
                break;
            case 83:
                break;
        }
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

    private Update() {
        this.plane.Update(0, 0, this.camera.z);
        this.camera.Update();
        this.DrawScene();
    }

    private DrawScene() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.plane.Draw();
        this.cube.Draw();
    }
}
export = App;