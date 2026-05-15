import Select from 'react-select';

export default function MultiSelectComponent({
  label = 'Seleccione opciones',
  placeholder = 'Buscar y seleccionar...',
  options = [],
  name,
  value = [],
  onChange,
  error,
  isDisabled = false,
}) {
  const selectedOptions = options.filter((op) => value.includes(op.value));

  const handleChange = (selected) => {
    const values = selected ? selected.map((op) => op.value) : [];

    onChange({
      target: {
        name,
        value: values,
      },
    });
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <Select
        isMulti
        options={options}
        name={name}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        isSearchable
        isDisabled={isDisabled}
        className="text-sm"
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
          multiValue: (base) => ({
            ...base,
            borderRadius: '10px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#0f172a',
          }),
        }}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
