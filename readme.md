I Scream IceCream
SEI SEBPT220 Project 1: The last Icey

A flappy bird inspired survial game

HOW TO PLAY

Start Up Screen:
Main Menu
How To Play
SpaceBar,Tap or Click to move

Game Start Screen:
Play Screen

Game Over Screen:
Score History

HOW TO INSTALL
Fork and Clone this respository to your local machine
Open index.html in your browser to play or
Open the directory in your text editor of choice to view or edit the code

HOW IT WORKS
The Last iceyPop runs on is sidescrolling game loop that. There is one gravity function: tbat forces the IceCream down. There are Obsticals that will cauase the IceCream to melt

timeStamp
`timeStamp` is a value in milli seconds that is built in object in requestAnimate
`deltaTime` is the difference between the current and prevous logged times
`requestAnimation` autmaticaly adjust the speed of refresh to the media. examaple 60fps~ depending on the device.

```js
let previousTime = 0;
function animate(timeStamp) {
  //deltaTime is the diffrence of previousTime and current frame
  const deltaTime = timeStamp - previousTime;
  previousTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.render(deltaTime);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

Random obstacles position and speed

To add to the game complexity and had AI like components to the game. I randomized the different positions of

`this.y` is set the positing of the object on the y axis to radom and keeps it scaled to the games height
`this.speedY` randomizes the direction based on the 50 50 probability.

```js
//randmize obstcales on the Y axis
this.y = Math.random() * (this.game.height - this.scaledHeight);
this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
```

Stretch Goals:

Game logic:
I would like to incoropate increased diffuclty the longer the player is alive. Possibly spawning 2 additional obistacles for every 20 seconds the user surives.

I would also like to give the player a health bar the more the player moves the faster the icePop melts. The user would have to grab health restoring objects.

Animation:
Updating the player to reflect different states in the game would be another addition.
A image for melting, melted, moving, and collision frames.

Sited Resources:
https://mixkit.co/free-sound-effects/game/
https://craftpix.net/freebies/free-cartoon-parallax-2d-backgrounds/
https://www.youtube.com/watch?v=jj5ADM2uywg

Inital WireFrame Concepts:

Home Screen
![Home Screen](./assets/wireframes/Home-Screen.png)

Game Start Screen
![Game Start Screen](./assets/wireframes/Game-StartScreen.png)

Game Over Screen
![Game Over Screen](./assets/wireframes/Game-OverScreen.png)

Update WireFrames:

Home Screen
![Home Screen](./assets/wireframes/Home-Screen2.png)

Game Start Screen
![Game Start Screen](./assets/wireframes/Game-Active.png)

Game Over Screen
![Game Over Screen](./assets/wireframes/Game-OverScreen2.png)
