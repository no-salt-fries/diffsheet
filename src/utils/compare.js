import { parse } from "date-fns";

/**
 * 문자열을 받아서 date-fns의 parse가 요구하는 포맷에 맞게 변환하는 함수
 *
 * 예)
 *  - YYYY.MM.DD > yyyy.MM.dd
 *  - HH:MM:SS > HH:mm:ss
 **/
const format_handler = (_format) => {
  if (_format === null) return null;

  let new_format = _format;
  new_format = new_format.replace(/Y/g, "y");
  new_format = new_format.replace(/D/g, "d");
  new_format = new_format.replace(/S/g, "s");
  new_format = new_format.replace(/([hH]+[-:/ ]?)(M+)/, (_, p1, p2) => {
    return p1 + p2.toLowerCase();
  });

  return new_format;
};

const processing = (_columnIndex, _valueIndexs, _data) => {
  const {
    columnIndex: main_columnIndex,
    type: main_type,
    format: main_format,
  } = _columnIndex;

  const [option_1, option_2] = _valueIndexs;
  const {
    valueField: a_valueField,
    columnIndex: a_columnIndex,
    type: a_type,
  } = option_1;
  const {
    valueField: b_valueField,
    columnIndex: b_columnIndex,
    type: b_type,
  } = option_2;

  // yyyy MM dd HH mm ss 가 되어야 함

  const arr = [];

  if (main_type === "date") {
    const new_main_format = format_handler(main_format);
    const needToCheckTime = false; //true

    for (let i = 0; i < _data.length; i++) {
      const date = _data[i][main_columnIndex]["v"];
      const value_1 = _data[i][a_columnIndex]["v"];
      const value_2 =
        b_columnIndex !== null ? _data[i][b_columnIndex]["v"] : null;

      const tempObj = {
        index: new_main_format
          ? parse(date, new_main_format, new Date())
          : date,
        value_1: value_1,
        value_2: value_2,
        original_index: i,
      };

      arr.push(tempObj);
    }
  } else {
    for (let i = 0; i < _data.length; i++) {
      const index = _data[i][main_columnIndex]["v"];
      const value_1 = _data[i][a_columnIndex]["v"];
      const value_2 =
        b_columnIndex !== null ? _data[i][b_columnIndex]["v"] : null;

      const tempObj = {
        index: index,
        value_1: value_1,
        value_2: value_2,
        original_index: i,
      };

      arr.push(tempObj);
    }
  }

  return arr;
};

const checkTime = (_f_selected, _c_selected) => {
  let f_result = false;
  let c_result = false;

  for (let i = 0; i < _f_selected.length; i++) {
    const index = _f_selected[i].index;
    const hour = index.getHours();
    const min = index.getMinutes();
    const sec = index.getSeconds();

    if (hour !== 0 || min !== 0 || sec !== 0) {
      f_result = true;
    }
  }

  for (let j = 0; j < _c_selected.length; j++) {
    const index = _c_selected[j].index;
    const hour = index.getHours();
    const min = index.getMinutes();
    const sec = index.getSeconds();

    if (hour !== 0 || min !== 0 || sec !== 0) {
      c_result = true;
    }
  }

  return f_result && c_result;
};

export const compare = (
  f_columnIndex,
  f_valueColumnIndexs,
  f_data,
  c_columnIndex,
  c_valueColumnIndexs,
  c_data
) => {
  let f_selected = processing(f_columnIndex, f_valueColumnIndexs, f_data);
  let c_selected = processing(c_columnIndex, c_valueColumnIndexs, c_data);

  let f_new = [];
  let c_new = [];

  if (f_columnIndex.type === "date") {
    if (!checkTime(f_selected, c_selected)) {
      f_selected = f_selected.map((d) => ({
        ...d,
        index: `${d.index.getFullYear()}${String(
          d.index.getMonth() + 1
        ).padStart(2, "0")}${String(d.index.getDate()).padStart(2, "0")}`,
      }));

      c_selected = c_selected.map((d) => ({
        ...d,
        index: `${d.index.getFullYear()}${String(
          d.index.getMonth() + 1
        ).padStart(2, "0")}${String(d.index.getDate()).padStart(2, "0")}`,
      }));
    }
  }

  console.log(f_selected);
  console.log(c_selected);

  //   for (let i = 0; i < f_selected.length; i++) {
  //     const f_index = f_new[i].index;
  //     const f_value_1 = f_new[i].value_1;
  //     const f_value_2 = f_new[i].value_2;

  //     for (let j = 0; j < c_selected.length; i++) {
  //       const c_index = c_new[i].index;
  //       const c_value_1 = c_new[i].value_1;
  //       const c_value_2 = c_new[i].value_2;

  //       if (f_index !== c_index) continue;
  //       if (f_index === c_index && j !== 0) {
  //       }
  //     }
  //   }
};
