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

import { makeStyles, Typography } from '@material-ui/core';
import { chatColors } from '../theme';
import { AssistantAvatar } from './AssistantAvatar';
import { SuggestedPrompts } from './SuggestedPrompts';
import { SuggestedPrompt } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '24px',
    textAlign: 'center',
    overflow: 'auto',
    '@media (max-height: 700px)': {
      justifyContent: 'flex-start',
      padding: '12px 16px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '32px',
    },
  },
  avatarContainer: {
    marginBottom: '12px',
    '@media (max-height: 700px)': {
      marginBottom: '4px',
    },
  },
  assistantName: {
    fontSize: '12px',
    fontWeight: 500,
    color: chatColors.primaryDark,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    '@media (max-height: 700px)': {
      fontSize: '10px',
      marginBottom: '6px',
    },
  },
  greeting: {
    fontSize: '26px',
    fontWeight: 600,
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textPrimary
        : chatColors.gray900,
    marginBottom: '8px',
    '@media (max-height: 700px)': {
      fontSize: '18px',
      marginBottom: '4px',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '30px',
    },
  },
  description: {
    fontSize: '15px',
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textSecondary
        : chatColors.gray600,
    marginBottom: '24px',
    maxWidth: '500px',
    lineHeight: 1.5,
    '@media (max-height: 700px)': {
      fontSize: '12px',
      marginBottom: '12px',
      maxWidth: '400px',
      lineHeight: 1.4,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '16px',
      maxWidth: '550px',
    },
  },
  suggestedLabel: {
    fontSize: '11px',
    color: chatColors.primaryBright,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&::before': {
      content: '""',
      display: 'inline-block',
      width: '5px',
      height: '5px',
      backgroundColor: chatColors.primaryBright,
      borderRadius: '50%',
    },
    '@media (max-height: 700px)': {
      fontSize: '9px',
      marginBottom: '8px',
      '&::before': {
        width: '4px',
        height: '4px',
      },
    },
  },
}));

interface WelcomeScreenProps {
  assistantName?: string;
  description?: string;
  suggestedPrompts: SuggestedPrompt[];
  onPromptClick: (prompt: string) => void;
}

export const WelcomeScreen = ({
  assistantName = 'AI Assistant',
  description = 'I can help answer your questions, find information, and assist with various tasks. Type a message below to get started.',
  suggestedPrompts,
  onPromptClick,
}: WelcomeScreenProps) => {
  const classes = useStyles();

  const greeting = 'How can I help you?';

  return (
    <div className={classes.container}>
      <div className={classes.avatarContainer}>
        <AssistantAvatar size="large" />
      </div>
      <Typography className={classes.assistantName}>{assistantName}</Typography>
      <Typography className={classes.greeting}>{greeting}</Typography>
      <Typography className={classes.description}>{description}</Typography>
      {suggestedPrompts.length > 0 && (
        <>
          <Typography className={classes.suggestedLabel}>Suggested</Typography>
          <SuggestedPrompts
            prompts={suggestedPrompts}
            onPromptClick={onPromptClick}
          />
        </>
      )}
    </div>
  );
};
