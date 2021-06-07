/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const AssemblyRecord = require('./paper.js');

class AssemblyRecordList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.record');
        this.use(AssemblyRecord);
    }

    async addRecord(record) {
        return this.addState(record);
    }

    async getRecord(recordKey) {
        return this.getState(recordKey);
    }

    async updateRecord(record) {
        return this.updateState(record);
    }
}


module.exports = AssemblyRecordList;
