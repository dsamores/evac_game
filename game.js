window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var GAME = {
	id: null,
	name: null,
	startTime: null,
	startLocation: null,
	finishLocation: null,
	stop: false,
	points: {
		time: 5,
		tap: 1,
		swipe: 2,
		writeText: 5,
		takePicture: 10,
	},
	showBubble: false,
	bubbleIdGen: 1,
	bubbleTypes: {
		tap: {
			points: 1,
			action: 'tap',
			text: 'Tap me',
			image: 'images/Tapme.png',
		},
		swipeLeft: {
			points: 2,
			action: 'swipe-left',
			text: 'Swipe me',
			image: 'images/SwipeLeft.png',
		},
		swipeRight: {
			points: 2,
			action: 'swipe-right',
			text: 'Swipe me',
			image: 'images/SwipeRight.png',
		},
		writeText: {
			points: 5,
			action: 'write-text',
			text: 'Text',
			image: 'images/Tapme.png',
		},
		takePicture: {
			points: 10,
			action: 'take-picture',
			text: 'Pic',
			image: 'images/Tapme.png',
		},
	},
	init: function(){
		while(USER.id == -1 || USER.id == null);
		startTime = new Date().getTime();
		requestFromServer('new_game');
	},
  imageTypes: {
    yellowenvelope: 'images/yenvelope.png',
    purpleenvelope: 'images/penvelope.png',
    blueenvelope: 'images/benvelope.png',
    orangeenvelope: 'images/oenvelope.png',
  },
};

var USER = {
	id: null,
	points: null,
	currentLat: null,
	currentLon: null,
	interactions: [],
	bubbles: [],
	mockLocation: false,

	init: function(){
		this.id = this.getUserId();
		//this.points = 600;
		if(this.id == -1)
			requestFromServer('new_user');
		this.simulateLocation();
	},
	
	getUserId: function(){
		if(this.id != -1 && this.id != null)
			return this.id;
		if(localStorage.userId)
			return localStorage.userId;
		return -1;
	},
	
	storeInfo: function(){
		localStorage.userId = this.id;
	},
	
	simulateLocation: function(){
		if(this.mockLocation){
	        setTimeout(function(){
	    		finishGame();
	        }, 60000);
		}
	},
	
	sendInteractions: function(){
		var data = {
			userId: USER.id,
			gameId: GAME.id,
			interactions: this.interactions,
		};
		sendToServer('interactions', JSON.stringify(data));
	},
	
	sendBubbles: function(){
		var data = {
			userId: USER.id,
			gameId: GAME.id,
			bubbles: this.bubbles,
		};
		sendToServer('bubbles', JSON.stringify(data));
	},
};

setInterval(function() {
	USER.points -= GAME.points.time;
	POP.Score.setNewPoints(GAME.points.time, false);
}, 5000);

var bubbleTimer = setInterval(function(){
	GAME.showBubble = true;
}, 3000);


var POP = {

    WIDTH: 320,
    HEIGHT:  480,
    RATIO:  null,
    currentWidth:  null,
    currentHeight:  null,
    canvas: null,
    ctx:  null,
    entities: [],

    scale:  1,
    offset: {top: 0, left: 0},

    initialTouch: null,
    touchType: null,

    init: function() {

    	USER.init();
    	GAME.init();

        POP.RATIO = POP.WIDTH / POP.HEIGHT;
        POP.currentWidth = POP.WIDTH;
        POP.currentHeight = POP.HEIGHT;

        POP.canvas = document.getElementsByTagName('canvas')[0];
        POP.canvas.width = POP.WIDTH;
        POP.canvas.height = POP.HEIGHT;
        POP.ctx = POP.canvas.getContext('2d');

        POP.ua = navigator.userAgent.toLowerCase();
        POP.android = POP.ua.indexOf('android') > -1 ? true : false;
        POP.ios = ( POP.ua.indexOf('iphone') > -1 || POP.ua.indexOf('ipad') > -1  ) ? true : false;

        POP.resize();

        POP.Draw.clear();

        POP.Input = {
            x: 0,
            y: 0,
            type: null,
            interaction: null,
            
            set: function(data, type) {
                this.x = (data.pageX - POP.offset.left) / POP.scale;
                this.y = (data.pageY - POP.offset.top) / POP.scale;
                this.type = type;
                this.interaction = new POP.Interaction(type, null);
                USER.interactions.push(this.interaction);
            }
        };

        POP.Score = {

            type: 'score',
            remove: false,
            idcard: 'images/idcard.png',
            binocular: 'images/binoculars.png',
            mail: 'images/mail.png',
            medal: 'images/medal.png',
            y: 30,
            points: null,
            won: null,
            pointsChanged: false,
            color: '255,255,0',
            opacity: 0, 
            
            setNewPoints: function (points, won){
            	POP.Score.points = points;
            	POP.Score.won = won;
            	POP.Score.pointsChanged = true;
            	POP.Score.y = 30;
            	POP.Score.opacity = 1;
            	POP.Score.color = POP.Score.won ? '0,128,0' : '255,0,0';
            },

            update: function() {
            	if(POP.Score.pointsChanged){
	            	if(POP.Score.won){
	            		POP.Score.y -= 2;
	            		if(POP.Score.y < -20){
	            			POP.Score.pointsChanged = false;
	            			POP.Score.opacity = 0;
	            		}
	            	}
	            	else{
	            		POP.Score.y += 2;
	            		if(POP.Score.y > 70){
	            			POP.Score.pointsChanged = false;
	            			POP.Score.opacity = 0;
	            		}
	            	}
            	}
            },

            render: function() {
                POP.Draw.rect(0, 0, POP.WIDTH, 50, '#333');
                POP.Draw.image(POP.Score.idcard, 60, 10, 1.0);
                POP.Draw.text(USER.id, 110, 30, 20, '#fff');
                POP.Draw.image(POP.Score.medal, POP.WIDTH - 130, 10, 1.0);
                POP.Draw.text(USER.points, POP.WIDTH - 70, 30, 20, '#fff');
                POP.Draw.text((POP.Score.won ? '+' : '-') + POP.Score.points, POP.WIDTH - 30, POP.Score.y, 30, 'rgb(' + POP.Score.color + ', ' + POP.Score.opacity + ')');
              },


        };

        POP.Touch = function(x, y) {

            this.type = 'touch';
            this.x = x;
            this.y = y;
            this.r = 5;
            this.opacity = 1;
            this.fade = 0.05;
            this.remove = false;

            this.update = function() {
                this.opacity -= this.fade;
                this.remove = (this.opacity < 0) ? true : false;
            };

            this.render = function() {
                POP.Draw.circle(this.x, this.y, this.r, 'rgba(255,0,0,'+this.opacity+')');
            };

        };

        POP.Swipe = function(x, y, direction) {

            this.type = 'swipe';
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.r = 5;
            this.opacity = 1;
            this.fade = 0.05;
            this.remove = false;

            this.update = function() {
                this.remove = true;
            };

            this.render = function() {
            };

        };

        POP.Bubble = function(bubbleType, imageType) {

            this.type = 'bubble';
            this.r = 28;
            this.x = this.r + (POP.WIDTH - 2 * this.r) * Math.random();
            this.y = 50 +  this.r + (POP.HEIGHT - 50 - 2 * this.r) * Math.random();
            this.opacity = 1;
            this.fadeRate = 0.05;

            this.properties = bubbleType;
            this.id = GAME.bubbleIdGen;
            GAME.bubbleIdGen += 1;
            this.time = new Date().getTime();
            
            this.fade = false;
            this.remove = false;

            this.action = null;
            var self = this;

            this.run = setTimeout(function(){
            	self.fade = true;
            }, 2800);

            this.update = function() {

            	if(this.fade){
                    this.opacity -= this.fadeRate;
                    this.remove = (this.opacity < 0) ? true : false;
            	}

            	if(this.action != null){
            		clearTimeout(this.run);
            		this.fade = false;
            	}

                if(this.action == 'tap'){
                	this.remove = true;
                }
                else if(this.action == 'swipe-left'){
                	this.x -= 10;
                    if (this.x < -10) {
                        this.remove = true;
                    }
                }
                else if(this.action == 'swipe-right'){
                	this.x += 10;
                    if (this.x > POP.WIDTH + 2 * this.r) {
                        this.remove = true;
                    }
                }
                else if(this.action == 'write-text'){
                	this.remove = true;
                }
                else if(this.action == 'take-picture'){
                	this.remove = true;
                }

            };

            this.render = function() {
                //POP.Draw.circle(this.x, this.y, this.r, 'rgba(255,255,255,'+this.opacity+')');
                POP.Draw.image(imageType, this.x - 31, this.y-31, this.opacity);
                POP.Draw.text(this.properties.text, this.x, this.y - 9, 12, 'rgba(0,0,0,'+this.opacity+')');
                POP.Draw.text('+' + this.properties.points, this.x + 2, this.y + 5, 14, 'rgba(0,0,0,'+this.opacity+')');
                POP.Draw.image(this.properties.image, this.x - 19, this.y, this.opacity);
                
            };
        };

        POP.collides = function(a, b) {

            var distance_squared = (((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));

            var radii_squared = (a.r + b.r) * (a.r + b.r);

            if (distance_squared < radii_squared) {
                return true;
            } else {
                return false;
            }
        };
        
        POP.Interaction = function (type, bubbleId){
        	this.type = type;
        	this.bubbleId = bubbleId;
            this.time = new Date().getTime();
            this.latitude = USER.currentLat;
            this.longitude = USER.currentLon;
        };
        
        POP.BubbleMininal = function (bubble){
        	this.id = bubble.id;
        	this.type = bubble.properties.action;
            this.time = new Date().getTime();
        };
        
        window.addEventListener('click', function(e) {
            //POP.Input.set(e, 'tap');
        }, false);

        window.addEventListener('touchstart', function(e) {
            POP.initialTouch = e.touches[0];
        }, {passive: false});
        window.addEventListener('touchmove', function(e) {

            if (initialX === null || initialY === null)
                return;

            var initialX = POP.initialTouch.clientX;
            var initialY = POP.initialTouch.clientY;

            var currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;

            var diffX = initialX - currentX;
            var diffY = initialY - currentY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                	POP.touchType = 'swipe-left';
                }
                else {
                	POP.touchType = 'swipe-right';
                }
            }
            else {
                if (diffY > 0) {
                	POP.touchType = 'swipe-up';
                }
                else {
                	POP.touchType = 'swipe-down';
                }
            }

            initialX = null;
            initialY = null;
        }, {passive: false});
        window.addEventListener('touchend', function(e) {
            if(POP.touchType == null){
            	POP.Input.set(e.changedTouches[0], 'tap');
            }
            else{
            	POP.Input.set(POP.initialTouch, POP.touchType);
            }
            POP.touchType = null;
        }, {passive: false});

    	POP.entities.push(POP.Score);
    },

    resize: function() {

        POP.currentHeight = window.innerHeight;
        POP.currentWidth = POP.currentHeight * POP.RATIO;

        if (POP.android || POP.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }

        POP.canvas.style.width = POP.currentWidth + 'px';
        POP.canvas.style.height = POP.currentHeight + 'px';

        window.setTimeout(function() {
            window.scrollTo(0,1);
        }, 1);

        POP.scale = POP.currentWidth / POP.WIDTH;
        POP.offset.top = POP.canvas.offsetTop;
        POP.offset.left = POP.canvas.offsetLeft;

        var map = document.getElementById('mapid');

        map.style.width = POP.currentWidth + 'px';
        map.style.height = POP.currentHeight + 'px';
        mymap.invalidateSize();
    },

    update: function() {

    	var numConcurrentBubbles = 3;
        if (GAME.showBubble) {
        	for(var i = 0; i < numConcurrentBubbles; i++){
	        	var keys_imgs = Object.keys(GAME.imageTypes);
	        	var imageType = GAME.imageTypes[keys_imgs[Math.floor(keys_imgs.length * Math.random())]];
	
	        	var keys = Object.keys(GAME.bubbleTypes);
	        	var bubbleType = GAME.bubbleTypes[keys[Math.floor(keys.length * Math.random())]];
	        	var bubble = new POP.Bubble(bubbleType, imageType);
	            POP.entities.push(bubble);
	            USER.bubbles.push(new POP.BubbleMininal(bubble));
        	}
            GAME.showBubble = false;

        }

        var i, checkCollision = false;

        if(POP.Input.type != null){
	        if (POP.Input.type === 'tap') {
	            POP.entities.push(new POP.Touch(POP.Input.x, POP.Input.y));
	            checkCollision = true;
	        }
	        else if (POP.Input.type.includes('swipe-')) {
	            POP.entities.push(new POP.Swipe(POP.Input.x, POP.Input.y, POP.Input.type.substring(6)));
	            checkCollision = true;
	        }
        }

        for (i = 0; i < POP.entities.length; i += 1) {

            if (POP.entities[i].type === 'bubble' && checkCollision) {
            	var bubble = POP.entities[i];
                hit = POP.collides(POP.entities[i], {x: POP.Input.x, y: POP.Input.y, r: 7});
   
                if (hit){ 
                	POP.Input.interaction.bubbleId = bubble.id;
                	var expectedAction = bubble.properties.action;
                	if(expectedAction == 'write-text' || expectedAction == 'take-picture')
                		expectedAction = 'tap';
                	if(expectedAction == POP.Input.type){
	                	POP.entities[i].action = POP.Input.type;
	                	switch(POP.Input.type){
	                	case 'tap':
	                		if(bubble.properties.action == 'write-text'){
	                			$("#writeTextModal").modal();
	                		}
	                		else if(bubble.properties.action == 'take-picture'){
	                			//$('#takePiccie')[0].click();
	                			$("#cameraModal").modal();
	                			console.log('dfghdfgh');
	                		}
	                		else{
		                		USER.points += GAME.points.tap;
		                		POP.Score.setNewPoints(GAME.points.tap, true);
	                		}
	                		break;
	                	default:
	                		USER.points += GAME.points.swipe;
                			POP.Score.setNewPoints(GAME.points.swipe, true);
	                		break;
	                	}
                	}
                }
            }
            POP.entities[i].update();

            if (POP.entities[i].remove) {
                POP.entities.splice(i, 1);
            }
        }
        POP.Input.type = null;

    },

    render: function() {

        POP.Draw.clear();

        for (var i = 0; i < POP.entities.length; i += 1) {
            POP.entities[i].render();
        }

    },

    loop: function() {
    	
    	if(GAME.stop){
    		return;
    	}

        requestAnimFrame( POP.loop );

        POP.update();
        POP.render();
    }
};

POP.Draw = {

 clear: function() {
     POP.ctx.clearRect(0, 0, POP.WIDTH, POP.HEIGHT);
 },

 rect: function(x, y, w, h, col) {
     POP.ctx.fillStyle = col;
     POP.ctx.fillRect(x, y, w, h);
 },

 circle: function(x, y, r, col) {
     POP.ctx.fillStyle = col;
     POP.ctx.beginPath();
     POP.ctx.arc(x, y, r, 0,  Math.PI * 2, true);
     POP.ctx.closePath();
     POP.ctx.fill();
 },

 text: function(string, x, y, size, col) {
     POP.ctx.font = 'bold '+size+'px Montserrat sans_serif';
     POP.ctx.fillStyle = col;
     POP.ctx.fillText(string, x, y, 50);
     POP.ctx.textAlign = "center";
     POP.ctx.textBaseline="middle";
  },

 image: function(string, x, y, alpha) {
	 POP.ctx.save();
     POP.ctx.globalAlpha = alpha;
     var img = new Image();
     img.src = string;
     POP.ctx.drawImage(img, x, y);
     POP.ctx.restore();
   },
};

window.addEventListener('load', POP.init, false);
window.addEventListener('resize', POP.resize, false);
