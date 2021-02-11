var dog,sadDog,happyDog;

var foodCount=10;

var fedTime,lastFed;

var foodObj,feed,addFood;

var database,foodS,foodStock;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happydog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);
  
  dog=createSprite(window.innerWidth*0+800,window.innerHeight*0+200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodStock=database.ref('FoodCount');
  foodStock.on("value",readStock,showError);

  

}

function draw() {
  background(46,139,87);

  foodObj.display();
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    FoodCount:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    FoodCount:foodS
  })
}

function showError(){console.log("Error")}