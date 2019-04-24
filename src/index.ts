enum Tile {
  None = 'none',
  Wall = 'wall',
  _Dot = 'dot',
}

interface Coord {
  i: number
  j: number
}

function add (a: Coord, b: Coord): Coord {
  return { i: a.i + b.i, j: a.j + b.j }
}

function eq (a: Coord, b: Coord): boolean {
  return a.i == b.i && a.j == b.j
}

interface State {
  matrix: Array<Array<Tile>>
  player: Coord
  boxes: Array<Coord>
}

const MATRIX: State['matrix'] = [
  [Tile.None, Tile.None, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.None],
  [Tile.Wall, Tile.Wall, Tile.Wall, Tile.None, Tile.None, Tile.None, Tile.Wall, Tile.None],
  [Tile.Wall, Tile._Dot, Tile.None, Tile.None, Tile.None, Tile.None, Tile.Wall, Tile.None],
  [Tile.Wall, Tile.Wall, Tile.Wall, Tile.None, Tile.None, Tile._Dot, Tile.Wall, Tile.None],
  [Tile.Wall, Tile._Dot, Tile.Wall, Tile.Wall, Tile.None, Tile.None, Tile.Wall, Tile.None],
  [Tile.Wall, Tile.None, Tile.Wall, Tile.None, Tile._Dot, Tile.None, Tile.Wall, Tile.Wall],
  [Tile.Wall, Tile.None, Tile.None, Tile._Dot, Tile.None, Tile.None, Tile._Dot, Tile.Wall],
  [Tile.Wall, Tile.None, Tile.None, Tile.None, Tile._Dot, Tile.None, Tile.None, Tile.Wall],
  [Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall, Tile.Wall],
]

const BOXES: State['boxes'] = [
  { i: 2, j: 3 },
  { i: 3, j: 4 },
  { i: 4, j: 4 },
  { i: 6, j: 4 },
  { i: 6, j: 3 },
  { i: 6, j: 1 },
  { i: 6, j: 5 },
]

class Game {

  private state: State

  constructor () {
    this.state = {
      matrix: MATRIX,
      boxes: BOXES,
      player: { i: 2, j: 2 },
    }
    console.log(this.state)
  }

  private move (direction: Coord) {
    const source = this.state.player
    const destination = add(source, direction)

    const isOutOfBoundsI = destination.i < 0 || destination.i > this.state.matrix.length - 1
    const isOutOfBoundsJ = destination.j < 0 || destination.j > this.state.matrix[0].length - 1
    if (isOutOfBoundsI || isOutOfBoundsJ) return

    const destinationTile = this.state.matrix[destination.i][destination.j]

    const isDestinationWall = destinationTile == Tile.Wall
    if (isDestinationWall) return

    const box = this.state.boxes.find(coord => eq(coord, destination))

    if (box != null) {
      const destination2 = add(destination, direction)
      const destination2Tile = this.state.matrix[destination2.i][destination2.j]
      const isDestination2Box = this.state.boxes.some(coord => eq(coord, destination2))
      const isDestination2Wall = destination2Tile == Tile.Wall

      if (isDestination2Box || isDestination2Wall) {
        return
      }

      const newBox = add(box, direction)
      box.i = newBox.i
      box.j = newBox.j
    }

    this.state.player = destination

    this.render()
    if (this.isGameOver()) {
      setTimeout(() => alert('BRA\'O'))
    }
  }

  private isGameOver (): boolean {
    return this.state.boxes.every(box => {
      return this.state.matrix[box.i][box.j] == Tile._Dot
    })
  }

  public moveUp () {
    this.move({ i: -1, j: 0 })
  }

  public moveDown () {
    this.move({ i: 1, j: 0 })
  }

  public moveLeft () {
    this.move({ i: 0, j: -1 })
  }

  public moveRight () {
    this.move({ i: 0, j: 1 })
  }

  public render () {
    const root = document.getElementById('root')
    if (root == null) throw new Error(`Missing #root element.`)
    root.innerHTML = ''

    const board = document.createElement('div')
    board.classList.add('board')

    for (let i = 0; i < this.state.matrix.length; i++) {
      const row = this.state.matrix[i]
      for (let j = 0; j < row.length; j++) {
        const tile = row[j]
        const isBox = this.state.boxes.find(coord => eq(coord, { i, j })) != null
        const isPlayer = eq(this.state.player, { i, j })
        const tileElm = this.createTile(tile, isBox, isPlayer)
        board.append(tileElm)
      }
    }
    root.append(board)
  }

  private createTile (tile: Tile, isBox: boolean, isPlayer: boolean) {
    const elm = document.createElement('div')
    elm.classList.add('tile', tile.toString())
    if (isBox) elm.classList.add('box')
    if (isPlayer) elm.classList.add('player')
    return elm
  }

}

const game = new Game()
game.render()

document.addEventListener('keyup', event => {
  if (event.code == 'ArrowLeft') {
    game.moveLeft()
  }
  if (event.code == 'ArrowRight') {
    game.moveRight()
  }
  if (event.code == 'ArrowUp') {
    game.moveUp()
  }
  if (event.code == 'ArrowDown') {
    game.moveDown()
  }
})
