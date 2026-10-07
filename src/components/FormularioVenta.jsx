import React, { useEffect, useState } from 'react';
import { api } from '../api';

const vacio = { cliente_id: '', manga_id: '', cantidad: '', fecha: '' };

// Sirve para crear (POST) y para editar (PUT) según reciba "venta"
export default function FormularioVenta({ venta, onGuardado, onCancelar }) {
  const [datos, setDatos] = useState(venta ? {
    cliente_id: venta.cliente_id, manga_id: venta.manga_id,
    cantidad: venta.cantidad, fecha: venta.fecha
  } : vacio);
  const [clientes, setClientes] = useState([]);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    api.get('/clientes').then(r => setClientes(r.data)).catch(console.error);
    api.get('/mangas').then(r => setMangas(r.data)).catch(console.error);
  }, []);

  const cambiar = e => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = e => {
    e.preventDefault();
    const peticion = venta ? api.put(`/ventas/${venta.id}`, datos) : api.post('/ventas', datos);
    peticion
      .then(res => { alert(res.data.message); setDatos(vacio); onGuardado(); })
      .catch(err => alert('Error: ' + (err.response?.data?.message || err.message)));
  };

  return (
    <form onSubmit={enviar}>
      <h2>{venta ? `Editar venta #${venta.id}` : 'Nueva venta'}</h2>
      <select name="cliente_id" value={datos.cliente_id} onChange={cambiar} required>
        <option value="">Cliente</option>
        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </select>
      <select name="manga_id" value={datos.manga_id} onChange={cambiar} required>
        <option value="">Manga</option>
        {mangas.map(m => <option key={m.id} value={m.id}>{m.titulo} - ${m.precio}</option>)}
      </select>
      <input type="number" min="1" name="cantidad" placeholder="Cantidad" value={datos.cantidad} onChange={cambiar} required />
      <input type="date" name="fecha" value={datos.fecha} onChange={cambiar} required />
      <button type="submit">{venta ? 'Guardar cambios' : 'Registrar venta'}</button>
      {venta && <button type="button" className="sec" onClick={onCancelar}>Cancelar</button>}
    </form>
  );
}
