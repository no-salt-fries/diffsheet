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
        matched: false,
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

  const f_selected_index = [...new Set(f_selected.map((d) => d.index))];
  const c_selected_index = [...new Set(c_selected.map((d) => d.index))];

  // 합쳐서 오름차순
  const selected_index = [
    ...new Set(f_selected_index.concat(c_selected_index)),
  ];

  const ordered_selected_index = selected_index.sort(
    (a, b) => Number(a) - Number(b)
  );

  const new_selected_index = [];

  for (let i = 0; i < ordered_selected_index.length; i++) {
    const tempObj = {};
    const currentIndex = ordered_selected_index[i];

    const f_has_index = f_selected_index.includes(currentIndex);
    const c_has_index = c_selected_index.includes(currentIndex);

    if (f_has_index && c_has_index) {
      tempObj["target"] = "all";
      tempObj["value"] = currentIndex;
    } else {
      if (f_has_index) {
        tempObj["target"] = "f";
        tempObj["value"] = currentIndex;
      } else {
        //c_has_index
        tempObj["target"] = "c";
        tempObj["value"] = currentIndex;
      }
    }

    new_selected_index.push(tempObj);
  }

  let f_new = [];
  let c_new = [];

  for (let j = 0; j < new_selected_index.length; j++) {
    const target = new_selected_index[j].target;
    const index = new_selected_index[j].value;

    if (target === "all") {
      const f_temp = f_selected.filter((d) => d.index === index);
      const c_temp = c_selected.filter((d) => d.index === index);

      for (let k = 0; k < f_temp.length; k++) {
        let matched = false;

        const f_value_1 = f_temp[k].value_1;
        const f_value_2 = f_temp[k].value_2;

        for (let m = 0; m < c_temp.length; m++) {
          if (c_temp[m].matched) continue;

          const c_value_1 = c_temp[m].value_1;
          const c_value_2 = c_temp[m].value_2;

          if (f_value_1 === c_value_1) {
            if (f_value_2 === c_value_2) {
              f_new.push(f_temp[k]);
              c_new.push(c_temp[m]);
              f_temp[k].matched = true;
              c_temp[m].matched = true;
              matched = true;
              break;
            } else {
              continue;
            }
          } else {
            continue;
          }
        }

        if (!matched) {
          f_new.push(f_temp[k]);
          c_new.push({});
        }
      }

      // c_temp에 !matched 만큼만 넣어주면 된다
      const c_not_matched = c_temp.filter((d) => !d.matched);
      for (let n = 0; n < c_not_matched.length; n++) {
        f_new.push({});
        c_new.push(c_not_matched[n]);
      }
    } else {
      if (target === "f") {
        const f_temp = f_selected.filter((d) => d.index === index);
        for (let i = 0; i < f_temp.length; i++) {
          f_new.push(f_temp[i]);
          c_new.push({});
        }
      } else {
        const c_temp = c_selected.filter((d) => d.index === index);
        for (let i = 0; i < c_temp.length; i++) {
          f_new.push({});
          c_new.push(c_temp[i]);
        }
      }
    }
  }

  const f_final = [];
  const c_final = [];
  const match_arr = [];

  for (let i = 0; i < f_new.length; i++) {
    let original_index = -1;
    // f_data
    if ("original_index" in f_new[i]) {
      original_index = f_new[i].original_index;
    }

    if (original_index !== -1) {
      f_final.push(f_data[original_index]);
      match_arr.push(f_new[i].matched);
    } else {
      f_final.push([]);
      match_arr.push(false);
    }
  }

  for (let j = 0; j < c_new.length; j++) {
    let original_index = -1;
    if ("original_index" in c_new[j]) {
      original_index = c_new[j].original_index;
    }

    if (original_index !== -1) {
      c_final.push(c_data[original_index]);
    } else {
      c_final.push([]);
    }
  }

  console.log(f_final, c_final, match_arr);

  const newWindow = window.open(
    "/viewer.html",
    "_blank",
    "height=" + screen.height + ",width=" + screen.width + "fullscreen=yes"
  );

  const payload = {
    f_final,
    c_final,
    match_arr,
  };

  newWindow?.addEventListener("load", () => {
    newWindow?.postMessage(payload, "*");
  });
};
