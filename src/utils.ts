import { ContributionPartyEvent } from "types";
import { ethersProvider } from "./ethereum";
import {
  haveSetNewPartyWithContribution,
  haveSetPartyHalfway,
  setNewPartyWithContribution,
  setPartyHalfway,
} from "./party_events";

export const bestUserName = async (address: string): Promise<string> => {
  const ens = await ethersProvider.lookupAddress(address);
  if (ens) {
    return ens;
  } else {
    return address;
  }
};

export const getIsNewPartyWithContribution = async (
  event: ContributionPartyEvent
): Promise<boolean> => {
  const { partyAddress, createdBy } = event.party;

  // check redis to see if alert has already been sent
  const hasSet = await haveSetNewPartyWithContribution(partyAddress);
  if (hasSet) {
    return false;
  }

  // do not alert for the case that the creator started the party, and made a contribution
  const { contributorAddress } = event.contribution;
  if (contributorAddress.toLowerCase() !== createdBy.toLowerCase()) {
    await setNewPartyWithContribution(partyAddress);
    return true;
  }

  // otherwise
  return false;
};

export const getIsPartyHalfWay = async (
  event: ContributionPartyEvent
): Promise<boolean> => {
  const { party } = event;
  const { partyAddress } = party;

  // check redis to see if alert has already been sent
  const hasSet = await haveSetPartyHalfway(partyAddress);
  if (hasSet) {
    return false;
  }

  // todo:
  // 1. create api endpoint that does the following:
  //   * if partybid - fetch auction reserve price
  //   * if partybuy - fetch maxPrice from contract
  //   * if collectionbuy - fetch current floor price
  // 2. compare (fetched value) / totalContributions >= .5
  // 3. return boolean
  const isPartyHalfway = false;
  if (isPartyHalfway) {
    await setPartyHalfway(partyAddress);
    return true;
  }

  // otherwise
  return false;
};
