/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@heroui/react';
import { forwardRef, useCallback } from 'react';
import { useParams } from 'react-router';
import { FaTrash } from "react-icons/fa";
import { FaRegImages, FaRegImage } from "react-icons/fa";
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

interface FieldConfig {
  name: string;
  label: string;
  multiple?: boolean;
  show?: 'onlyCreate' | 'onlyEdit';
}

interface ImageUploadProps {
  field: FieldConfig;
  value: File | File[] | string | string[] | null;
  error?: { message?: string };
  setValue: (name: string, value: File | File[] | string | string[] | null) => void;
  [key: string]: any;
}

const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ field, value, setValue }, ref) => {
    const { label, multiple = false, required = false } = field;
    const { id } = useParams();

    const compressImage = useCallback(async (file: File) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      try {
        return await imageCompression(file, options);
      } catch (error: any) {
        toast.error('Error al comprimir la imagen', error);
        return file; // Devuelve el archivo original si falla la compresión
      }
    }, []);

    const handleFileChange = async (e: any) => {
      const newFiles: File[] = Array.from(e.target.files || []);
      
      if (newFiles.length === 0) return;

      // Verificar tamaño máximo de archivo (5MB)
      const oversizedFile = newFiles.find(file => file.size > 5000000);
      if (oversizedFile) {
        toast.error('El archivo es demasiado grande (máx. 5MB)');
        return;
      }

      try {
        // Comprimir todas las imágenes
        const compressedFiles = await Promise.all(
          newFiles.map(file => compressImage(file))
        );

        if (multiple) {
          // Combinar las URLs existentes con los nuevos archivos
          const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
          const currentUrls = currentValues.filter(v => typeof v === 'string');
          const currentFiles = currentValues.filter(v => v instanceof File) as File[];
          
          if (currentUrls.length + currentFiles.length + compressedFiles.length > 8) {
            toast.error('Máximo 8 imágenes permitidas');
            return;
          }
          setValue(field.name, [...currentUrls, ...currentFiles, ...compressedFiles]);
        } else {
          setValue(field.name, compressedFiles[0]);
        }
      } catch (error: any) {
        toast.error('Error al procesar las imágenes', error);
      }
    };

    const removeFile = (index: number) => {
      if (!Array.isArray(value)) {
        setValue(field.name, null);
        return;
      }
      
      const newFiles = [...value];
      newFiles.splice(index, 1);
      setValue(field.name, newFiles.length > 0 ? newFiles : null);
    };

    const getImageUrl = (item: File | string) => {
      return typeof item === 'string' ? item : URL.createObjectURL(item);
    };

    return (
      <div className="flex flex-col gap-2">
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          className={`hidden ${field.show === "onlyCreate" && id ? "hidden" : ""
          } ${field.show === "onlyEdit" && !id ? "hidden" : ""
          }`}
          id={`file-upload-${field.name}`}
          ref={ref}
        />
        <label 
          htmlFor={`file-upload-${field.name}`}
          className="flex items-center justify-between cursor-pointer border-gray-600 border-2 border-dashed p-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-950 transition"
        >
          {multiple ? <FaRegImages size={22} /> : <FaRegImage size={20} />}
          <p>Agregar {label}{required && <span className="text-red-500 text-sm">*</span>}</p> 
          <div></div>
        </label>
        
        {/* Previsualización de imágenes */}
        {value && (Array.isArray(value) ? value.length > 0 : true) && (
          <div className={`grid ${multiple ? 'grid-cols-3' : 'grid-cols-1'} gap-2 mt-2`}>
            {Array.isArray(value) ? (
              value.map((item, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={getImageUrl(item)} 
                    alt={`Preview ${index}`}
                    className="w-full h-[152px] object-cover rounded"
                  />
                  <Button
                    isIconOnly
                    radius='full'
                    size='sm'
                    color="danger"
                    onPress={() => removeFile(index)}
                    className="absolute top-1 right-1 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))
            ) : (
              <div className="relative group">
                <img 
                  src={getImageUrl(value)} 
                  alt="Preview"
                  className="w-full h-[152px] object-cover rounded"
                />
                <Button
                  isIconOnly
                  radius='full'
                  size='sm'
                  color="danger"
                  onPress={() => removeFile(0)}
                  className="absolute top-1 right-1 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default ImageUpload;