import Select from 'react-select';

export default function SelectComponent({
  label = 'Seleccione una opción',
  placeholder = 'Buscar y seleccionar...',
  options = [],
  name,
  value,
  onChange,
  error,
  isDisabled = false,
}) {
  const selectedOption = options.find((op) => op.value === value) || null;

  const handleChange = (option) => {
    onChange({
      target: {
        name,
        value: option ? option.value : null,
      },
    });
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <Select
        options={options}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        isDisabled={isDisabled}
        className="text-sm"
        classNamePrefix="elegant-select"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: '46px',
            borderRadius: '14px',
            borderColor: error
              ? '#ef4444'
              : state.isFocused
                ? '#2563eb'
                : '#cbd5e1',
            boxShadow: state.isFocused
              ? '0 0 0 3px rgba(37, 99, 235, 0.15)'
              : 'none',
            '&:hover': {
              borderColor: error ? '#ef4444' : '#2563eb',
            },
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? '#2563eb'
              : state.isFocused
                ? '#eff6ff'
                : 'white',
            color: state.isSelected ? 'white' : '#0f172a',
            cursor: 'pointer',
          }),
          menu: (base) => ({
            ...base,
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
          }),
        }}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
