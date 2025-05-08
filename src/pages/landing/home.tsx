
const MasonryGallery = () => {
  // Array de imágenes con distintas dimensiones (simuladas con picsum.photos)
  const images = [
    { id: 1, url: "https://picsum.photos/400/600" },
    { id: 2, url: "https://picsum.photos/600/400" },
    { id: 3, url: "https://picsum.photos/800/500" },
    { id: 4, url: "https://picsum.photos/500/800" },
    { id: 5, url: "https://picsum.photos/300/500" },
    { id: 6, url: "https://picsum.photos/700/300" },
    { id: 7, url: "https://picsum.photos/400/400" },
    { id: 8, url: "https://picsum.photos/600/600" },
  ];

  return (
    <div className="con
    tainer mx-auto px-4 py-8">
      <title>Inicio</title>
      <h1 className="text-3xl font-bold text-center mb-16">¡Bienvenido a nuestra galería!</h1>
      
      {/* Contenedor Masonry con Tailwind */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative group break-inside-avoid animate__animated animate__fadeInUp"
          >
            <img
              src={image.url}
              alt={`Imagen ${image.id}`}
              className="w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* Efecto hover opcional */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300">
                Imagen {image.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGallery;