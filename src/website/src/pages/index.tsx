import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">PARA(Projects · Areas · Resources · Archive) 기반 지식 허브</p>
        <div className={styles.paraButtons}>
          <Link className={`button button--lg ${styles.paraButtonPrimary}`} to="/docs/projects">
            Projects
          </Link>
          <Link className={`button button--lg ${styles.paraButtonOutline}`} to="/docs/area">
            Area
          </Link>
          <Link className={`button button--lg ${styles.paraButtonOutline}`} to="/docs/resource">
            Resource
          </Link>
          <Link className={`button button--lg ${styles.paraButtonOutline}`} to="/docs/archive">
            Archive
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <section className={styles.mainSection}>
          <div className="container">
            <h2>PARA 안내</h2>
            <p>
              이 사이트는 PARA 방법론에 따라 정리된 자료를 제공합니다. 각 섹션을 클릭하여
              프로젝트, 책임 영역, 자료, 보관함을 탐색하세요.
            </p>
            <div className={styles.paraButtons} style={{marginTop: 12}}>
              <Link className={`button ${styles.paraButtonPrimary}`} to="/docs/projects">Projects</Link>
              <Link className={`button ${styles.paraButtonOutline}`} to="/docs/area">Area</Link>
              <Link className={`button ${styles.paraButtonOutline}`} to="/docs/resource">Resource</Link>
              <Link className={`button ${styles.paraButtonOutline}`} to="/docs/archive">Archive</Link>
            </div>
          </div>
        </section>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
