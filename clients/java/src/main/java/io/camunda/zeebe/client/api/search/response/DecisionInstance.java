/*
 * Copyright © 2017 camunda services GmbH (info@camunda.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.camunda.zeebe.client.api.search.response;

public interface DecisionInstance {

  /**
   * @return the key of the decision instance
   */
  long getDecisionInstanceKey();

  /**
   * @return the state of the decision instance
   */
  DecisionInstanceState getState();

  /**
   * @return the evaluation date of the decision instance
   */
  String getEvaluationDate();

  /**
   * @return the evaluation failure of the decision instance
   */
  String getEvaluationFailure();

  /**
   * @return the process definition key of the decision instance
   */
  Long getProcessDefinitionKey();

  /**
   * @return the process instance id of the decision instance
   */
  Long getProcessInstanceKey();

  /**
   * @return the decision definition key of the decision instance
   */
  long getDecisionDefinitionKey();

  /**
   * @return the decision definition id of the decision instance
   */
  String getDecisionDefinitionId();

  /**
   * @return the decision definition name of the decision instance
   */
  String getDecisionDefinitionName();

  /**
   * @return the decision definition version of the decision instance
   */
  int getDecisionDefinitionVersion();

  /**
   * @return the decision type of the decision instance
   */
  DecisionDefinitionType getDecisionDefinitionType();

  /**
   * @return the tenant id of the decision instance
   */
  String getTenantId();
}