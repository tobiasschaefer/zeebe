/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

import {act} from '@testing-library/react';
import {render, screen} from 'modules/testing-library';
import {processInstancesSelectionStore} from 'modules/stores/processInstancesSelection';
import {mockFetchProcessInstances} from 'modules/mocks/api/processInstances/fetchProcessInstances';
import {mockProcessInstances} from 'modules/testUtils';
import {
  fetchProcessInstances,
  fetchProcessXml,
  getProcessInstance,
  getWrapper,
} from '../mocks';
import {MoveAction} from '.';
import {mockFetchProcessXML} from 'modules/mocks/api/processes/fetchProcessXML';
import {open} from 'modules/mocks/diagrams';

const PROCESS_DEFINITION_ID = '2251799813685249';
const PROCESS_ID = 'MoveModificationProcess';
const mockProcessXML = open('MoveModificationProcess.bpmn');

jest.mock('modules/stores/processes/processes.list', () => ({
  processesStore: {
    getPermissions: jest.fn(),
    state: {processes: []},
    versionsByProcessAndTenant: {
      [`{${PROCESS_ID}}-{<default>}`]: [
        {id: PROCESS_DEFINITION_ID, version: 1},
      ],
    },
  },
}));

describe('<MoveAction />', () => {
  it('should disable button when no process version is selected', () => {
    render(<MoveAction />, {wrapper: getWrapper()});

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'Please select an element from the diagram first.',
    );
  });

  it('should disable button when only finished instances are selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=Task`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('CANCELED', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'You can only move flow node instances in active or incident state.',
    );
  });

  it('should disable button when start event is selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=StartEvent`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'The selected element type is not supported.',
    );
  });

  it('should disable button when boundary event is selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=BoundaryEvent`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'The selected element type is not supported.',
    );
  });

  it('should disable button when multi instance task is selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=MultiInstanceTask`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'The selected element type is not supported.',
    );
  });

  it('should disable button if element is attached to event based gateway', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=MessageEvent`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'Elements attached to an event based gateway are not supported.',
    );
  });

  it('should disable button if element is inside multi instance sub process', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=TaskInsideMultiInstance`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    const moveButton = screen.getByRole('button', {name: /move/i});

    expect(moveButton).toBeDisabled();
    expect(moveButton).toHaveAttribute(
      'title',
      'Elements inside a multi instance element are not supported.',
    );
  });

  it('should enable move button when active or incident instances are selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=Task`,
      ),
    });

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    const instance = getProcessInstance('ACTIVE', mockProcessInstances);

    expect(screen.getByRole('button', {name: /move/i})).toBeDisabled();

    act(() => {
      processInstancesSelectionStore.selectProcessInstance(instance.id);
    });

    expect(screen.getByRole('button', {name: /move/i})).toBeEnabled();
  });

  it('should enable move button when all instances are selected', async () => {
    mockFetchProcessInstances().withSuccess(mockProcessInstances);
    mockFetchProcessXML().withSuccess(mockProcessXML);

    const {user} = render(<MoveAction />, {
      wrapper: getWrapper(
        `/processes?process=${PROCESS_ID}&version=1&flowNodeId=Task`,
      ),
    });

    expect(screen.getByRole('button', {name: /move/i})).toBeDisabled();

    await fetchProcessInstances(screen, user);
    await fetchProcessXml(screen, user);

    act(() => {
      processInstancesSelectionStore.selectAllProcessInstances();
    });

    expect(screen.getByRole('button', {name: /move/i})).toBeEnabled();
  });
});
