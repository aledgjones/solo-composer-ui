import { default_groupings } from "./utils";

it("is grouped correctly (0)", () => {
  const groups = default_groupings(0);
  expect(groups).toEqual([2, 2]);
});

it("is grouped correctly (1)", () => {
  const groups = default_groupings(1);
  expect(groups).toEqual([1]);
});

it("is grouped correctly (2)", () => {
  const groups = default_groupings(2);
  expect(groups).toEqual([1, 1]);
});

it("is grouped correctly (3)", () => {
  const groups = default_groupings(3);
  expect(groups).toEqual([1, 1, 1]);
});

it("is grouped correctly (4)", () => {
  const groups = default_groupings(4);
  expect(groups).toEqual([2, 2]);
});

it("is grouped correctly (5)", () => {
  const groups = default_groupings(5);
  expect(groups).toEqual([3, 2]);
});

it("is grouped correctly (6)", () => {
  const groups = default_groupings(6);
  expect(groups).toEqual([3, 3]);
});

it("is grouped correctly (7)", () => {
  const groups = default_groupings(7);
  expect(groups).toEqual([3, 4]);
});

it("is grouped correctly (8)", () => {
  const groups = default_groupings(8);
  expect(groups).toEqual([3, 3, 2]);
});

it("is grouped correctly (9)", () => {
  const groups = default_groupings(9);
  expect(groups).toEqual([3, 3, 3]);
});

it("is grouped correctly (10)", () => {
  const groups = default_groupings(10);
  expect(groups).toEqual([3, 3, 4]);
});

it("is grouped correctly (11)", () => {
  const groups = default_groupings(11);
  expect(groups).toEqual([3, 3, 3, 2]);
});

it("is grouped correctly (12)", () => {
  const groups = default_groupings(12);
  expect(groups).toEqual([3, 3, 3, 3]);
});
