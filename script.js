app = {
	size: 4,
	rightArrow: 39,
	leftArrow: 37,
	upArrow: 38,
	downArrow: 40,
	dKey: 68,
	aKey: 65,
	wKey: 87,
	sKey: 83,
	swipeDirection: 0,
	flipped: false,
	rotated: false,
	winner: false,
	canvas: document.querySelector(`canvas`),
	context: this.canvas.getContext(`2d`),
	score: 0,
	blankGrid: function () {
		return [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	},
	colours: [`#f2edd7`, `#fc766a`, `#de4d44`, `#9e3744`, `#c83e74`, `#ff842a`, `#fed65e`, `#3b3a50`, `#2e5d9f`, `#616247`, `#d7c49e`, `#ffdf00`, `#2e5d9f`, `#c0c0c0`, `#fff`]
}

// game ending methods
app.isGameOver = () => {
	for (let i = 0; i < app.size; i++) {
		for (let j = 0; j < app.size; j++) {
			if (app.grid[i][j] === 0) {
				return false
			}
			if (j !== 3 && app.grid[i][j] === app.grid[i][j + 1]) {
				return false
			}
			if (i !== 3 && app.grid[i][j] === app.grid[i + 1][j]) {
				return false
			}
		}
	}
	!alert('Game Over!') ? window.location.reload() : null
}

app.isGameWon = () => {
	app.grid.forEach(col => col.forEach(cell => {
		if (cell === 2048 && !app.winner) { 
			!confirm(`Winner! Want to keep playing?`) ? window.location.reload() : app.winner = true
		} else if (cell === 32768) {
			!alert(`We get it, you're good. But I'm sorry - you broke 2048.`) ? window.location.reload() : null
		}
	}))
}

// grid operation methods
app.copyGrid = () => {
	const newGrid = app.blankGrid();
	app.grid.forEach((col, i) => {
		col.forEach((cell, j) => {
			newGrid[i][j] = app.grid[i][j]
		})
	})
	return newGrid
}

app.compare = (newGrid) => {
	for (let i = 0; i < app.size; i++) {
		for (let j = 0; j < app.size; j++) {
			if (newGrid[i][j] !== app.grid[i][j]) {
				return true
			}
		}
	}
	return false
}

app.slideCol = (col) => {
	const numbers = col.filter(value => value)
	const zeros = app.size - numbers.length
	const newZeros = Array(zeros).fill(0)
	const newArray = newZeros.concat(numbers)
	return newArray
}

app.combineCol = (col) => {
	let score = 0
	for (let i = 4; i >= 1; i--) {
		const firstPosition = col[i]
		const secondPosition = col[i - 1]
		if (firstPosition === secondPosition) {
			col[i] = firstPosition + secondPosition
			col[i - 1] = 0;
			score += col[i]
		}
	}
	app.score = app.score + score
	return col
}

app.operate = (col) => {
	col = app.slideCol(col)
	col = app.combineCol(col)
	col = app.slideCol(col)
	return col
}

app.operateOnGrid = () => {
	const newGrid = app.copyGrid()

	app.grid.forEach((col, i) => {
		app.grid[i] = app.operate(col)
	})

	const hasChanged = app.compare(newGrid)

	app.repositionGrid()

	if (hasChanged) {
		app.addScore()
		app.displayNewGrid()
		app.isGameWon()
		app.isGameOver()
	}
}

// board positioning methods
app.repositionGrid = () => {
	if (app.flipped) {
		app.grid = app.flipGrid()
		app.flipped = false
	}

	if (app.rotated) {
		app.grid = app.rotateGrid()
		app.rotated = false
	}
}

app.flipGrid = () => {
	app.grid.forEach(col => {
		col.reverse()
		app.flipped = true;
	})
	return app.grid
}

app.rotateGrid = () => {
	const newGrid = app.blankGrid()
	app.grid.forEach((col, i) => col.forEach((cell, j) => {
		if (!app.rotated) {
			newGrid[i][j] = cell
			app.rotated = true
		} else {
			newGrid[j][i] = cell
		}
	}))
	return newGrid
}

app.positionGrid = (e) => {
	let played = true
	switch (app.swipeDirection || e.keyCode) {
		case app.downArrow: // don't change the direction of the board
		case app.sKey:
			break;
		case app.upArrow: // flip the board
		case app.wKey:
			app.grid = app.flipGrid()
			break;
		case app.rightArrow: // rotate the board
		case app.dKey:
			app.grid = app.rotateGrid()
			break
		case app.leftArrow: // rotate and flip the board
		case app.aKey:
			app.grid = app.rotateGrid()
			app.grid = app.flipGrid()
			break;
		default: // no moves have been made
			played = false
	}
	played ? app.operateOnGrid() : null
}

app.detectSwipe = () => {
	const swipe = {}
	swipe.startX = 0
	swipe.startY = 0
	swipe.endX = 0
	swipe.endY = 0
	const minX = 60
	const maxX = 80
	const minY = 60
	const maxY = 80
	const body = document.getElementById(`body`)

	body.addEventListener(`touchstart`, (e) => {
		swipe.startX = e.touches[0].screenX
		swipe.startY = e.touches[0].screenY
	})

	body.addEventListener(`touchmove`, (e) => {
		swipe.endX = e.touches[0].screenX
		swipe.endY = e.touches[0].screenY
	})

	body.addEventListener(`touchend`, () => {
		//horizontal detection
		if ((((swipe.endX - minX > swipe.startX) || 
					(swipe.endX + minX < swipe.startX)) && 
					((swipe.endY < swipe.startY + maxY) &&  
					(swipe.startY > swipe.endY - maxY) && 
					(swipe.endX > 0)))) {
			swipe.endX > swipe.startX ? app.swipeDirection = 39 : app.swipeDirection = 37
		}

		else if ((((swipe.endY - minY > swipe.startY) ||
							(swipe.endY + minY < swipe.startY)) &&
							((swipe.endX < swipe.startX + maxX) &&
							(swipe.startX > swipe.endX - maxX) &&
							(swipe.endY > 0)))) {
			swipe.endY > swipe.startY ? app.swipeDirection = 40 : app.swipeDirection = 38
		}

		app.swipeDirection ? app.positionGrid() : null
		app.swipeDirection = 0
		swipe.startX = 0
		swipe.startY = 0
		swipe.endX = 0
		swipe.endY = 0
	})
}

// add score method
app.addScore = () => {
	const score = document.getElementById('score')
	const scoreText = score.textContent
	score.textContent = scoreText.replace(scoreText, `${app.score}`)
}

// add new number method
app.addNumber = () => {
	zeroLocations = [];
	app.grid.map((col, i) => {
		return col.reduce((acc, cur, j) => {
			col[j] === 0 ? acc.push({ x: i, y: j }) : null
			return acc
		}, zeroLocations)
	})

	if (zeroLocations.length) {
		const spot = zeroLocations[Math.floor(Math.random() * zeroLocations.length)]
		let newNumber = app.grid[spot.x][spot.y] = Math.floor(Math.random()) <= 0.1 ? 2 : 4;
	}
}

// board drawing methods
app.fillGrid = () => {
	app.grid.forEach((col, i) => col.forEach((cell, j) => {
		switch (cell) {
			case 0: app.context.fillStyle = `${app.colours[0]}`; break;
			case 2: app.context.fillStyle = `${app.colours[1]}`; break;
			case 4: app.context.fillStyle = `${app.colours[2]}`; break;
			case 8: app.context.fillStyle = `${app.colours[3]}`; break;
			case 16: app.context.fillStyle = `${app.colours[4]}`; break;
			case 32: app.context.fillStyle = `${app.colours[5]}`; break;
			case 64: app.context.fillStyle = `${app.colours[6]}`; break;
			case 128: app.context.fillStyle = `${app.colours[7]}`; break;
			case 256: app.context.fillStyle = `${app.colours[8]}`; break;
			case 512: app.context.fillStyle = `${app.colours[9]}`; break;
			case 1024: app.context.fillStyle = `${app.colours[10]}`; break;
			case 2048: app.context.fillStyle = `${app.colours[11]}`; break;
			case 4096: app.context.fillStyle = `${app.colours[12]}`; break;
			case 8192: app.context.fillStyle = `${app.colours[13]}`; break;
			case 16384: app.context.fillStyle = `${app.colours[14]}`; break;
		}
		app.context.fillRect(i * 100, j * 100, 100, 100)
	}))
}

app.drawGrid = () => {
	app.context.beginPath()
	app.context.lineWidth = 2
	for (let i = 0; i < app.size; i++) {
		app.context.moveTo(i * 100, 0)
		app.context.lineTo(i * 100, 400)
	}
	for (let i = 0; i < app.size; i++) {
		app.context.moveTo(0, i * 100)
		app.context.lineTo(400, i * 100)
	}
	app.context.stroke()
}

app.fillText = () => {
	app.context.font = `40px Concert One, cursive`;
	app.context.fillStyle = `black`;
	app.context.textAlign = `center`;
	app.grid.forEach((col, i) => col.forEach((cell, j) => {
		cell !== 0 ? app.context.fillText(cell, i * 100 + 50, j * 100 + 62.5) : null
	}))
}

app.clearBoard = () => {
	app.context.clearRect(0, 0, 400, 400);
}

app.drawBoard = () => {
	app.addNumber()
	app.fillGrid()
	app.drawGrid()
	app.fillText()
}

app.displayNewGrid = () => {
	app.clearBoard()
	app.drawBoard()
}

// initial page loaded methods
app.init = () => {
	app.grid = app.blankGrid()
	app.addNumber()
	app.drawBoard()
	document.onkeydown = (e) => app.positionGrid(e)
	app.detectSwipe()
}

document.addEventListener("DOMContentLoaded", () => {
	app.init()
})