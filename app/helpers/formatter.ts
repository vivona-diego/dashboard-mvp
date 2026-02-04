class Formatter {
  as_currency(amount: string | number, dense: boolean = false): string {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(number)) {
      return '$0.00';
    }

    if (!dense) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(number);
    }

    const abs_val = Math.abs(number);

    if (abs_val < 1000) {
      return '$' + Math.round(number).toLocaleString('en-US');
    } else if (abs_val < 1000000) {
      const thousands = number / 1000;
      const rounded = Math.round(thousands * 10) / 10;
      return '$' + rounded + 'k';
    } else {
      const millions = number / 1000000;
      const rounded = Math.round(millions * 10) / 10;
      return '$' + rounded + 'm';
    }
  }

  with_commas(number: number, decimals: number) {
    if (!number) {
      return 0;
    }

    let number_string;

    if (decimals) {
      number_string = number.toFixed(decimals);
    } else {
      number_string = number.toString();
    }

    const parts = number_string.split('.');
    const integer = parts[0];
    const decimal = parts.length > 1 ? '.' + parts[1] : '';

    const formatted_integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formatted_integer + decimal;
  }

  as_phone(number: string) {
    const cleaned = number?.replace(/\D/g, '');

    if (cleaned?.length !== 10) {
      return number;
    }

    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 6);
    const part3 = cleaned.slice(6);

    return `${part1}-${part2}-${part3}`;
  }

  as_percent(number: number, decimals: number = 2) {
    if (isNaN(number)) {
      return '0%';
    }
    return number.toFixed(decimals) + '%';
  }
}

const formatter = new Formatter();
export default formatter;
