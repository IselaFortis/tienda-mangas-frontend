import React, { useEffect, useState } from 'react';
import { api } from './api';
import FormularioVenta from './components/FormularioVenta';
import ListaVentas from './components/ListaVentas';
import Catalogo from './components/Catalogo';

const CLIENTES = [
  { name: 'nombre', label: 'Nombre' },
  { name: 'telefono', label: 'Teléfono', opcional: true }
];
const MANGAS = [
  { name: 'titulo', label: 'Título' },
  { name: 'autor', label: 'Autor', opcional: true },
  { name: 'precio', label: 'Precio', type: 'number', step: '0.01' }
];

export default function App() {
  const [vista, setVista] = useState('ventas');
  const [ventas, setVentas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  const cargar = () =>
    api.get('/ventas')
      .then(res => { setVentas(res.data); setError(''); })
      .catch(() => setError('No se pudo conectar con el servidor. Si es el primer acceso, espera unos 40 s y recarga.'));

  // Al volver a la pestaña Ventas se recarga todo (incluye clientes y mangas nuevos)
  useEffect(() => { if (vista === 'ventas') cargar(); }, [vista]);

  const guardado = () => { setEditando(null); cargar(); };

  return (
    <main>
      <header><h1>漫画 Tienda de Mangas</h1><p>Ventas, clientes y mangas</p></header>
      <nav>
        {['ventas', 'clientes', 'mangas'].map(v => (
          <button key={v} className={vista === v ? 'tab activa' : 'tab'} onClick={() => setVista(v)}>
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </nav>
      {error && <p className="error">{error}</p>}

      {vista === 'ventas' && <>
        <FormularioVenta key={editando?.id ?? 'nueva'} venta={editando}
          onGuardado={guardado} onCancelar={() => setEditando(null)} />
        <ListaVentas ventas={ventas} onEditar={setEditando} onCambio={cargar} />
      </>}
      {vista === 'clientes' && <Catalogo ruta="clientes" titulo="Clientes" singular="cliente" campos={CLIENTES} />}
      {vista === 'mangas' && <Catalogo ruta="mangas" titulo="Mangas" singular="manga" campos={MANGAS} />}
    </main>
  );
}
