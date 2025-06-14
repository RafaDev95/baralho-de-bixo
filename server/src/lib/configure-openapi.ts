import { apiReference } from '@scalar/hono-api-reference';

import packageJSON from '../../package.json';
import type { AppOpenApi } from './types';

export default function configureOpenApi(app: AppOpenApi) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Testing API',
    },
  });

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'axios',
      },
      spec: {
        url: '/doc',
      },
    })
  );
}
