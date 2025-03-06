import React from 'react';
import { ResourceForm } from './resource-form';

const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

const validateBucketName = (value: string) => {
  if (value.length < 3) return 'Bucket name must be at least 3 characters';
  if (value.length > 63) return 'Bucket name must be less than 63 characters';
  if (!/^[a-z0-9.-]+$/.test(value)) return 'Bucket name can only contain lowercase letters, numbers, dots, and hyphens';
  if (/^[.-]/.test(value)) return 'Bucket name cannot start with a dot or hyphen';
  if (/[.-]$/.test(value)) return 'Bucket name cannot end with a dot or hyphen';
  return null;
};

export function StorageForm({ onSubmit }: { onSubmit: (values: Record<string, string>) => Promise<void> }) {
  return (
    <ResourceForm
      fields={[
        {
          key: 'name',
          label: 'Bucket Name',
          placeholder: 'e.g., my-unique-bucket',
          required: true,
          validation: validateBucketName,
        },
        {
          key: 'region',
          label: 'Region',
          placeholder: 'Select region',
          type: 'select',
          options: regions,
          required: true,
        },
      ]}
      onSubmit={onSubmit}
      color="#96CEB4"
      submitLabel="Create Bucket"
    />
  );
}
