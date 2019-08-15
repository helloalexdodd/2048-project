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
	colour: {
		0: `#E4FFBA`,
		2: `#BF7AFF`,
		4: `#9381CC`,
		8: `#81CC85`,
		16: `#329939`
	}
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
	console.log('Game Over!')
}

app.isGameWon = () => {
	app.grid.forEach(row => 
		row.forEach(cell => {
		cell === 2048 ? console.log(`Winner!`) : null
		})
	)
}

app.copyGrid = (grid) => {
	const newGrid = app.blankGrid();
	app.grid.forEach((row, i) => {
		row.forEach((cell, j) => {
			newGrid[i][j] = app.grid[i][j]
		})
	})
	console.log(newGrid, app.grid)
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

app.flipGrid = () => {
	app.grid.forEach(row => {
		row.reverse()
		app.flipped = true;
	})
	return app.grid
}

app.rotateGrid = () => {
	const newGrid = app.blankGrid()
	for (let i = 0; i < app.size; i++) {
		for (let j = 0; j < app.size; j++) {
			if (!app.rotated) {
				newGrid[i][j] = app.grid[j][i]
				app.rotated = true
			} else {
				newGrid[j][i] = app.grid[i][j]
			}
		}
	}
	return newGrid
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

app.clearGrid = () => {
	app.context.clearRect(0, 0, 800, 800);
}

app.fillGrid = () => {
	app.context.font = `64px Arial`;
	app.context.fillStyle = ``;
	app.context.textAlign = `center`;
	for (let i = 0; i < app.size; i++) {
		for (let j = 0; j < app.size; j++) {
			app.context.fillText(app.grid[i][j], i * 200 + 100, j * 200 + 100)
			// app.context.fillStyle = `${app.colour[j]}`
		}
	}
}

app.drawGrid = () => {
	for (let i = 0; i < app.size; i++) {
		for (let j = 0; j < app.size; j++) {
			app.context.strokeRect(i * 200, j * 200, 200, 200)

			// app.context.fillStyle = `${app.colour[j]]}`
		}
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

app.manageKeyDown = () => {
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

		if (played) {
			const newGrid = app.copyGrid()
			console.log(newGrid, app.grid)

			app.grid.forEach((row, i) => {
				app.grid[i] = app.operate(row)
			})

			app.flipped ? app.grid = app.flipGrid() : null
			app.rotated ? app.grid = app.rotateGrid() : null

			const hasChanged = app.compare(newGrid)
			console.log(hasChanged)
			if (hasChanged) {
				app.flipped = false
				app.rotated = false
				app.addNumber()
				app.clearGrid()
				app.drawGrid()
				app.fillGrid()
				// console.clear()
				console.table(app.grid)
			}

			app.isGameWon()
			app.isGameOver()
		}
	}
}

app.init = () => {
	app.grid = app.blankGrid()
	app.addNumber()
	app.addNumber()
	app.drawGrid()
	app.fillGrid()
	console.table(app.grid)
	app.manageKeyDown()
}

document.addEventListener("DOMContentLoaded", () => {
	app.init()
})