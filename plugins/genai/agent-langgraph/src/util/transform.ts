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

import { ChatEvent } from '@aws/genai-plugin-for-backstage-common';
import { StreamEvent } from '@langchain/core/dist/tracers/event_stream';
import { AIMessageChunk, AIMessage } from '@langchain/core/messages';
import { LoggerService } from '@backstage/backend-plugin-api';

// Claude Haiku 4.5 pricing (USD per 1k tokens)
const INPUT_TOKEN_PRICE = 0.0011;
const OUTPUT_TOKEN_PRICE = 0.0055;

export class ResponseTransformStream extends TransformStream<
  StreamEvent,
  ChatEvent
> {
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private sessionId: string;
  private logger: LoggerService;

  constructor(sessionId: string, logger: LoggerService) {
    let instance: ResponseTransformStream;
    super({
      start: controller => {
        instance = this;
        controller.enqueue({
          type: 'ResponseEvent',
          sessionId,
        });
      },
      transform: (chunk, controller) => instance.transform(chunk, controller),
      flush: controller => instance.flush(controller),
    });
    this.sessionId = sessionId;
    this.logger = logger;
  }

  transform(
    chunk: StreamEvent,
    controller: TransformStreamDefaultController<ChatEvent>,
  ) {
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
        this.totalInputTokens += output.usage_metadata.input_tokens || 0;
        this.totalOutputTokens += output.usage_metadata.output_tokens || 0;
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
  }

  flush(controller: TransformStreamDefaultController<ChatEvent>) {
    // Calculate costs
    const inputCost = (this.totalInputTokens / 1000) * INPUT_TOKEN_PRICE;
    const outputCost = (this.totalOutputTokens / 1000) * OUTPUT_TOKEN_PRICE;
    const totalCost = inputCost + outputCost;
    const totalTokens = this.totalInputTokens + this.totalOutputTokens;

    // Log token usage and costs
    this.logger.info(
      `[Token Usage] Session: ${this.sessionId} | ` +
        `Input: ${this.totalInputTokens} tokens ($${inputCost.toFixed(6)}) | ` +
        `Output: ${this.totalOutputTokens} tokens ($${outputCost.toFixed(6)}) | ` +
        `Total: ${totalTokens} tokens ($${totalCost.toFixed(6)})`,
    );

    controller.terminate();
  }
}
