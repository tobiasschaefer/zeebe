package org.camunda.optimize.service.es.report.command.process.user_task.duration;

import org.camunda.optimize.service.es.schema.type.ProcessInstanceType;

public class MaxUserTaskIdleDurationByUserTaskCommand extends MaxUserTaskDurationByUserTaskCommand {
  @Override
  protected String getDurationFieldName() {
    return ProcessInstanceType.USER_TASK_IDLE_DURATION;
  }
}
