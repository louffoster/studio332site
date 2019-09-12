import Phaser from 'phaser'
import Square from './square'


export default  class Squares extends Phaser.Scene {
    constructor ()   {
       super({ key: 'squares' })
    }

    create() {
        // create an even set of color identifiers 
        let colors = []
        for ( let i=0; i<64; i++ ) {
            colors.push( i%4)
        }

        // ... and shuffle them. This is the starting set of square colors
        for (let i = colors.length; i; i -= 1) {
            let j = Math.floor(Math.random() * i)
            let x = colors[i - 1]
            colors[i - 1] = colors[j]
            colors[j] = x
        }

        this.graphics = this.add.graphics();
        this.grid = []
        for ( let r=0; r<=7; r++) {
            let row = []
            for ( let c=0; c<=7; c++) {
                let x = ((Square.SIZE+1)*c)+1
                let y = ((Square.SIZE+1)*r)+1
                let sq = new Square(colors.pop(), x,y )
                row.push( sq )
                if ( r==0 || r==7 || c==0 || c==7) {
                    sq.setInactive()
                }
            }
            this.grid.push(row)
        }
        this.border = new Phaser.Geom.Rectangle(51, 51, (50+1)*6, (50+1)*6)
        this.showBorder = true
        this.redraw()
        this.input.on('pointermove', pointer=> {
            let y = pointer.y
            let x = pointer.x
            for ( let r=0; r<=7; r++) {
                for ( let c=0; c<=7; c++) {     
                    this.grid[r][c].hit( x, y)
                }
            }
            this.redraw()
        })
        this.input.on('pointerup', pointer => {
            let y = pointer.y
            let x = pointer.x
            for ( let r=0; r<=7; r++) {
                for ( let c=0; c<=7; c++) {     
                    if (this.grid[r][c].hit( x, y) ) {
                        // this.showBorder = false
                        // this.drawBorder()
                        let selCenter = this.grid[r][c].getCenter()
                        let sqSz = (Square.SIZE+1)*1.5
                        let left = selCenter.x - sqSz
                        let top = selCenter.y - sqSz
                        let w = (Square.SIZE+1)*3
                        let h = (Square.SIZE+1)*3
                        this.game.renderer.snapshotArea(left,top,w,h, image => {
                            // this.showBorder = true
                            // this.drawBorder()
                            let rect = new Phaser.Geom.Rectangle(left,top,w,h)
                            this.graphics.fillStyle(0x000000)
                            this.graphics.fillRectShape(rect)
                            this.textures.addImage('snap', image);
                            var snapImg = this.add.image(selCenter.x,selCenter.y, 'snap')
                            this.tweens.add({targets: [snapImg],  rotation:+1.5708,
                                duration: 500, ease: 'Linear',
                                onCompleteParams: [ this ],
                                onComplete: () => {
                                     this.textures.remove('snap')
                                    snapImg.destroy()
                                    this.rotateAround(r,c)
                                    this.redraw()
                                }}
                            )
                        })
                    }
                }
            }
        })
    }

    drawBorder() {
        this.graphics.lineStyle(2, 0x000000)
        if (this.showBorder) {
            this.graphics.lineStyle(2, 0xaa5555)
        }
        this.graphics.strokeRectShape(this.border)
    }

    // rotate the 8 squares centered around r,c by 90 degrees
    rotateAround(centerR,centerC) {
        // Copy current grid colors into local matrix...
        let result = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
        // 1,2,3      7,4,1
        // 4,5,6  =>  8,5,2
        // 7,8,9      9,6,3
        let rOffset = centerR - 1
        let cOffset = centerC - 1
        for (let r=centerR-1; r<=centerR+1; r++) {
            for (let c=centerC-1; c<=centerC+1; c++) {
                let color = this.grid[r][c].getColor()
                // convert to local grid coords
                let lr = r-rOffset
                let lc = c-cOffset

                /// rotate them and assign to 3x3 matrix
                let rotR = lc
                let rotC = 2 - lr
                result[rotR][rotC] = color
            }
        }

        // stick the rotated result back on the grid
        for (let r=0; r<=2; r++) {
            for (let c=0; c<=2; c++) {
                this.grid[r+rOffset][c+cOffset].setColor( result[r][c])
            }
        }
    }

    redraw() {
        this.graphics.clear()
        for ( let r=0; r<=7; r++) {
            for ( let c=0; c<=7; c++) {     
                this.grid[r][c].draw(this.graphics)
            }
        }

        this.drawBorder()
    }
}