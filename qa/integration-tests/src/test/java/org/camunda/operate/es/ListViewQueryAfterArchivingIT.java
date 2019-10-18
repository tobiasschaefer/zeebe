/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */
package org.camunda.operate.es;

import org.camunda.operate.archiver.ArchiverJob;
import org.camunda.operate.zeebe.PartitionHolder;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

public class ListViewQueryAfterArchivingIT extends ListViewQueryIT {

  @MockBean
  private PartitionHolder partitionHolder;

  @Autowired
  private BeanFactory beanFactory;

  @Override
  protected void createData() {
    super.createData();
    mockPartitionHolder(partitionHolder);
    ArchiverJob archiverJob = beanFactory.getBean(ArchiverJob.class, partitionHolder.getPartitionIds());
    runArchiving(archiverJob);
    elasticsearchTestRule.refreshIndexesInElasticsearch();
  }

}
