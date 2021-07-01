import React from 'react';

import logo from '@/assets/logo.svg';
<%_ if(buildTool.includes('webpack')) { _%>
import styles from '@/App.scss';
<%_ } _%>
<%_ if(buildTool.includes('vite')) { _%>
import styles from '@/App.module.scss';
<%_ } _%>
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={styles['App-link']}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
