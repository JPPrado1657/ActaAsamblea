/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');


/**
 * AssemblyRecord class extends State class
 * Class will be used by application and smart contract to define an Assembly Record
 */
class AssemblyRecord extends State {

    constructor(obj) {
        super(AssemblyRecord.getClass(), [obj.assembly.number]);
        Object.assign(this, obj);
        this.state = 'ISSUED';
    }

    /**
     * Basic getters and setters
    */
    getAssoc() {
        return this.assoc;
    }

    getAssembly() {
        return this.assembly;
    }

    setAssembly() {
        this.assembly = this.assembly;
    }

    addAssociates(associates) {
        this.assembly['associates'] = associates;
    }

    signAssociate(signature) {
        if(!this.assembly.signAssociate) {
            this.assembly['signAssociate'] = [];
        }
        this.assembly.signAssociate.push(signature);
        // 8 is the number of associates in the current society
        if(this.assembly.signAssociate.length == 8) {
            this.setAssociateSigned();
        }
    }

    addAgreement(agreement) {
        if(!this.assembly.agreements) {
            this.assembly['agreements'] = [];
        }
        this.assembly.agreements.push({agreement});
    }

    signAgreement(index, signature) {
        if(!this.assembly.agreements) return null;
        if(!this.assembly.agreements[index].signatures) {
            this.assembly.agreements[index].signatures = []
        }
        this.assembly.agreements[index].signatures.push(signature);

        if(this.allAgreementsSigned()) {
            this.setSigned();
        }
        return true;
    }

    allAgreementsSigned(){
        for (let agreement in this.assembly.agreements) {
            if(agreement.signatures.length != this.assembly.associates.length) return false;
        }
        return true;
    }

    isIssued() {
        return this.state == 'ISSUED';
    }

    setModify() {
        this.state = 'MODIFY';
    }

    isModify() {
        return this.state == 'MODIFY';
    }

    setAssociateSigned() {
        this.state = 'ASSOC_SIGNED';
    }

    isAssociateSigned() {
        return this.state == 'ASSOC_SIGNED';
    }

    setSigned(){
        this.state = 'SIGNED';
    }

    isSigned() {
        this.state = 'SIGNED';
    }

    // Not so basic getters and setters
    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }
    
    static fromBuffer(buffer) {
        return AssemblyRecord.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, AssemblyRecord);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(assoc, assembly) {
        return new AssemblyRecord({ assoc, assembly });
    }

    static getClass() {
        return 'org.papernet.assemblyrecord';
    }
}

module.exports = AssemblyRecord;
