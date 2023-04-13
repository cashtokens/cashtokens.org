---
sidebar_position: 1
title: Introduction
---

# Tokens on Bitcoin Cash

CashTokens are digital assets that can be created and used on the global, decentralized Bitcoin Cash (BCH) network. These tokens can be issued by any person, organization, or decentralized application.

Like Bitcoin Cash, **tokens cannot be counterfeited**. Tokens can be held by any contract, wallets can easily verify the authenticity of a token or group of tokens, and tokens cannot be inadvertently destroyed by non-token-aware software.

## Fungible Tokens

**Fungible tokens** are "tokens" as most commonly understood – they have a total supply and **each unit is undifferentiated from each other unit**. Multiple groups of fungible tokens can be merged into a single group in a transaction, and that group can again be divided into multiple smaller groups of tokens.

Fungible tokens are the basic building block behind most exchangeable assets: stocks, bonds, options, stablecoins, regional currencies, asset-backed tokens, general-admission tickets, loyalty points, etc.

Beyond representing off-chain assets, fungible tokens are critical for decentralized applications to represent on-chain assets – e.g. voting shares, utility tokens, collateralized loans, hedging contract positions, [prediction market](https://blog.bitjson.com/prediction-markets-on-bitcoin-cash/) options, etc. – and to implement [complex coordination tasks](./spec/examples) – e.g. [liquidity-pooling](https://github.com/bitjson/jedex), auctions, [voting](./spec/examples#voting-with-fungible-tokens), sidechain withdrawals, spin-offs, mergers, and more.

## Non-Fungible Tokens

In contrast to fungible tokens, **non-fungible tokens** are **unique units which cannot be merged or divided**. In the CashTokens terminology, they are authenticated messages belonging to a **token category** – a domain of tokens issued by a particular person, organization, or decentralized application.

Non-fungible tokens allow contracts to attest to some message, a **commitment**, in an impersonation-proof way: other contracts can safely read and act on the commitment, certain that it was produced by the claimed contract. This primitive enables covenants to design **public interfaces**, paths of operation intended for other contracts – even contracts which are designed and deployed separately.

## Decentralized Applications

In short, non-fungible tokens **allow contracts to "call" other contracts**, while preserving Bitcoin Cash's massively-parallel performance (already [25,000 transactions per second on modest, 2020 hardware](https://read.cash/@TomZ/scaling-bitcoin-cash-be8344a6)). With these building blocks, we can build advanced, [decentralized applications on Bitcoin Cash](./spec/examples).

**Bitcoin Cash decentralized applications can already scale to millions of users without increasing transaction fees**, even during periods of high network activity. Bitcoin Cash covenants [don't rely on miners for transaction ordering](./spec/examples#multithreaded-covenants), so high network usage has no impact on transaction fees.

## Opt-In Support

CashTokens are a built-in, optional feature of the Bitcoin Cash network. Token-supporting wallets use unique payment addresses or query parameters to indicate their ability to receive CashTokens, so users of CashTokens don't need to worry about compatibility when sending tokens – the sending wallet can inform the user if the receiver's wallet is unable to accept tokens. Wallets can safely accept and send Bitcoin Cash without supporting CashTokens, allowing simple BCH-only wallets and utilities to minimize development and maintenance effort.

## Learn More

You can learn more about CashTokens by reviewing the [technical specification](./spec/chip). The specification also includes appendices describing practical [contract usage examples](./spec/examples), the [rationale behind various design decisions](./spec/rationale), a summary of [prior art and alternatives](./spec/alternatives), and the [consensus process](./spec/stakeholders) by which CashTokens was developed and deployed.

This documentation also includes the [technical specification for Bitcoin Cash Metadata Registries](./bcmr), an application layer standard for sharing authenticated metadata between Bitcoin Cash wallets that allows user-recognizable names, descriptions, icons, ticker symbols, etc. to be associated with on-chain artifacts like identities, tokens, and contract systems.
