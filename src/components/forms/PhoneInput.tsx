import { Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Phone } from 'lucide-react';

interface PhoneInputFieldProps {
  name: string;
  control: any;
  error?: string;
  label?: string;
}

export function PhoneInputField({ name, control, error, label }: PhoneInputFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-slate-400 ml-1">{label}</label>}
      <div className={`relative group flex items-center border border-slate-800 rounded-2xl bg-slate-900/80 transition-all focus-within:ring-2 focus-within:ring-red-500/50 ${error ? 'border-red-500/50' : 'hover:border-slate-700'}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Phone className={`h-5 w-5 transition-colors ${error ? 'text-red-500' : 'text-slate-500 group-focus-within:text-red-500'}`} />
        </div>
        
        <Controller
          name={name}
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return true;
              return isValidPhoneNumber(value) || 'Teléfono no válido';
            }
          }}
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              international
              defaultCountry="CO"
              value={value}
              onChange={onChange}
              placeholder="Número de teléfono"
              className="phone-input-custom w-full pr-4 py-3 bg-transparent text-white outline-none"
            />
          )}
        />
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      
      <style>{`
        .phone-input-custom {
          display: flex;
          align-items: center;
          width: 100%;
          padding-left: 2.75rem;
        }
        .phone-input-custom .PhoneInputCountry {
          margin-right: 0.75rem;
          display: flex;
          align-items: center;
          position: relative;
        }
        .phone-input-custom .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        }
        .phone-input-custom .PhoneInputInput {
          background: transparent;
          border: none;
          color: white !important;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
        }
        .phone-input-custom .PhoneInputInput::placeholder {
          color: #64748b !important; /* slate-500 */
        }
        .phone-input-custom .PhoneInputCountryIcon {
          width: 24px;
          height: auto;
          border-radius: 2px;
        }
        
        /* Dropdown nativo del país */
        .PhoneInputCountrySelect {
          background-color: #020617 !important; /* slate-950 */
          color: white !important;
        }
        
        select.PhoneInputCountrySelect option {
          background-color: #020617 !important;
          color: white !important;
        }

        /* Algunos navegadores usan el tema del sistema, esto fuerza el modo oscuro si es posible */
        @media (prefers-color-scheme: dark) {
          select.PhoneInputCountrySelect {
            color-scheme: dark;
          }
        }

        /* Ocultar el indicador de flecha nativo si es posible para mantener el look limpio */
        .phone-input-custom .PhoneInputCountrySelectArrow {
          opacity: 0.7;
          color: white;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
