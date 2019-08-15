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
	flipped: false,
	rotated: false,
	winner: false,
	canvas: document.querySelector(`canvas`),
	context: this.canvas.getContext(`2d`),
	blankGrid: function () {
		return [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	},
	colours: [`#f2edd7`, `#fc766a`, `#de4d44`, `#9e3744`, `#c83e74`, `#ff842a`, `#fed65e`, `#3b3a50`, `#2e5d9f`, `#616247`, `#d7c49e`, `#ff842a`, `#9e3744`, `#c83e74`, `#d7c49e`]
}

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
	app.grid.forEach(row => row.forEach(cell => {
		if (cell === 2048) { 
			!confirm(`Winner! Want to keep playing?`) ? window.location.reload() : app.winner = true;
		} 
	}))
}

app.copyGrid = () => {
	const newGrid = app.blankGrid();
	app.grid.forEach((row, i) => {
		row.forEach((cell, j) => {
			newGrid[i][j] = app.grid[i][j]
		})
	})
	return newGrid
}

app.compare = (newGrid) => {
	newGrid.forEach((row, i) => row.forEach((cell, j) => {
		if (newGrid[i][j] !== cell) {
			return true
		}
	}))
	return false
}

app.slideRow = (row) => {
	const numbers = row.filter(value => value)
	const zeros = app.size - numbers.length
	const newZeros = Array(zeros).fill(0)
	const newArray = newZeros.concat(numbers)
	return newArray
}

app.combineRow = (row) => {
	for (let i = 4; i >= 1; i--) {
		const firstPosition = row[i]
		const secondPosition = row[i - 1]
		if (firstPosition === secondPosition) {
			row[i] = firstPosition + secondPosition
			row[i - 1] = 0;
		}
	}
	return row
}

// maybe refactored into new second half of event listener function
app.operate = (row) => {
	row = app.slideRow(row)
	row = app.combineRow(row)
	row = app.slideRow(row)
	return row
}

app.rotateGrid = () => {
	const newGrid = app.blankGrid()
	app.grid.forEach((row, i) => row.forEach((cell, j) => {
		if (!app.rotated) {
			newGrid[i][j] = cell
			app.rotated = true
		} else {
			newGrid[j][i] = cell
		}
	}))
	return newGrid
}

app.flipGrid = () => {
	app.grid.forEach(row => {
		row.reverse()
		app.flipped = true;
	})
	return app.grid
}

app.fillText = () => {
	app.context.font = `60px Arial`;
	app.context.fillStyle = `black`;
	app.context.textAlign = `center`;
	app.grid.forEach((row, i) => row.forEach((cell, j) => {
		cell !== 0 ? app.context.fillText(cell, i * 150 + 75, j * 150 + 100) : null
	}))
}

app.drawGrid = () => {
	app.context.beginPath()
	app.context.lineWidth = 2
	for (let i = 0; i < app.size; i++) {
		app.context.moveTo(i * 150, 0)
		app.context.lineTo(i * 150, 600)	
	}
	for (let i = 0; i < app.size; i++) {
		app.context.moveTo(0, i * 150)
		app.context.lineTo(600, i * 150)
	}
	app.context.stroke()
}

app.fillGrid = () => {
	app.grid.forEach((row, i) => row.forEach((cell, j) => {
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
		app.context.fillRect(i * 150, j * 150, 150, 150)
	}))
}

app.displayNewGrid = () => {	
	app.clearBoard()
	app.drawBoard()
	!app.winner ? app.isGameWon() : null
	app.isGameOver()
}

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

app.operateOnGrid = () => {
	// the order of these lines super matters
	const newGrid = app.copyGrid()

	app.grid.forEach((row, i) => {
		app.grid[i] = app.operate(row)
	})

	const hasChanged = app.compare(newGrid)

	app.repositionGrid()

	hasChanged ? app.displayNewGrid() : null
}

app.positionGrid = () => {
	document.onkeydown = (e) => {
		let played = true
		switch (e.keyCode) {
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
}

app.addNumber = () => {
	const zeroLocations = [];
	app.grid.map((row, i) => {
		return row.reduce((acc, cur, j) => {
			row[j] === 0 ? acc.push({ x: i, y: j }) : null
			return acc
		}, zeroLocations)
	})

	if (zeroLocations.length > 0) {
		const spot = zeroLocations[Math.floor(Math.random() * zeroLocations.length)]
		app.grid[spot.x][spot.y] = Math.floor(Math.random()) <= 0.1 ? 2 : 4
	}
}

app.drawBoard = () => {
	app.addNumber()
	app.fillGrid()
	app.drawGrid()
	app.fillText()
}

app.clearBoard = () => {
	app.context.clearRect(0, 0, 800, 800);
}

app.init = () => {
	app.grid = app.blankGrid()
	app.addNumber()
	app.drawBoard()
	app.positionGrid()
}

document.addEventListener("DOMContentLoaded", () => {
	app.init()
})