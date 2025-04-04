'use client';

import { useState } from 'react';

interface Field<T> {
  name: keyof T;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
  required?: boolean;
}

interface AddFormProps<T = Record<string, string>> {
  fields: Field<T>[];
  onSubmit: (formData: T) => void;
}

export default function AddForm<T = Record<string, string>>({
  fields,
  onSubmit
}: AddFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData as T);
      setFormData({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={String(field.name)} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              name={String(field.name)}
              placeholder={field.placeholder}
              value={(formData[field.name] as string) || ''}
              onChange={handleChange}
              required={field.required}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
            />
          ) : (
            <input
              type="text"
              name={String(field.name)}
              placeholder={field.placeholder}
              value={(formData[field.name] as string) || ''}
              onChange={handleChange}
              required={field.required}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
