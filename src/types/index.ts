export interface CustomRequest extends Express.Request {
    user?: any; // Define the user type as needed
}

export interface CustomResponse extends Express.Response {
    customSend: (data: any) => void; // Example of a custom response method
}

export interface CustomNextFunction extends Express.NextFunction {
    // Define any custom properties or methods for the next function if needed
}