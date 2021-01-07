import { Changeset } from "../changeset"

test("Constructs with given options", () => {
  const changeset = new Changeset({
    originals: { test: "original" },
    changes: { test: "change" },
    errors: { nonNull: [{ message: "Can't be blank" }] },
  })

  expect(changeset.getOriginals()).toStrictEqual({ test: "original" })
  expect(changeset.getChanges()).toStrictEqual({ test: "change" })
  expect(changeset.getAllErrors()).toStrictEqual({
    nonNull: [{ message: "Can't be blank" }],
  })
})
