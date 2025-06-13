/* type for selected data */

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
  headerValue: string | null;
}

export interface optionSelectedCellType extends selectedCellType {
  type: string | null;
}

export interface selectedDataType {
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

export interface workbookDataType {
  fix: selectedDataType;
  comp: selectedDataType;
}
