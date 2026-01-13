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

export const chatColors = {
  // Primary brand greens
  primaryDark: '#0D3D3D',
  primaryBright: '#4CAF50',
  primaryLight: '#E8F5E9',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray600: '#757575',
  gray800: '#424242',
  gray900: '#212121',

  // Functional
  error: '#F44336',
  errorLight: '#FFEBEE',
  errorDark: '#5b2e2e',

  // Dark mode variants
  dark: {
    background: '#121212',
    paper: '#1E1E1E',
    paperLight: '#2D2D2D',
    primaryDark: '#1A5252',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
  },
};

// Shared style constants
export const chatStyleConstants = {
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.16)',
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
};
