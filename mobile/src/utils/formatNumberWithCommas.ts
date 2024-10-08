export function formatNumberWithCommas(value?: string | number) {
    if (value) {
      const parts = String(value).split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return "0";
  }