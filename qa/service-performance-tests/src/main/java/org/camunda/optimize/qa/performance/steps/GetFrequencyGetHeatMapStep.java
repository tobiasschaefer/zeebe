package org.camunda.optimize.qa.performance.steps;

import org.camunda.optimize.dto.optimize.query.HeatMapResponseDto;
import org.camunda.optimize.dto.optimize.query.report.filter.FilterDto;
import org.camunda.optimize.qa.performance.framework.PerfTestContext;
import org.camunda.optimize.qa.performance.framework.PerfTestStepResult;
import ru.yandex.qatools.allure.annotations.Step;

import java.util.List;

public class GetFrequencyGetHeatMapStep extends GetHeatMapStep {

  public GetFrequencyGetHeatMapStep(List<FilterDto> filter) {
    super(filter);
  }

  @Override
  String getRestEndpoint(PerfTestContext context) {
    return context.getConfiguration().getFrequencyHeatMapEndpoint();
  }

  @Override
  @Step("Query Frequency heatmap data over REST API")
  public PerfTestStepResult<HeatMapResponseDto> execute(PerfTestContext context) {
    return super.execute(context);
  }
}
