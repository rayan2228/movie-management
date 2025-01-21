class ApiResponse {
    constructor(status, data, message) {
        this.statusCode = statusCode || 200
        this.status = "success"
        this.message = message
        this.data = data || null
    }
}

expect default ApiResponse