export interface Originals {
  [field: string]: any
}

export interface Changes {
  [field: string]: any
}

export interface FieldError {
  message: string | null | undefined
  [key: string]: any
}

export interface AllFieldErrors {
  [field: string]: FieldError[] | null | undefined
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

  constructor(options: Options = {}) {
    if (options.originals) {
      verifyOriginals(options.originals)
      this.originals = options.originals
    }

    if (options.changes) {
      verifyChanges(options.changes)
      this.changes = options.changes
    }

    if (options.errors) {
      verifyAllErrors(options.errors)
      this.errors = options.errors
    }
  }

  getValue(field: string): any {
    if (this.changes.hasOwnProperty(field)) {
      return this.changes[field]
    } else {
      return this.originals[field]
    }
  }

  getValues(): Originals {
    return { ...this.originals, ...this.changes }
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

  setOriginals(originals: Originals): void {
    verifyOriginals(originals)
    this.originals = originals
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

  setChanges(changes: Changes): void {
    verifyChanges(changes)
    this.changes = changes
  }

  hasChange(field: string): boolean {
    return this.changes.hasOwnProperty(field)
  }

  clearChanges(): void {
    this.changes = {}
  }

  getAllErrors(): AllFieldErrors {
    return { ...this.errors }
  }

  getErrors(field: string): FieldError[] {
    return this.errors[field] || []
  }

  setErrors(field: string, errors: FieldError[]): void {
    verifyErrors(errors)
    this.errors[field] = errors
  }

  setAllErrors(errors: AllFieldErrors): void {
    verifyAllErrors(errors)
    this.errors = errors
  }

  addError(field: string, error: FieldError): void {
    verifyError(error)

    if (!Array.isArray(this.errors[field])) {
      this.errors[field] = []
    }

    ;(this.errors[field] as any).push(error)
  }

  hasErrors(field: string): boolean {
    const errors = this.errors[field]
    return Array.isArray(errors) && errors.length > 0
  }

  hasAnyErrors(): boolean {
    for (const field in this.errors) {
      if (this.hasErrors(field)) {
        return true
      }
    }

    return false
  }

  clearErrors(field: string): void {
    delete this.errors[field]
  }

  clearAllErrors(): void {
    this.errors = {}
  }
}

function verifyOriginals(originals: Originals): void {
  verifyData("originals", originals)
}

function verifyChanges(changes: Changes): void {
  verifyData("changes", changes)
}

function verifyData(dataType: string, data: Originals | Changes): void {
  if (typeof data !== "object") {
    throw new Error(`Changeset ${dataType} must be an object`)
  } else if (data === null) {
    throw new Error(`Changeset ${dataType} can't be null`)
  } else if (data === undefined) {
    throw new Error(`Changeset ${dataType} can't be undefined`)
  } else if (Array.isArray(data)) {
    throw new Error(`Changeset ${dataType} can't be an array`)
  }
}

function verifyAllErrors(allErrors: AllFieldErrors): void {
  if (typeof allErrors !== "object") {
    throw new Error("Changeset errors must be an object")
  } else if (Array.isArray(allErrors)) {
    throw new Error("Changeset errors can't be an array")
  } else {
    for (const field of Object.keys(allErrors)) {
      const errors = allErrors[field]

      if (errors !== null && errors !== undefined) {
        verifyErrors(errors)
      }
    }
  }
}

function verifyErrors(errors: FieldError[]): void {
  if (!Array.isArray(errors)) {
    throw new Error("Changeset field errors must be an array")
  } else {
    errors.forEach(verifyError)
  }
}

function verifyError(error: FieldError): void {
  if (typeof error !== "object") {
    throw new Error("Changeset error must be an object")
  } else if (Array.isArray(error)) {
    throw new Error("Changeset error can't be an array")
  } else if (!error.hasOwnProperty("message")) {
    throw new Error("Changeset error must have a message property")
  } else if (
    typeof error.message !== "string" &&
    error.message !== null &&
    error.message !== undefined
  ) {
    throw new Error("Changeset error message must be a string")
  }
}
