/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  boy_running =   loadAnimation("assets/boy1.png","assets/boy2.png","assets/boy3.png");
  boy_collided = loadAnimation("assets/boy1.png");
  jungleImage = loadImage("assets/bg.png");
  coin1 = loadImage("assets/coin1.png");
  coin2 = loadImage("assets/coin2.png");
  coin3 = loadImage("assets/coin3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameover.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  boy = createSprite(50,200,20,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.20;
  boy.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.50;

  gameOver.visible = false;
  restart.visible = false;
  
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  boy.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(boy.y)
    if(keyDown("space")&& boy.y>270) {
      jumpSound.play();
       boy.velocityY = -16;
    }
  
    boy.velocityY = boy.velocityY + 0.8
    spawnCoins();
    spawnObstacles();

    boy.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(boy) )
    {
      collidedSound.play();
      gameState = END;
    }

    if(coinsGroup.isTouching(boy)
    ){
      score = score + 1;
      coinsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    boy.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);

    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 5){
    boy.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnCoins() {
 
  if (frameCount % 150 === 0) {

    var coin = createSprite(camera.position.x+500,330,40,10);

    coin.velocityX = -(6 + 3*score/100)
    coin.scale = 0.1;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: coin.addImage(coin1);
              break;
      case 2: coin.addImage(coin2);
              break;
      case 3: coin.addImage(coin3);
              break;
      default: break;
    }
       
    coin.scale = 0.04;
    coin.lifetime = 400;
    
    coin.setCollider("rectangle",0,0,coin.width/2,coin.height/2)
    coinsGroup.add(coin);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  //change animation of the kangaroo
  boy.changeAnimation("running", boy_running);
   boy.addAnimation("collided",boy_collided);
  //destroy the shrubs and obstacle group
  coinsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score = 0;
}































































































































































































































