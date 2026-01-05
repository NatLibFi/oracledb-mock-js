# A mock for oracledb Node.js module [![NPM Version](https://img.shields.io/npm/v/@natlibfi/oracledb-mock.svg)](https://npmjs.org/package/@natlibfi/oracledb-mock)

# Usage
```js
import createMock from '@natlibfi/oracledb-mock';

const oracledb = createMock();

oracledbMock._execute([
  {
    queryPattern: /^SELECT * from foobar$/,
    results: [
      { foo: 'bar' }
    ]
  }
]);

await operate(oracledbMock);

oracledbMock._clear();

async function operate(oracledb) {
  const connection = await oracledb.getConnection();
  const {resultSet} = await connection.execute('SELECT * from foobar');
  const row = await resultSet.getRow();
  // do something with `{foo: 'bar'}`
  return connection.close();
}
```
## Mocking queries
The `_execute` method initializes the mock with expected queries and their results. An array of object is passed to the `_execute` method and the array is iterated for matching results. The following parameters are supported
- **queryPattern**: A `RegExp` object which the query is tested against. Defaults to `.*`.
- **expectedArgs**: An optional object which, if present, must be equal to the arguments passed to the execute-call of the connection.
- **results**: An array of results represented as object (Column names are the properties).

## License and copyright

Copyright (c) 2020, 2026 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **GNU Lesser General Public License Version 3** or any later version.
