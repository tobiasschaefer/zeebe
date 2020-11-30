/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import {post, get} from 'modules/request';
import {parseFilterForRequest} from 'modules/utils/filter';
import {FILTER_SELECTION} from 'modules/constants';

const URL = '/api/workflow-instances';

type BatchOperationQuery = {
  active?: boolean;
  canceled?: boolean;
  completed?: boolean;
  excludeIds: string[];
  finished?: boolean;
  ids: string[];
  incidents?: boolean;
  running?: boolean;
};

type WorkflowInstancesQuery = {
  firstResult: number;
  maxResults: number;
  active?: boolean;
  batchOperationId?: string;
  canceled?: boolean;
  completed?: boolean;
  endDateAfter?: string;
  endDateBefore?: string;
  errorMessage?: string;
  finished?: boolean;
  ids?: string[];
  excludeIds?: string[];
  incidents?: boolean;
  running?: boolean;
  startDateAfter?: string;
  startDateBefore?: string;
  variable?: {
    name: string;
    value: string;
  };
  workflowIds?: string[];
  sorting?: {
    sortBy: string;
    sortOrder: 'desc' | 'asc';
  };
};

type OperationPayload = {
  operationType: OperationEntityType;
  variableName?: string;
  variableScopeId?: string | undefined;
  variableValue?: string;
  incidentId?: string;
};

async function fetchWorkflowInstance(id: WorkflowInstanceEntity['id']) {
  return get(`${URL}/${id}`);
}

async function fetchWorkflowInstanceIncidents(
  id: WorkflowInstanceEntity['id']
) {
  return get(`${URL}/${id}/incidents`);
}

async function fetchWorkflowInstances({
  firstResult,
  maxResults,
  ...payload
}: WorkflowInstancesQuery) {
  return await post(
    `${URL}?firstResult=${firstResult}&maxResults=${maxResults}`,
    payload
  );
}

async function fetchSequenceFlows(
  workflowInstanceId: WorkflowInstanceEntity['id']
) {
  return get(`${URL}/${workflowInstanceId}/sequence-flows`);
}

async function fetchGroupedWorkflows() {
  return get('/api/workflows/grouped');
}

async function fetchWorkflowCoreStatistics() {
  return get(`${URL}/core-statistics`);
}

async function fetchWorkflowInstancesByIds(
  ids: WorkflowInstanceEntity['id'][]
) {
  const payload = parseFilterForRequest({
    ...FILTER_SELECTION.running,
    ...FILTER_SELECTION.finished,
    ids: ids.join(','),
  });

  const options = {
    firstResult: 0,
    maxResults: ids.length,
    ...payload,
  };

  return fetchWorkflowInstances(options);
}

async function fetchWorkflowInstancesStatistics(payload: any) {
  const response = await post(`${URL}/statistics`, payload);
  return {statistics: await response.json()};
}

/**
 * @param {*} payload object with query params.
 */
async function applyBatchOperation(
  operationType: OperationEntityType,
  query: BatchOperationQuery
) {
  return post(`${URL}/batch-operation`, {operationType, query});
}

/**
 * @param {*} operationType constants specifying the operation to be applied.
 * @param {*} queries object with query params.
 */
async function applyOperation(
  instanceId: WorkflowInstanceEntity['id'],
  payload: OperationPayload
) {
  return post(`${URL}/${instanceId}/operation`, payload);
}

async function fetchVariables({
  instanceId,
  scopeId,
}: {
  instanceId: WorkflowInstanceEntity['id'];
  scopeId: Required<VariableEntity>['scopeId'];
}) {
  return get(`${URL}/${instanceId}/variables?scopeId=${scopeId}`);
}

export {
  fetchWorkflowInstances,
  fetchWorkflowInstance,
  fetchWorkflowInstanceIncidents,
  fetchSequenceFlows,
  fetchGroupedWorkflows,
  fetchWorkflowCoreStatistics,
  fetchWorkflowInstancesByIds,
  fetchWorkflowInstancesStatistics,
  applyBatchOperation,
  applyOperation,
  fetchVariables,
};
