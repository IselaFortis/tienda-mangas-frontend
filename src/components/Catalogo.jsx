import React, { useEffect, useState } from 'react';
import { api } from '../api';

// Sección reutilizable: lista + crear (POST) + editar (PUT) + eliminar (DELETE)
export default function Catalogo({ ruta, titulo, singular, campos }) {
  const vacio = Object.fromEntries(campos.map(c => [c.name, '']));
  const [filas, setFilas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [datos, setDatos] = useState(vacio);

  const cargar = () => api.get(`/${ruta}`).then(r => setFilas(r.data)).catch(console.error);
  useEffect(() => { cargar(); }, []);

  const mensaje = err => {
    const m = err.response?.data?.message || err.message;
    return /foreign key/i.test(m) ? 'No se puede eliminar: tiene ventas asociadas.' : 'Error: ' + m;
  };

  const cambiar = e => setDatos({ ...datos, [e.target.name]: e.target.value });
  const limpiar = () => { setEditando(null); setDatos(vacio); };
  const editar = f => {
    setEditando(f);
    setDatos(Object.fromEntries(campos.map(c => [c.name, f[c.name] ?? ''])));
  };

  const enviar = e => {
    e.preventDefault();
    const peticion = editando ? api.put(`/${ruta}/${editando.id}`, datos) : api.post(`/${ruta}`, datos);
    peticion
      .then(res => { alert(res.data.message); limpiar(); cargar(); })
      .catch(err => alert(mensaje(err)));
  };

  const eliminar = id => {
    if (!window.confirm(`¿Seguro que deseas eliminar este ${singular}?`)) return;
    api.delete(`/${ruta}/${id}`)
      .then(res => { alert(res.data.message); cargar(); })
      .catch(err => alert(mensaje(err)));
  };

  return (
    <section>
      <form onSubmit={enviar}>
        <h2>{editando ? `Editar ${singular} #${editando.id}` : `Nuevo ${singular}`}</h2>
        {campos.map(c => (
          <input key={c.name} name={c.name} type={c.type || 'text'} step={c.step}
            placeholder={c.label} value={datos[c.name]} onChange={cambiar} required={!c.opcional} />
        ))}
        <button type="submit">{editando ? 'Guardar cambios' : `Agregar ${singular}`}</button>
        {editando && <button type="button" className="sec" onClick={limpiar}>Cancelar</button>}
      </form>

      {!filas.length ? <p className="vacio">Aún no hay {titulo.toLowerCase()}.</p> : (
        <div className="tabla">
          <table>
            <thead><tr>{campos.map(c => <th key={c.name}>{c.label}</th>)}<th>Acciones</th></tr></thead>
            <tbody>
              {filas.map(f => (
                <tr key={f.id}>
                  {campos.map(c => <td key={c.name}>{f[c.name]}</td>)}
                  <td>
                    <button onClick={() => editar(f)}>Editar</button>
                    <button className="sec" onClick={() => eliminar(f.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
