import React from 'react';
import { TextFieldIcon, TextareaIcon, NumberIcon, DateIcon } from './icons';

export const FIELD_TYPES = {
  text: { label: 'Text Field', icon: <TextFieldIcon />, default: { type: 'text', label: 'Text Field', placeholder: 'Enter text...' } },
  textarea: { label: 'Text Area', icon: <TextareaIcon />, default: { type: 'textarea', label: 'Text Area', placeholder: 'Enter a longer text...' } },
  number: { label: 'Number', icon: <NumberIcon />, default: { type: 'number', label: 'Number Field', placeholder: 'Enter a number...' } },
  date: { label: 'Date', icon: <DateIcon />, default: { type: 'date', label: 'Date Field' } },
}; 