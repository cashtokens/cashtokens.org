import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Reliably Low Fees',
    description: (
      <>
        CashTokens are digital assets created on Bitcoin Cash. CashToken
        transactions are highly-efficient and validated in parallel, so
        transaction fees are <strong>less than $0.01</strong>, even during
        periods of high network usage.
      </>
    ),
  },
  {
    title: 'Widespread Support',
    description: (
      <>
        CashTokens are the built-in token system of the global, decentralized
        Bitcoin Cash network. CashTokens are supported by a growing number of
        wallets, services, tools, and companies.
      </>
    ),
  },
  {
    title: 'Decentralized Applications',
    description: (
      <>
        CashTokens enable developers to build on-chain, decentralized
        applications like crowdfunding systems, trading protocols, decentralized
        exchanges (DEXs), cross-chain bridges, and more.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
