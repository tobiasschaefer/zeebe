import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import PanelBody from './PanelBody';

import * as Styled from './styled.js';

class Panel extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    isRounded: PropTypes.bool
  };

  static defaultProps = {
    isRounded: false
  };

  render() {
    const {children} = this.props;
    return <Styled.Panel {...this.props}>{children}</Styled.Panel>;
  }
}

Panel.Footer = PanelFooter;
Panel.Header = PanelHeader;
Panel.Body = PanelBody;

export default Panel;
