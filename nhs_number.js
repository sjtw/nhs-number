// Constants which define ranges of NHS Numbers
const GOOD_FORMAT = /^(\d{10}|\d{3} \d{3} \d{4}|\d{3}-\d{3}-\d{4})$/;

class Range {
  constructor(start, end, label) {
    this.start = start;
    this.end = end;
    this.label = label;
  }

  contains_number(number) {
    return this.start <= parseInt(number) && parseInt(number) <= this.end;
  }
}

class Region {
  constructor(label, tags, ranges) {
    this.label = label;
    this.tags = tags;
    this.ranges = ranges;
  }

  contains_number(number) {
    return this.ranges.some((range) => range.contains_number(number));
  }
}

const calculate_checksum = (identifier_digits) => {
  if (identifier_digits.length !== 9) {
    return null;
  }

  const parts_list = identifier_digits.split("").map((digit, index) => {
    return parseInt(digit, 10) * (10 - index);
  });
  const list_sum = parts_list.reduce((sum, num) => sum + num, 0);
  let checksum = 11 - (list_sum % 11);
  if (checksum === 11) {
    checksum = 0;
  }
  return checksum;
};

const is_valid = (nhs_number, for_region = null) => {
  nhs_number = standardise_format(nhs_number);
  if (!nhs_number) {
    return false;
  }

  if (for_region) {
    if (!for_region.contains_number(nhs_number)) {
      return false;
    }
  }

  const identifier_digits = nhs_number.slice(0, -1);
  const check_digit = parseInt(nhs_number.slice(-1), 10);
  const calculated_checksum = calculate_checksum(identifier_digits);
  return calculated_checksum === check_digit;
};

const standardise_format = (nhs_number) => {
  let working_number = nhs_number.toString();
  if (typeof nhs_number === "number") {
    working_number = working_number.padStart(10, "0");
  } else {
    working_number = working_number.trim();
  }
  if (!GOOD_FORMAT.test(working_number)) {
    working_number = "";
  }
  working_number = working_number.replace(/[- ]/g, "");
  return working_number;
};

function generate({ valid = true, for_region = null, quantity = 1 }) {
  const nhs_numbers = [];
  let ranges = [FULL_RANGE];

  if (for_region) {
    if (for_region.constructor.name === "Region") {
      ranges = for_region.ranges;
    } else {
      throw new TypeError("The for_region argument must be of type Region");
    }
  }

  while (nhs_numbers.length < quantity) {
    const this_range = ranges[Math.floor(Math.random() * ranges.length)];
    const candidate =
      Math.floor(
        Math.random() * (this_range.end - this_range.start + 1) +
          this_range.start
      ) / 10;
    const candidate_str = String(candidate).padStart(9, "0");
    const checksum_str = String(calculate_checksum(candidate_str));
    if (checksum_str.length === 1) {
      if (valid) {
        nhs_numbers.push(candidate_str + checksum_str);
      } else {
        let wrong_checksum_str = checksum_str;
        while (wrong_checksum_str === checksum_str) {
          wrong_checksum_str = String(Math.floor(Math.random() * 10));
        }
        nhs_numbers.push(candidate_str + wrong_checksum_str);
      }
    }
  }

  return nhs_numbers;
}

const RANGE_UNALLOCATED_1 = new Range(
  10,
  9999999,
  "Unallocated 1 (not in use)"
);
const RANGE_SCOTLAND = new Range(10000000, 3112999999, "Scotland CHI numbers");
const RANGE_UNALLOCATED_2 = new Range(
  3113000000,
  3199999999,
  "Unallocated 2 (not in use)"
);
const RANGE_NORTHERN_IRELAND = new Range(
  3200000000,
  3999999999,
  "Northern Ireland H&C Numbers"
);
const RANGE_ENGLAND_WALES_IOM_1 = new Range(
  4000000000,
  4999999999,
  "England Wales and IOM NHS Numbers Range 1"
);
const RANGE_RESERVED = new Range(
  5000000000,
  5999999999,
  "Reserved Range - not to be issued"
);
const RANGE_ENGLAND_WALES_IOM_2 = new Range(
  6000000000,
  7999999999,
  "England Wales and IOM NHS Numbers Range 2"
);
const RANGE_EIRE = new Range(
  8000000000,
  8599999999,
  "Used within the Republic of Ireland Individual Health Identifier (IHI)"
);
const RANGE_UNALLOCATED_3 = new Range(
  8600000000,
  8999999999,
  "Unallocated 3 (not in use)"
);
const RANGE_NOT_ISSUED_SYNTHETIC = new Range(
  9000000000,
  9999999999,
  "Not to be issued (Synthetic/test patients PDS)"
);
const FULL_RANGE = new Range(
  10,
  9999999999,
  "Full range of possible numbers, not all are actually valid"
);

const REGION_SCOTLAND = new Region(
  "Scotland CHI numbers",
  ["scotland", "chi"],
  [RANGE_SCOTLAND]
);
const REGION_ENGLAND_WALES_IOM = new Region(
  "England Wales and IOM NHS Numbers",
  ["england-wales", "e-w-iom", "isle-of-man", "cymru", "wales"],
  [RANGE_ENGLAND_WALES_IOM_1, RANGE_ENGLAND_WALES_IOM_2]
);
const REGION_NORTHERN_IRELAND = new Region(
  "Northern Ireland H&C Numbers",
  ["northern-ireland", "ni", "tuaisceart-éireann"],
  [RANGE_NORTHERN_IRELAND]
);
const REGION_EIRE = new Region(
  "Used within the Republic of Ireland Individual Health Identifier (IHI)",
  [
    "eire",
    "republic-of-ireland",
    "ihi",
    "individual-health-identifier",
    "poblacht-na-héireann",
  ],
  [RANGE_EIRE]
);
const REGION_SYNTHETIC = new Region(
  "Not to be issued (Synthetic/test patients PDS)",
  ["test", "synthetic"],
  [RANGE_NOT_ISSUED_SYNTHETIC]
);
const REGION_UNALLOCATED = new Region(
  "Unallocated - should not be a valid Number",
  ["unallocated"],
  [RANGE_UNALLOCATED_1, RANGE_UNALLOCATED_2, RANGE_UNALLOCATED_3]
);
const REGION_RESERVED = new Region(
  "Reserved and not issued",
  ["reserved"],
  [RANGE_RESERVED]
);

const REGIONS = {
  UNALLOCATED: REGION_UNALLOCATED,
  SCOTLAND: REGION_SCOTLAND,
  NORTHERN_IRELAND: REGION_NORTHERN_IRELAND,
  ENGLAND_WALES_IOM: REGION_ENGLAND_WALES_IOM,
  RESERVED: REGION_RESERVED,
  EIRE: REGION_EIRE,
  SYNTHETIC: REGION_SYNTHETIC,
};

class NhsNumber {
  constructor(nhs_number) {
    this.nhs_number = nhs_number;
    this.identifier_digits = nhs_number.slice(0, -1);
    this.check_digit = parseInt(nhs_number.slice(-1), 10);
    this.calculated_checksum = calculate_checksum(this.identifier_digits);
    this.valid = this.calculated_checksum === this.check_digit;

    let region_comment = "Number did not match a known NHS number range";
    for (const handle in REGIONS) {
      if (REGIONS[handle].contains_number(nhs_number)) {
        region_comment = REGIONS[handle].label;
        this.region = REGIONS[handle];
        break;
      }
    }
    this.region_comment = region_comment;
  }
}

module.exports = {
  calculate_checksum,
  is_valid,
  standardise_format,
  generate,
  Range,
  Region,
  NhsNumber,
  RANGE_UNALLOCATED_1,
  RANGE_SCOTLAND,
  RANGE_UNALLOCATED_2,
  RANGE_NORTHERN_IRELAND,
  RANGE_ENGLAND_WALES_IOM_1,
  RANGE_RESERVED,
  RANGE_ENGLAND_WALES_IOM_2,
  RANGE_EIRE,
  RANGE_UNALLOCATED_3,
  RANGE_NOT_ISSUED_SYNTHETIC,
  FULL_RANGE,
  REGION_SCOTLAND,
  REGION_ENGLAND_WALES_IOM,
  REGION_NORTHERN_IRELAND,
  REGION_EIRE,
  REGION_SYNTHETIC,
  REGION_UNALLOCATED,
  REGION_RESERVED,
  REGIONS,
};
