import path from 'path';
import { fileURLToPath } from 'url';
import Rest from '../lib/index.js';

// ESM doesn't have __dirname, this is a workaround
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rest = new Rest({
  controllers: path.join(__dirname, '/controllers'),
  versioning: {
    header: 'Accept',
    grab: /.*application\/vnd.test(.com)?.v(\d+)\+json/,
    error: '406',
  },
});

export default async function (server) {
  const app = server.app;

  // resources
  await rest.resources(
    'resources_controller',
    {
      collection: { get: ['collection_action'] },
      member: { post: ['member_action'] },
    },
    async () => {
      await rest.resources(
        'nested_controller',
        {
          collection: { get: ['collection_action'] },
          member: { post: ['member_action'] },
        },
        async () => {
          await rest.resources('double_nested_controller', {
            collection: { get: ['collection_action'] },
            member: { post: ['member_action'] },
          });
        }
      );

      await rest.resources('after_double_nested_controller');
    }
  );

  await rest.resources('change_name_controller', {
    name: 'custom_name',
  });
  await rest.resources('before_controllers');

  // resource
  await rest.resource('resource_controller');
  await rest.resource('change_name_controller', {
    name: 'resource_custom_name',
  });

  // versioned resources
  await rest.resources(
    'versioned_resources_controller',
    {
      versions: ['1', '2'],
      collection: { get: ['collection_action'] },
      member: { post: ['member_action'] },
    },
    async () => {
      await rest.resources('versioned_nested_controller', {
        version: ['1', '2'],
        collection: { get: ['collection_action'] },
        member: { post: ['member_action'] },
      });
    }
  );

  // versioned resources
  await rest.resources(
    'non_versioned_resources_controller',
    {
      collection: { get: ['collection_action'] },
      member: { post: ['member_action'] },
    },
    async () => {
      await rest.resources('versioned_nested_controller', {
        version: ['1', '2'],
        collection: { get: ['collection_action'] },
        member: { post: ['member_action'] },
      });
    }
  );

  // versioned resources
  await rest.resources(
    'versioned_resources_controller',
    {
      versions: ['1', '2'],
      collection: { get: ['collection_action'] },
      member: { get: ['deprecated_member_action'], post: ['member_action'] },
    },
    async () => {
      await rest.resources('non_versioned_nested_controller', {
        collection: { get: ['collection_action'] },
        member: { post: ['member_action'] },
      });
    }
  );

  await rest.resources('versioned_change_name_controller', {
    versions: ['1', '2'],
    name: 'versioned_custom_name',
  });

  await rest.resources('versioned_before_controllers', {
    versions: ['1', '2'],
  });

  await rest.resources('wildcard_resources_controller', {
    versions: ['*'],
  });

  // versioned resources
  await rest.resources(
    'fallback_to_v1_resources_controller',
    {
      versions: ['1', '2'],
      collection: { get: ['collection_action'] },
      member: { post: ['member_action'] },
    },
    async () => {
      await rest.resources('fallback_to_v1_nested_resources_controller', {
        version: ['1', '2'],
        collection: { get: ['collection_action'] },
        member: { post: ['member_action'] },
      });
    }
  );

  await rest.resources('fallback_to_base_resources_controller', {
    versions: ['1', '2'],
  });

  await rest.resources('override_default_actions', {
    member: { post: ['create'] },
    collection: { put: ['update'] },
  });

  rest.mountRoutes(app);
};
