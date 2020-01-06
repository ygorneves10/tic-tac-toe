class Game {
    constructor() {
        this.element = document.getElementById("tic-tac-toe")
        this.state = {
            squares: ['', '', '', '', '', '', '', '', ''],
            players: ['X', 'O'],
            userPlayer: null,
            robot: null,
            currentPlayer: null,
            winner: null
        }
    }

    verifyWin(player) {
        const { squares } = this.state
        const possibilities = [
            "0,1,2",
            "0,3,6",
            "0,4,8",
            "1,4,7",
            "2,5,8",
            "2,4,6",
            "3,4,5",
            "6,7,8"
        ]
        function getIndex(player) {
            return squares.reduce(function (a, e, i) {
                if (e === player) {
                    a.push(i);
                }
                return a;
            }, [])
        }
        function winnerCheck(playerToWin, possibilityWinner = null) {
            const haveWinner = possibilities.some(possibility => {
                const [possibility1, possibility2, possibility3] = possibility.split(",")
                if (playerToWin.includes(possibility1) && playerToWin.includes(possibility2) && playerToWin.includes(possibility3) && playerToWin.length >= 3) {
                    possibilityWinner = possibility
                    return true
                }
            })

            return {
                haveWinner,
                possibilityWinner
            }
        }

        const playerToWin = getIndex(player).toString()
        const { haveWinner, possibilityWinner } = winnerCheck(playerToWin.split(","))

        return haveWinner ? { player, possibilityWinner } : !squares.includes('') ? "V" : null
    }

    finish(winner) {
        const { userPlayer, robot } = this.state
        if (!winner) {
            return
        } else if (winner === "V") {
            alert("Draw")
        } else if (winner.player) {
            if (userPlayer === winner.player) {
                alert("You win!")
            } else if (robot === winner.player) {
                alert("Robot win!")
            }
        }

        this.reset()
    }

    robotPlay() {
        const { robot, squares } = this.state
        const indexes = []
        squares.filter((square, index) => {
            if (!square || square === '') {
                indexes.push(index)
                return
            }
        })
        const index = indexes[Math.floor(Math.random() * indexes.length)]

        setTimeout(() => {
            this.mark(index, robot)
        }, 1000);
    }

    mark(index, mark) {
        const { userPlayer, robot, currentPlayer } = this.state

        if (this.state.squares[index] || currentPlayer && currentPlayer != mark) {
            return
        }

        const nextPlayer = userPlayer === mark ? robot : userPlayer

        this.state.squares[index] = mark
        this.setState({
            currentPlayer: nextPlayer
        })

        const winner = this.verifyWin(mark)

        if (winner) {
            this.finish(winner)
            return
        }

        if (nextPlayer === robot) {
            this.robotPlay()
        }
    }

    setState(state) {
        this.state = { ...this.state, ...state }
        this.update()
    }

    reset() {
        this.state = {
            squares: ['', '', '', '', '', '', '', '', ''],
            players: ['X', 'O'],
            userPlayer: null,
            robot: null,
            currentPlayer: null,
            winner: null
        }

        this.init()
    }

    update() {
        this.element.innerHTML = this.render()
    }

    init() {
        const { players } = this.state
        const userPlayer = players[Math.floor(Math.random() * players.length)]
        const robot = userPlayer === players[0] ? players[1] : players[0]

        this.setState({
            userPlayer,
            robot
        })
    }

    render() {
        const { squares, userPlayer } = this.state

        return `
            ${
            squares.map((square, index) => {
                return `
                    <div class="square" onclick="tictactoe.mark(${index}, '${userPlayer}')"><span>${square}</span></div>
                `
            }).join('')
            }
            `
    }
}

const tictactoe = new Game()

tictactoe.init()