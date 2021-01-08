import { Changeset } from "../changeset"

describe("constructor", () => {
  test("creates a valid changeset with given options", () => {
    const changeset = new Changeset({
      originals: { test: "original" },
      changes: { test: "change" },
      errors: { test: [{ message: "Error" }] },
    })

    expect(changeset.getOriginals()).toStrictEqual({ test: "original" })
    expect(changeset.getChanges()).toStrictEqual({ test: "change" })
    expect(changeset.getAllErrors()).toStrictEqual({
      test: [{ message: "Error" }],
    })
  })

  test("throws error when originals is badly formatted", () => {
    function cs(originals: any) {
      return () => {
        new Changeset({ originals })
      }
    }

    expect(cs("bad")).toThrow("must be an object")
    expect(cs(123)).toThrow("must be an object")
    expect(cs(true)).toThrow("must be an object")
    expect(cs([])).toThrow("can't be an array")
  })

  test("throws error when changes is badly formatted", () => {
    function cs(changes: any) {
      return () => {
        new Changeset({ changes })
      }
    }

    expect(cs("bad")).toThrow("must be an object")
    expect(cs(123)).toThrow("must be an object")
    expect(cs(true)).toThrow("must be an object")
    expect(cs([])).toThrow("can't be an array")
  })

  test("throws error when errors is badly formatted", () => {
    function cs(errors: any) {
      return () => {
        new Changeset({ errors })
      }
    }

    expect(cs("bad")).toThrow("must be an object")
    expect(cs(123)).toThrow("must be an object")
    expect(cs(true)).toThrow("must be an object")
    expect(cs([])).toThrow("can't be an array")
    expect(cs({ x: "bad" })).toThrow("must be an array")
    expect(cs({ x: 123 })).toThrow("must be an array")
    expect(cs({ x: {} })).toThrow("must be an array")
    expect(cs({ x: [{}] })).toThrow("must have a message property")
    expect(cs({ x: [{ message: true }] })).toThrow("message must be a string")
    expect(cs({ x: [{ message: 1 }] })).toThrow("message must be a string")
  })
})

describe("getValue()", () => {
  test("prioritises change over original", () => {
    const changeset = new Changeset({
      originals: { test: 12 },
      changes: { test: 53 },
    })

    expect(changeset.getValue("test")).toEqual(53)
    changeset.setChange("test", null)
    expect(changeset.getValue("test")).toEqual(null)
    changeset.setChange("test", undefined)
    expect(changeset.getValue("test")).toEqual(undefined)
  })

  test("returns original when change isn't provided", () => {
    const changeset = new Changeset({ originals: { test: 12 } })
    expect(changeset.getValue("test")).toEqual(12)
  })

  test("returns undefined if neither change or original is provided", () => {
    const changeset = new Changeset()
    expect(changeset.getValue("test")).toEqual(undefined)
  })
})

describe("getValues()", () => {
  test("combines originals and changes, prioritising changes", () => {
    const changeset = new Changeset({
      originals: { original: "original", merged: "original" },
      changes: { change: "change", merged: "change" },
    })

    expect(changeset.getValues()).toStrictEqual({
      original: "original",
      change: "change",
      merged: "change",
    })
  })
})

describe("getOriginals()", () => {
  test("returns a copy of originals", () => {
    const changeset = new Changeset({ originals: { test: "yes" } })
    const originals = changeset.getOriginals()
    expect(originals).toStrictEqual({ test: "yes" })
    originals.test = "updated"
    expect(changeset.getOriginals()).toStrictEqual({ test: "yes" })
  })
})

describe("getOriginal()", () => {
  test("returns the original with the given field", () => {
    const changeset = new Changeset({ originals: { test: 5 } })
    expect(changeset.getOriginal("test")).toEqual(5)
  })

  test("returns undefined if the given field hasn't been set", () => {
    const changeset = new Changeset()
    expect(changeset.getOriginal("test")).toEqual(undefined)
  })
})

describe("setOriginal()", () => {
  test("updates the original field", () => {
    const changeset = new Changeset({ originals: { test: "original" } })
    changeset.setOriginal("test", "updated")
    changeset.setOriginal("other", "new")

    expect(changeset.getOriginals()).toStrictEqual({
      test: "updated",
      other: "new",
    })
  })
})

describe("setOriginals()", () => {
  test("updates all originals, overriding any existing values", () => {
    const changeset = new Changeset({
      originals: {
        test: "original",
        other: "original",
      },
    })

    changeset.setOriginals({ test: "updated" })
    expect(changeset.getOriginals()).toStrictEqual({ test: "updated" })
  })

  test("throws an error when originals is an invalid type", () => {
    const changeset = new Changeset()

    function upd(originals: any) {
      return () => {
        changeset.setOriginals(originals)
      }
    }

    expect(upd(null)).toThrow("can't be null")
    expect(upd(undefined)).toThrow("must be an object")
    expect(upd("bad")).toThrow("must be an object")
    expect(upd(123)).toThrow("must be an object")
    expect(upd(true)).toThrow("must be an object")
    expect(upd([])).toThrow("can't be an array")
  })
})

describe("hasOriginal()", () => {
  test("true when provided original is set", () => {
    const changeset = new Changeset({ originals: { test: undefined } })
    expect(changeset.hasOriginal("test")).toEqual(true)
  })

  test("false when provided original is not set", () => {
    const changeset = new Changeset()
    expect(changeset.hasOriginal("test")).toEqual(false)
  })
})

describe("getChanges()", () => {
  test("returns a copy of changes", () => {
    const changeset = new Changeset({ changes: { test: "yes" } })
    const changes = changeset.getChanges()
    expect(changes).toStrictEqual({ test: "yes" })
    changes.test = "updated"
    expect(changeset.getChanges()).toStrictEqual({ test: "yes" })
  })
})

describe("getChange()", () => {
  test("returns the change with the given field", () => {
    const changeset = new Changeset({ changes: { test: 5 } })
    expect(changeset.getChange("test")).toEqual(5)
  })

  test("returns undefined if the given field hasn't been set", () => {
    const changeset = new Changeset()
    expect(changeset.getChange("test")).toEqual(undefined)
  })
})

describe("setChange()", () => {
  test("updates the change field", () => {
    const changeset = new Changeset({ changes: { test: "change" } })
    changeset.setChange("test", "updated")
    changeset.setChange("other", "new")

    expect(changeset.getChanges()).toStrictEqual({
      test: "updated",
      other: "new",
    })
  })
})

describe("setChanges()", () => {
  test("updates all changes, overriding any existing values", () => {
    const changeset = new Changeset({
      changes: {
        test: "change",
        other: "change",
      },
    })

    changeset.setChanges({ test: "updated" })
    expect(changeset.getChanges()).toStrictEqual({ test: "updated" })
  })

  test("throws an error when changes is an invalid type", () => {
    const changeset = new Changeset()

    function upd(changes: any) {
      return () => {
        changeset.setChanges(changes)
      }
    }

    expect(upd(null)).toThrow("can't be null")
    expect(upd(undefined)).toThrow("must be an object")
    expect(upd("bad")).toThrow("must be an object")
    expect(upd(123)).toThrow("must be an object")
    expect(upd(true)).toThrow("must be an object")
    expect(upd([])).toThrow("can't be an array")
  })
})

describe("hasChange()", () => {
  test("true when provided change is set", () => {
    const changeset = new Changeset({ changes: { test: undefined } })
    expect(changeset.hasChange("test")).toEqual(true)
  })

  test("false when provided change is not set", () => {
    const changeset = new Changeset()
    expect(changeset.hasChange("test")).toEqual(false)
  })
})

describe("clearChanges()", () => {
  test("removes all changes", () => {
    const changeset = new Changeset({ changes: { a: 1, b: 2 } })
    changeset.clearChanges()
    expect(changeset.getChanges()).toEqual({})
  })
})

describe("getAllErrors()", () => {
  test("returns all errors", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Test Message" }],
      },
    })

    expect(changeset.getAllErrors()).toStrictEqual({
      test: [{ message: "Test Message" }],
    })
  })
})

describe("getErrors()", () => {
  test("returns all field errors", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Error" }],
      },
    })

    expect(changeset.getErrors("test")).toStrictEqual([{ message: "Error" }])
  })

  test("returns an empty array if field doesn't have any errors", () => {
    const changeset = new Changeset()
    expect(changeset.getErrors("test")).toStrictEqual([])
  })
})

describe("setErrors()", () => {
  test("sets a given field's errors", () => {
    const changeset = new Changeset()
    changeset.setErrors("test", [{ message: "Error" }])

    expect(changeset.getAllErrors()).toStrictEqual({
      test: [{ message: "Error" }],
    })
  })

  test("throws an error when errors are badly formatted", () => {
    const changeset = new Changeset()

    function upd(errors: any) {
      return () => {
        changeset.setErrors("test", errors)
      }
    }

    expect(upd("bad")).toThrow("must be an array")
    expect(upd(123)).toThrow("must be an array")
    expect(upd({})).toThrow("must be an array")
    expect(upd([{}])).toThrow("must have a message property")
    expect(upd([{ message: 123 }])).toThrow("message must be a string")
  })
})

describe("setAllErrors()", () => {
  test("sets all errors, overriding any existing errors", () => {
    const changeset = new Changeset({
      errors: {
        existing: [{ message: "Error" }],
      },
    })

    changeset.setAllErrors({
      test: [{ message: "Error" }],
    })

    expect(changeset.getAllErrors()).toStrictEqual({
      test: [{ message: "Error" }],
    })
  })

  test("throws error when badly formatted", () => {
    const changeset = new Changeset()

    function upd(errors: any) {
      return () => {
        changeset.setAllErrors(errors)
      }
    }

    expect(upd("bad")).toThrow("must be an object")
    expect(upd(123)).toThrow("must be an object")
    expect(upd(true)).toThrow("must be an object")
    expect(upd([])).toThrow("can't be an array")
    expect(upd({ x: "bad" })).toThrow("must be an array")
    expect(upd({ x: 123 })).toThrow("must be an array")
    expect(upd({ x: {} })).toThrow("must be an array")
    expect(upd({ x: [{}] })).toThrow("must have a message property")
    expect(upd({ x: [{ message: true }] })).toThrow("message must be a string")
    expect(upd({ x: [{ message: 1 }] })).toThrow("message must be a string")
  })
})

describe("hasErrors()", () => {
  test("true when errors have been set", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Error" }],
      },
    })

    expect(changeset.hasErrors("test")).toEqual(true)
  })

  test("false when errors haven't been set or errors are empty", () => {
    const changeset = new Changeset({
      errors: {
        empty: [],
      },
    })

    expect(changeset.hasErrors("empty")).toEqual(false)
    expect(changeset.hasErrors("none")).toEqual(false)
  })
})

describe("hasAnyErrors()", () => {
  test("true when at least one error is set", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Error" }],
      },
    })

    expect(changeset.hasAnyErrors()).toEqual(true)
  })

  test("false when no errors are set", () => {
    const changeset = new Changeset({
      errors: {
        empty: [],
      },
    })

    expect(changeset.hasAnyErrors()).toEqual(false)
  })
})

describe("clearErrors()", () => {
  test("clears errors for a given field", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Error" }],
      },
    })

    changeset.clearErrors("test")
    expect(changeset.getAllErrors()).toStrictEqual({})
  })
})

describe("clearAllErrors()", () => {
  test("clears all errors", () => {
    const changeset = new Changeset({
      errors: {
        test: [{ message: "Error" }],
        empty: [],
      },
    })

    changeset.clearAllErrors()
    expect(changeset.getAllErrors()).toStrictEqual({})
  })
})
