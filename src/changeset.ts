export interface Originals {
  [field: string]: any
}

export interface Changes {
  [field: string]: any
}

export interface FieldError {
  message: string
}

export interface AllFieldErrors {
  [field: string]: FieldError[]
}

export interface Options {
  changes?: Changes
  originals?: Originals
  errors?: AllFieldErrors
}

export class Changeset {
  private originals: Originals = {}
  private changes: Changes = {}
  private errors: AllFieldErrors = {}

  constructor(options: Options) {
    this.originals = options.originals || {}
    this.changes = options.changes || {}
    this.errors = options.errors || {}
  }

  getValue(field: string): any {
    if (this.changes.hasOwnProperty(field)) {
      return this.changes[field]
    } else {
      return this.originals[field]
    }
  }

  getOriginals(): Originals {
    return { ...this.originals }
  }

  getOriginal(field: string): any {
    return this.originals[field]
  }

  setOriginal(field: string, value: any): void {
    this.originals[field] = value
  }

  hasOriginal(field: string): boolean {
    return this.originals.hasOwnProperty(field)
  }

  getChanges(): Changes {
    return { ...this.changes }
  }

  getChange(field: string): any {
    return this.changes[field]
  }

  setChange(field: string, value: any): void {
    this.changes[field] = value
  }

  clearChanges(): void {
    this.changes = {}
  }

  hasChange(field: string): boolean {
    return this.changes.hasOwnProperty(field)
  }

  getAllErrors(): AllFieldErrors {
    return { ...this.errors }
  }

  getErrors(field: string): FieldError[] {
    return this.errors[field]
  }

  setErrors(field: string, errors: FieldError[]): void {
    this.errors[field] = errors
  }

  setAllErrors(errors: AllFieldErrors): void {
    this.errors = errors
  }

  hasErrors(field: string): boolean {
    return Array.isArray(this.errors[field]) && this.errors[field].length > 0
  }

  hasAnyErrors(): boolean {
    for (const field in this.errors) {
      if (this.hasErrors(field)) {
        return true
      }
    }

    return false
  }
}
