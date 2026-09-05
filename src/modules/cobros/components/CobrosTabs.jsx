import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';


const tabs = [

  {
    value:
      'acciones',

    label:
      'Cobrar Acciones',

    icon:
      ClipboardDocumentListIcon,
  },

  {
    value:
      'multas',

    label:
      'Cobrar Multas',

    icon:
      ExclamationTriangleIcon,
  },

  {
    value:
      'adicionales',

    label:
      'Cobrar Adicionales',

    icon:
      CurrencyDollarIcon,
  },

  {
    value:
      'pagos',

    label:
      'Pagos',

    icon:
      BanknotesIcon,
  },
];


export default function CobrosTabs({
  activeView,
  onChange,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">

        {tabs.map(
          (tab) => {

            const Icon =
              tab.icon;


            const active =
              activeView ===
              tab.value;


            return (

              <button
                key={
                  tab.value
                }
                type="button"
                onClick={() =>
                  onChange(
                    tab.value,
                  )
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4 py-3
                  text-sm
                  font-semibold
                  transition

                  ${
                    active
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >

                <Icon className="h-5 w-5" />

                {tab.label}

              </button>

            );
          },
        )}

      </div>

    </div>
  );
}