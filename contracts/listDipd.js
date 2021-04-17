// a SW contract that reads a PSC cXYZ contract and append 
// the unregistered state of votes.

// REQUIREMENT:
// the caller should hold an amount of $DLT token
// in the wallet at the moment of execution

// NOTICE:
// this still a prototype of the planned logic. It still
// unaudited, neither tested

// Author(s):
// charmful0x

const DECENTLAND_SWC = "sew_MAXZIgmyEPzzOTkdAca7SQCL9XTCMfxY3KOE5-M"
const CXYZ_PSC_FACTORY_SRC = "ngMml4jmlxu0umpiQCsHgPX2pb_Yz6YDB8f7G6j-tpI"
const MIN_DLT_AMOUNT = 1

export async function handle(state, action) {

  const input = action.input
  const caller = action.caller
  const pscContract = input.pscSrc
  const dipds = state.dipds
  const tagsMap = new Map()


  if (input.function === "registerUnlistedDipd") {

    if ( (pscContract.length !== 43) || (typeof pscContract !== "string") ) {
      throw new ContractError(`invalid TXID`)
    }
    
    // using unsafeClient feature to verify that pscContract tags
    // are compatible with a cXYZ PSC tx
    let psc_tx = await SmartWeave.unsafeClient.transactions.get(pscContract)
    let tags = psc_tx.get("tags")

    for (let tag of tags) {
      let key = tag.get("name", {decode: true, string: true});
      let value = tag.get("value", {decode: true, string: true});
      tagsMap.set(key, value)
    }

    // short-circuit validation
    // a PSC created via CXYZ_PSC_FACTORY_SRC SW
    // has 7 tags
    if ( tagsMap.size !== 7 ) {
      throw new ContractError(`invalid PSC TXID: ${pscContract}`)
    }

    if (! tagsMap.has("Contract-Src") ) {
      throw new ContractError(`invalid PSC TXID: ${pscContract}`)
    }

    if ( tagsMap.has("Contract-Src") ) {
      if (tagsMap.get("Contract-Src") !== CXYZ_PSC_FACTORY_SRC) {
        throw new ContractError(`the following PSC "${pscContract}" isn't created under cXYZ`)
      }
    }

    const pscContractState = await SmartWeave.contracts.readContractState(pscContract)
    const votes = pscContractState["votes"]

    if ( JSON.stringify(dipds[pscContract]) === JSON.stringify(votes) ) {
      throw new ContractError(`no new votes detetcted`)
    }
      
    const decentlandState = await SmartWeave.contracts.readContractState(DECENTLAND_SWC)
    
    if (decentlandState["balances"][caller] < MIN_DLT_AMOUNT) {
      throw new ContractError(`a minimum balance of ${MIN_DLT_AMOUNT} DLT PST is required to create a dipd`)
    }

      dipds[pscContract] = votes
      dipds[pscContract].push( {"caller": caller} )

      return { state }
  }
}
