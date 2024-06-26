/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';
import type {ThemeConfig} from '@docusaurus/theme-mermaid';
import type {ThemeConfigValidationContext} from '@docusaurus/types';

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mermaid: {
    theme: {
      dark: 'dark',
      light: 'default',
    },
    config: {
      dark: {},
      light: {},
    },
  },
};

const configSchema = Joi.object().default({});
const forbiddenSchema = Joi.forbidden().error(new Error("'options' is deprecated. Please use 'config' instead and remove 'options'."));

export const Schema = Joi.object<ThemeConfig>({
  mermaid: Joi.object({
    theme: Joi.object({
      dark: Joi.string().default(DEFAULT_THEME_CONFIG.mermaid.theme.dark),
      light: Joi.string().default(DEFAULT_THEME_CONFIG.mermaid.theme.light),
    }).default(DEFAULT_THEME_CONFIG.mermaid.theme),
    config: Joi.alternatives().conditional('options', {
      is: Joi.exist(),
      then: forbiddenSchema,
      otherwise: Joi.object({
        dark: configSchema,
        light: configSchema,
      }).default(DEFAULT_THEME_CONFIG.mermaid.config),
    }),
    options: Joi.alternatives().conditional('config', {
      is: Joi.exist(),
      then: forbiddenSchema,
      otherwise: configSchema,
    })
  }).default(DEFAULT_THEME_CONFIG.mermaid),
});

export function validateThemeConfig({
  validate,
  themeConfig,
}: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
  return validate(Schema, themeConfig);
}
