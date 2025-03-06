import React from 'react';
import { ResourceForm } from './resource-form';

const instanceTypes = [
  't3.micro',
  't3.small',
  't3.medium',
  't3.large',
  't3.xlarge',
];

const validateName = (value: string) => {
  if (value.length < 3) return 'Name must be at least 3 characters';
  if (value.length > 63) return 'Name must be less than 63 characters';
  if (!/^[a-zA-Z0-9-]+$/.test(value)) return 'Name can only contain letters, numbers, and hyphens';
  return null;
};

export function ComputeForm({ onSubmit }: { onSubmit: (values: Record<string, string>) => Promise<void> }) {
  return (
    <ResourceForm
      fields={[
        {
          key: 'name',
          label: 'Instance Name',
          placeholder: 'e.g., api-server',
          required: true,
          validation: validateName,
        },
        {
          key: 'type',
          label: 'Instance Type',
          placeholder: 'Select instance type',
          type: 'select',
          options: instanceTypes,
          required: true,
        },
      ]}
      onSubmit={onSubmit}
      color="#FF6B6B"
      submitLabel="Launch Instance"
    />
  );
}
