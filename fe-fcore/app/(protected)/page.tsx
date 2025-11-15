// src/app/(protected)/page.tsx
export default function ProtectedHome() {
  return (
    <div className="grid">
      <div className="col-12">
        <h1 className="text-2xl mb-2">Bienvenido</h1>
        <p className="text-600">Selecciona una opción en el menú lateral para comenzar.</p>
      </div>
    </div>
  );
}
