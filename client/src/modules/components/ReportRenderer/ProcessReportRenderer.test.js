import React from 'react';
import {shallow} from 'enzyme';

import ProcessReportRenderer from './ProcessReportRenderer';
import {Number, Table} from './visualizations';

import {processResult} from './service';

import {getFlowNodeNames} from 'services';

jest.mock('services', () => {
  const rest = jest.requireActual('services');

  return {
    ...rest,
    getFlowNodeNames: jest.fn().mockReturnValue({
      a: 'foo',
      b: 'bar'
    })
  };
});

jest.mock('./service', () => {
  return {
    isEmpty: str => !str,
    getFormatter: view => v => v,
    processResult: jest.fn().mockImplementation(({result}) => result)
  };
});

const report = {
  combined: false,
  reportType: 'process',
  data: {
    processDefinitionKey: 'aKey',
    processDefinitionVersion: '1',
    view: {
      property: 'foo',
      entity: 'whatever'
    },
    groupBy: {
      type: 'bar'
    },
    visualization: 'number',
    configuration: {}
  },
  result: 1234
};

it('should call getFlowNodeNames on mount', () => {
  shallow(<ProcessReportRenderer report={report} type="process" />);

  expect(getFlowNodeNames).toHaveBeenCalled();
});

it('should display a number if visualization is number', () => {
  const node = shallow(<ProcessReportRenderer report={report} />);
  node.setState({
    loaded: true
  });

  expect(node.find(Number)).toBePresent();
  expect(node.find(Number).prop('report')).toEqual(report);
});

it('should provide an errorMessage property to the component', () => {
  const node = shallow(<ProcessReportRenderer report={report} errorMessage={'test'} />);
  node.setState({
    loaded: true
  });
  expect(node.find(Number)).toHaveProp('errorMessage');
});

const exampleDurationReport = {
  combined: false,
  reportType: 'process',
  data: {
    processDefinitionKey: 'aKey',
    processDefinitionVersion: '1',
    view: {
      property: 'foo',
      entity: 'whatever'
    },
    groupBy: {
      type: 'processInstance',
      unit: 'day'
    },
    visualization: 'table',
    configuration: {}
  },
  result: {
    '2015-03-25T12:00:00Z': 2,
    '2015-03-26T12:00:00Z': 3
  }
};

it('should pass the report to the visualization component', () => {
  const node = shallow(<ProcessReportRenderer report={exampleDurationReport} type="process" />);
  node.setState({
    loaded: true
  });

  expect(node.find(Table)).toHaveProp('report', exampleDurationReport);
});

it('should process the report result', () => {
  const node = shallow(<ProcessReportRenderer report={exampleDurationReport} />);

  expect(processResult).toHaveBeenCalledWith(exampleDurationReport);
});
