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

export type ListenerType = "change"

export interface Listeners {
  change: ChangeListener[]
}

export type ChangeListener =
  (field: string, value: any, changeset: Changeset) => void

export type Listener = (...args: any[]) => any

export interface Options {
  changes?: Changes
  originals?: Originals
  errors?: AllFieldErrors
  errorMessage?: string | null
  onChange?: ChangeListener
}

export class Changeset {
  originals: Originals = {}
  changes: Changes = {}
  errors: AllFieldErrors = {}
  errorMessage: string | null = null
  listeners: Listeners = { change: [] }

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

    if (options.errorMessage) {
      verifyErrorMessage(options.errorMessage)
      this.errorMessage = options.errorMessage
    }

    if (options.onChange) {
      verifyListener(options.onChange)
      this.listeners.change.push(options.onChange)
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
    this.callListeners("change", field, value, this)
  }

  setChanges(changes: Changes): void {
    verifyChanges(changes)
    this.changes = changes

    for (const field of Object.keys(changes)) {
      this.callListeners("change", field, changes[field], this)
    }
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
    this.errorMessage = null
  }

  hasErrorMessage(): boolean {
    return this.errorMessage ? true : false
  }

  getErrorMessage(): string | null {
    return this.errorMessage
  }

  setErrorMessage(errorMessage: string | null): void {
    verifyErrorMessage(errorMessage)
    this.errorMessage = errorMessage
  }

  listen(listenerType: ListenerType, listener: Listener): void {
    verifyListenerType(listenerType)
    verifyListener(listener)
    this.listeners.change.push(listener)
  }

  callListeners(listenerType: ListenerType, ...args: any[]): void {
    this.listeners[listenerType].forEach((listener: any) => {
      try {
        listener(...args)
      } catch (error) {
        // tslint:disable-next-line
        console.error(`Failed to call Changeset listener ${listener}`)
      }
    })
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

function verifyErrorMessage(errorMessage: string | null): void {
  if (typeof errorMessage !== "string" && errorMessage !== null) {
    throw new Error("Changeset errorMessage must be a string or null")
  }
}

function verifyListener(listener: Listener): void {
  if (typeof listener !== "function") {
    throw new Error("Changeset change listener must be a function")
  }
}

function verifyListenerType(listenerType: ListenerType): void {
  const types = ["change"]

  if (types.indexOf(listenerType) === -1) {
    throw new Error(
      "Changeset listener type must be one of: " + types.join(", "),
    )
  }
}
