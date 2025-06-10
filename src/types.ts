/* type for selected data */

export interface metaType {
  workbookId: string | null;
  sheetName: string | null;
}

export interface cellType {
  cell: string | null;
  value: string | null;
}

export interface selectedDataType {
  meta: metaType;
  key: { start: cellType; end: cellType };
  value: cellType[];
}

export interface workbookDataType {
  fix: selectedDataType;
  comp: selectedDataType;
}
