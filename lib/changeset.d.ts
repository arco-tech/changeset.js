declare type FieldErrors = string[];
export interface Originals {
    [field: string]: any;
}
export interface Changes {
    [field: string]: any;
}
export interface AllFieldErrors {
    [field: string]: FieldErrors;
}
export interface Options {
    changes?: Changes;
    originals?: Originals;
    fieldErrors?: AllFieldErrors;
}
export declare class Changeset {
    private originals;
    private changes;
    private fieldErrors;
    private errorMessage;
    constructor(options: Options);
    getValue(field: string): any;
    getOriginals(): Originals;
    getOriginal(field: string): any;
    setOriginal(field: string, value: any): void;
    hasOriginal(field: string): boolean;
    getChanges(): Changes;
    getChange(field: string): any;
    setChange(field: string, value: any): void;
    hasChange(field: string): boolean;
    getAllFieldErrors(): AllFieldErrors;
    getFieldErrors(field: string): FieldErrors;
    setFieldErrors(field: string, errors: FieldErrors): void;
    setAllFieldErrors(errors: AllFieldErrors): void;
    hasFieldErrors(field: string): boolean;
    getErrorMessage(): string | null;
    setErrorMessage(error: string | null): void;
    hasErrorMessage(): boolean;
    hasError(): boolean;
}
export {};
