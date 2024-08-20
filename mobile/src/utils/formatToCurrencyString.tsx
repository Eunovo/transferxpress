export const formatToCurrencyString = (
    number?: number | string,
    numberOfDecimalPlaces?: number
  ) => {
    if (number) {
      const formattedValue = parseFloat(`${number}`).toLocaleString('en-US', {
        style: 'decimal',
        maximumFractionDigits:
          typeof numberOfDecimalPlaces !== 'undefined'
            ? numberOfDecimalPlaces
            : 0,
        minimumFractionDigits:
          typeof numberOfDecimalPlaces !== 'undefined'
            ? numberOfDecimalPlaces
            : 0,
      });
      return formattedValue.includes('.') && !numberOfDecimalPlaces
        ? formattedValue.replace('.', '')
        : formattedValue;
    }
    return '0';
  };
  