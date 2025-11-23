import { useDropzone } from "react-dropzone";

interface UploadFotosProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  loading?: boolean;
}

export const UploadFotos: React.FC<UploadFotosProps> = ({ fotos, onChange, loading }) => {
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onChange([...fotos, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: loading,
  });

  const handleEliminarFoto = (index: number) => {
    onChange(fotos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-dashed border-2 p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta la imagen aquí ...</p>
        ) : (
          <p>Arrastra y suelta imágenes o haz click para buscar</p>
        )}
      </div>

      {fotos.length > 0 && (
        <div className="row g-3 mt-2">
          {fotos.map((url, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card">
                <img src={url} className="card-img-top" />
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-1"
                  onClick={() => handleEliminarFoto(idx)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
