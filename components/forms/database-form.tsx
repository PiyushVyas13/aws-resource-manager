import React from 'react';
import { ResourceForm } from './resource-form';

const engines = ['postgres', 'mysql', 'mariadb'];
const instanceTypes = ['db.t3.micro', 'db.t3.small', 'db.t3.medium'];

const validateName = (value: string) => {
  if (value.length < 3) return 'Name must be at least 3 characters';
  if (value.length > 63) return 'Name must be less than 63 characters';
  if (!/^[a-zA-Z0-9-]+$/.test(value)) return 'Name can only contain letters, numbers, and hyphens';
  return null;
};

export function DatabaseForm({ onSubmit }: { onSubmit: (values: Record<string, string>) => Promise<void> }) {
  return (
    <ResourceForm
      fields={[
        {
          key: 'name',
          label: 'Database Name',
          placeholder: 'e.g., production-db',
          required: true,
          validation: validateName,
        },
        {
          key: 'engine',
          label: 'Database Engine',
          placeholder: 'Select database engine',
          type: 'select',
          options: engines,
          required: true,
        },
        {
          key: 'size',
          label: 'Instance Size',
          placeholder: 'Select instance size',
          type: 'select',
          options: instanceTypes,
          required: true,
        },
      ]}
      onSubmit={onSubmit}
      color="#4ECDC4"
      submitLabel="Create Database"
    />
  );
}
