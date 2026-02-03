export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Multi-Lingua Translation API',
    version: '0.2.1',
    description: 'API for multi-language translation with support for multiple providers (LibreTranslate, MyMemory, DeepL, Google, Azure)',
  },
  servers: [
    {
      url: '/',
      description: 'Current server',
    },
  ],
  paths: {
    '/api/translate': {
      post: {
        tags: ['Translation'],
        summary: 'Translate text to multiple languages',
        description: 'Translates text from a source language to all other supported languages (English, German, French, Italian, Spanish)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'The text to translate',
                    example: 'Hello world',
                  },
                  sourceLanguage: {
                    type: 'string',
                    enum: ['en', 'de', 'fr', 'it', 'es'],
                    description: 'Source language code (defaults to "en" if not specified)',
                    example: 'en',
                  },
                },
                required: ['text'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful translation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    german: {
                      $ref: '#/components/schemas/TranslationResult',
                    },
                    french: {
                      $ref: '#/components/schemas/TranslationResult',
                    },
                    italian: {
                      $ref: '#/components/schemas/TranslationResult',
                    },
                    spanish: {
                      $ref: '#/components/schemas/TranslationResult',
                    },
                    english: {
                      $ref: '#/components/schemas/TranslationResult',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - text is required',
          },
          '500': {
            description: 'Translation failed',
          },
        },
      },
    },
    '/api/translations': {
      get: {
        tags: ['Translations Database'],
        summary: 'Get all saved translations',
        description: 'Retrieves all translation entries from the database',
        responses: {
          '200': {
            description: 'List of translations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Translation',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to fetch translations',
          },
        },
      },
      post: {
        tags: ['Translations Database'],
        summary: 'Add a new translation entry',
        description: 'Saves a new translation entry to the database',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TranslationInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Translation added successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to add translation',
          },
        },
      },
      put: {
        tags: ['Translations Database'],
        summary: 'Update an existing translation',
        description: 'Updates a translation entry in the database',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'Translation ID to update',
                      },
                    },
                    required: ['id'],
                  },
                  {
                    $ref: '#/components/schemas/TranslationInput',
                  },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Translation updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to update translation',
          },
        },
      },
      delete: {
        tags: ['Translations Database'],
        summary: 'Delete a translation',
        description: 'Removes a translation entry from the database',
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'Translation ID to delete',
          },
        ],
        responses: {
          '200': {
            description: 'Translation deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'ID is required',
          },
          '500': {
            description: 'Failed to delete translation',
          },
        },
      },
    },
    '/api/providers': {
      get: {
        tags: ['Providers'],
        summary: 'Get all provider configurations',
        description: 'Retrieves configuration for all translation providers',
        responses: {
          '200': {
            description: 'Provider configurations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    providers: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/ProviderConfig',
                      },
                    },
                    fallbackOrder: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Order of providers (deprecated)',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to fetch providers',
          },
        },
      },
      post: {
        tags: ['Providers'],
        summary: 'Save provider configuration',
        description: 'Creates or updates a provider configuration',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProviderConfigInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Provider configuration saved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Provider type is required',
          },
          '500': {
            description: 'Failed to save provider config',
          },
        },
      },
    },
    '/api/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get application settings',
        description: 'Retrieves application settings including LibreTranslate URL',
        responses: {
          '200': {
            description: 'Application settings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    libretranslate_url: {
                      type: 'string',
                      example: 'http://localhost:5432',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Failed to fetch settings',
          },
        },
      },
      post: {
        tags: ['Settings'],
        summary: 'Update application settings',
        description: 'Updates application settings',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  libretranslate_url: {
                    type: 'string',
                    description: 'LibreTranslate API URL',
                    example: 'http://localhost:5432',
                  },
                },
                required: ['libretranslate_url'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Settings saved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    libretranslate_url: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'libretranslate_url is required',
          },
          '500': {
            description: 'Failed to save settings',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TranslationResult: {
        type: 'object',
        properties: {
          translation: {
            type: 'string',
            description: 'The translated text',
          },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
            description: 'Alternative translations sorted by confidence',
          },
        },
      },
      Translation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          english: { type: 'string' },
          german: { type: 'string' },
          french: { type: 'string' },
          italian: { type: 'string' },
          spanish: { type: 'string' },
          english_proposals: { type: 'string', description: 'JSON array of alternatives' },
          german_proposals: { type: 'string', description: 'JSON array of alternatives' },
          french_proposals: { type: 'string', description: 'JSON array of alternatives' },
          italian_proposals: { type: 'string', description: 'JSON array of alternatives' },
          spanish_proposals: { type: 'string', description: 'JSON array of alternatives' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      TranslationInput: {
        type: 'object',
        properties: {
          english: { type: 'string', example: 'Hello' },
          german: { type: 'string', example: 'Hallo' },
          french: { type: 'string', example: 'Bonjour' },
          italian: { type: 'string', example: 'Ciao' },
          spanish: { type: 'string', example: 'Hola' },
          english_proposals: { type: 'string' },
          german_proposals: { type: 'string' },
          french_proposals: { type: 'string' },
          italian_proposals: { type: 'string' },
          spanish_proposals: { type: 'string' },
        },
        required: ['english'],
      },
      ProviderConfig: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['libretranslate', 'mymemory', 'deepl', 'google', 'azure'],
          },
          enabled: {
            type: 'integer',
            enum: [0, 1],
            description: '1 if provider is active, 0 otherwise',
          },
          api_key: { type: 'string', nullable: true },
          api_url: { type: 'string', nullable: true },
          region: { type: 'string', nullable: true },
          email: { type: 'string', nullable: true, description: 'Email for MyMemory quota increase' },
        },
      },
      ProviderConfigInput: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['libretranslate', 'mymemory', 'deepl', 'google', 'azure'],
            description: 'Provider type',
          },
          enabled: {
            type: 'boolean',
            description: 'Whether this provider is enabled',
          },
          apiKey: { type: 'string', description: 'API key for the provider' },
          apiUrl: { type: 'string', description: 'API URL (for LibreTranslate)' },
          region: { type: 'string', description: 'Region (for Azure)' },
          email: { type: 'string', description: 'Email (for MyMemory)' },
        },
        required: ['type'],
      },
    },
  },
  tags: [
    {
      name: 'Translation',
      description: 'Real-time translation endpoints',
    },
    {
      name: 'Translations Database',
      description: 'CRUD operations for saved translations',
    },
    {
      name: 'Providers',
      description: 'Translation provider configuration',
    },
    {
      name: 'Settings',
      description: 'Application settings',
    },
  ],
};
