import React from 'react';

<%_ if(buildTool.includes('webpack')) { _%>
import styles from '@/App.scss';
<%_ } _%>
<%_ if(buildTool.includes('vite')) { _%>
import styles from '@/App.module.scss';
<%_ } _%>
class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="about-wraper">
        <h2 className={styles['about-text']}>This is about page</h2>
        <h3 className={styles['about-h3-text']}>This is H3 fragment</h3>
      </div>
    );
  }
}

export default About;
