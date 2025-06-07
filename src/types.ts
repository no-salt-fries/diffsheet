/* type for selected data */

export interface metaType {
  workbookId: string;
  sheetName: string;
}

export interface cellType {
  cell: string;
  value: string;
}

export interface selectedDataType {
  meta: metaType;
  key: cellType;
  value: cellType[];
}

export interface workbookDataType {
  fix: selectedDataType;
  comp: selectedDataType;
}
