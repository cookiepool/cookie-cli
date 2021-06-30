import React from 'react';

import styles from '@/App.scss';

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
