/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Avatar, makeStyles } from '@material-ui/core';
import SmartToyOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import { chatColors } from '../theme';

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: chatColors.primaryDark,
    color: chatColors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: '36px',
    height: '36px',
    '& svg': { fontSize: '20px' },
  },
  medium: {
    width: '48px',
    height: '48px',
    '& svg': { fontSize: '28px' },
  },
  large: {
    width: '72px',
    height: '72px',
    '& svg': { fontSize: '42px' },
    '@media (max-height: 700px)': {
      width: '44px',
      height: '44px',
      '& svg': { fontSize: '26px' },
    },
    [theme.breakpoints.up('lg')]: {
      width: '88px',
      height: '88px',
      '& svg': { fontSize: '52px' },
    },
  },
}));

interface AssistantAvatarProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const AssistantAvatar = ({
  size = 'medium',
  className,
}: AssistantAvatarProps) => {
  const classes = useStyles();

  const sizeClass = {
    small: classes.small,
    medium: classes.medium,
    large: classes.large,
  }[size];

  return (
    <Avatar className={`${classes.avatar} ${sizeClass} ${className || ''}`}>
      <SmartToyOutlinedIcon />
    </Avatar>
  );
};
