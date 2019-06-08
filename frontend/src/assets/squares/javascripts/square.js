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
        graphics.fillStyle(0x22223f)
        if (this.color === 1) {
            graphics.fillStyle(0xffffff)
        }
        graphics.fillRectShape(this.rect);

        if (this.active) {
            graphics.lineStyle( 2, 0xff5555)
            graphics.lineBetween(this.rect.centerX - 10, this.rect.centerY, this.rect.centerX + 10, this.rect.centerY);
            graphics.lineBetween(this.rect.centerX, this.rect.centerY - 10, this.rect.centerX, this.rect.centerY + 10);
        }
    }

    hit(x,y) {
        if ( this.invisible || this.inactive) return false
        this.active = this.rect.contains(x,y)
        if (this.active) {
            console.log(this.rect)
        }
        return this.active
    }
}