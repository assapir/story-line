import { Application } from "express";

export function setSimulateError(app: Application, path: string, error: Error) {
    app.all(path, () => {
        throw error;
    });
}
