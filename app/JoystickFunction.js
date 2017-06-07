function Joystick(){ //This class simulates an analog joystick for touchscreen devices    
   this.position=new vect(.0,.0); //position of the whole joystick    
   this.stickPosition=new vect(.0,.0); //position of the stick    
   this.delta=new vect(.0,.0); //vector from joystick to finger    //stick contour    
   this.size=new vect(imgJoystick.spriteSize.X*this.stickSize[OPTION.stickSize],imgJoystick.spriteSize.Y*this.stickSize[OPTION.stickSize]);    
   this.halfSize=new vect(this.size.X>>1,this.size.Y>>1);    
   this.squareRad=this.halfSize.X*this.halfSize.X; //compared with square magnitude of delta in setPosition() to determine what to do    
   this.stickContour=new sprite(this.position,0,0,imgJoystick,this.size,this.halfSize,0);        //stick    
   this.sSize=new vect(imgJoystick2.spriteSize.X*this.stickSize[OPTION.stickSize],imgJoystick2.spriteSize.Y*this.stickSize[OPTION.stickSize]);    
   this.sHalfSize=new vect(this.sSize.X>>1,this.sSize.Y>>1);    
   this.stick=new sprite(this.stickPosition,0,0,imgJoystick2,this.sSize,this.sHalfSize,0);        
   this.life=0;       
   this.margin=new Margin(-this.halfSize.X,-this.halfSize.Y);}Joystick.prototype={    
      draw:function(){
         if(SCREEN.touched){ //draw joystick if TOUCH_PRESSED            
            this.stickContour.draw();            
            this.stick.draw();        
         }    
      },    setPosition:function(fingerPosition){ //TOUCH_MOVED            
      this.computeDelta(fingerPosition); //compute the vector from finger to joystick                         
      var sMag = this.delta.squareMagnitude(); //square magnitude of delta            
      if(sMag >= this.squareRad){ //joystick moves if the finger is out of the joystick contour                
         this.stickPosition.initV(fingerPosition); //stick moves under the finger                                
         this.delta.normalize(); //delta is now a direction                
         this.delta.scale(this.halfSize.X,2); //delta is now the stick position relative to the whole joystick                                
         this.position.initV(fingerPosition); //joystick contour moves under the finger                
         this.position.subtract(this.delta); //joystick contour is moved in order to keep stick direction                
         this.clamp();// the joystick contour can't go out of the screen                        
      }else //finger is inside the joystick contour. We move the stick only                
         this.stickPosition.initV(fingerPosition); //stick is moved under the finger                            
      this.computeDirection(); //gives the stick direction to the space ship    
   },    computeDelta:function(position){ //compute the vector from finger to joystick         
      this.delta.initV(position);        
      this.delta.subtract(this.position);    
   },    computeDirection:function(){ //sends the joystick direction to the space ship        
      SHIP.direction.initV(this.delta);        
      SHIP.direction.scale(1/this.halfSize.X,2); //normalize D    
   },    clamp:function(){ //joystick contour can't go out of screen        
      if(this.position.Y<this.margin.top)this.position.Y=this.margin.top;        
      if(this.position.X>this.margin.right)this.position.X=this.margin.right;        
      if(this.position.Y>this.margin.bottom)this.position.Y=this.margin.bottom;        
      if(this.position.X<this.margin.left)this.position.X=this.margin.left;    
   },    release:function(){ //TOUCH_RELEASED        
      this.stickPosition.initV(this.position);        
      SHIP.direction.init(.0,.0);        
   },    init:function(fingerPosition){ //TOUCH_PRESSED        
      this.position.initV(fingerPposition);        
      this.stickPosition.initV(fingerPosition);        
      this.clamp();        
      this.computeDelta(fingerPosition);        
      this.computeDirection();    
   }
};
