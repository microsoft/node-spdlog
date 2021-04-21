/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

export const version: number;
export function setFlushEvery(seconds: number);
export function setLevel(level: number);
export function shutdown();
export function createAsyncRotatingLoggerAsync(name: string, filename: string, filesize: number, filecount: number): Promise<RotatingLogger>;

export class Logger {
    constructor(loggerType: "rotating" | "rotating_async" | "stdout", name: string, filename: string, filesize: number, filecount: number);

    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    critical(message: string): void;
    setLevel(level: number): void;
    clearFormatters(): void;
    /**
     * A synchronous operation to flush the contents into file
    */
    flush(): void;
    drop(): void;
}