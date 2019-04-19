
// Window properties
let window_width = window.innerWidth
let window_height = window.innerHeight

// Canvas properties
let canvas_name = "canvas";
let canvas_width = 500;
let canvas_height = 400;

// Create the canvas
let canvas_obj = `<canvas id='${canvas_name}' width='${canvas_width}' height='${canvas_height}'> </canvas>`;
document.write(canvas_obj);

// Get Canvas Context
let canvas = document.getElementById(canvas_name);
let gfx = canvas.getContext("2d");

gfx.font = "12px MS-Comic-Sans";

class Renderable
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }

    setPos(x, y)
    {
        this.x = x;
        this.y = y;
    }

    render(gfx)
    {
        // Overload
    }

}

// Falling text object
class TextObject extends Renderable
{
    constructor(text)
    {
        super();
        this.text = text;
    }

    render()
    {
        gfx.translate(super.x, super.y);
        gfx.fillStyle = "grey";
        gfx.fillRect(0, 0, 200, 30);
        gfx.fillStyle = "white";
        gfx.fillText(this.text, 20, 20);
    }

}

// Return a random color
function getRandomColor()
{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    return color;
}

let renderables = new Array();
renderables[renderables.length] = new TextObject("世界初めて");

// Draw the frame
function draw()
{
    gfx.fillStyle = "white"; //getRandomColor();
    gfx.fillRect(0, 0, canvas_width, canvas_height);

    for(let i = 0; i < renderables.length; i++)
    {
        renderables[i].render();
    }

}

// Update and render next frame
function updateAndRender()
{
    draw();
    window.requestAnimationFrame(updateAndRender);
}

// Start the game
function start()
{
    updateAndRender();
}

// Start the game after the window loads
window.onload = start;