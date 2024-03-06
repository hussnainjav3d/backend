class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.message = message
        // super(message)
        this.statusCode = statusCode
        this.data = data
        this.success = statusCode < 400
    }
}

export { ApiResponse }