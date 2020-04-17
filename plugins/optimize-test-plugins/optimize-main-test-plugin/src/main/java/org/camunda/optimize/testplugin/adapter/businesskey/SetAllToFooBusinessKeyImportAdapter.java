/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */
package org.camunda.optimize.testplugin.adapter.businesskey;

import org.camunda.optimize.plugin.importing.businesskey.BusinessKeyImportAdapter;

public class SetAllToFooBusinessKeyImportAdapter implements BusinessKeyImportAdapter {

  @Override
  public String adaptBusinessKey(final String businessKey) {
    return "foo";
  }
}
