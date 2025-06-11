/* type for selected data */

export interface metaType {
  workbookId: string | null;
  sheetName: string | null;
}

export interface cellType {
  cell: string | null;
  value: string | null;
}

export interface valueCellType extends cellType {
  id: number;
}

export interface selectedDataType {
  meta: metaType;
  key: { start: cellType; end: cellType };
  value: valueCellType[];
}

export interface workbookDataType {
  fix: selectedDataType;
  comp: selectedDataType;
}
