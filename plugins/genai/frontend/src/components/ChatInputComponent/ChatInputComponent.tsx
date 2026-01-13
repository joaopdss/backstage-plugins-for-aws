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

import React, { useEffect, useRef, useState } from 'react';
import { IconButton, makeStyles, TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import StopIcon from '@material-ui/icons/Stop';
import { chatColors, chatStyleConstants } from '../theme';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '16px 24px',
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.paper
        : chatColors.white,
    borderRadius: chatStyleConstants.borderRadius.large,
    padding: '8px 16px',
    boxShadow: chatStyleConstants.shadows.medium,
    border: `1px solid ${
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : chatColors.gray200
    }`,
    transition: chatStyleConstants.transitions.normal,
    '&:focus-within': {
      borderColor: chatColors.primaryBright,
      boxShadow: `${chatStyleConstants.shadows.medium}, 0 0 0 2px ${chatColors.primaryLight}`,
    },
  },
  attachButton: {
    width: '40px',
    height: '40px',
    color: chatColors.gray600,
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? chatColors.dark.paperLight
          : chatColors.gray100,
    },
  },
  textField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: chatStyleConstants.borderRadius.medium,
      '& fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: '10px 0',
      color:
        theme.palette.type === 'dark'
          ? chatColors.dark.textPrimary
          : chatColors.gray900,
      '&::placeholder': {
        color:
          theme.palette.type === 'dark'
            ? chatColors.dark.textSecondary
            : chatColors.gray600,
        opacity: 1,
      },
    },
    '& .MuiInputBase-root': {
      backgroundColor: 'transparent',
    },
  },
  sendButton: {
    width: '44px',
    height: '44px',
    backgroundColor: chatColors.primaryBright,
    color: chatColors.white,
    boxShadow: chatStyleConstants.shadows.subtle,
    transition: chatStyleConstants.transitions.normal,
    '&:hover': {
      backgroundColor: chatColors.primaryDark,
      boxShadow: chatStyleConstants.shadows.medium,
    },
    '&:disabled': {
      backgroundColor: chatColors.gray300,
      color: chatColors.gray600,
    },
  },
  cancelButton: {
    width: '44px',
    height: '44px',
    backgroundColor: chatColors.error,
    color: chatColors.white,
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  clearButton: {
    width: '40px',
    height: '40px',
    color: chatColors.gray600,
    transition: chatStyleConstants.transitions.normal,
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? chatColors.dark.paperLight
          : chatColors.gray100,
      color: chatColors.error,
    },
  },
}));

interface ChatInputComponentProps {
  onMessage: (message: string) => void;
  disabled?: boolean;
  onClear?: () => void;
  onCancel?: () => void;
}

export const ChatInputComponent = ({
  onMessage,
  disabled,
  onClear,
  onCancel,
}: ChatInputComponentProps) => {
  const classes = useStyles();

  const inputRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!disabled) {
      const textArea = inputRef.current?.querySelector('textarea');
      textArea?.focus();
    }
  }, [disabled]);

  const processMessage = () => {
    if (message.trim()) {
      onMessage(message);
      setMessage('');
    }
  };

  const checkKeyPress = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.code === 'Enter') {
      if (!evt.shiftKey && message.trim()) {
        processMessage();
        evt.preventDefault();
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.inputWrapper}>
        <IconButton
          className={classes.attachButton}
          title="Attach file"
          disabled
        >
          <AttachFileIcon />
        </IconButton>
        <TextField
          placeholder="Type a message..."
          multiline
          value={message}
          maxRows={8}
          minRows={1}
          onKeyDown={checkKeyPress}
          onChange={evt => setMessage(evt.target.value)}
          fullWidth
          disabled={disabled}
          ref={inputRef}
          className={classes.textField}
          InputProps={{
            disableUnderline: true,
          }}
        />
        {disabled && onCancel ? (
          <IconButton
            title="Cancel"
            onClick={onCancel}
            className={classes.cancelButton}
          >
            <StopIcon />
          </IconButton>
        ) : (
          <IconButton
            title="Send"
            onClick={processMessage}
            disabled={!message.trim()}
            className={classes.sendButton}
          >
            <SendIcon />
          </IconButton>
        )}
        <IconButton
          title="Clear conversation"
          onClick={onClear}
          disabled={disabled}
          className={classes.clearButton}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};
