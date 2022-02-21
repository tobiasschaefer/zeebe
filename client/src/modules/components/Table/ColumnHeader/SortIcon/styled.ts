/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import styled, {css} from 'styled-components';

import {ReactComponent as DefaultUp} from 'modules/components/Icon/up.svg';
import {ReactComponent as DefaultDown} from 'modules/components/Icon/down.svg';

type IconProps = {
  $disabled?: boolean;
};

const Icon = styled.span<IconProps>`
  ${({$disabled}) => {
    return css`
      opacity: ${$disabled ? '0.4' : '1'};
    `;
  }}
`;

const sortIconStyle = css`
  height: 16px;
  width: 16px;
`;

const Up = styled(DefaultUp)`
  ${sortIconStyle};
`;

const Down = styled(DefaultDown)`
  ${sortIconStyle};
`;

export {Icon, Up, Down};
