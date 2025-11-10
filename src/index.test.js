/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* A mock for oracledb Node.js module
*
* Copyright (C) 2020 University Of Helsinki (The National Library Of Finland)
*
* This file is part of oracledb-mock-js
*
* oracledb-mock-js program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* oracledb-mock-js is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

import createMock from './index.js';
import generateTests from '@natlibfi/fixugen';
import assert from 'node:assert';

generateTests({
  useMetadataFile: true,
  path: [import.meta.dirname, '..', 'test-fixtures'],
  callback: async ({dbResults, usePool = false, expectedResults, query, args = {}}) => {
    const mock = createMock();

    mock._execute(formatDbResults());

    if (usePool) {
      const pool = await mock.createPool();
      const connection = await pool.getConnection();
      const {resultSet} = await connection.execute(query, args);
      const results = await fetchResults(resultSet);

      //expect(results).to.eql(expectedResults);
      assert.deepEqual(results, expectedResults);

      await connection.close();
      await pool.close();

      mock._clear();
      return;
    }

    const connection = await mock.getConnection();
    const {resultSet} = await connection.execute(query, args);
    const results = await fetchResults(resultSet);

   // expect(results).to.eql(expectedResults);
    assert.deepEqual(results, expectedResults);
    await connection.close();
    mock._clear();

    async function fetchResults(resultSet, results = []) {
      const row = await resultSet.getRow();

      if (row) {
        return fetchResults(resultSet, results.concat(row));
      }

      await resultSet.close();
      return results;
    }

    function formatDbResults() {
      return dbResults.map(({queryPattern, ...rest}) => {
        if (queryPattern) {
          return {
            ...rest,
            queryPattern: new RegExp(queryPattern, 'u')
          };
        }

        return rest;
      });
    }
  }
});
