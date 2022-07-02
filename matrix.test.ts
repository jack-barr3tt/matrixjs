import Matrix from "./matrix"

describe("My matrix", () => {
	it("Is created empty", () => {
		const matrix = new Matrix(2, 2)

		for (let r = 0; r < 2; r++) {
			for (let c = 0; c < 2; c++) {
				expect(matrix.get([r, c])).toBe(0)
			}
		}
	})

	it("Is created with the specified dimensions", () => {
		const matrix1 = new Matrix(3, 2)
		const matrix2 = new Matrix(5, 1)
		const matrix3 = new Matrix(8, 20)

		expect(matrix1.rows).toBe(3)
		expect(matrix1.columns).toBe(2)

		expect(matrix2.rows).toBe(5)
		expect(matrix2.columns).toBe(1)

		expect(matrix3.rows).toBe(8)
		expect(matrix3.columns).toBe(20)
	})

	it("Stores all the values given in the correct place", () => {
		// Firstly, check if all values correctly copied into a 3x3 matrix
		const matrix1 = new Matrix(3, 3)

		const sample1 = [
			[1, -1, 3],
			[2, 0, 2],
			[5, 4, 0],
		]

		matrix1.set(sample1)

		for (let r = 0; r < sample1.length; r++) {
			for (let c = 0; c < sample1[r].length; c++) {
				expect(matrix1.get([r, c])).toBe(sample1[r][c])
			}
		}

		// Now see if a 2x3 matrix can be copied into either a 2x3 or a 3x2
		const matrix2 = new Matrix(2, 3)
		const matrix3 = new Matrix(3, 2)

		const sample2 = [
			[2, 9, -1],
			[3, -7, 4],
		]

		const validSet1 = () => {
			matrix2.set(sample2)
		}
		const invalidSet1 = () => {
			matrix3.set(sample2)
		}

		expect(validSet1).not.toThrowError()
		expect(invalidSet1).toThrowError()

		expect(matrix2.equals(sample2))
	})

	it("Does not allow values outside the matrix to be stored", () => {
		const matrix = new Matrix(2, 2)

		const setNegative = () => {
			matrix.setItem([-1, -2], 6)
		}

		const setTooLarge = () => {
			matrix.setItem([100, 100], 6)
		}

		expect(setNegative).toThrowError("Reference is out of bounds of matrix")
		expect(setTooLarge).toThrowError("Reference is out of bounds of matrix")
	})

	it("Has correct minors", () => {
		const matrix1 = new Matrix(3, 3)
		matrix1.set([
			[1, 3, 1],
			[0, 4, 1],
			[2, -1, 0],
		])

		const minors1 = [
			[
				[
					[4, 1],
					[-1, 0],
				],
				[
					[0, 1],
					[2, 0],
				],
				[
					[0, 4],
					[2, -1],
				],
			],
			[
				[
					[3, 1],
					[-1, 0],
				],
				[
					[1, 1],
					[2, 0],
				],
				[
					[1, 3],
					[2, -1],
				],
			],
			[
				[
					[3, 1],
					[4, 1],
				],
				[
					[1, 1],
					[0, 1],
				],
				[
					[1, 3],
					[0, 4],
				],
			],
		]

		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				expect(matrix1.getMinor([r, c]).equals(minors1[r][c])).toBe(true)
			}
		}
	})

	it("Has a determinant", () => {
		const matrix1 = new Matrix(2, 2)
		matrix1.set([
			[6, 5],
			[1, 2],
		])

		expect(matrix1.det).toBe(7)

		const matrix2 = new Matrix(3, 3)
		matrix2.set([
			[1, 1, 0],
			[1, 2, 2],
			[0, -2, -1],
		])

		expect(matrix2.det).toBe(3)

		const matrix4 = new Matrix(4, 4)
		matrix4.set([
			[5, 8, 9, 1],
			[5, 3, 5, 4],
			[2, 4, 1, 7],
			[7, 2, 6, 1],
		])
		expect(matrix4.det).toBe(-345)
	})

	it("Can be multiplied by a scalar", () => {
		const matrix1 = new Matrix(2, 2)
		matrix1.set([
			[1, 2],
			[-1, 0],
		])

		expect(
			matrix1.scale(2).equals([
				[2, 4],
				[-2, 0],
			])
		).toBe(true)

		const matrix2 = new Matrix(1, 3)
		matrix2.set([[6, 0, -4]])

		expect(matrix2.scale(0.5).equals([[3, 0, -2]])).toBe(true)
	})

	it("Can be added/subtracted to another matrix if they are the same size", () => {
		const matrix1 = new Matrix(2, 2)
		const matrix2 = new Matrix(2, 2)

		const sample1 = [
			[2, -1],
			[0, 3],
		]
		const sample2 = [
			[-1, 4],
			[5, 3],
		]
		const result1 = [
			[1, 3],
			[5, 6],
		]

		matrix1.set(sample1)
		matrix2.set(sample2)

		expect(matrix1.add(matrix2).equals(result1)).toBe(true)
		expect(matrix1.add(matrix2).equalsMat(matrix2.add(matrix1))).toBe(true)

		const matrix3 = new Matrix(2, 3)
		const matrix4 = new Matrix(2, 3)

		const sample3 = [
			[1, -3, 4],
			[2, 1, 1],
		]
		const sample4 = [
			[0, 2, 1],
			[5, 2, 3],
		]
		const result2 = [
			[1, -5, 3],
			[-3, -1, -2],
		]

		matrix3.set(sample3)
		matrix4.set(sample4)

		expect(matrix3.subtract(matrix4).equals(result2)).toBe(true)
		expect(matrix3.subtract(matrix4).equalsMat(matrix4.subtract(matrix3))).toBe(false)
	})

	it("Cannot be added/subtracted to another matrix if they are not the same size", () => {
		const matrix1 = new Matrix(2, 2)
		const matrix2 = new Matrix(2, 2)
		const matrix3 = new Matrix(2, 3)
		const matrix4 = new Matrix(2, 3)

		const sample1 = [
			[2, -1],
			[0, 3],
		]
		const sample2 = [
			[-1, 4],
			[5, 3],
		]
		const sample3 = [
			[1, -3, 4],
			[2, 1, 1],
		]
		const sample4 = [
			[0, 2, 1],
			[5, 2, 3],
		]

		matrix1.set(sample1)
		matrix2.set(sample2)
		matrix3.set(sample3)
		matrix4.set(sample4)

		const validOps = () => {
			matrix1.add(matrix1)
			matrix1.subtract(matrix1)

			matrix1.add(matrix2)
			matrix1.subtract(matrix2)

			matrix3.add(matrix3)
			matrix3.subtract(matrix3)

			matrix3.add(matrix4)
			matrix3.subtract(matrix4)
		}

		const invalidOps = () => {
			matrix1.add(matrix3)
			matrix3.add(matrix1)
		}

		expect(validOps).not.toThrowError()
		expect(invalidOps).toThrowError()
	})

	it("Can be multiplied by another matrix if they are multiplicatively comfortable", () => {
		const matrix1 = new Matrix(2, 3)
		const matrix2 = new Matrix(3, 2)

		const sample1 = [
			[5, -1, 2],
			[8, 3, -4],
		]
		const sample2 = [
			[2, 2],
			[9, -3],
			[7, 4],
		]
		const result = [
			[15, 21],
			[15, -9],
		]

		matrix1.set(sample1)
		matrix2.set(sample2)

		expect(matrix1.multiply(matrix2).equals(result)).toBe(true)
	})

	it("Cannot be multiplied by another matrix if they are not multiplicatively comfortable", () => {
		const matrix1 = new Matrix(2, 2)
		const matrix2 = new Matrix(2, 1)

		const sample1 = [
			[1, -2],
			[3, 4],
		]
		const sample2 = [[-3], [2]]
		matrix1.set(sample1)
		matrix2.set(sample2)

		const validOps = () => {
			matrix1.multiply(matrix2)
		}

		const invalidOps = () => {
			matrix2.multiply(matrix1)
		}

		expect(validOps).not.toThrowError()
		expect(invalidOps).toThrowError()
	})

	it("Has an inverse if determinant is not 0", () => {
		const matrix1 = new Matrix(2, 2)
		const matrix2 = new Matrix(2, 2)
		matrix1.set([
			[3, 2],
			[-1, 1],
		])
		matrix2.set([
			[1, -2],
			[1, 3],
		])

		expect(matrix1.inverse.equalsMat(matrix2.scale(0.2))).toBe(true)

		const matrix3 = new Matrix(3, 3)
		const matrix4 = new Matrix(3, 3)
		matrix3.set([
			[1, 3, 1],
			[0, 4, 1],
			[2, -1, 0],
		])
		matrix4.set([
			[-1, 1, 1],
			[-2, 2, 1],
			[8, -7, -4],
		])

		expect(matrix3.inverse.equalsMat(matrix4)).toBe(true)
	})

	it("Does not have an inverse if determinant is 0", () => {
        const matrix1 = new Matrix(2,2)
        const matrix2 = new Matrix(2,2)

        matrix1.set([
            [3,4],
            [-1,2]
        ])
        matrix2.set([
            [-4, -4],
            [1,1]
        ])

        const matrix3 = new Matrix(3,3)
        const matrix4 = new Matrix(3,3)
        
        matrix3.set([
            [1,0,0],
            [0,2,0],
            [0,0,3]
        ])
        matrix4.set([
            [1,0,1],
            [2,4,1],
            [3,5,2]
        ])

        const validOps = () => {
            matrix1.inverse
            matrix3.inverse
        }

        const invalidOps = () => {
            matrix2.inverse
            matrix4.inverse
        }

        expect(validOps).not.toThrowError()
        expect(invalidOps).toThrowError()
    })
})
