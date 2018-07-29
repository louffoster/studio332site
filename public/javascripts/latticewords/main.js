
var config = {
  type: Phaser.AUTO,
  parent: 'studio332',
  width: 600,
  height: 640,
  backgroundColor: '3F51B5',
  scene: [Menu,Latticewords]
};

var game = new Phaser.Game(config);
