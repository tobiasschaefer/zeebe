/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */
package org.camunda.optimize.service.es.writer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.optimize.dto.optimize.query.IdDto;
import org.camunda.optimize.dto.optimize.query.event.EventImportSourceDto;
import org.camunda.optimize.dto.optimize.query.event.EventProcessPublishStateDto;
import org.camunda.optimize.dto.optimize.query.event.IndexableEventProcessPublishStateDto;
import org.camunda.optimize.service.es.OptimizeElasticsearchClient;
import org.camunda.optimize.service.es.schema.index.events.EventProcessPublishStateIndex;
import org.camunda.optimize.service.exceptions.OptimizeRuntimeException;
import org.camunda.optimize.service.util.IdGenerator;
import org.elasticsearch.ElasticsearchStatusException;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.script.Script;
import org.springframework.stereotype.Component;

import javax.ws.rs.NotFoundException;
import java.io.IOException;

import static org.camunda.optimize.upgrade.es.ElasticsearchConstants.EVENT_PROCESS_PUBLISH_STATE_INDEX;
import static org.camunda.optimize.upgrade.es.ElasticsearchConstants.NUMBER_OF_RETRIES_ON_CONFLICT;
import static org.elasticsearch.action.support.WriteRequest.RefreshPolicy.IMMEDIATE;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;

@AllArgsConstructor
@Component
@Slf4j
public class EventProcessPublishStateWriter {

  private final OptimizeElasticsearchClient esClient;
  private final ObjectMapper objectMapper;

  public IdDto createEventProcessPublishState(final EventProcessPublishStateDto eventProcessPublishStateDto) {
    String id = IdGenerator.getNextId();
    eventProcessPublishStateDto.setId(id);
    log.debug("Writing event process publish state [{}] to elasticsearch", id);
    IndexResponse indexResponse;
    try {
      final IndexRequest request = new IndexRequest(EVENT_PROCESS_PUBLISH_STATE_INDEX)
        .id(id)
        .source(
          objectMapper.writeValueAsString(
            IndexableEventProcessPublishStateDto.fromEventProcessPublishStateDto(eventProcessPublishStateDto)
          ),
          XContentType.JSON
        )
        .setRefreshPolicy(IMMEDIATE);
      indexResponse = esClient.index(request, RequestOptions.DEFAULT);
    } catch (IOException e) {
      final String errorMessage = String.format(
        "There was a problem while writing the event process publish state [%s].", id
      );
      log.error(errorMessage, e);
      throw new OptimizeRuntimeException(errorMessage, e);
    }

    if (!indexResponse.getResult().equals(IndexResponse.Result.CREATED)) {
      final String errorMessage = String.format("Could not write event process publish state [%s].", id);
      throw new OptimizeRuntimeException(errorMessage);
    }
    return new IdDto(id);
  }

  public void updateEventProcessPublishState(final EventProcessPublishStateDto eventProcessPublishStateDto) {
    String id = eventProcessPublishStateDto.getId();
    log.debug("Updating event process publish state [{}] in elasticsearch.", id);
    final UpdateResponse updateResponse;
    try {
      Script updateScript = ElasticsearchWriterUtil.createFieldUpdateScript(
        Sets.newHashSet(
          EventProcessPublishStateIndex.EVENT_IMPORT_SOURCES,
          EventProcessPublishStateIndex.PUBLISH_PROGRESS,
          EventProcessPublishStateIndex.STATE
        ),
        IndexableEventProcessPublishStateDto.fromEventProcessPublishStateDto(eventProcessPublishStateDto),
        objectMapper
      );
      final UpdateRequest request = new UpdateRequest()
        .index(EVENT_PROCESS_PUBLISH_STATE_INDEX)
        .id(id)
        .script(updateScript)
        .setRefreshPolicy(IMMEDIATE)
        .retryOnConflict(NUMBER_OF_RETRIES_ON_CONFLICT);
      updateResponse = esClient.update(request, RequestOptions.DEFAULT);
    } catch (IOException e) {
      final String errorMessage = String.format(
        "There was a problem updating the event process publish state [%s].",
        id
      );
      log.error(errorMessage, e);
      throw new OptimizeRuntimeException(errorMessage, e);
    } catch (ElasticsearchStatusException e) {
      String errorMessage = String.format(
        "Was not able to update event process publish state with id [%s]." +
          " Event event process publish state does not exist!",
        id
      );
      log.error(errorMessage, e);
      throw new NotFoundException(errorMessage, e);
    }

    if (!updateResponse.getResult().equals(IndexResponse.Result.UPDATED)) {
      String errorMessage = String.format("Could not update event process publish state [%s].", id);
      log.error(errorMessage);
      throw new OptimizeRuntimeException(errorMessage);
    }
  }

  public boolean deleteAllEventProcessPublishStatesForEventProcessMappingId(final String eventProcessMappingId) {
    log.debug("Flagging event process publish state with processEventMappingId [{}] as deleted.", eventProcessMappingId);
    final Script updateScript = ElasticsearchWriterUtil.createDefaultScript(
      ElasticsearchWriterUtil.createUpdateFieldsScript(
        ImmutableSet.of(IndexableEventProcessPublishStateDto.Fields.deleted)
      ),
      ImmutableMap.of(IndexableEventProcessPublishStateDto.Fields.deleted, true)
    );

    return ElasticsearchWriterUtil.tryUpdateByQueryRequest(
      esClient,
      "processPublishState.deleted",
      "true",
      updateScript,
      termQuery(EventProcessPublishStateIndex.PROCESS_MAPPING_ID, eventProcessMappingId),
      EVENT_PROCESS_PUBLISH_STATE_INDEX
    );
  }

}
