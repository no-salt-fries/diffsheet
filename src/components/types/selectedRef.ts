type KeyField = "key_start" | "key_end";
type ValueField = 1 | 2;

export type selectRefType =
  | { type: "fix" | "comp"; keyField: KeyField; valueField?: never }
  | { type: "fix" | "comp"; keyField?: never; valueField: ValueField }
  | { type: null; keyField?: never; valueField?: never };

export const selectedRefInitial = (): selectRefType => ({
  type: null,
});
