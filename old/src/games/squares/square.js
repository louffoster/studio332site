import Phaser from 'phaser'


export default class Square  {
    static get SIZE() {
        return 50
    }

    constructor(color, x, y) {
        this.color = color
        this.active = false
        this.rect = new Phaser.Geom.Rectangle(x,y, Square.SIZE, Square.SIZE)
        this.invisible = false
    }

    getCenter() {
        return Phaser.Geom.Rectangle.GetCenter(this.rect)
    }
    setInvisible() {
        this.invisible = true
    }
    setInactive() {
        this.inactive = true
    }

    getColor()  {
        return this.color
    }

    setColor(newColor) {
        this.color = newColor
    }

    draw(graphics) {
        if ( this.invisible) return
        let colors = [0x212121, 0xe0f7fa, 0x003c8f, 0x5e92f3]
        graphics.fillStyle( colors[this.color] )
        graphics.fillRectShape(this.rect)
        graphics.lineStyle(1, 0x000000)
        graphics.fillRectShape(this.rect)

        // if (this.active) {
        //     graphics.lineStyle( 1, 0x00ff00)
        //     graphics.lineBetween(this.rect.centerX - 25, this.rect.centerY, this.rect.centerX + 25, this.rect.centerY);
        //     graphics.lineBetween(this.rect.centerX, this.rect.centerY - 25, this.rect.centerX, this.rect.centerY + 25);
        // }
        
        graphics.strokeRectShape(this.rect);
    }

    hit(x,y) {
        if ( this.invisible || this.inactive) return false
        this.active = this.rect.contains(x,y)
        return this.active
    }
}