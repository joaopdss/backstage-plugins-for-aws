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
import { chatColors, chatStyleConstants } from '../theme';
import { SuggestedPrompt } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    maxWidth: '700px',
    width: '100%',
    '@media (max-height: 700px)': {
      gap: '6px',
      maxWidth: '500px',
    },
    [theme.breakpoints.up('lg')]: {
      gap: '16px',
      maxWidth: '800px',
    },
  },
  card: {
    flex: '1 1 calc(50% - 12px)',
    minWidth: '200px',
    maxWidth: '340px',
    padding: '14px 16px',
    borderRadius: chatStyleConstants.borderRadius.small,
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.paper
        : chatColors.white,
    border: `1px solid ${
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : chatColors.gray200
    }`,
    cursor: 'pointer',
    transition: chatStyleConstants.transitions.normal,
    boxShadow: chatStyleConstants.shadows.subtle,
    textAlign: 'left',
    '&:hover': {
      boxShadow: chatStyleConstants.shadows.medium,
      borderColor: chatColors.primaryBright,
      transform: 'translateY(-1px)',
    },
    '@media (max-height: 700px)': {
      flex: '1 1 calc(50% - 6px)',
      minWidth: '140px',
      maxWidth: '240px',
      padding: '8px 10px',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: '220px',
      maxWidth: '380px',
      padding: '16px 20px',
    },
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textPrimary
        : chatColors.gray900,
    marginBottom: '4px',
    lineHeight: 1.3,
    '@media (max-height: 700px)': {
      fontSize: '11px',
      marginBottom: '1px',
      lineHeight: 1.2,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '14px',
    },
  },
  cardLabel: {
    fontSize: '11px',
    color: chatColors.primaryBright,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    '@media (max-height: 700px)': {
      fontSize: '9px',
    },
  },
}));

interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[];
  onPromptClick: (prompt: string) => void;
}

export const SuggestedPrompts = ({
  prompts,
  onPromptClick,
}: SuggestedPromptsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {prompts.map((prompt, index) => (
        <div
          key={index}
          className={classes.card}
          onClick={() => onPromptClick(prompt.prompt)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              onPromptClick(prompt.prompt);
            }
          }}
        >
          <Typography className={classes.cardTitle}>{prompt.title}</Typography>
          <Typography className={classes.cardLabel}>Prompt</Typography>
        </div>
      ))}
    </div>
  );
};
