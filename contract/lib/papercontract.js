/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const AssemblyRecord = require('./paper.js');
const AssemblyRecordList = require('./paperlist.js');
const QueryUtils = require('./queries.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class AssemblyRecordContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.assemblyRecordList = new AssemblyRecordList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class AssemblyRecordContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.assemblyrecord');
    }

    /**
     * Define a custom context for assembly record
    */
    createContext() {
        return new AssemblyRecordContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue assembly record
     *
     * @param {Context} ctx the transaction context
     * @param {Object} assembly assembly record data
    */
    async issue(ctx, assembly) {
        // create an instance of the assembly record
        if(!assembly && !assembly.date && !assembly.time && !assembly.day_order && !assembly.number) return null;
        let record = AssemblyRecord.createInstance(assembly);

        // save the owner's MSP 
        let mspid = ctx.clientIdentity.getMSPID();
        record.setOwnerMSP(mspid);

        // Add the record to the list of all similar assembly records in the ledger world state
        await ctx.assemblyRecordList.addRecord(record);

        // Must return a serialized assembly record to caller of smart contract
        return record;
    }

    async addAssociates(ctx, recordNumber, associates) {

        let recordKey = AssemblyRecord.makeKey([recordNumber]);
        let record = await ctx.assemblyRecordList.gerRecord(recordKey);

        if (record.isIssued()) {
            record.setModify();
        }

        if (paper.isSigned()) {
            record.setModify();
        }

        record.addAssociates(associates);

        await ctx.assemblyRecordList.updateRecord(record);
        return record;
    }

    async addAgreements(ctx, recordNumber, agreement) {
        let recordKey = AssemblyRecord.makeKey([recordNumber]);
        let record = await ctx.assemblyRecordList.getRecord(recordKey);

        if (record.isIssued()) {
            record.setModify();
        }

        if (paper.isSigned()) {
            record.setModify();
        }

        record.addAgreement(agreement);

        await ctx.assemblyRecordList.updateRecord(record);
        return record;
    }

    async signPresentAssociates(ctx, recordNumber, signature) {
        let recordKey = AssemblyRecord.makeKey([recordNumber]);
        let record = await ctx.assemblyRecordList.gerRecord(recordKey);

        if (record.isIssued()) {
            throw new Error(`\nRecord ${recordNumber} has just been issued.`);
        }

        if (paper.isSigned() || paper.isAssocSigned()) {
            throw new Error(`\nRecord ${recordNumber} has just been signed for every member.`);
        }

        record.signAssociate(signature);

        await ctx.assemblyRecordList.updateRecord(record);
        return record;
    }

    async signAgreement(ctx, recordNumber, agreementIndex, signature) {
        let recordKey = AssemblyRecord.makeKey([recordNumber]);
        let record = await ctx.assemblyRecordList.gerRecord(recordKey);

        if (record.isIssued()) {
            throw new Error(`\nRecord ${recordNumber} has just been issued.`);
        }

        if (paper.isSigned()) {
            throw new Error(`\nRecord ${recordNumber} has just been signed for every member.`);
        }

        if(!record.signAgreement(agreementIndex, signature)) throw new Error('\nA Mistake just happend, try again');

        await ctx.assemblyRecordList.updateRecord(record);
        return record;
    }

}

module.exports = AssemblyRecordContract;
