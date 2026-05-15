import AsyncSelect from 'react-select/async';

export default function AsyncSelectComponent({
  label = 'Seleccione una opción',
  placeholder = 'Buscar y seleccionar...',
  name,
  value,
  onChange,
  error,
  isDisabled = false,
  loadOptions,
}) {
  const handleChange = (option) => {
    onChange(option ?? null);
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        isDisabled={isDisabled}
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

          singleValue: (base) => ({
            ...base,
            color: '#0f172a',
            opacity: 1,
          }),

          input: (base) => ({
            ...base,
            color: '#0f172a',
          }),

          placeholder: (base) => ({
            ...base,
            color: '#94a3b8',
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
        }}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
