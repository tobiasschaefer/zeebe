/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Zeebe Community License 1.1. You may not use this file
 * except in compliance with the Zeebe Community License 1.1.
 */
package io.camunda.zeebe.test.util.record;

import io.camunda.zeebe.protocol.record.Record;
import io.camunda.zeebe.protocol.record.value.deployment.DecisionRecordValue;
import java.util.stream.Stream;

public class DecisionRecordStream
    extends ExporterRecordStream<DecisionRecordValue, DecisionRecordStream> {

  public DecisionRecordStream(final Stream<Record<DecisionRecordValue>> wrappedStream) {
    super(wrappedStream);
  }

  @Override
  protected DecisionRecordStream supply(final Stream<Record<DecisionRecordValue>> wrappedStream) {
    return new DecisionRecordStream(wrappedStream);
  }
}
