/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
package io.camunda.optimize.service.db.os.report.interpreter.view.process.frequency;

import static io.camunda.optimize.service.db.report.plan.process.ProcessView.PROCESS_VIEW_FLOW_NODE_FREQUENCY;
import static io.camunda.optimize.service.db.report.plan.process.ProcessView.PROCESS_VIEW_INCIDENT_FREQUENCY;
import static io.camunda.optimize.service.db.report.plan.process.ProcessView.PROCESS_VIEW_USER_TASK_FREQUENCY;

import java.util.Set;
import io.camunda.optimize.service.db.report.plan.process.ProcessView;
import io.camunda.optimize.service.util.configuration.condition.OpenSearchCondition;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Component;

@Component
@Conditional(OpenSearchCondition.class)
public class ProcessViewFrequencyInterpreterOS extends AbstractProcessViewFrequencyInterpreterOS {

  @Override
  public Set<ProcessView> getSupportedViews() {
    return Set.of(
        PROCESS_VIEW_FLOW_NODE_FREQUENCY,
        PROCESS_VIEW_INCIDENT_FREQUENCY,
        PROCESS_VIEW_USER_TASK_FREQUENCY);
  }
}
