/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DEFAULT_THEME_CONFIG,
  validateThemeConfig,
} from '../validateThemeConfig';
import type {Joi} from '@docusaurus/utils-validation';
import type {ThemeConfig, UserThemeConfig} from '@docusaurus/theme-mermaid';

function testValidateThemeConfig(themeConfig: UserThemeConfig) {
  function validate(
    schema: Joi.ObjectSchema<ThemeConfig>,
    cfg: UserThemeConfig,
  ) {
    const {value, error} = schema.validate(cfg, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  return validateThemeConfig({validate, themeConfig});
}

describe('validateThemeConfig', () => {
  it('undefined config', () => {
    const mermaid = undefined;
    expect(testValidateThemeConfig({mermaid})).toEqual(DEFAULT_THEME_CONFIG);
  });

  it('nonexistent config', () => {
    expect(testValidateThemeConfig({})).toEqual(DEFAULT_THEME_CONFIG);
  });

  it('empty config', () => {
    const mermaid = {};
    expect(testValidateThemeConfig({mermaid})).toEqual(DEFAULT_THEME_CONFIG);
  });

  it('theme', () => {
    const mermaid = {
      theme: {
        light: 'light',
        dark: 'dark',
      },
    };
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {
        ...DEFAULT_THEME_CONFIG.mermaid,
        ...mermaid,
      },
    });
  });

  it('mermaid options', () => {
    const mermaid = {
      options: {
        fontFamily: 'Ariel',
      },
    };
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {
        theme: DEFAULT_THEME_CONFIG.mermaid.theme,
        ...mermaid,
      },
    });
  });

  it('mermaid config with options', () => {
    const mermaid = {
      config: {
      },
      options: {
      },
    };
    expect(() =>
      testValidateThemeConfig({mermaid}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"'options' is deprecated. Please use 'config' instead and remove 'options'."`,
    );
  });

  it('mermaid config', () => {
    const mermaid = {
      config: {
        light: {
          fontFamily: 'Ariel',
        },
        dark: {
          fontFamily: 'Ariel',
        }
      },
    };
    expect(testValidateThemeConfig({mermaid})).toEqual({
      mermaid: {
        ...DEFAULT_THEME_CONFIG.mermaid,
        ...mermaid,
      },
    });
  });
});
