'use strict'

const assert = require('node:assert');
const {
   kebabToCamelCase, kebabToPascalCase, kebabToSnakeCase,
   camelToKebabCase, camelToPascalCase, camelToSnakeCase,
   snakeToCamelCase, snakeToKebabCase, snakeToPascalCase,
   pascalToCamelCase, pascalToKebabCase, pascalToSnakeCase,
} = require('./string-cases')

const kebabStrings = ['abc', 'abc-xyz', 'very-interesting-string']
const snakeStrings = ['abc', 'abc_xyz', 'very_interesting_string']
const camelStrings = ['abc', 'abcXyz', 'veryInterestingString']
const pascalStrings = ['Abc', 'AbcXyz', 'VeryInterestingString']

assert.strict.deepStrictEqual(kebabStrings.map(kebabToSnakeCase), snakeStrings)
assert.strict.deepStrictEqual(kebabStrings.map(kebabToCamelCase), camelStrings)
assert.strict.deepStrictEqual(kebabStrings.map(kebabToPascalCase), pascalStrings)

assert.strict.deepStrictEqual(camelStrings.map(camelToKebabCase), kebabStrings)
assert.strict.deepStrictEqual(camelStrings.map(camelToPascalCase), pascalStrings)
assert.strict.deepStrictEqual(camelStrings.map(camelToSnakeCase), snakeStrings)

assert.strict.deepStrictEqual(snakeStrings.map(snakeToKebabCase), kebabStrings)
assert.strict.deepStrictEqual(snakeStrings.map(snakeToPascalCase), pascalStrings)
assert.strict.deepStrictEqual(snakeStrings.map(snakeToCamelCase), camelStrings)

assert.strict.deepStrictEqual(pascalStrings.map(pascalToKebabCase), kebabStrings)
assert.strict.deepStrictEqual(pascalStrings.map(pascalToCamelCase), camelStrings)
assert.strict.deepStrictEqual(pascalStrings.map(pascalToSnakeCase), snakeStrings)

console.log('string-cases PASSED SUCCESSFULLY');
