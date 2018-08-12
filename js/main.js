/**
 * Created by jeffdaze on 2018-08-10.
 *
 * This will be a small game for LD42
 *
 */


//create a global game object...
var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');


//some globals...
var player = {};

player.credits = 10000;
player.deviceParts = 0;
player.crew = [];
player.ship = {};
player.location = {};

var galaxy = {};
galaxy.starSystems = [];

window.onload = function(){
	init();
};


var init = function(){
	//build our starmap...
	generateGalaxy(20);

	console.log(galaxy);

	//pick a random starting system...
	player.location = randArrayElement(galaxy.starSystems);

	console.log('starting location', player);

	game.state.start('attract_screen');
};


var START = {
	create: function(){
		console.log("ran create...");

		//text...
		var style = { font: "24px 'Press Start 2P'", fill: "#ff0044", align: "center" };
		var style2 = { font: "12px 'Press Start 2P'", fill: "#ffffff", align: "center" };
		var style3 = { font: "10px 'Press Start 2P'", fill: "#ff0044", align: "center" };

		var title1 = game.add.text(game.world.centerX, 350, "The Syncope Device", style);
		var title2 = game.add.text(game.world.centerX, 700, "© 2018 Jeff Daze", style2);

		title1.anchor.set(0.5);
		title2.anchor.set(0.5);

		var text = game.add.text(game.world.centerX, 400, "click anywhere to start", style3);

		text.anchor.set(0.5);
		text.alpha = 0.1;
		var tween = game.add.tween(text).to( { alpha: 1 }, 2000, "Linear", true, 0, -1);

		tween.yoyo(true, 3000);

		//click anywhere to start?
		game.inputEnabled = true;
		game.input.useHandCursor = true;

		game.input.onDown.add(function(){
			startState('intro_screen');
		});

		//text.inputEnabled=true;
		//text.input.useHandCursor = true;

		//text.events.onInputDown.add(startState('intro_screen'), this);


	}
	/*
	 //game loop here...
	 render: function(){
	 console.log("Ran render...");
	 }
	 */
};


var INTRO = {
	create: function(){
		console.log("ran intro story...");

		//text...
		var style = { font: "24px 'Press Start 2P'", fill: "#ffffff", align: "left" };
		var style2 = { font: "26px 'Press Start 2P'", fill: "#ff0044", align: "left" };


		var info = "There are many legends of the Ancients\nwhispered in the galaxy. But it had been \nso long since their presence had been felt \nthe spacefaring planets have all but \nforgotten the warnings...\nuntil now, no-one had realised the true \nimportance of";

		var header = "The Syncope Device";

		var text = game.add.text(10, 100, info, style);

		var text2 = game.add.text(500, 500, header, style);

		var tween = game.add.tween(text2).to( { x: 505 }, 2000, "Linear", true, 0, -1);

		tween.yoyo(true, 3000);

		/*
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
		graphics.events.onInputDown.add(function(){
			startState('main_game');
		});
		*/


		//click anywhere to start?
		game.inputEnabled = true;
		game.input.useHandCursor = true;

		game.input.onDown.add(function(){
			startState('main_game');
		});


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
		game.load.image('starfieldBase', 'images/starfield_base.png');
		game.load.image('starfieldAccent', 'images/starfield_accent.png');
	},

	create: function(){
		console.log("ran main game...");


		//render some stars...

		//starfield_base = game.make.bitmapData();

		//starfield_base.load('starfieldBase');


		//var sprite = starfield_base.addToWorld(game.world.centerX, game.world.centerY, 0.5, 0.5, 1, 1);
		//sprite.smoothed = false;


		//base starfield...
		var starfield_base = game.add.sprite(0, 0, 'starfieldBase');

		var tween = game.add.tween(starfield_base).to( { x: 5 }, 5000, "Linear", true, 0, -1);

		tween.yoyo(true, 6000);


		//color accents...
		var starfield_accents = game.add.sprite(0,0, 'starfieldAccent');
		var tween = game.add.tween(starfield_accents).to( { x: 10 }, 3000, "Linear", true, 0, -1);
		tween.yoyo(true, 4000);


		for(var x=0;x<galaxy.starSystems.length;x++){
			var star = game.add.sprite(galaxy.starSystems[x].x, galaxy.starSystems[x].y, 'bluestar');

			let starName = galaxy.starSystems[x].name;

			let statusInfo = "";

			//highlite the player current planet..
			if(player.location.name == galaxy.starSystems[x].name){

				var reticle = game.add.graphics(player.location.x, player.location.y);
				reticle.lineStyle(1, 0xFFFFFF, 1);
				reticle.drawRect(-5, -5, 36, 36);

				statusInfo += "Current \nSystem";

			};

			star.inputEnabled = true;
			star.input.useHandCursor = true;

			star.events.onInputOver.add(over, this);
			star.events.onInputOut.add(out, this);
			star.events.onInputDown.add(down, this);

			var systemName = null;
			var graphics = null;

			var status = null;

			var travel = null;
			var dock = null;
			var close = null;

			 function over(item){
				 renderInfo(item);
			 }

			function down(item){
				nukeInfo();
				//renderInfo(item);

				//renderActions(item);
			}

			function out(item){
				nukeInfo();
			}

			//could probably improve this with adding children?
			function nukeInfo(){
				systemName.destroy();
				status.destroy();
				//close.destroy();
				//travel.destroy();
				//dock.destroy();
				graphics.destroy();
			}

			function renderInfo(item) {
				//in case we need some more graphics...
				graphics = game.add.graphics(item.x, item.y);


				// set a fill and line style
				graphics.beginFill(0x333333);
				graphics.lineStyle(10, 0xffffff, 1);

				// draw a rectangle
				graphics.lineStyle(1, 0xFFFFFF, 1);
				graphics.drawRect(30, -10, 100, 150);
				graphics.endFill();

				graphics.alpha = 0.4;

				//graphics.inputEnabled=true;
				//graphics.input.useHandCursor = true;

				var textXoffset = 34;

				var style = {font: "12px 'Press Start 2P'", fill: "#ffffff", align: "left"};

				var style2 = {font: "10px 'Press Start 2P'", fill: "#ffffff", align: "left"};

				systemName = game.add.text(item.x + textXoffset, item.y - 22, starName, style);

				status = game.add.text(item.x + textXoffset + 5, item.y + 10, statusInfo, style2);

				/*
				close = game.add.text(item.x + 116, item.y - 10, "x", style);

				travel = game.add.text(item.x + textXoffset, item.y + 120, "Visit", style);
				dock = game.add.text(item.x + textXoffset, item.y + 100, "Dock", style)

				close.inputEnabled = true;
				close.input.useHandCursor = true;

				close.events.onInputDown.add(nukeInfo, this);

				*/


			}

		}




	},


	 //game loop here...
	 //render: function(){
	 	//console.log("Ran render...");

	 //}

};

//register game states...
game.state.add('attract_screen', START);
game.state.add('intro_screen', INTRO);
game.state.add('main_game', MAINGAME);

/** PRIVATE METHODS... **/

//generic method to change state / screen...
function startState(state){
	game.state.start(state);
}

//generate our game galaxy...
//generate a list of locations...
var starNames = [
	'Achernar',
	'Acrab',
	'Acrux',
	'Adhara',
	'Algieba',
	'Algol',
	'Alhena',
	'Alioth',
	'Aljanah',
	'Alkaid',
	'Almach',
	'Alnair',
	'Alnilam',
	'Alnitak',
	'Alphard',
	'Alphecca',
	'Alpheratz',
	'Alsephina',
	'Aludra',
	'Ankaa',
	'Aspidiske',
	'Atria',
	'Avior',
	'Capella',
	'Caph',
	'Denebola',
	'Diphda',
	'Dschubba',
	'Dubhe',
	'Elnath',
	'Eltanin',
	'Enif',
	'Gacrux',
	'Hadar',
	'Hamal',
	'Izar',
	'Kochab',
	'Larawag',
	'Markab',
	'Menkalinan',
	'Menkent',
	'Merak',
	'Mintaka',
	'Mirach',
	'Mirfak',
	'Mirzam',
	'Mizar',
	'Naos',
	'Nunki',
	'Phecda',
	'Regor',
	'Sabik',
	'Sadr',
	'Saiph',
	'Sargas',
	'Schedar',
	'Shaula',
	'Suhail',
	'Tiaki',
	'Wezen'
];

//might seed this so it can be replayed?
function generateGalaxy(size){

	for(var x=0;x<size;x++){
		var ssgen = {};

		ssgen.name = randArrayElement(starNames);
		//make sure we get unique names; remove any found names from the original array...
		var index = starNames.indexOf(ssgen.name);
		if (index > -1) {
			starNames.splice(index, 1);
		}

		ssgen.x = getRandomIntInclusive(100, 850);
		ssgen.y = getRandomIntInclusive(100, 600);

		galaxy.starSystems.push(ssgen);
	}


}


//RANDOM METHODS...

//returns a random item from an array...
//takes an array as a param
//returns an item from the array
function randArrayElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

//random inclusive number...
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}