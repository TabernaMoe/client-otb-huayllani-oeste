import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';


const tabs = [

  {
    value:
      'crear',

    label:
      'Crear Multa',

    icon:
      PlusCircleIcon,
  },

  {
    value:
      'multar',

    label:
      'Multar Acción',

    icon:
      ExclamationTriangleIcon,
  },

  {
    value:
      'listar',

    label:
      'Listar Multas',

    icon:
      ClipboardDocumentListIcon,
  },
];


export default function MultasTabs({
  activeView,
  onChange,
}) {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

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