/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import styled, {css} from 'styled-components';

import Panel from 'modules/components/Panel';
import {StatusMessage} from 'modules/components/StatusMessage';

const VariablesPanel = styled(Panel)`
  ${({theme}) => {
    const colors = theme.colors.variablesPanel;

    return css`
      flex: 1;
      font-size: 14px;
      border-left: none;
      color: ${colors.color};

      ${StatusMessage} {
        height: 58%;
      }
    `;
  }}
`;

export {VariablesPanel};
