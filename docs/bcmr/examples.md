---
sidebar_position: 2
---

# Registry Examples

This directory includes several [Bitcoin Cash Metadata Registry](./chip) examples. Each example is briefly described below.

## Fungible Token

The [`fungible-token.json` example](./examples/fungible-token.json) demonstrates how the issuer of a single kind of fungible token might publish information about the token.

The registry includes only one identity, `Example Asset`, defined as authbase `89cad9e3e34280eb1e8bc420542c00a7fcc01002b663dbf7f38bceddf80e680c` with a matching token category ID. `Example Asset` has the ticker symbol `XAMPL` and 6 decimal places, i.e. `1,000,000` fungible tokens should be displayed as `1.000000 XAMPL`.

The registry also includes some historical background for `Example Asset` – it was first released at `2023-01-03T00:00:00.000Z`, with the ticker symbol `EXAMPLE` and 8 decimal places before being redenominated and rebranded; from a user's perspective, `1 EXAMPLE` became `100 XAMPL`. The rebranding and re-denomination migration began at `2023-01-13T00:00:00.000Z` and was considered complete at `2023-02-13T00:00:00.000Z`. The old `icon` and a `web` URI providing more information about the migration is also included.

For more detail, see the [descriptions in the example](./examples/fungible-token.json).

## Art Collection

The [`art-collection.json` example](./examples/art-collection.json) demonstrates how the issuer of a non-fungible token (NFT) art collection might publish information about each token in the collection.

The registry includes only one identity, `Example NFT Collection`, defined as authbase `89cad9e3e34280eb1e8bc420542c00a7fcc01002b663dbf7f38bceddf80e680c` with a matching token category ID.

`Example NFT Collection` has the ticker symbol `XAMPLZ` and defines metadata for 3 sequential NFTs, `Example #0` (`XAMPLZ-0`), `Example #1` (`XAMPLZ-1`), and `Example #2` (`XAMPLZ-2`). The `icon` for each NFT is published via IPFS (as [recommended](./chip#publication-of-static-data)), so clients may download each icon by querying IPFS or by using [HTTP Gateways](https://docs.ipfs.tech/reference/http/gateway/), e.g. [`ipfs://bafybeihnmh5bkbaspp3xfdanje74pekhsklhobzzraeyywq6gcpb3iuvey/0.svg`](ipfs://bafybeihnmh5bkbaspp3xfdanje74pekhsklhobzzraeyywq6gcpb3iuvey/0.svg) may be accessed via CloudFlare's gateway at [`https://cf-ipfs.com/ipfs/bafybeihnmh5bkbaspp3xfdanje74pekhsklhobzzraeyywq6gcpb3iuvey/0.svg`](https://cf-ipfs.com/ipfs/bafybeihnmh5bkbaspp3xfdanje74pekhsklhobzzraeyywq6gcpb3iuvey/0.svg).

For more detail, see the [descriptions in the example](./examples/art-collection.json).

## Decentralized Application

The [`decentralized-application.json` example](./examples/decentralized-application.json) demonstrates how a registry might specify the structure of NFTs used by a decentralized application.

The registry includes only one identity, `Crowdfunding Example`, defined as authbase `89cad9e3e34280eb1e8bc420542c00a7fcc01002b663dbf7f38bceddf80e680c` with a matching token category ID.

This decentralized application uses only one type of parsable NFT, `Pledge Receipt`, which itself contains only one field, `Pledge Value`. This field demonstrates the additional capabilities of the `number` encoding: clients are informed that `Pledge Value` can be aggregated (by addition) in views containing multiple NFTs to provide useful information to the user. For example, if the wallet holds two NFTs, one with a `Pledge Value` of `123456` and one of `654321`, the wallet can display a total of the user's pledges to this campaign in relevant user interfaces: `0.00777777 BCH`.

For more detail, see the [descriptions in the example](./examples/decentralized-application.json).

## Payouts or Dividends

The [`payouts-or-dividends.json` example](./examples/payouts-or-dividends.json) demonstrates how a registry might publish information about fungible tokens that receive [on-chain payouts or dividends](https://bitcoincashresearch.org/t/higher-level-token-standards-using-cashtokens/912/7), either from off-chain activities (e.g. equity or debt instruments) or as part of an on-chain mechanism (e.g. payouts from a decentralized application or sidechain). The example is documented as if the client is reading the registry shortly after its `latestRevision` of 2023-04-14.

The registry includes only one identity, `Example Payout Shares`, defined as authbase `978306aa4e02fd06e251b38d2e961f78f4af2ea6524a3e4531126776276a6af1`.

The first issue of `Example Payout Shares` was issued as token category `978306aa4e02fd06e251b38d2e961f78f4af2ea6524a3e4531126776276a6af1` with symbol `XAMPL-23Q1`. On 2023-03-31, the asset experienced a a metadata update in which the initial token category was replaced with the current category `b1a35cadd5ddb1bd18787eeb99ee061f34b946f0db375d84caadd8ab621c10f5` and symbol `XAMPL-23Q2`. Token holders of the initial category (`978306...`) could visit the new snapshot's `migrate` URI (`https://app.example.com/payouts/2023Q1`) for guidance or assistance in exchanging `XAMPL-23Q1` tokens for the latest `XAMPL-23Q2` tokens; presumably, the new tokens are locked in an on-chain covenant with which `XAMPL-23Q1` holders can swap in their old tokens and receive both a payout for the first quarter of 2023 and the new `XAMPL-23Q2` tokens.

Leading up to 2023-03-31, user wallets would have displayed tokens of the initial category (`978306...`) as `XAMPL`. When the new snapshot became effective, these wallets should have immediately switch to identifying `978306...` tokens as `XAMPL-23Q1`, as the category of the current snapshot (`b1a35c...`) became the new `XAMPL`. Users holding both assets would have seen them listed separately, as `XAMPL-23Q1` entitles the user to both an unpaid payout and current `XAMPL` (`XAMPL-23Q2`) tokens.

Finally, the registry includes information for a planned future snapshot that will become current on 2023-06-30. Clients may notify users in advance if this snapshot appears to impact a user's holdings. As before, clients should consider the current tokens (category `b1a35c...`) to be `XAMPL` until the time of the migration. After the future snapshot comes into effect (`2023-06-30T00:00:00.000Z`), the current tokens should be labelled with their fully-qualified `symbol`, `XAMPL-23Q2`, while tokens of the third category (`89cad9...`) become the new `XAMPL`.

Note, that the mechanics of this example can also be used to improve user experiences in cases where an asset is re-issued or migrated for other technical reasons: on-chain voting, fee assessment, mergers, spinoffs, resolution of contract vulnerabilities, etc.
