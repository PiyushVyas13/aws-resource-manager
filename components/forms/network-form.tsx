import React from 'react';
import { ResourceForm } from './resource-form';

const validateIpName = (value: string) => {
  if (value.length < 3) return 'Name must be at least 3 characters';
  if (value.length > 63) return 'Name must be less than 63 characters';
  if (!/^[a-zA-Z0-9-]+$/.test(value)) return 'Name can only contain letters, numbers, and hyphens';
  return null;
};

export function NetworkForm({ onSubmit }: { onSubmit: (values: Record<string, string>) => Promise<void> }) {
  return (
    <ResourceForm
      fields={[
        {
          key: 'name',
          label: 'IP Name',
          placeholder: 'e.g., web-server-ip',
          required: true,
          validation: validateIpName,
        },
      ]}
      onSubmit={onSubmit}
      color="#9B59B6"
      submitLabel="Allocate IP"
    />
  );
}
