/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under one or more contributor license agreements.
 * Licensed under a proprietary license. See the License.txt file for more information.
 * You may not use this file except in compliance with the proprietary license.
 */
package org.camunda.optimize.service.importing.zeebe.mediator.factory;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.camunda.optimize.dto.optimize.datasource.ZeebeDataSourceDto;
import org.camunda.optimize.service.db.reader.ProcessDefinitionReader;
import org.camunda.optimize.service.es.OptimizeElasticsearchClient;
import org.camunda.optimize.service.es.writer.ZeebeProcessInstanceWriter;
import org.camunda.optimize.service.importing.ImportIndexHandlerRegistry;
import org.camunda.optimize.service.importing.ImportMediator;
import org.camunda.optimize.service.importing.engine.service.zeebe.ZeebeProcessInstanceImportService;
import org.camunda.optimize.service.importing.zeebe.fetcher.ZeebeProcessInstanceFetcher;
import org.camunda.optimize.service.importing.zeebe.mediator.ZeebeProcessInstanceImportMediator;
import org.camunda.optimize.service.util.BackoffCalculator;
import org.camunda.optimize.service.util.configuration.ConfigurationService;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ZeebeProcessInstanceImportMediatorFactory extends AbstractZeebeImportMediatorFactory {

  private final ZeebeProcessInstanceWriter zeebeProcessInstanceWriter;
  private final ProcessDefinitionReader processDefinitionReader;

  public ZeebeProcessInstanceImportMediatorFactory(final BeanFactory beanFactory,
                                                   final ImportIndexHandlerRegistry importIndexHandlerRegistry,
                                                   final ConfigurationService configurationService,
                                                   final ZeebeProcessInstanceWriter zeebeProcessInstanceWriter,
                                                   final ProcessDefinitionReader processDefinitionReader,
                                                   final ObjectMapper objectMapper,
                                                   final OptimizeElasticsearchClient esClient) {
    super(beanFactory, importIndexHandlerRegistry, configurationService, objectMapper, esClient);
    this.zeebeProcessInstanceWriter = zeebeProcessInstanceWriter;
    this.processDefinitionReader = processDefinitionReader;
  }

  @Override
  public List<ImportMediator> createMediators(final ZeebeDataSourceDto zeebeDataSourceDto) {
    return Collections.singletonList(
      new ZeebeProcessInstanceImportMediator(
        importIndexHandlerRegistry.getZeebeProcessInstanceImportIndexHandler(zeebeDataSourceDto.getPartitionId()),
        beanFactory.getBean(
          ZeebeProcessInstanceFetcher.class,
          zeebeDataSourceDto.getPartitionId(),
          esClient,
          objectMapper,
          configurationService
        ),
        new ZeebeProcessInstanceImportService(
          configurationService,
          zeebeProcessInstanceWriter,
          zeebeDataSourceDto.getPartitionId(),
          processDefinitionReader
        ),
        configurationService,
        new BackoffCalculator(configurationService)
      )
    );
  }

}
