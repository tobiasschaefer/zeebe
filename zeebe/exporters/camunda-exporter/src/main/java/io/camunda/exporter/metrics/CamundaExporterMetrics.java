/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
package io.camunda.exporter.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.Timer.ResourceSample;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

public class CamundaExporterMetrics {
  private static final String NAMESPACE = "zeebe.camunda.exporter";

  private final MeterRegistry meterRegistry;
  private final AtomicInteger bulkMemorySize = new AtomicInteger(0);
  private final Timer flushLatency;
  private Timer.Sample flushLatencyMeasurement;

  public CamundaExporterMetrics(final MeterRegistry meterRegistry) {
    this.meterRegistry = meterRegistry;

    flushLatency =
        Timer.builder(meterName("flush.latency"))
            .description(
                "Time of how long a export buffer is open and collects new records before flushing, meaning latency until the next flush is done.")
            .publishPercentileHistogram()
            .register(meterRegistry);
  }

  public ResourceSample measureFlushDuration() {
    return Timer.resource(meterRegistry, meterName("flush.duration.seconds"))
        .description("Flush duration of bulk exporters in seconds")
        .publishPercentileHistogram()
        .minimumExpectedValue(Duration.ofMillis(10));
  }

  public void recordBulkSize(final int bulkSize) {
    DistributionSummary.builder(meterName("bulk.size"))
        .description("Exporter bulk size")
        .serviceLevelObjectives(10, 100, 1_000, 10_000, 100_000)
        .register(meterRegistry)
        .record(bulkSize);
  }

  public void recordBulkMemorySize(final int bulkMemorySize) {
    Gauge.builder(meterName("bulk.memory.size"), this.bulkMemorySize, AtomicInteger::get)
        .description("Exporter bulk memory size")
        .register(meterRegistry);

    this.bulkMemorySize.set(bulkMemorySize);
  }

  public void recordFailedFlush() {
    Counter.builder(meterName("failed.flush"))
        .description("Number of failed flush operations")
        .register(meterRegistry)
        .increment();
  }

  public void startFlushLatencyMeasurement() {
    flushLatencyMeasurement = Timer.start(meterRegistry);
  }

  public void stopFlushLatencyMeasurement() {
    if (flushLatencyMeasurement != null) {
      flushLatencyMeasurement.stop(flushLatency);
    }
  }

  private String meterName(final String name) {
    return NAMESPACE + "." + name;
  }
}