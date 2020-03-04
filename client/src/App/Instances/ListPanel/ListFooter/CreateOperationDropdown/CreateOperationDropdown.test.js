/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import React from 'react';
import {mount} from 'enzyme';

import {OPERATION_TYPE} from 'modules/constants';
import Dropdown from 'modules/components/Dropdown';

import {mockUseOperationApply} from './CreateOperationDropdown.setup';

import CreateOperationDropdown from './';

jest.mock('./useOperationApply', () => () => mockUseOperationApply);

describe('CreateOperationDropdown', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render button', () => {
    // given
    const node = mount(<CreateOperationDropdown label="MyLabel" />);

    // when
    const button = node.find('button');

    // then
    expect(button.text()).toContain('MyLabel');
  });

  it('should show dropdown menu on click', () => {
    // given
    const node = mount(<CreateOperationDropdown label="MyLabel" />);
    const button = node.find('[data-test="dropdown-toggle"]').first();

    // when
    button.simulate('click');

    // then
    const retryButton = node
      .find(Dropdown.Option)
      .at(0)
      .find('button');

    const cancelButton = node
      .find(Dropdown.Option)
      .at(1)
      .find('button');

    expect(retryButton.text()).toContain('Retry');
    expect(cancelButton.text()).toContain('Cancel');
  });

  it('should trigger data manager on retry click', () => {
    // given
    const node = mount(<CreateOperationDropdown label="MyLabel" />);
    const button = node.find('[data-test="dropdown-toggle"]').first();

    // when
    button.simulate('click');

    // then
    const retryButton = node
      .find(Dropdown.Option)
      .at(0)
      .find('button');

    retryButton.simulate('click');

    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledTimes(1);
    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledWith(
      OPERATION_TYPE.RESOLVE_INCIDENT
    );
  });

  it('should trigger data manager on cancel click', () => {
    // given
    const node = mount(<CreateOperationDropdown label="MyLabel" />);
    const button = node.find('[data-test="dropdown-toggle"]').first();

    // when
    button.simulate('click');

    // then
    const retryButton = node
      .find(Dropdown.Option)
      .at(1)
      .find('button');

    retryButton.simulate('click');

    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledTimes(1);
    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledWith(
      OPERATION_TYPE.CANCEL_WORKFLOW_INSTANCE
    );
  });

  it('should call applyOperation', () => {
    const node = mount(
      <CreateOperationDropdown label="MyLabel" selectedCount={2} />
    );

    const button = node.find('[data-test="dropdown-toggle"]').first();

    // when
    button.simulate('click');

    // then
    const retryButton = node
      .find(Dropdown.Option)
      .at(1)
      .find('button');

    retryButton.simulate('click');

    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledTimes(1);
    expect(mockUseOperationApply.applyOperation).toHaveBeenCalledWith(
      OPERATION_TYPE.CANCEL_WORKFLOW_INSTANCE
    );
  });
});
