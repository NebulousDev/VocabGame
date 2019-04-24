// ------------------------------- //
//  J202 単語ゲーム                 //
//  Ben Ratcliff 2019              //
// ------------------------------- //

// Window properties
let window_width = window.innerWidth
let window_height = window.innerHeight

// Canvas properties
let canvas_name = "canvas";
let canvas_width = 1000;
let canvas_height = 900;

// Create the canvas
let canvas_obj = `<canvas id='${canvas_name}' width='${canvas_width}' height='${canvas_height}'> </canvas>`;
document.write(canvas_obj);

// Get Canvas Context
let canvas = document.getElementById(canvas_name);
let gfx = canvas.getContext("2d");

// Words
let wordList = undefined;

// Mouse
let mousePositionX = 0;
let mousePositionY = 0;
let leftClick = false;
let rightClick = false;

// DPI
dpi = window.devicePixelRatio;

// Random Settings:
let buttonGrowMargin = 5;

// Scene
let activeScene = undefined;
let failScene = undefined;
let winScene = undefined;
let cardsSceen = undefined;
let cardsSceen_pre = undefined;
let menuScene = undefined;

// Images
var img_menu_bg = new Image;
img_menu_bg.src = "images/menu_bg.png";

var img_logo = new Image;
img_logo.src = "images/logo2.png";

var img_button = new Image;
img_button.src = "images/button.png";

var img_cards_bg = new Image;
img_cards_bg.src = "images/cards_bg.png";

var img_cards_logo = new Image;
img_cards_logo.src = "images/card_logo.png";

var img_card = new Image;
img_card.src = "images/card.png";

var img_textArea = new Image;
img_textArea.src = "images/text_area.png";

var img_win = new Image;
img_win.src = "images/win.png";

var img_lose = new Image;
img_lose.src = "images/lose.png";

function fix_dpi() {
    //create a style object that returns width and height
      let style = {
        height() {
          return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        },
        width() {
          return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        }
      }
    //set the correct attributes for a crystal clear image!
      canvas.setAttribute('width', style.width() * dpi);
      canvas.setAttribute('height', style.height() * dpi);
    }

function forceKeyPressUppercase(e)
{
    var charInput = e.keyCode;
    if((charInput >= 97) && (charInput <= 122)) { // lowercase
    if(!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
        var newChar = charInput - 32;
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
        e.target.setSelectionRange(start+1, start+1);
        e.preventDefault();
    }
    }
}

document.getElementsByName("text")[0].addEventListener("keypress", forceKeyPressUppercase, false);

// Function to get the mouse position
function onMouseMove(canvas, event)
{
    let rect = canvas.getBoundingClientRect();
    mousePositionX = event.clientX - rect.left;
    mousePositionY = event.clientY - rect.top;
}

// Function when mouse clicked
function onMouseClick(event)
{
    leftClick = event.button == 0;
    rightClick = event.button == 2;
}

// Binding the hover event on the canvas
canvas.addEventListener('mousemove', function(event) {
    mousePosition = onMouseMove(canvas, event);
}, false);

// Binding the hover event on the canvas
canvas.addEventListener('mouseup', function(event) {
    onMouseClick(event);
}, false);

// Updateable/Renderable game object
class GameObject
{
    constructor(name)
    {
        this.x = 0;
        this.y = 0;
        this.name = name
    }

    setPos(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getX() { return this.x }
    getY()  { return this.y }
    getName()  { return this.name }

    focus()
    {
        // Overload 
    }

    unfocus()
    {
        // Overload 
    }

    update()
    {   
        // Overload 
    }  

    render(gfx)
    {
        // Overload
    }

}

// Scene renderables container
class Scene
{
    constructor(background)
    {
        this.renderables = new Array();
        this.renderablesMap = new Map();
        this.background = background
    }

    add(renderable)
    {
        if(renderable != undefined)
        {
            this.renderables[this.renderables.length] = renderable;
            this.renderablesMap.set(renderable.getName(), renderable);
        }
    }

    remove(name)
    {
        renderable = this.renderableMap.get(name);
        if(renderable != undefined)
        {
            this.renderables.remove(renderable);
            this.renderableMap.delete(name);
        }
    }

    focus()
    {
        for(let i = 0; i < this.renderables.length; i++)
            this.renderables[i].focus();
    }

    unfocus()
    {
        for(let i = 0; i < this.renderables.length; i++)
            this.renderables[i].unfocus();
    }

    updateAll()
    {
        for(let i = 0; i < this.renderables.length; i++)
            this.renderables[i].update();
    }

    renderAll()
    {
        gfx.drawImage(this.background, 0, 0, canvas.width, canvas.height);

        for(let i = 0; i < this.renderables.length; i++)
        {
            gfx.setTransform(1, 0, 0, 1, 0, 0);
            this.renderables[i].render();
        }
    }
}

// Flashing logo
class Logo extends GameObject
{
    constructor(img, speed, x, y, width, height)
    {
        super();
        this.img = img;
        this.speed = speed;
        super.x = x;
        super.y = y;
        this.width = width
        this.height = height;
        this.growing = true;
        this.timer = 0;
    }

    update()
    {
        if(this.speed != 0)
        {
            if(this.growing)
            {
                this.x -= 1.5 / this.speed;
                this.y -= 1 / this.speed;
                this.width += 3 / this.speed;
                this.height += 2 / this.speed;
                this.timer++;
                if(this.timer >= 75)
                    this.growing = false;
            }
            else
            {
                this.x += 1.5 / this.speed;
                this.y += 1 / this.speed;
                this.width -= 3 / this.speed;
                this.height -= 2 / this.speed;
                this.timer--;
                if(this.timer <= 0)
                    this.growing = true;
            }
        }
    }

    render()
    {
        gfx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

// Clickable Button
class Button extends GameObject
{
    constructor(text, img, font, font2, color, x, y, width, height, offset, func)
    {
        super();
        this.text = text;
        super.x = x;
        super.y = y;
        this.font = font;
        this.font2 = font2;
        this.color = color;
        this.width = width;
        this.height = height;
        this.offset = offset;
        this.func = func;
        this.big = false;
        this.img = img;
    }

    mouseInside()
    {
        return mousePositionX > this.x && mousePositionY > this.y &&
            mousePositionX < this.x + this.width && mousePositionY < this.y + this.height;
    }

    grow(margin)
    {
        this.x -= margin;
        this.y -= margin;
        this.width += margin * 2;
        this.height += margin * 2;
        this.big = true;
    }

    shrink(margin)
    {
        this.x += margin;
        this.y += margin;
        this.width -= margin * 2;
        this.height -= margin * 2;
        this.big = false;
    }

    update()
    {
        let inside = this.mouseInside();

        if(inside && !this.big)
            this.grow(buttonGrowMargin)

        if(!inside && this.big)
            this.shrink(buttonGrowMargin);

        if(inside && leftClick)
            this.func();
    }

    render()
    {
        gfx.drawImage(this.img, this.x, this.y, this.width, this.height);
        gfx.fillStyle = this.color;
        gfx.textAlign = "center"; 
        gfx.font = this.big ? this.font2 : this.font;
        gfx.fillText(this.text, this.x + (this.width / 2), this.y + (this.height / 2) + this.offset);
    }
}

// A usable textbox
class TextBox extends GameObject
{
    constructor()
    {
        super();
        this.hideBox();

        // NOTE: Hard coded for now
        this.x = 120;
        this.y = 650;
        this.width = 575;
        this.height = 150;
    }

    focus()
    {
        this.showBox();
    }

    unfocus()
    {
        this.hideBox();
    }

    showBox()
    {
        let rect = canvas.getBoundingClientRect();
        let sx = rect.x + 150;
        let sy = rect.y + 670;
        this.box = document.getElementsByName("text")[0];
        this.box.disabled = false;
        this.box.style.top = sy + "px";
        this.box.style.left = sx + "px";
    }

    hideBox()
    {
        this.box = document.getElementsByName("text")[0];
        this.box.disabled = true;
        this.box.style.top = "0px";
        this.box.style.left = "0px";
    }

    update()
    {

    }

    render()
    {
        gfx.drawImage(img_textArea, this.x, this.y, this.width, this.height);
    }
}

// A single card object
class Card extends GameObject
{
    constructor(japanese, english)
    {
        super();
        this.english = english;
        this.japanese = japanese;
        this.show = false;
        
        // NOTE: Hard coded for now
        this.x = 100;
        this.y = 200;
        this.width = 600;
        this.height = 375;

        this.showAnswer = function()
        {
            this.show = true;
        };

        this.isShowing = function()
        {
            return this.show;
        };
    }
    
    render()
    {
        gfx.drawImage(img_card, this.x, this.y, this.width, this.height);
        gfx.fillStyle = "black";
        gfx.textAlign = "center"; 
        gfx.font = "bold 48px Arial";
        gfx.fillText(this.japanese, this.x + (this.width / 2), this.y + (this.height / 2) + 10);

        if(this.show)
        {
            gfx.fillStyle = "#333333";
            gfx.textAlign = "center"; 
            gfx.font = "bold 30px Arial";
            gfx.fillText(this.english, this.x + (this.width / 2), this.y + (this.height / 2) + 50);
        }
    }
}

class Scoreboard extends GameObject
{
    constructor()
    {
        super();
        this.score = 0;
        this.strikes = "";

        // NOTE: Hard coded for now
        super.x = 120;
        super.y = 75;
        this.width = 350;
        this.height = 120;

        // I have no idea why these dont just work
        // as member functions

        this.strike = function()
        {
            this.strikes += " X"
        }

        this.addScore = function()
        {
            this.score++;
        }

        this.resetScore = function()
        {
            this.strikes = ""
        }
    }

    render()
    {
        gfx.drawImage(img_textArea, this.x, this.y, this.width, this.height);
        gfx.drawImage(img_button, this.x + 350, 80, 205, 105);
        
        gfx.fillStyle = "#4c4506";
        gfx.textAlign = "left"; 
        gfx.font = "bold 30px kosugimaru";
        gfx.fillText("スコアー", this.x + 40, this.y + 70);
 
        gfx.textAlign = "right"; 
        gfx.fillText(this.score, this.x + 300, this.y + 70);
    
        gfx.fillStyle = "#ff0000";
        gfx.font = "bold 48px Arial";
        gfx.fillText(this.strikes, this.x + 512, this.y + 75);
    
    }
}

// Very hacky:
// I dont like these:
let cardSwapper = undefined;
let scoreboard = undefined;

// Card game card swapper
class CardSwapper extends GameObject
{
    constructor()
    {
        super();
        super.x = 0;
        super.y = 0;
        this.width = 400;
        this.height = 400;
        this.cards = getCards();
        this.size = 0;
        this.card = this.nextCard();
        this.redCount = 0;

        this.textBox = new TextBox();
        this.scoreboard = new Scoreboard();

        this.passed = 0;
        this.numWords = 3;

        this.showAnswer = false;

        this.strikeCount = 0;

        cardSwapper = this;
        scoreboard = this.scoreboard;

        this.box = document.getElementsByName("text")[0];
        this.box.addEventListener("keydown", function(event){
            if(event.key == "Enter" && !document.getElementsByName("text")[0].disabled)
                cardSwapper.onEnter();
        });
    }

    onEnter()
    {
        let res = this.box.value;
        if(res.toLowerCase() === this.card.english.toLowerCase())
        {
            if(this.cards.length == 0 || this.passed == this.numWords - 1)
            {
                this.scoreboard.resetScore();
                this.box.value = "";
                this.strikeCount = 0;
                this.score = 0;
                this.passed = 0;
                this.cards = getCards();
                this.card = this.nextCard();
                switchScene(winScene);
            }
            else
            {
                this.passed++;
                this.card = this.nextCard();
                this.scoreboard.addScore();
                this.box.value = "";
            }
        }
        else
        {
            this.redCount = 10;
            this.scoreboard.strike();
            this.strikeCount++;

            if(!this.card.isShowing())
                this.card.showAnswer();

            if(this.strikeCount == 3)
            {
                this.scoreboard.resetScore();
                this.box.value = "";
                this.strikeCount = 0;
                this.score = 0;
                this.passed = 0;
                this.cards = getCards();
                this.card = this.nextCard();
                switchScene(failScene);
            }
        }
    }

    focus()
    {
        this.textBox.focus();
    }

    unfocus()
    {
        this.textBox.unfocus();
    }

    nextCard()
    {
        let card = undefined;
        let num = Math.floor(Math.random() * this.cards.length);
        this.cards = this.cards.filter(function(value, index, arr) {
            if(index == num)
                card = value;
            return index != num;
        });
        return card;
    }

    update()
    {
       if(this.redCount)
       {
           this.box.style.color = "#ff0000";
           this.redCount--;
       }
       else
       {
            this.box.style.color = "#4c4506";
       }
    }

    render()
    {
        this.card.render();
        this.textBox.render();
        this.scoreboard.render();
    }
}

// Draw the frame
function renderGame()
{
    fix_dpi();
    gfx.fillStyle = "white";
    gfx.fillRect(0, 0, canvas_width, canvas_height);
    activeScene.renderAll();
}

// Update the frame
function updateGame()
{
    activeScene.updateAll();
    rightClick = false;
    leftClick = false;
}

// Update and render next frame
function updateAndRender()
{
    updateGame()
    renderGame();
    window.requestAnimationFrame(updateAndRender);
}

// Start the game
function start()
{
    updateAndRender();
}

function switchScene(scene)
{
    activeScene.unfocus();
    activeScene = scene;
    activeScene.focus();
}

function getCards()
{
    let cards = new Array();

    cards.push(new Card("いま", "now"));
    cards.push(new Card("えいご", "english"));
    cards.push(new Card("がくせい", "student"));
    cards.push(new Card("〜ご", "language"));
    cards.push(new Card("こうこう", "high school"));
    cards.push(new Card("ごご", "PM"));
    cards.push(new Card("ごぜん", "AM"));
    cards.push(new Card("〜さい", "years old"));
    cards.push(new Card("せんせい", "teacher"));
    cards.push(new Card("そうです", "correct"));
    cards.push(new Card("だいがく", "college"));
    cards.push(new Card("でんわ", "phone"));
    cards.push(new Card("ともだち", "friend"));
    cards.push(new Card("なまえ", "name"));
    cards.push(new Card("なん／なに", "what"));
    cards.push(new Card("にほん", "japan"));
    cards.push(new Card("はい", "yes"));
    cards.push(new Card("はん", "half"));
    cards.push(new Card("ばんごう", "number"));
    cards.push(new Card("わたし", "I"));
    cards.push(new Card("かがく", "science"));
    cards.push(new Card("コンピューター", "computer"));
    cards.push(new Card("しごと", "job"));
    cards.push(new Card("いしゃ", "doctor"));
    cards.push(new Card("おかあさん", "mother"));
    cards.push(new Card("おとうさん", "father"));

    return cards;
}

// Setup scenes
cardsSceen = new Scene(img_cards_bg);
cardsSceen.add(new CardSwapper(getCards()));

cardsSceen_pre = new Scene(img_cards_bg);
cardsSceen_pre.add(new Logo(img_cards_logo, 0, 100, 175, 600, 280));
cardsSceen_pre.add(new Button("プレー", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 275, 550, 250, 100, 15, function(){ switchScene(cardsSceen); }))

failScene = new Scene(img_cards_bg);
failScene.add(new Logo(img_lose, 6, 100, 175, 600, 280))
failScene.add(new Button("メニュー", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 125, 550, 250, 100, 15, function(){ switchScene(menuScene); }))
failScene.add(new Button("またする", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 425, 550, 250, 100, 15, function(){ switchScene(cardsSceen); }))

winScene = new Scene(img_cards_bg);
winScene.add(new Logo(img_win, 4, 100, 175, 600, 280))
winScene.add(new Button("メニュー", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 125, 550, 250, 100, 15, function(){ switchScene(menuScene); }))
winScene.add(new Button("またする", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 425, 550, 250, 100, 15, function(){ switchScene(cardsSceen); }))

menuScene = new Scene(img_menu_bg);
menuScene.add(new Logo(img_logo, 4, 75, 100, 640, 400));
menuScene.add(new Button("カードズ", img_button, "bold 34px kosugimaru", "bold 36px kosugimaru", "#4c4506", 275, 500, 250, 100, 15, function(){ switchScene(cardsSceen_pre); }));
menuScene.add(new Button("フォーリング", img_button, "bold 30px kosugimaru","bold 32px kosugimaru", "#4c4506", 275, 650, 250, 100, 15, function(){ switchScene(cardsSceen_pre); }));

// Set starting scene to menu
activeScene = menuScene;

// Start the game after the window loads
window.onload = start;