export interface Option {
  value: string | number;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  options?: Option[];
  disabled?: boolean;
  defaultValue?: any;
  hideInFormRows?: boolean;
}
