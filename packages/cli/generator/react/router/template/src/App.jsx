import React from 'react';
<%_ if(historyMode) { _%>
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
<%_ } else { _%>
import { HashRouter as Router, Switch, Link } from 'react-router-dom';
<%_ } _%>
import { renderRoutes } from 'react-router-config';
import routes from '@/router';
import Loading from '@/components/Loading';

<%_ if(buildTool.includes('webpack')) { _%>
import styles from './App.scss';
<%_ } _%>
<%_ if(buildTool.includes('vite')) { _%>
import styles from './App.module.scss';
<%_ } _%>
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className={styles.container}>
          <div className={styles['title-wraper']}>
            <Link to="/">
              <span className={styles['link-title']}>Home</span>
            </Link>
            <span className={styles['link-line']}> | </span>
            <Link to="/about">
              <span className={styles['link-title']}>About</span>
            </Link>
          </div>
          <Switch>
            <React.Suspense fallback={<Loading></Loading>}>
              {renderRoutes(routes)}
            </React.Suspense>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
