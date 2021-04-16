// a SW contract that reads a PSC cXYZ contract and append 
// the unregistered state of votes.

// REQUIREMENT:
// the caller should hold an amount of $DLT token
// in the wallet at the moment of execution

// NOTICE:
// this still a prototype of the planned logic. It still
// unaudited, neither tested

// Author(s):
// @charmful0x

const DECENTLAND_SWC = "sew_MAXZIgmyEPzzOTkdAca7SQCL9XTCMfxY3KOE5-M"
const MIN_DLT_AMOUNT = 1

export async function handle(state, action) {

  const input = action.input
  const caller = action.caller
  const pscContract = input.pscSrc
  const dipds = state.dipds


  if (input.function === "registerUnlistedDipd") {

    if ( (pscContract.length !== 43) || (typeof pscContract !== "string") ) {
      throw new ContractError(`invalid PSC TXID`)
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
      dipds[pscContract].push(caller)

      return { state }
  }
}
