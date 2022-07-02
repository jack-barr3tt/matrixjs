export default class Matrix {
	public rows: number
	public columns: number
	private data: number[][] = []

	constructor(rows: number, columns: number) {
		this.rows = rows
		this.columns = columns
		this.data = new Array(rows).fill(new Array(columns).fill(0))
	}

	private checkRef(ref: [number, number]) {
		if (ref[0] < 0 || ref[1] < 0 || ref[0] >= this.rows || ref[1] >= this.columns) {
			throw new Error("Reference is out of bounds of matrix")
		}
	}

	public get(ref: [number, number]) {
		this.checkRef(ref)

		return this.data[ref[0]][ref[1]]
	}

	public equals(data: number[][]): boolean {
		if (data.length != this.rows) return false
		if (Math.max(...data.map((r) => r.length)) != Math.min(...data.map((r) => r.length)))
			return false
		if (data[0].length != this.columns) return false

		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				if (this.get([r, c]) != data[r][c]) return false
			}
		}

		return true
	}

	public equalsMat(matrix: Matrix) {
		if (this.rows != matrix.rows) return false
		if (this.columns != matrix.columns) return false

		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				if (this.get([r, c]) != matrix.get([r, c])) return false
			}
		}

		return true
	}

	public setItem(ref: [number, number], value: number) {
		this.checkRef(ref)

		let temp = [...this.data[ref[0]]]
		temp[ref[1]] = value

		this.data[ref[0]] = temp

		return this
	}

	public set(data: number[][]) {
		for (let r = 0; r < data.length; r++) {
			for (let c = 0; c < data[r].length; c++) {
				this.setItem([r, c], data[r][c])
			}
		}

		return this
	}

	public getMinor(ref: [number, number]) {
		return new Matrix(this.rows - 1, this.columns - 1).set(
			this.data.filter((_, ri) => ri != ref[0]).map((r) => r.filter((_, ci) => ci != ref[1]))
		)
	}

	get det() {
		if (this.rows != this.columns) {
			throw new Error("Cannot find determinant of this matrix")
		}
        if(this.rows == 1) return this.get([0,0])
		if (this.rows == 2) {
			return this.get([0, 0]) * this.get([1, 1]) - this.get([0, 1]) * this.get([1, 0])
		}
		let det = 0
		for (let i = 0; i < this.columns; i++) {
			det += Math.pow(-1, i) * this.get([0, i]) * this.getMinor([0, i]).det
		}
		return det
	}

	public scale(scalar: number) {
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				this.setItem([r, c], this.get([r, c]) * scalar)
			}
		}

		return this
	}

	public add(matrix: Matrix) {
		if (this.rows != matrix.rows || this.columns != matrix.columns) {
			throw new Error("Matricies must be the same size to add them")
		}

		let temp = new Matrix(this.rows, this.columns)

		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				temp.setItem([r, c], this.get([r, c]) + matrix.get([r, c]))
			}
		}

		return temp
	}

	public subtract(matrix: Matrix) {
		return this.add(matrix.scale(-1))
	}

	private pairMultiply(matrix1: Matrix, matrix2: Matrix, mat1row: number, mat2colum: number) {
		let temp = 0
		for (let r = 0; r < matrix1.columns; r++) {
			temp += matrix1.get([mat1row, r]) * matrix2.get([r, mat2colum])
		}
		return temp
	}

	public multiply(matrix: Matrix) {
		if (this.columns != matrix.rows) {
			throw new Error("Matricies must be multiplicatively comfortable")
		}

		let temp = new Matrix(this.rows, matrix.columns)

		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < matrix.columns; c++) {
				temp.setItem([r, c], this.pairMultiply(this, matrix, r, c))
			}
		}

		return temp
	}

    public get inverse() {
        if(this.det == 0) {
            throw new Error("Cannot inverse a singular matrix")
        }

        const result = new Matrix(this.rows, this.columns)
        for(let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.columns; c++) {
                result.setItem([c,r], this.getMinor([r,c]).det * Math.pow(-1,c) * Math.pow(-1, r))
            }
        }

        return result.scale(1 / this.det)
    }
}
