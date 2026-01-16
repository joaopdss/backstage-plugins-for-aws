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

import { ChatEvent } from '@joaopdss/genai-plugin-for-backstage-common';
import { StreamEvent } from '@langchain/core/dist/tracers/event_stream';
import { AIMessageChunk, AIMessage } from '@langchain/core/messages';
import { LoggerService } from '@backstage/backend-plugin-api';

// Claude Haiku 4.5 pricing (USD per 1k tokens)
const INPUT_TOKEN_PRICE = 0.0011;
const OUTPUT_TOKEN_PRICE = 0.0055;

export interface TokenUsageTracker {
  totalInputTokens: number;
  totalOutputTokens: number;
}

export function createResponseTransformStream(
  sessionId: string,
  logger: LoggerService,
  usageTracker?: TokenUsageTracker,
): TransformStream<StreamEvent, ChatEvent> {
  const tracker = usageTracker || { totalInputTokens: 0, totalOutputTokens: 0 };

  return new TransformStream<StreamEvent, ChatEvent>({
    start(controller) {
      controller.enqueue({
        type: 'ResponseEvent',
        sessionId,
      });
    },
    transform(chunk, controller) {
      const event = chunk.event;
      const data = chunk.data;

      if (event === 'on_chat_model_stream') {
        const msg = data.chunk as AIMessageChunk;
        if (!msg.tool_call_chunks?.length) {
          const content = msg.content;

          controller.enqueue({
            type: 'ChunkEvent',
            token: content.toString(),
          });
        }
      } else if (event === 'on_chat_model_end') {
        // Extract token usage from the output message
        const output = data.output as AIMessage;
        if (output?.usage_metadata) {
          tracker.totalInputTokens += output.usage_metadata.input_tokens || 0;
          tracker.totalOutputTokens += output.usage_metadata.output_tokens || 0;
          logger.info(
            `[on_chat_model_end] Received usage: input=${output.usage_metadata.input_tokens}, output=${output.usage_metadata.output_tokens}`,
          );
        }

        controller.enqueue({
          type: 'ChunkEvent',
          token: '\n\n',
        });
      } else if (event === 'on_tool_start') {
        const msg = data;

        controller.enqueue({
          type: 'ToolEvent',
          name: chunk.name,
          input: msg.input.input,
        });
      }
    },
  });
}

export function logTokenUsage(
  sessionId: string,
  tracker: TokenUsageTracker,
  logger: LoggerService,
): void {
  const { totalInputTokens, totalOutputTokens } = tracker;
  const inputCost = (totalInputTokens / 1000) * INPUT_TOKEN_PRICE;
  const outputCost = (totalOutputTokens / 1000) * OUTPUT_TOKEN_PRICE;
  const totalCost = inputCost + outputCost;
  const totalTokens = totalInputTokens + totalOutputTokens;

  logger.info(
    `[Token Usage] Session: ${sessionId} | ` +
      `Input: ${totalInputTokens} tokens ($${inputCost.toFixed(6)}) | ` +
      `Output: ${totalOutputTokens} tokens ($${outputCost.toFixed(6)}) | ` +
      `Total: ${totalTokens} tokens ($${totalCost.toFixed(6)})`,
  );
}
