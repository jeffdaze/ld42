/**
 * Created by jeffdaze on 2018-08-10.
 *
 * This will be a small game for LD42
 *
 */


//create a global game object...
var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');



window.onload = function(){
	init();
};


var init = function(){
	game.state.start('intro_screen');
};


var INTRO = {
	create: function(){
		console.log("ran create...");
		var graphics = game.add.graphics(100, 100);

		// set a fill and line style
		graphics.beginFill(0xFF3300);
		graphics.lineStyle(10, 0xffd900, 1);

		// draw a rectangle
		graphics.lineStyle(2, 0x0000FF, 1);
		graphics.drawRect(50, 250, 100, 100);
		graphics.endFill();

		graphics.inputEnabled=true;
		graphics.input.useHandCursor = true;

		//capture events and send to the function 'listener'
		graphics.events.onInputDown.add(startGame,this);


	}
	/*
	 //game loop here...
	 render: function(){
	 console.log("Ran render...");
	 }
	 */
};

var MAINGAME = {
	preload: function(){
		game.load.image('bluestar', 'images/bluestar.png');
	},

	create: function(){
		console.log("ran main game...");

		game.add.sprite(400, 300, 'bluestar');
	},
	/*
	 //game loop here...
	 render: function(){
	 console.log("Ran render...");
	 }
	 */
};

//register game states..
game.state.add('intro_screen', INTRO);
game.state.add('main_game', MAINGAME);

/** PRIVATE METHODS... **/
function startGame(){
	game.state.start('main_game');
}

