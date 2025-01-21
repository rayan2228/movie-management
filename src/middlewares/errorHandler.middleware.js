import ApiError from "../utils/ApiError.js";

const errorHandler = (err, _, res, next) => {
    // Handle ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            status: err.status,
            message: err.message,
            data: err.data,
        });
    }

    // Handle unexpected errors (non-ApiError)
    return res.status(500).json({
        statusCode: err.statusCode || 500,
        status: err.status || "fail",
        message: err.message || 'Internal Server Error',
        data: null,
    });
};

export default errorHandler;