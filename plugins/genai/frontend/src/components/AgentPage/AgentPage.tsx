// plugins/genai/frontend/src/components/AgentPage/AgentPage.tsx
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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Page, Content } from '@backstage/core-components';
import { ChatHistoryComponent } from '../ChatHistoryComponent';
import { ChatInputComponent } from '../ChatInputComponent';
import { useParams } from 'react-router-dom';
import { LinearProgress, makeStyles } from '@material-ui/core';
import { useChatSession } from '../../hooks';
import { SuggestedPrompt } from '../types';
import { chatColors } from '../theme';

const useStyles = makeStyles(theme => ({
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.background
        : chatColors.gray50,
  },
  messagesArea: {
    flexGrow: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
}));

// Default suggested prompts
const defaultSuggestedPrompts: SuggestedPrompt[] = [
  {
    title: 'Show me an overview of our Backstage ecosystem',
    prompt: 'Show me an overview of our Backstage ecosystem',
  },
  {
    title: 'List all available Software Templates',
    prompt: 'List all available Software Templates',
  },
  {
    title: 'Which users and groups are registered in the system?',
    prompt: 'Which users and groups are registered in the system?',
  },
];

export interface AgentPageProps {
  assistantName?: string;
  suggestedPrompts?: SuggestedPrompt[];
}

export const AgentPage = ({
  assistantName = 'AI Assistant',
  suggestedPrompts = defaultSuggestedPrompts,
}: AgentPageProps) => {
  const classes = useStyles();

  const config = useApi(configApiRef);
  const showInformation =
    config.getOptionalBoolean('genai.chat.showInformation') ?? false;


  const params = useParams() as { agentName: string };
  const agentName = params.agentName;

  if (!agentName) {
    throw new Error('agent name is not defined');
  }

  const {
    messages,
    isInitializing,
    isLoading,
    onUserMessage,
    onClear,
    onCancel,
  } = useChatSession({
    agentName,
  });

  const handleSuggestedPromptClick = (prompt: string) => {
    onUserMessage(prompt);
  };

  if (isInitializing) {
    return (
      <Content>
        <LinearProgress />
      </Content>
    );
  }

  return (
    <Page themeId="tool">
      <Content noPadding>
        <div className={classes.chatContainer}>
          <ChatHistoryComponent
            messages={messages}
            className={classes.messagesArea}
            isStreaming={isLoading}
            showInformation={showInformation}
            assistantName={assistantName}
            suggestedPrompts={suggestedPrompts}
            onSuggestedPromptClick={handleSuggestedPromptClick}
          />
          <ChatInputComponent
            onMessage={onUserMessage}
            disabled={isLoading}
            onClear={onClear}
            onCancel={onCancel}
          />
        </div>
      </Content>
    </Page>
  );
};
