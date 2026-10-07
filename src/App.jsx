import React, { useEffect, useState } from 'react';
import { api } from './api';
import FormularioVenta from './components/FormularioVenta';
import ListaVentas from './components/ListaVentas';

export default function App() {
  const [ventas, setVentas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  const cargar = () =>
    api.get('/ventas')
      .then(res => { setVentas(res.data); setError(''); })
      .catch(() => setError('No se pudo conectar con el servidor. Si es el primer acceso, espera unos 40 s y recarga.'));

  useEffect(() => { cargar(); }, []);

  const guardado = () => { setEditando(null); cargar(); };

  return (
    <main>
      <header><h1>漫画 Tienda de Mangas</h1><p>Registro de ventas</p></header>
      {error && <p className="error">{error}</p>}
      <FormularioVenta key={editando?.id ?? 'nueva'} venta={editando}
        onGuardado={guardado} onCancelar={() => setEditando(null)} />
      <ListaVentas ventas={ventas} onEditar={setEditando} onCambio={cargar} />
    </main>
  );
}
