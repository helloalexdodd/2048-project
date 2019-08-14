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
	blankGrid: function() {
		return [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	},
	flipped: false,
	rotated: false
}

app.manageKeyDown = () => {
	document.onkeydown = (e) => {
		let played = true
		switch (e.keyCode) {
			case app.rightArrow: // don't change the direction of the board
			case app.dKey:
				break;
			case app.leftArrow: // flip the board
			case app.aKey:
				app.grid = app.flipGrid()
				break;
			case app.downArrow: // rotate the board
			case app.sKey:
				app.grid = app.rotateGrid()
				break
			case app.upArrow: // rotate and flip the board
			case app.wKey:
				app.grid = app.rotateGrid()
				app.grid = app.flipGrid()
				break;
			default: // no moves have been made
				played = false
		}

		if (played) {
			const newGrid = app.copyGrid(app.grid)

			app.grid.forEach((row, i) => {
				app.grid[i] = app.operate(row)
			})

			app.flipped ? app.grid = app.flipGrid() : null
			app.rotated ? app.grid = app.rotateGrid() : null

			const hasChanged = app.compare(newGrid)
			if (hasChanged) {
				app.flipped = false
				app.rotated = false
				app.addNumber()
				console.clear()
				console.table(app.grid)
			}

			app.isGameWon()
			app.isGameOver()
		}
	}
}

// maybe combined with transpose into one function
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

app.copyGrid = (grid) => {
	const newGrid = app.blankGrid();
	app.grid.forEach((row, i) => {
		row.forEach((cell, j) => {
			newGrid[i][j] = grid[i][j]
		})
	})
	return newGrid
}

// maybe refactored into new second half of event listener function
app.operate = (row) => {
	row = app.slideRow(row)
	row = app.combineRow(row)
	row = app.slideRow(row)
	return row
}

app.compare = (newGrid) => {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (newGrid[i][j] !== app.grid[i][j]) {
				return true
			}
		}
	}
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

app.init = () => {
	app.grid = app.blankGrid()
	app.addNumber()
	app.addNumber()
	console.table(app.grid)
	app.manageKeyDown()
}

document.addEventListener("DOMContentLoaded", () => {
	app.init()
})