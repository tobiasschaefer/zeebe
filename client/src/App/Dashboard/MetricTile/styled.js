import styled from 'styled-components';
import {Colors, themed, themeStyle} from 'modules/theme';

export const Metric = themed(styled.div`
  padding-top: 6px;
  padding-bottom: 16px;
  font-size: 56px;
  text-align: center;
  opacity: ${({metricColor}) =>
    metricColor === 'themed' &&
    themeStyle({
      dark: 0.9,
      light: 1
    })};
  color: ${({metricColor}) =>
    metricColor === 'themed'
      ? themeStyle({dark: '#ffffff', light: Colors.uiLight06})
      : Colors[metricColor]};
`);

export const Name = themed(styled.div`
  padding-bottom: 22px;
  font-size: 40px;
  line-height: 1.4;
  text-align: center;
  opacity: ${themeStyle({
    dark: 0.9,
    light: 1
  })};
  color: ${themeStyle({dark: '#ffffff', light: Colors.uiLight06})};
`);
