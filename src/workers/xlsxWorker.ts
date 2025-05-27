import { read as read_xlsx } from "xlsx";

self.onmessage = (e) => {
  const buffer = e.data;
  try {
    const wb = read_xlsx(buffer, {
      type: "array",
      dense: true,
      //   cellStyles: true,
    });
    self.postMessage({ success: true, workbook: wb });
  } catch (err) {
    self.postMessage({ success: false, error: err });
  }
};
