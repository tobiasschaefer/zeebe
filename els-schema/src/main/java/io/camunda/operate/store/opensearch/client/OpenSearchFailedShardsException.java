/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */
package io.camunda.operate.store.opensearch.client;

import io.camunda.operate.exceptions.OperateRuntimeException;

public class OpenSearchFailedShardsException extends OperateRuntimeException {
  public OpenSearchFailedShardsException(String message) {
    super(message);
  }
}
