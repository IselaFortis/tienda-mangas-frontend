import React from 'react';
import { api } from '../api';

export default function ListaVentas({ ventas, onEditar, onCambio }) {
  const eliminar = id => {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    api.delete(`/ventas/${id}`)
      .then(res => { alert(res.data.message); onCambio(); })
      .catch(err => alert('Error: ' + (err.response?.data?.message || err.message)));
  };

  if (!ventas.length) return <p className="vacio">Aún no hay ventas. Registra la primera arriba.</p>;

  return (
    <div className="tabla">
      <table>
        <thead>
          <tr><th>Cliente</th><th>Manga</th><th>Cantidad</th><th>Precio</th><th>Total</th><th>Fecha</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.cliente}</td><td>{v.manga}</td><td>{v.cantidad}</td>
              <td>${v.precio}</td><td>${v.total}</td><td>{v.fecha}</td>
              <td>
                <button onClick={() => onEditar(v)}>Editar</button>
                <button className="sec" onClick={() => eliminar(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
