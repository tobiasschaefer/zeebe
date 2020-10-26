/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */
package org.camunda.optimize.dto.optimize.query.definition;

import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;
import org.camunda.optimize.dto.optimize.DefinitionType;
import org.camunda.optimize.dto.optimize.SimpleDefinitionDto;
import org.camunda.optimize.dto.optimize.TenantDto;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DefinitionWithTenantsResponseDto extends SimpleDefinitionDto {
  @NonNull
  private List<TenantDto> tenants;

  public DefinitionWithTenantsResponseDto(@NonNull final String key,
                                          final String name,
                                          @NonNull final DefinitionType type,
                                          final Boolean isEventProcess,
                                          @NonNull final List<TenantDto> tenants,
                                          @NonNull final String engine) {
    super(key, name, type, isEventProcess, Collections.singleton(engine));
    this.tenants = tenants;
  }

  public DefinitionWithTenantsResponseDto(@NonNull final String key,
                                          final String name,
                                          @NonNull final DefinitionType type,
                                          final Boolean isEventProcess,
                                          @NonNull final List<TenantDto> tenants,
                                          @NonNull final Set<String> engines) {
    super(key, name, type, isEventProcess, engines);
    this.tenants = tenants;
  }

  public DefinitionWithTenantsResponseDto(@NonNull final String key,
                                          final String name,
                                          @NonNull final DefinitionType type,
                                          @NonNull final List<TenantDto> tenants,
                                          @NonNull final String engine) {
    super(key, name, type, false, Collections.singleton(engine));
    this.tenants = tenants;
  }
}
