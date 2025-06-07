/* type for selected data */
export interface cellType {
  workbookId: string;
  cell: string;
  value: string;
}

export interface selectedDataType {
  key: cellType;
  value: cellType[];
}

export interface workbookDataType {
  fix: selectedDataType;
  comp: selectedDataType;
}
