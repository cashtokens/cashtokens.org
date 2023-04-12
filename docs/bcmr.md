# Metadata Registries CHIP

        Title: Bitcoin Cash Metadata Registries
        Type: Standards
        Layer: Applications
        Maintainer: Jason Dreyzehner
        Status: Draft
        Initial Publication Date: 2022-10-31
        Latest Revision Date: 2022-10-31
        Version: 1.0.0

<details>

<summary><strong>Table of Contents</strong></summary>

- [Summary](#summary)
- [Deployment](#deployment)
- [Motivation](#motivation)
- [Benefits](#benefits)
- [Technical Specification](#technical-specification)
- [Rationale](#rationale)
- [Prior Art & Alternatives](#prior-art--alternatives)
- [Test Vectors](#test-vectors)
- [Implementations](#implementations)
- [Feedback & Reviews](#feedback--reviews)
- [Acknowledgements](#acknowledgements)
- [Changelog](#changelog)
- [Copyright](#copyright)

</details>

## Summary

A standard for sharing authenticated metadata between Bitcoin Cash wallets.

## Deployment

This proposal does not require coordinated deployment. Clients can begin implementation upon acceptance of [`CHIP-2022-02-CashTokens`](https://github.com/bitjson/cashtokens).

## Motivation

Bitcoin Cash software requires standards for locating and verifying metadata, allowing user-recognizable names, descriptions, icons, ticker symbols, and other information to be associated with on-chain artifacts like identities, tokens, and contract systems.

## Benefits

### Extensible JSON Schema

Metadata registries use an extensible JSON schema, ensuring a baseline of compatibility across all ecosystem software while enabling individual vendors and industry groups to create extensions and rapidly innovate.

### Interpretation of NFT Commitments

Registries can encode structured information about NFT commitment APIs, allowing ecosystem software to parse and understand the contents of any NFT. This enables generalized user interfaces for all NFTs, and application-specific extensions can build on this NFT parsing infrastructure to enable richer experiences – for example:

- A table of the user's open orders for a decentralized exchange with sums for "Total Tokens for Sale" and "Total BCH Order Value".
- A list of the user's active crowdfunding pledges with information on each campaign and a sum of "Total BCH Pledged".
- A view of the user's tickets with times, dates, location, seat, class, gate, etc. prominently displayed.
- A gallery of the user's collectable NFTs for a particular game ecosystem with images and other metadata displayed using information encoded in each NFT.

### Decentralized Publishing & Verification

Metadata registries can be published by any entity or individual without an approval process. Registries can be authenticated via the Domain Name System (DNS) or via on-chain transactions, enabling strong censorship resistance.

### Contract-Held Identities

Identities are held by BCH contracts, enabling identities to employ the same security strategies as those used to secure funds and tokens, e.g. multisignature wallets, offline signers, time-delayed vaults, bounties/honeypots, and more. Identities can modify their security requirements over time, offering built-in support for key rotation and incremental security enhancement.

### SPV Validation of Identities and Claims

Identities can be verified by validating only the last transaction in a chain of transactions, so validation can be performed by low-resource clients using lightweight proofs (measured in kilobytes).

### Bootstrapped Trust via DNS

Registries may be published via both DNS and on-chain transactions, allowing trust in the registry's identity to be bootstrapped from a domain name that is already known to the user.

## Technical Specification

A **Bitcoin Cash Metadata Registry** (BCMR) is an authenticated JSON file containing metadata about tokens, individual and organizational identities, contract applications, and other on-chain artifacts. BCMRs conform to a [Metadata Registry JSON Schema](#metadata-registry-json-schema), and they can be published and maintained by any entity or individual.

**Client software** – wallets, indexers, and other software that utilizes metadata – can acquire and authenticate metadata registries using multiple strategies. **Metadata-validating clients** are clients that fully support acquiring and authenticating [chain-resolved registries](#chain-resolved-registries); **DNS-only clients** are clients that support only [DNS-resolved registries](#dns-resolved-registries).

### Embedded Registries

**Embedded metadata registries** are built in to published releases of client software, providing a default registry of metadata assembled by the software publisher.

It is recommended that all client software include an initially-trusted, embedded registry. Client software may support updating embedded registries [via DNS](#dns-resolved-registries) or [via on-chain transactions](#chain-resolved-registries).

### Manually-Imported Registries

Where appropriate, client software may provide advanced users with the ability to manually import registries (e.g. from a file or from an arbitrary URL). Note that malicious registries can mislead users into mislabeling token, identities, and contract applications, leading to loss of value. Implementers supporting manually-imported registries should review the [Guidelines for Client Software](#guidelines-for-client-software).

### DNS-Resolved Registries

**DNS-resolved metadata registries** are associated with a particular [Fully-Qualified Domain Name (FQDN)](https://en.wikipedia.org/wiki/Fully_qualified_domain_name); they are acquired and authenticated using [Hypertext Transfer Protocol Secure (HTTPS)](https://en.wikipedia.org/wiki/HTTPS).

DNS resolution allows registries to bootstrap trust from domain names that are already known to users. After initially importing a DNS-resolved registry, clients can receive faster updates and prevent targeted attacks by upgrading to [on-chain resolution](#chain-resolved-registries).

#### Well-Known URI

DNS-resolved metadata registries are published using a [Well-Known URI](https://en.wikipedia.org/wiki/Well-known_URI) with the `https` scheme and a suffix of `bitcoin-cash-metadata-registry.json`. For example, given a fully-qualified domain name of `test.example.com`, the metadata registry must be published at `https://test.example.com/.well-known/bitcoin-cash-metadata-registry.json` and accessed via `GET` request.

Registries must allow [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) using `Access-Control-Allow-Origin: *`.

If the registry is returned with a `max-age` directive in its [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP header, clients must invalidated and refetch the registry after the stated expiration. If no `max-age` is set, clients should consider downloaded registries to expire after `7` days (`max-age=604800`).

#### HTTP Redirect Handling

All clients must support the HTTP [`301 Moved Permanently`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) and [`302 Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) redirect status response codes when fetching DNS-resolved metadata registries.

Clients may handle a status response code of `302` without notifying the user. The registry must be fetched from the alternative URL provided in the `Location` header, and `Location` URLs that do not conform to the [Well-Known URI](#well-known-uri) are acceptable.

Clients must handle a status response code of `301` by notifying the user of the permanent redirection. The registry must be fetched from the alternative URL provided in the `Location` header, and `Location` URLs that do not conform to the [Well-Known URI](#well-known-uri) are acceptable. The client must update its records of the canonical Fully-Qualified Domain Name (FQDN) for the metadata registry being fetched; future registry updates must be fetched from the [Well-Known URI](#well-known-uri) using the updated FQDN (even if the returned `Location` URL did not conform to the Well-Known URI).

#### Upgrade to On-Chain Resolution

DNS-resolved metadata registries may indicate a preference for [on-chain resolution](#chain-resolved-registries) by specifying an [authbase](#authbase) in the `registryIdentity` property of the metadata registry.

If a received registry indicates a `registryIdentity` authbase, clients with support for [chain-resolved registries](#chain-resolved-registries) (metadata-validating clients) must update their records to set the indicated authbase as the root of trust for that registry and immediately begin to fetch the registry using [chain resolution](#on-chain-metadata-registry-resolution). Clients without support for on-chain resolution (DNS-only clients) should warn the user that the fetched registry prefers on-chain resolution, but the client only supports DNS resolution.

If the DNS-resolved registry includes the [`authchain` extension](#authchain-extension) for the authbase indicated in `registryIdentity`, chain resolution should be [accelerated using the provided authchain data](#authchain-extension). (Note, the registry's authhead transaction must commit to the hash of the published registry, so the registry identity's `authchain` extension is expected to not include the latest authhead transaction.)

### Chain-Resolved Registries

**Chain-resolved metadata registries** are associated with a particular **authbase**, a 32-byte, hex-encoded transaction hash (A.K.A. TXID) for which the [**zeroth-descendant transaction chain** (ZDTC)](#zeroth-descendant-transaction-chains) authenticates and publishes all registry updates.

Chain resolution offers stronger security and better user experiences than DNS resolution:

- **Enhanced identity security** – identities are controlled by unspent transaction outputs, so identity owners can employ the same security strategies used to secure funds and tokens (e.g. multisignature wallets, offline signers, time-delayed vaults, bounties/honeypots, etc.); this avoids many classes of attacks possible against DNS-resolved registries.
- **Prevention of targeted attacks** – a hash of the registry is published on the blockchain, so clients can ensure that a received registry is identical to that received by every other client.
- **Real-time updates** – identity updates are broadcasted by spending the identity's latest [identity output](#zeroth-descendant-transaction-chains), so clients can detect updates using standard light wallet infrastructure (e.g. [Simplified Payment Verification](https://web.archive.org/web/20100704213649/https://bitcoin.org/bitcoin.pdf)).

#### Zeroth-Descendant Transaction Chains

A **zeroth-descendant transaction chain** – also known as an **authchain** – is a chain of transactions where the output at index `0` for each transaction is spent by the following transaction. In the context of authchains, the transaction output at index `0` is known as the transaction's **identity output**. Because all Bitcoin Cash transactions must have at least one output, every valid transaction has a single identity output.

The first transaction in an authchain is referred to as the **authbase transaction**; authbase transactions have no distinguishing features, and any valid transaction can serve as an authbase transaction. The final transaction in an authchain is referred to as the **authhead transaction**. By definition, the identity output of the authhead transaction is unspent.

#### Authchain Resolution

To resolve an authchain (a [zeroth-descendant transaction chain](#zeroth-descendant-transaction-chains)), clients must recursively identify the transaction that spent the output at index `0` of the current transaction, beginning with the authbase transaction. (Note, this process can be [accelerated using data from `authchain` extensions](#authchain-extension) in registries.)

Once validated, clients should retain a mapping of the authbase to the latest identity input to accelerate future resolutions. To track an identity for future updates, clients should monitor the latest identity input for spends (e.g. wallets may monitor tracked identity outputs as if they were UTXOs held by the wallet).

##### Burned Identities

Identities for which the authhead transaction includes a data-carrier output (an output beginning with `OP_RETURN`/`0x6a`) as the identity output are considered "**burned**". Identities may be burned to broadcast that the identity is no longer maintained and can be safely forgotten or archived by clients. Other standards may make use of identity-burning data-carrier output to broadcast additional information about the burned identity.

Note that identities undergoing name changes or other significant changes to metadata need not burn the identity; updated metadata can be published via [on-chain identity claims](#on-chain-identity-claims). Note also that identities can be seamlessly merged (e.g. after a merger or acquisition) by spending both identity outputs in the same transaction, so burning actively-used identities is rarely necessary.

#### On-Chain Identity Claims

By including standardized data-carrier outputs in [authhead](#zeroth-descendant-transaction-chains) transactions, identities can broadcast **on-chain identity claims** – public attestations by the identity about various topics.

On-chain identity claims can be used to broadcast information like metadata registries, hashes of software updates, [warrant canaries](https://en.wikipedia.org/wiki/Warrant_canary), [tamper-evident logs](https://transparency.dev/), [reusable payment addresses](https://github.com/imaginaryusername/Reusable_specs/blob/16025c2f9f20c9dd16e1619a7a742dad908865f3/reusable_addresses.md), [onion service](https://community.torproject.org/onion-services/) addresses, and other information relating to the broadcasting identity. (Note, metadata registry [extensions](#extensions) offer an off-chain alternative to on-chain identity claims.)

[Metadata Registry Publication Outputs](#metadata-registry-publication-outputs) are the only type of on-chain identity claim standardized by this specification.

#### On-Chain Metadata Registry Resolution

To resolve a metadata registry that is published on chain, clients must first [resolve and validate the authchain](#authchain-resolution) for the registry's identity. Once the registry's authhead transaction has been acquired and validated, the client must inspect the authhead transaction's outputs to locate the [metadata registry publication output](#metadata-registry-publication-outputs), then fetch and verify the registry using the appropriate strategy for that publication output (either [IPFS](#ipfs-publication-outputs) or [HTTPS](#https-publication-outputs)).

#### Metadata Registry Publication Outputs

Chain-resolved registries are published using **metadata registry publication outputs**, data-carrier outputs that include the hash and – optionally – an HTTPS URL from which the registry can be downloaded.

The locking bytecode of publication outputs must conform to the following structure:

```
OP_RETURN <'BCMR'> <hash> [<https_url>]
```

Metadata registry publication outputs are identified by the **locking bytecode prefix** `OP_RETURN <'BCMR'>` (`0x6a0442434d52`).

Every transaction can have **zero or one metadata registry publication output**; if multiple outputs share the required locking bytecode prefix, the first (the output at the lowest-value index) is considered the definitive publication output, and later outputs sharing the prefix must be ignored. (Note, even if the first matching output is malformed – e.g. it does not push a `hash` – later matching outputs should not be considered by clients.)

##### IPFS Publication Outputs

Publication outputs with only two pushed items (where the `<https_url>` is omitted) are **[IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) publication outputs**. For these outputs, the `hash` is a [binary-encoded IPFS Content Identifier (CID)](https://docs.ipfs.tech/concepts/content-addressing/#cid-conversion). Clients must fetch these registries using [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System).

Clients without access to full IPFS nodes may use [HTTP Gateways](https://docs.ipfs.tech/reference/http/gateway/) to resolve IPFS-published registries. Clients using HTTP gateways must self-verify the response to confirm it matches the requested CID.

##### HTTPS Publication Outputs

Publication outputs with the third pushed item (`https_url`) are **HTTPS publication outputs**. For these outputs, the `hash` is the SHA-256 hash (encoded in `OP_SHA256` byte order<sup>1</sup>) of the registry contents, and the `https_url` is the [percent-encoded](https://en.wikipedia.org/wiki/Percent-encoding) URL from which the registry can be downloaded, excluding the `https://` protocol prefix<sup>2</sup>. It is recommended that `https_url` conform to the [Well-Known URI](#well-known-uri).

After fetching a registry from the published `https_url`, clients must verify the response to confirm it matches the published SHA-256 `hash`.

To avoid leaking connection information to registry hosts, clients may choose to download the registry via Tor or via a trusted proxy, VPN, or mirror service. Because the hash of the downloaded registry is verified, sources need not be trusted for registry integrity.

<details>

<summary>Notes</summary>

1. This is the byte order produced/required by all BCH VM operations which employ SHA-256 (including `OP_SHA256` and `OP_HASH256`), the byte order used for outpoint transaction hashes in the P2P transaction format, and the byte order produced by most SHA-256 libraries. For reference, the genesis block header in this byte order is little-endian – `6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000` – and can be produced by this script: `<0x0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c> OP_HASH256`. (Note, this is the opposite byte order as is commonly used in user interfaces like block explorers.)
2. For example, a registry hosted at `https://www.example.com/bcmr registry.json` with a hash of `0x6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000` would be encoded using the locking script: `OP_RETURN <'BCMR'> <0x6fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000> <'www.example.com/bcmr%20registry.json'>` producing the locking bytecode: `0x6a0442434d52206fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000247777772e6578616d706c652e636f6d2f62636d7225323072656769737472792e6a736f6e`.

</details>

### Metadata Registry JSON Schema

Metadata registries conform to the [**Metadata Registry JSON Schema**](/bcmr-v2.schema.json) ([source TypeScript type definitions](https://github.com/bitjson/chip-bcmr/blob/master/bcmr-v2.schema.ts)). The JSON schema is internally-documented, but notable features are discussed below.

#### Identities

Identities are the core primitive of metadata registries – they can encapsulate metadata about the metadata registry itself, other metadata registries, individuals, organizations, products, tokens, and various on-chain entities.

Every identity is defined by an [authbase](#chain-resolved-registries). **An identity's authbase is both a globally-unique identifier and its root of trust**: the entire history of an identity – it's [authchain](#zeroth-descendant-transaction-chains) – can be [trustlessly verified by light clients](#authchain-resolution), including globally-broadcasted, [on-chain identity claims](#on-chain-identity-claims).

Metadata registries map any number of authbases to concise representations of each identity's history. By standardizing a strategy for describing notable evolutions of an identity over time, clients can provide more consistent user experiences across the ecosystem.

#### Identity Snapshots

All identity metadata is organized into **identity snapshots**, data structures that contain metadata for a particular identity as of a specific time.

Snapshots can include general information about the identity like `name`, `description`, [`tags`](#tags), and [`uris`](#uri-identifiers). For identities that represent token categories, snapshots can include the current `category`, display information like `symbol`, and `decimals`, and detailed technical metadata like parsing, encoding, and semantic information about various types of NFTs available within the token category.

At any moment in time, only one snapshot is considered "current" for an identity. However, using the `IdentitySnapshot.migrated` property, a snapshot can indicate that the identity's prior snapshot remains relevant (e.g. an in-circulation token identity is gradually migrating to a new token category).

#### Identity History

Each identity in a metadata registry is represented by an `IdentityHistory` data structure, a map of ISO timestamps to [`IdentitySnapshot`](#identitysnapshots)s. `IdentityHistory` data structures allow clients to construct a timeline of the evolution of a particular identity, helping users recognize and disambiguate identities that have changed significantly since the user last interacted with that identity.

Typically, the current identity information is the latest record when the keys (timestamps) are lexicographically sorted, but in cases where a [planned migration](#handling-identity-snapshot-migrations) has not yet begun (the snapshot's timestamp has not been reached), the immediately preceding record is considered the current identity.

#### Tags

Tags allow registries to classify and group identities by a variety of characteristics. Tags are standardized within a registry and may represent either labels applied by that registry or designations by external authorities (certification, membership, ownership, etc.) that are tracked by that registry.

Examples of possible tags include: `individual`, `organization`, `token`, `wallet`, `exchange`, `staking`, `utility-token`, `security-token`, `stablecoin`, `wrapped`, `collectable`, `deflationary`, `governance`, `decentralized-exchange`, `liquidity-provider`, `sidechain`, `sidechain-bridge`, `acme-audited`, `acme-endorsed`, etc.

Tags may be used by clients in search, discovery, and filtering of identities, and they can also convey information like accreditation from investor protection organizations, public certifications by security or financial auditors, and other designations that signal integrity or value to users.

#### URI Identifiers

Both the `IdentitySnapshot` and `Tag` types may include a `uris` property mapping any number of **URI Identifiers** to URIs. **Conforming clients must support both `https` and `ipfs` URIs**. (Note: rudimentary support for `ipfs` can be implemented using [trusted HTTPS gateways](https://docs.ipfs.tech/reference/http/gateway/).)

Several URI identifiers are standardized by this specification, and any number of [custom URI identifiers](#custom-uri-identifiers) may also be used by other standards or vendor-specific software. All URIs must be provided in full, including protocol prefix (e.g. `https://` or `ipfs://`). Other protocol prefixes may be specified, but they might not be supported by all clients.

##### Recommended URI Identifiers

The following identifiers are strongly recommended for all identities and tags:

| Identifier | Description                                                                                                                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`     | A URI pointing to a square, static icon that represents this identity or tag. Transparency is supported, and icons should be suitable for display against both light and dark backgrounds. Acceptable formats are `SVG`, `AVIF`, `WebP`, or `PNG`; `SVG` is recommended. For raster formats, the recommended size is `400px` by `400px`. |
| `web`      | The URI for a website offering information about this registry, identity, or tag.                                                                                                                                                                                                                                                        |

##### Optional URI Identifiers

The following optional URI identifiers are standardized:

| Identifier   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blog`       | A URI identifying a blog or other news source for this identity or tag.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `chat`       | A URI identifying a community chatroom for this identity or tag.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `forum`      | A URI identifying a community forum for this identity or tag.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `icon-intro` | A URI pointing to a square, animated icon that represents this identity or tag. The animation should play once (without looping) to introduce the static icon. Transparency is supported, and icons should be suitable for display against both light and dark backgrounds. Acceptable formats are `SVG`, `AVIF`, or `WebP`. For raster formats, the recommended size is `400px` by `400px`.                                                                                                                                                                                                                                                                                             |
| `registry`   | The primary-source registry URI for this identity or tag. For DNS-resolved registries, this is the full, [Well-Known URI](#well-known-uri) from which the registry can be downloaded. For chain-resolved registries and other identities, this is the full URI of the latest registry published on-chain by the identity. For tags, The `registry` identifier should only be used when a tag represents a formal designation by a particular authority (certification, membership, ownership, etc.); when present, this URI points to the canonical registry published by that authority. Tags without this identifier are assumed to be created and applied by the containing registry. |
| `support`    | A URI offering user-facing support for this identity or tag.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

##### Custom URI identifiers

Custom URI identifiers allow for sharing social networking profiles, p2p connection information, and other application-specific URIs. Identifiers must be lowercase, alphanumeric strings, with no whitespace or special characters other than dashes (as a regular expression: `/^[-a-z0-9]+$/`).

For example, some common identifiers include: `discord`, `docker`, `facebook`, `git`, `github`, `gitter`, `instagram`, `linkedin`, `matrix`, `npm`, `reddit`, `slack`, `substack`, `telegram`, `twitter`, `wechat`, `youtube`. Note that the `CC0-1.0`-licensed [Simple Icons](https://simpleicons.org/) project offers icons for these and many other identifiers.

#### Extensions

The metadata registry includes an optional `extensions` property for registries, identities, tags, NFT types, and NFT fields. Extensions offer the flexibility to associate arbitrary, vendor-specific metadata with a particular registry, identity, or tag.

For example, a `contact` extension could specify common contact information for an identity:

```json
{
  "extensions": {
    "contact": {
      "phone": "+1 (123) 456-7890",
      "email": "contact@example.com",
      "postal-address": "New Hampshire State House Museum\n107 N Main St\nConcord, NH 03301"
    }
  }
}
```

Like [Custom URI identifiers](#custom-uri-identifiers), extensions identifiers must be lowercase, alphanumeric strings, with no whitespace or special characters other than dashes (as a regular expression: `/^[-a-z0-9]+$/`).

This specification standardizes several extensions.

##### Locales Extension

The `locales` extension is standardized for the `Registry` type. When provided, `locales` specifies a mapping of Unicode locale identifiers (conforming to [ECMAScript's `Intl.Locale`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) object) to localized versions of metadata registry contents. The following optional properties may be provided within each locale: `identities`, `tags`, and `extensions`. (Note, registry property names and standardized identifiers are never localized.)

**Outside of the `locales` extension, metadata registries are considered to be provided in the `English` Unicode locale (identifier: `en`)**. All other locales – including regional English locales like `en-US` or `en-GB` – must be provided via the `locale` extension.

**It is acceptable for registries to be partially-localized.** For example, some locales may exclude identities that appear in the `en` locale (and vice versa). Clients with support for the `locale` extension will attempt to use metadata from the user's preferred locale, falling back to metadata from the closest available locale. (Note, it is not necessary for registries to include any metadata for the `en` locale; registries that omit both the `identities` and `tags` fields from the `en` locale may still provide either or both fields for any number of other locales using the `locales` extension.)

Registries should avoid localizing custom identifiers (like URI and tag identifiers) to ensure consistency across all locales.

###### Assembling Localized Registries

A localized registry is produced by the following algorithm:

1. Given the user's preferred locale, locate the registry's closest specified locale in the `locale` extension. If a precise match is not available, fall back recursively to the closest available locale. If no matching language is available, default to `en`. E.g. If the user's preferred locale is `de-AT`, fall back to `de`, then `en`.
2. Beginning from the closest available locale, assemble a list of matching locales in reverse order of specificity. E.g. `["en", "de", "de-AT"]`. (Note, `en` is a special case; other `en` locales should not be included in this list for non-english locales.)
3. Create a localized registry by inheriting from each locale beginning with the least specific locale:
   1. From the current locale, assign all `identities`, `tags`, and `extensions` (excluding the `locale` extension) to the generated locale, overriding the full definition at that identifier with the localized definition from the more-specific locale. (Note, replacement is object-level; do not attempt to merge two definitions for the same identifier.)
   2. If this client is deeply-validating the registry, verify the consistency of recognized, non-localized metadata and emit an error if any differences are found (e.g. metadata such as `token.category` and `token.symbol` should not vary between locales).
   3. Repeat using the next-most-specific locale until all locales have been applied.

When the `locales` extension is configured, clients should use this localized registry for all metadata.

##### Authchain Extension

The `authchain` extension is standardized for `IdentitySnapshot`s. When provided, `authchain` reduces the work and data required for clients to [verify the metadata](#chain-verified-identities) of a particular identity.

The `authchain` extension value must be an numerically-indexed object of strings, where all indexes are contiguous integers beginning with `0`. The first string (index `0`) must be the hex-encoded [authbase transaction](#zeroth-descendant-transaction-chains) for the identity (the identity's authbase is this transaction's ID). Each subsequent string must be the next transaction in the authchain, and the final string must be the latest known [authhead transaction](#zeroth-descendant-transaction-chains) for the identity.

Clients may use the `authchain` extension to rapidly update their records for a particular identity using the following validation algorithm:

1. Verify that the string at index `0` is the authbase transaction by double sha-256 hashing it and verifying the result is equal to the identity's known authbase.
2. Decode each successive transaction in the authchain, verifying that an input in each transaction spends the identity output (output index `0`) of the previous transaction.
3. After verifying that the final transaction spends the identity output of the second-to-last transaction, attempt to verify that the identity output of the final transaction is currently present in the Unspent Transaction Output (UTXO) set:
   1. If currently in the UTXO set, the authchain is verified and this transaction is the identity's authhead – [metadata verification](#chain-verified-identities) can proceed immediately.
   2. If not in the UTXO set, attempt to [continue resolution](#authchain-resolution) from this transaction. (The identity may have been updated since the registry was published.)
4. If any of these verifications fail – or if continued resolution from the last transaction fails, notify the user that registry's view of the chain has diverged from that of the client. (For trusted registries, this may indicate a network split or a client software bug; in other cases, this may indicate a flaw in the registry.)

### Guidelines for Token Issuers

If additional fungible tokens may be needed in the future, token issuers should initially mint an excess supply and hold them in the identity output with a [mutable token](https://github.com/bitjson/cashtokens#token-types) (using any `commitment` value) to indicate they are part of the [Reserved Supply](https://github.com/bitjson/cashtokens#reserved-supply). This enables light-client verification of the maximum possible [Circulating Supply](https://github.com/bitjson/cashtokens#circulating-supply).

### Guidelines for Client Software

The following recommendations are made for wallets, indexers, and other client software.

#### Adding and Updating Registries

To prevent malicious registries from causing users to misidentify tokens, clients should attempt to verify that newly imported identities are not impersonating identities that might be recognized by the user.

It is recommended that all supporting client software include at least one [embedded registry](#embedded-registries) to serve as a basis for anomaly detection. Additionally, clients should include a list of **reserved token symbols** that trigger further verification when used to represent token identities imported via metadata registries. For reference, this repository includes two sample lists [`reserved-token-symbols-ISO-4217.json`](./reserved-token-symbols-ISO-4217.json) (based on [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)) and [`reserved-token-symbols-cryptocurrencies.json`](./reserved-token-symbols-cryptocurrencies.json) (top 100 cryptocurrencies by market cap at initial publication).

When adding or updating a registry, clients should perform basic validation of the newly-received registry:

1. Using the client's existing registries, build a mapping of identity `token.symbol` values to known authbases.
2. Iterating through the newly-received registry, verify that each new `token.symbol`:
   1. Passes token symbol validation. (Regular expression: `/^[-A-Z0-9]+$/`)
   2. Maps to the same authbase in existing registries as is represented in the new registry.
   3. Does not appear on the client's list of reserved token symbols.

If this validation fails, clients should either:

- Notify users of each collision and request user confirmation that each newly-imported identity is acceptable;
- Refuse to import new identities that failed validation; or
- Refuse to import the new registry.

#### Handling Identity Snapshot Migrations

Each `IdentitySnapshot` is assigned to a timestamp at which the snapshot began or will begin to take effect. If no `IdentitySnapshot.migrated` timestamp is provided, the snapshot's migration is considered **instant**: the new information should be displayed immediately after the assigned timestamp has been reached. If `IdentitySnapshot.migrated` is provided, the snapshot's migration is considered **gradual**: the migration period begins at the `IdentitySnapshot`'s initial timestamp and completes upon reaching the `IdentitySnapshot.migrated` timestamp. Clients are encouraged to surface both kinds of migrations to users.

**Where possible, clients should notify users about upcoming and recent migrations that impact in-use identities.**

Note that while it is technically possible for registries to encode two overlapping migrations, clients should only attempt to use information from the latest migration (between the latest and previous snapshots when timestamps are lexicographically sorted).

## Test Vectors

_(pending initial implementations)_

## Implementations

The following software is known to support Bitcoin Cash Metadata Registries:

_(pending initial implementations)_

## Feedback & Reviews

- [CHIP-BCMR Issues](https://github.com/bitjson/chip-bcmr/issues)
- [`CHIP-BCMR: Bitcoin Cash Metadata Registries` - Bitcoin Cash Research](https://bitcoincashresearch.org/t/chip-bcmr-bitcoin-cash-metadata-registries/942)

## Changelog

This section summarizes the evolution of this document.

- **Draft**
  - Initial publication

## Copyright

This document is placed in the public domain.
