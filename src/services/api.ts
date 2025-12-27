/**
 * RTX AI HuggingFace API Service
 * Handles all API interactions with HuggingFace Serverless Inference API
 */

import axios, {AxiosError} from 'axios';
import {APIConfig} from '../constants';
import type {AppError, HuggingFaceRequest, Message} from '../types';
import {formatMessagesForAPI} from '../utils';

// AbortController reference for request cancellation
let currentAbortController: AbortController | null = null;

/**
 * Create API request configuration
 */
const createRequestConfig = (apiKey: string, signal?: AbortSignal) => ({
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  timeout: APIConfig.timeout,
  signal,
});

/**
 * Format error response
 */
const formatError = (error: AxiosError): AppError => {
  if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
    return {
      type: 'timeout',
      message: 'Request timed out. Please try again.',
    };
  }

  if (!error.response) {
    return {
      type: 'network',
      message: 'Network error. Please check your connection.',
    };
  }

  const status = error.response.status;
  const data = error.response.data as {error?: string; estimated_time?: number};

  switch (status) {
    case 401:
      return {
        type: 'api_key',
        message: 'Invalid API key. Please check your settings.',
      };
    case 429:
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded. Please wait before trying again.',
        retryAfter: 60,
      };
    case 503:
      return {
        type: 'model_loading',
        message: 'Model is loading. Please wait a moment and try again.',
        retryAfter: data.estimated_time || 20,
      };
    default:
      return {
        type: 'unknown',
        message: data.error || 'An unexpected error occurred.',
      };
  }
};

/**
 * Send a chat message to the HuggingFace API
 */
export const sendMessage = async (
  messages: Message[],
  apiKey: string,
  model: string,
  options: {
    maxNewTokens?: number;
    temperature?: number;
    topP?: number;
  } = {},
): Promise<{response: string} | {error: AppError}> => {
  // Cancel any existing request
  if (currentAbortController) {
    currentAbortController.abort();
  }

  // Create new AbortController for this request
  currentAbortController = new AbortController();

  const url = `${APIConfig.baseUrl}/${model}`;

  const requestBody: HuggingFaceRequest = {
    inputs: formatMessagesForAPI(messages),
    parameters: {
      max_new_tokens: options.maxNewTokens || APIConfig.maxNewTokens.default,
      temperature: options.temperature || APIConfig.temperature.default,
      top_p: options.topP || 0.9,
      return_full_text: false,
      do_sample: true,
    },
  };

  try {
    const response = await axios.post(
      url,
      requestBody,
      createRequestConfig(apiKey, currentAbortController.signal),
    );

    currentAbortController = null;

    // Parse response
    const data = response.data;

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      const generatedText = data[0].generated_text.trim();

      if (!generatedText) {
        return {
          error: {
            type: 'empty_response',
            message: 'No response received from the AI model.',
          },
        };
      }

      return {response: generatedText};
    }

    return {
      error: {
        type: 'empty_response',
        message: 'No response received from the AI model.',
      },
    };
  } catch (error) {
    currentAbortController = null;

    if (axios.isAxiosError(error)) {
      return {error: formatError(error)};
    }

    return {
      error: {
        type: 'unknown',
        message: 'An unexpected error occurred.',
      },
    };
  }
};

/**
 * Generate a chat title using the AI model
 */
export const generateTitle = async (
  userMessage: string,
  aiResponse: string,
  apiKey: string,
  model: string,
): Promise<string | null> => {
  const prompt = `Generate a short title (3-5 words) for a conversation that starts with this exchange. Only output the title, nothing else.

User: ${userMessage}
Assistant: ${aiResponse}

Title:`;

  try {
    const url = `${APIConfig.baseUrl}/${model}`;

    const requestBody: HuggingFaceRequest = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 20,
        temperature: 0.5,
        top_p: 0.9,
        return_full_text: false,
        do_sample: true,
      },
    };

    const response = await axios.post(
      url,
      requestBody,
      createRequestConfig(apiKey),
    );

    const data = response.data;

    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      // Clean up the title
      let title = data[0].generated_text.trim();
      // Remove quotes if present
      title = title.replace(/^["']|["']$/g, '');
      // Limit length
      if (title.length > 50) {
        title = title.substring(0, 50).trim();
      }
      return title || null;
    }

    return null;
  } catch (error) {
    console.error('Error generating title:', error);
    return null;
  }
};

/**
 * Cancel the current API request
 */
export const cancelCurrentRequest = (): void => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
};

/**
 * Check if there's an active request
 */
export const hasActiveRequest = (): boolean => {
  return currentAbortController !== null;
};
