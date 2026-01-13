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

import {
  Modal,
  Typography,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { ToolRecord } from '../types';
import { MarkdownContent } from '@backstage/core-components';
import { chatColors, chatStyleConstants } from '../theme';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.paper
        : chatColors.white,
    borderRadius: chatStyleConstants.borderRadius.medium,
    boxShadow: chatStyleConstants.shadows.elevated,
    padding: '24px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'auto',
    outline: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textPrimary
        : chatColors.gray900,
    margin: 0,
  },
  closeButton: {
    color: chatColors.gray600,
    '&:hover': {
      backgroundColor:
        theme.palette.type === 'dark'
          ? chatColors.dark.paperLight
          : chatColors.gray100,
    },
  },
  accordion: {
    backgroundColor:
      theme.palette.type === 'dark'
        ? chatColors.dark.paperLight
        : chatColors.gray50,
    borderRadius: `${chatStyleConstants.borderRadius.small} !important`,
    marginBottom: '8px',
    boxShadow: 'none',
    border: `1px solid ${
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : chatColors.gray200
    }`,
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: '0 0 8px 0',
    },
  },
  accordionSummary: {
    minHeight: '48px',
    '&.Mui-expanded': {
      minHeight: '48px',
    },
  },
  accordionDetails: {
    padding: '0 16px 16px',
  },
  toolName: {
    fontWeight: 500,
    color:
      theme.palette.type === 'dark'
        ? chatColors.dark.textPrimary
        : chatColors.gray900,
  },
}));

interface ToolParametersProps {
  tool: ToolRecord;
}

const ToolsParameters = ({ tool }: ToolParametersProps) => {
  let data: any;

  try {
    data = JSON.parse(tool.input);
  } catch (e) {
    data = tool.input;
  }

  const markdown = `
\`\`\`json
${JSON.stringify(data, undefined, 2)}
\`\`\`
`;

  return <MarkdownContent content={markdown} dialect="gfm" />;
};

interface ToolsModalProps {
  open: boolean;
  onClose: () => void;
  tools: ToolRecord[];
}

export const ToolsModal = ({ open, onClose, tools }: ToolsModalProps) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="tools-modal-title"
      aria-describedby="tools-modal-description"
    >
      <div className={classes.paper}>
        <div className={classes.header}>
          <Typography component="h2" className={classes.title}>
            Tools Used
          </Typography>
          <IconButton
            className={classes.closeButton}
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
        {tools.map((tool, index) => (
          <Accordion key={index} className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              className={classes.accordionSummary}
            >
              <Typography className={classes.toolName}>{tool.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <ToolsParameters tool={tool} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Modal>
  );
};
