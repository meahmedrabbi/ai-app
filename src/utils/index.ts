/**
 * RTX AI Utility Functions
 */

import {format, formatDistanceToNow, isToday, isYesterday, subDays} from 'date-fns';

/**
 * Format a timestamp to a readable time string
 */
export const formatTimestamp = (timestamp: number): string => {
  return format(new Date(timestamp), 'h:mm a');
};

/**
 * Format a timestamp to a relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp), {addSuffix: true});
};

/**
 * Get the date group label for a chat (Today, Yesterday, Last 7 Days, Older)
 */
export const getDateGroup = (timestamp: number): string => {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const sevenDaysAgo = subDays(new Date(), 7);
  if (date > sevenDaysAgo) {
    return 'Last 7 Days';
  }

  return 'Older';
};

/**
 * Group chats by date period
 */
export const groupChatsByDate = <T extends {updatedAt: number; isPinned?: boolean}>(
  chats: T[],
): Record<string, T[]> => {
  const groups: Record<string, T[]> = {
    Pinned: [],
    Today: [],
    Yesterday: [],
    'Last 7 Days': [],
    Older: [],
  };

  chats.forEach(chat => {
    if (chat.isPinned) {
      groups.Pinned.push(chat);
    } else {
      const group = getDateGroup(chat.updatedAt);
      groups[group].push(chat);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};

/**
 * Generate a fallback title from the first message
 */
export const generateFallbackTitle = (message: string, maxLength = 30): string => {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength).trim() + '...';
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format messages for HuggingFace API
 */
export const formatMessagesForAPI = (
  messages: Array<{role: string; content: string}>,
): string => {
  let formatted = '';

  messages.forEach(msg => {
    if (msg.role === 'user') {
      formatted += `Human: ${msg.content}\n\n`;
    } else {
      formatted += `Assistant: ${msg.content}\n\n`;
    }
  });

  // Append "Assistant:" to prompt continuation
  formatted += 'Assistant:';

  return formatted;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Validate API key format (basic check)
 */
export const isValidApiKey = (key: string): boolean => {
  // HuggingFace API keys typically start with 'hf_'
  return key.length > 10 && key.startsWith('hf_');
};
