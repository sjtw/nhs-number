const {
  is_valid,
  calculate_checksum,
  standardise_format,
  Region,
  REGIONS,
  generate,
  NhsNumber,
  REGION_ENGLAND_WALES_IOM,
} = require("./nhs_number");

test("String is valid - good one", () => {
  expect(is_valid("9876543210")).toBe(true);
});

test("Integer is valid - good one", () => {
  expect(is_valid(9876543210)).toBe(true);
});

test("String is valid - bad one", () => {
  expect(is_valid("1234567890")).toBe(false);
});

test("Integer is valid - bad one", () => {
  expect(is_valid(1234567890)).toBe(false);
});

test("Is valid - good one with right-padding", () => {
  expect(is_valid("9876543210 ")).toBe(true);
});

test("Is invalid - wrong format", () => {
  expect(is_valid("123 456 789")).toBe(false);
});

test("Is valid - randomly generated", () => {
  expect(is_valid("9990000018")).toBe(true);
});

test("String is valid - leading zero CHI", () => {
  expect(is_valid("0607230002")).toBe(true);
});

test("Integer is valid - leading zero CHI", () => {
  expect(is_valid(607230002)).toBe(true);
});

test("Valid England Wales number", () => {
  const regionEnglandWalesIOM = REGIONS["ENGLAND_WALES_IOM"];
  expect(is_valid("4000000632", regionEnglandWalesIOM)).toBe(true);
});

test("Invalid England Wales number", () => {
  const regionEnglandWalesIOM = REGIONS["ENGLAND_WALES_IOM"];
  expect(is_valid("9876543210", regionEnglandWalesIOM)).toBe(false);
});

test("Checksum returns null if less than nine digits", () => {
  expect(calculate_checksum("123456")).toBe(null);
});

test("Checksum returns null if more than nine digits", () => {
  expect(calculate_checksum("12345678901223456")).toBe(null);
});


/**
 * generate tests
 */
test("Test that a valid NHS number is generated", () => {
  const nhs_number = generate({valid: true});
  expect(nhs_number.length).toBe(1);
  expect(is_valid(nhs_number[0])).toBe(true);
});

test("Test that one invalid NHS number is generated", () => {
  const nhs_number = generate({ valid: false });
  expect(nhs_number.length).toBe(1);
  expect(is_valid(nhs_number[0])).toBe(false);
});

test("Test that a large number of valid NHS numbers are generated", () => {
  const nhs_numbers = generate({ quantity: 10000 });
  expect(nhs_numbers.length).toBe(10000);
  for (const nhs_number of nhs_numbers) {
    expect(is_valid(nhs_number)).toBe(true);
  }
});

test("Test that random NHS numbers are generated", () => {
  const nhs_numbers = generate({ quantity: 100 });
  expect(nhs_numbers.length).toBe(100);
  for (const nhs_number of nhs_numbers) {
    expect(is_valid(nhs_number)).toBe(true);
  }
});

test("Test that NHS numbers for a specific region are generated", () => {
  const nhs_numbers = generate({ for_region: REGION_ENGLAND_WALES_IOM });
  expect(nhs_numbers.length).toBe(1);
  expect(is_valid(nhs_numbers[0])).toBe(true);
  expect(REGION_ENGLAND_WALES_IOM.contains_number(nhs_numbers[0])).toBe(true);
});

test('Test that we get an error if we supply something other than a Region object as the for_region argument', () => {
  expect(() => {
    generate({ for_region: 'REGION_ENGLAND_WALES_IOM' });
  }).toThrow(TypeError);
});

/**
 * standardise tests
 */

test("test_format_basic", () => {
  const num_string = "0123456789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_basic_pad_right", () => {
  const num_string = "0123456789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_basic_pad_left", () => {
  const num_string = " 0123456789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_basic_pad_both", () => {
  const num_string = " 0123456789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_internal", () => {
  const num_string = "012 345 6789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_internal_pad_right", () => {
  const num_string = "012 345 6789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_internal_pad_left", () => {
  const num_string = " 012 345 6789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_internal_pad_both", () => {
  const num_string = " 012 345 6789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_internal_invalid_format", () => {
  const num_string = "01 2345 6789";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_hyphen", () => {
  const num_string = "012-345-6789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_hyphen_pad_right", () => {
  const num_string = "012-345-6789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_hyphen_pad_left", () => {
  const num_string = " 012-345-6789";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_hyphen_pad_both", () => {
  const num_string = " 012-345-6789 ";
  const expected = "0123456789";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_hyphen_invalid_format", () => {
  const num_string = "01-2345-6789";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_mixed", () => {
  const num_string = "012 345-6789";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_short", () => {
  const num_string = "012345678";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_long", () => {
  const num_string = "01234567890";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_letters", () => {
  const num_string = "ABCDEFGHIJ";
  const expected = "";
  expect(standardise_format(num_string)).toBe(expected);
});

test("test_format_10_digit_int", () => {
  const number = 1234567890;
  const expected = "1234567890";
  expect(standardise_format(number)).toBe(expected);
});

test("test_format_11_digit_int", () => {
  const number = 12345678901;
  const expected = "";
  expect(standardise_format(number)).toBe(expected);
});

test("test_format_9_digit_int", () => {
  const number = 123456789;
  const expected = "0123456789";
  expect(standardise_format(number)).toBe(expected);
});

// test("test_normalise_deprecated", () => {
// });

/**
 * details
 */
test("test_valid_synthetic_nhs_number_details", () => {
  const number = new NhsNumber("9876543210");

  expect(number.nhs_number).toBe("9876543210");
  expect(number.identifier_digits).toBe("987654321");
  expect(number.check_digit).toBe(0);
  expect(number.valid).toBe(true);
  expect(number.calculated_checksum).toBe(0);

  expect(number.region).toBe(REGIONS.SYNTHETIC);
  expect(number.region_comment).toBe("Not to be issued (Synthetic/test patients PDS)");
});