const DECENTLAND_SWC = "sew_MAXZIgmyEPzzOTkdAca7SQCL9XTCMfxY3KOE5-M"
const MIN_DLT_AMOUNT = 100

export async function handle(state, action) {

  const input = action.input
  const caller = action.caller
  const pscContract = input.pscSrc
  const dipds = state.dipds


  if (input.function === "registerUnlistedDipd") {

    if (pscContract.length !== 43 || (typeof pscContract !== "string") ) {
      throw new ContractError(`invalid PSC TXID`)
    }

    const pscContractState = await SmartWeave.contracts.readContractState(pscContract)
    const votes = pscContractState["votes"]

    if ( (dipds.length !== votes.length) && (JSON.stringify(dipds) !== JSON.stringify(votes)) ) {
      const decentlandState = await SmartWeave.contracts.readContractState(DECENTLAND_SWC)

      if (decentlandState["balances"][caller] < MIN_DLT_AMOUNT) {
          throw new ContractError(`a minimum balance of ${MIN_DLT_AMOUNT} DLT PST is required to create a dipd`)
        }

      dipds[pscContract] = votes

      return {state}
    }

    throw new ContractError(`no new votes detected`)

  }

}