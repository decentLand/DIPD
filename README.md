# DIPD
DAO's Improvement Proposals Discussion
# Synopsis
DAO's Improvement Proposals Discussion or DIPD is a new under planning/development feature for decentland protocol in order to provide on-chain, sized, and a better way to discuss a DAO's IP (improvement proposal).
# Motivation
Decentralized Autonomous Organizations (DAOs) lack from decentralization when it comes to provide a decentralized enclosed discussion-lobby for the DAO members only. While third-app services are used (e.g Slack, Telegram, Discord, etc) for a proposal's discussion, several problems rise like: anti-Coummunity-guidelines members giving their opinions, spam, a fifth column, etc.

To prevent such issues, DAO's core team used to create private groups/channels to ensure DAO's membership, and user's selectivity.

# DIPD Protocol
DIPD logic rely on SmartWeave contract to ensure fairness, logic immutability, and transparency. it's called "DIPD Protocol" just due to special features and different logic-flow than a normal post transaction under decentland protocol. However, it still sub-decentland.

**How it works:**

`listDipd` contract simply read an another profit sharing community contract latest state, to retrieve the array of votes and compute its own logic. 

**Restrictions:**

- the `caller` must be valid for `MIN_DLT_AMOUNT` condition (hold x amount of DLT in his wallet)
- once the `votes` array strictly in the current `listDipd` state equals to the `votes` array in the latest state of `PscContract` , the exection will fail ("first come, first served")

**The reason to hold DLT:**

a valid caller must hold a pre-defined amount of `$DLT` token in the calling wallet in order to reinforce decentland tokenomics. Even after registiring the unlisted Dipds, the caller must continue to hold DLT as long as he wants to be incentivized from the DIPD commenting activity.

**first come, first served:**

this "logic" is used in registering a new unlisted Dipd. Once the state of the PSC at a given time (block height) surpasses the last state of the `dipd`, the dipd will be open for a new caller to register the unlisted votes and therefore, - if it was a valid caller - he/she will be the `caller` of that `state`. 

As long as it is a valid caller, he will be incentivized for each UI interaction of the Tribus's DIPD (fee in AR). A new opportunity for an another valid caller is given whenever there is state's distinction.

**Better than private channels:**

The unique feature which make a DIPD better than a private third-party app's room (channel) is user's selectivity.

Because `DIPD` is a sub-decentland protocol as mentioned before, each comment on vote's post should pass the Tribus membership validity. In other words, in order to comment under a vote's post, the commenter must have been staked of that Tribus PST. Therefore, only the PSC's PST holders (and stakers in the same time) will have the permission to participate in a improvement proposal discussion.  

# License
Licensed under the MIT License.
