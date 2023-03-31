// interface MoreNarrowNumbers {
//   [i: number]: string;
//   [i: string]: string | number;
// }

// const mixesNumbersAndStrings: MoreNarrowNumbers = {
//   0: '',
//   key1: '',
//   key2: undefined,
// };

// interface MoreNarrowStrings {
//   [i: number]: number;
//   [i: string]: string;
// }

interface WithNullableName {
  name: string | undefined;
}

// interface WithNonNullableName extends WithNullableName {
//   name: string;
// }

interface WithNumericName extends WithNullableName {
  name: string | number;
}

// interface MergedProperties {
//   same: (input: boolean) => string;
//   different: (input: string) => string;
// }

// interface MergedProperties {
//   same: (input: boolean) => string; // Ok
//   different: (input: number) => string;
// }
