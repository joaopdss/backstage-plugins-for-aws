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

import { MarkdownContent } from '@backstage/core-components';
import React, { useEffect, useRef } from 'react';

import { ChatMessage, SuggestedPrompt, ToolRecord } from '../types';
import { Avatar } from '@material-ui/core';
import Info from '@material-ui/icons/Info';
import Error from '@material-ui/icons/Error';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import { ToolsModal } from './ToolsModal';
import { makeStyles } from '@material-ui/core';
import { WelcomeScreen } from '../WelcomeScreen';
import { chatColors, chatStyleConstants } from '../theme';

const useStyles = makeStyles(theme => ({
  container: {
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
    overflow: 'auto',
    padding: '16px 24px',
  },
  // User message - right aligned
  userMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
  },
  userBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px 16px 4px 16px',
    backgroundColor:
      theme.palette.type === 'dark' ? chatColors.gray800 : chatColors.gray200,
    color:
      theme.palette.type === 'dark'
        ? chatColors.white
        : chatColors.gray900,
    boxShadow: chatStyleConstants.shadows.subtle,
    fontSize: '15px',
    lineHeight: 1.5,
  },
  // Assistant message - left aligned with avatar
  assistantMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
  },
  assistantAvatar: {
    width: '36px',
    height: '36px',
    backgroundColor: chatColors.primaryDark,
    color: chatColors.white,
    flexShrink: 0,
    '& svg': {
      fontSize: '20px',
    },
  },
  assistantBubble: {
    maxWidth: '70%',
    minWidth: '120px',
    padding: '12px 16px',
    borderRadius: '16px 16px 16px 4px',
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.paper
        : chatColors.white,
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textPrimary
        : chatColors.gray900,
    boxShadow: chatStyleConstants.shadows.subtle,
    border: `1px solid ${
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.05)'
        : chatColors.gray100
    }`,
    fontSize: '15px',
    lineHeight: 1.5,
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  // Error message
  errorAvatar: {
    backgroundColor: chatColors.errorDark,
  },
  errorBubble: {
    backgroundColor: chatColors.errorLight,
    borderColor: chatColors.error,
    color: chatColors.errorDark,
  },
  // Tool info icon
  toolIconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
  },
  toolIcon: {
    cursor: 'pointer',
    color: chatColors.gray600,
    fontSize: '18px',
    '&:hover': {
      color: chatColors.primaryBright,
    },
  },
  // Markdown content styling
  markdownContent: {
    width: '100%',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    '& p': {
      margin: 0,
    },
    '& p + p': {
      marginTop: '8px',
    },
    '& pre': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? chatColors.dark.paperLight
          : chatColors.gray100,
      borderRadius: '8px',
      padding: '12px',
      overflow: 'auto',
      maxWidth: '100%',
    },
    '& code': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? chatColors.dark.paperLight
          : chatColors.gray100,
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '13px',
    },
    '& pre code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
}));

export interface ChatHistoryComponentProps {
  messages?: ChatMessage[];
  isStreaming?: boolean;
  className?: string;
  showInformation: boolean;
  assistantName?: string;
  suggestedPrompts?: SuggestedPrompt[];
  onSuggestedPromptClick?: (prompt: string) => void;
}

export const ChatHistoryComponent = ({
  messages,
  className,
  showInformation,
  assistantName,
  suggestedPrompts = [],
  onSuggestedPromptClick,
}: ChatHistoryComponentProps) => {
  const classes = useStyles();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const [open, setOpen] = React.useState(false);
  const [tools, setTools] = React.useState<ToolRecord[]>([]);

  const handleOpen = (message: ChatMessage) => {
    setOpen(true);
    setTools(message.tools);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePromptClick = (prompt: string) => {
    if (onSuggestedPromptClick) {
      onSuggestedPromptClick(prompt);
    }
  };

  // Show welcome screen when no messages
  if (!messages || messages.length === 0) {
    return (
      <div className={`${className || ''} ${classes.container}`}>
        <WelcomeScreen
          assistantName={assistantName}
          suggestedPrompts={suggestedPrompts}
          onPromptClick={handlePromptClick}
        />
      </div>
    );
  }

  return (
    <div className={`${className || ''} ${classes.container}`}>
      <div className={classes.messagesArea} ref={contentRef}>
        {messages.map((message, index) => {
          const isUser = message.type === 'user';
          const isError = message.type === 'error';

          if (isUser) {
            return (
              <div key={index} className={classes.userMessageContainer}>
                <div className={classes.userBubble}>
                  <div className={classes.markdownContent}>
                    <MarkdownContent content={message.payload} dialect="gfm" />
                  </div>
                </div>
              </div>
            );
          }

          // Assistant or error message
          return (
            <div key={index} className={classes.assistantMessageContainer}>
              <Avatar
                className={`${classes.assistantAvatar} ${
                  isError ? classes.errorAvatar : ''
                }`}
              >
                {isError ? <Error /> : <EmojiObjectsOutlinedIcon />}
              </Avatar>
              <div>
                <div
                  className={`${classes.assistantBubble} ${
                    isError ? classes.errorBubble : ''
                  }`}
                >
                  <div className={classes.markdownContent}>
                    <MarkdownContent
                      content={
                        message.payload.length === 0
                          ? 'Working...'
                          : message.payload
                      }
                      dialect="gfm"
                    />
                  </div>
                </div>
                {message.tools.length > 0 && showInformation && (
                  <div className={classes.toolIconContainer}>
                    <Info
                      className={classes.toolIcon}
                      onClick={() => handleOpen(message)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ToolsModal open={open} onClose={handleClose} tools={tools} />
    </div>
  );
};
