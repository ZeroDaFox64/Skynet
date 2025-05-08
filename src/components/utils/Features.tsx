/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input } from '@heroui/react';
import { forwardRef, useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

interface FieldConfig {
  name: string;
  label: string;
  multiple?: boolean;
  show?: 'onlyCreate' | 'onlyEdit';
}

interface FeaturesProps {
  field: FieldConfig;
  value: any | null;
  error?: { message?: string };
  setValue: (name: string, value: any | null) => void;
  [key: string]: any;
}

const Features = forwardRef<HTMLInputElement, FeaturesProps>(
  ({ field, value, setValue }, ref) => {
    const { label } = field;

    const [titleFeature, setTitleFeature] = useState('');
    const [valueFeature, setValueFeature] = useState('');
    const [internalValue, setInternalValue] = useState<any[]>([]);

    // Función para parsear el valor inicial
    const parseInitialValue = (inputValue: any) => {
      try {
        // Si es string, intentamos parsearlo
        if (typeof inputValue === 'string') {
          return JSON.parse(inputValue);
        }
        // Si es array, tomamos el primer elemento si es string
        if (Array.isArray(inputValue) && inputValue.length > 0 && typeof inputValue[0] === 'string') {
          return JSON.parse(inputValue[0]);
        }
        // Si ya es array de objetos, lo devolvemos directamente
        if (Array.isArray(inputValue)) {
          return inputValue;
        }
        return [];
      } catch (error) {
        console.error('Error parsing features:', error);
        return [];
      }
    };

    // Efecto para inicializar el valor interno
    useEffect(() => {
      const parsed = parseInitialValue(value);
      setInternalValue(parsed);
      // Solo actualizamos el valor padre si es diferente
      if (JSON.stringify(parsed) !== JSON.stringify(value)) {
        setValue(field.name, parsed);
      }
    }, [value]);

    const handleAddFeature = () => {
      if (titleFeature.length < 1 || valueFeature.length < 1) {
        return toast.warning("Por favor, completa los dos campos");
      }
      
      const newFeatures = [...internalValue, {
        title: titleFeature,
        value: valueFeature,
      }];
      
      setTitleFeature('');
      setValueFeature('');
      setInternalValue(newFeatures);
      setValue(field.name, newFeatures);
    };

    const handleRemoveFeature = (index: number) => {
      const newFeatures = [...internalValue];
      newFeatures.splice(index, 1);
      setInternalValue(newFeatures);
      setValue(field.name, newFeatures);
    };

    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-xs">{label}</h3>
        <div className="flex flex-col gap-2 justify-center">
          <div className="flex gap-2 items-center">
            <Input 
              type="text"
              variant='underlined'
              label={<p className='text-gray-400'>Titulo</p>}
              value={titleFeature}
              onChange={(e) => setTitleFeature(e.target.value)}
              placeholder={'Ej. Material'}
              size="sm"
              ref={ref}
            />
            <Input 
              type="text"
              variant='underlined'
              label={<p className='text-gray-400'>Valor</p>}
              value={valueFeature}
              onChange={(e) => setValueFeature(e.target.value)}
              placeholder={'Ej. Algodón'}
              size="sm"
              ref={ref}
            />
            <Button
              radius="full"
              isIconOnly
              color="danger"
              size="sm"
              onPress={handleAddFeature}
            >
              <FaPlus size={15} className="text-white" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {internalValue.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">Características añadidas:</p>
            )}
            {internalValue.map((feature, index) => (
              <div key={index} className="flex gap-2 border-1 border-gray-400 pl-3 py-1 rounded-xl items-center justify-between">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">{feature.title} : </span>
                  {feature.value}
                </p>
                <Button
                  isIconOnly
                  radius='full'
                  size='sm'
                  onPress={() => handleRemoveFeature(index)}
                  className="bg-transparent text-danger-400 rounded-full flex items-center justify-center"
                >
                  <FaTrash />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default Features;