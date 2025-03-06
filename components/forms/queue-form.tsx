import React from 'react';
import { ResourceForm } from './resource-form';

const validateQueueName = (value: string) => {
  if (value.length < 3) return 'Queue name must be at least 3 characters';
  if (value.length > 80) return 'Queue name must be less than 80 characters';
  if (!/^[a-zA-Z0-9-_]+$/.test(value)) return 'Queue name can only contain letters, numbers, hyphens, and underscores';
  return null;
};

export function QueueForm({ onSubmit }: { onSubmit: (values: Record<string, string>) => Promise<void> }) {
  return (
    <ResourceForm
      fields={[
        {
          key: 'name',
          label: 'Queue Name',
          placeholder: 'e.g., order-processing',
          required: true,
          validation: validateQueueName,
        },
      ]}
      onSubmit={onSubmit}
      color="#F39C12"
      submitLabel="Create Queue"
    />
  );
}
