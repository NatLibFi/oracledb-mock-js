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

import deepEqual from 'deep-eql';

export default () => {
  const options = [];
  const DEFAULT_OPTIONS = {
    queryPattern: /.*/u,
    results: []
  };

  const connection = {
    close: () => {},
    break: () => {},
    execute: (query, args) => {
      const rows = getRows();

      return {
        resultSet: {
          getRow: () => rows.shift(),
          close: () => {}
        }
      };

      function getRows() {
        const index = options.findIndex(({queryPattern, expectedArgs}) => {
          if (queryPattern.test(query) && (expectedArgs === undefined || deepEqual(args, expectedArgs))) {
            return true;
          }

          return false;
        });

        if (index >= 0) {
          const {results} = options.splice(index, 1).shift();
          return results;
        }

        return [];
      }
    }
  };

  return {
    getConnection: () => connection,
    createPool: () => ({
      getConnection: () => connection,
      close: () => {}
    }),
    _clear: () => {
      // Clear array
      options.splice(0);
      Object.keys(options).forEach(k => delete options[k]);
    },
    _execute: optList => {
      // Clear array
      options.splice(0);

      optList.forEach(opts => {
        options.push({...DEFAULT_OPTIONS, ...opts});
      });
    }
  };
};
