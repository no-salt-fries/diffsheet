export interface workBookMetaDataType {
  workbookId: string | null;
  sheetName: string | null;
}

export interface keyDataTypeType {
  type: string | null;
  format: string | null;
}

export interface selectedCellType {
  rowIndex: string | null;
  columnIndex: string | null;
  value: string | null;
  headerTitle: string | null;
}

export interface optionSelectedCellType extends selectedCellType {
  type: string | null;
}

export interface workbookDataType {
  meta: workBookMetaDataType;
  key: {
    type: keyDataTypeType;
    start: selectedCellType;
    end: selectedCellType;
  };
  value: {
    1: optionSelectedCellType;
    2: optionSelectedCellType;
  };
}

export interface workbookRefDataType {
  fix: workbookDataType;
  comp: workbookDataType;
}

export const workbookInitial = (): workbookDataType => ({
  meta: { workbookId: null, sheetName: null },
  key: {
    type: {
      type: null,
      format: null,
    },
    start: {
      rowIndex: null,
      columnIndex: null,
      value: null,
      headerTitle: null,
    },
    end: {
      rowIndex: null,
      columnIndex: null,
      value: null,
      headerTitle: null,
    },
  },
  value: {
    1: {
      rowIndex: null,
      columnIndex: null,
      value: null,
      headerTitle: null,
      type: null,
    },
    2: {
      rowIndex: null,
      columnIndex: null,
      value: null,
      headerTitle: null,
      type: null,
    },
  },
});
