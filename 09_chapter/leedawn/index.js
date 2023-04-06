// function isNumberOrString(value: unknown) {
//   return ['number', 'string'].includes(typeof value);
// }
var declared = {
    // Error: Propery 'acts' is missing in type '{ one: number; }' but required in type 'Entertainer'.
    name: 'Moms Mabley',
};
var asserted = {
    name: 'Moms Mabley',
}; // 허용되지만 런타임 시 오류 발생
// 다음 구문은 런타임 시 다음 오류로 인해 정상적으로 작동되지 않음
// Runtime TypeError: Cannot read properties of undefined (reading 'toPrecision')
console.log(declared.acts.join(', '));
console.log(asserted.acts.join(', '));
