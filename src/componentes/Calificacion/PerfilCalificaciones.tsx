import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {Chart as ChartJS,ArcElement,Tooltip,Legend,ChartOptions,Plugin} from "chart.js";
import apiCalificacion from "../../api/endpoints/calificacion";
import type { Calificacion } from "../../modelos/Calificacion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PerfilCalificacionesProps {
  idUsuario: string;
  esMiPerfil?: boolean;
  nombreUsuario?: string;
}

const centerTextPlugin: Plugin<"doughnut"> = {
  id: "centerText",
  afterDraw(chart: any) {
    const { width, height, ctx } = chart;
    ctx.restore();

    const promedio = chart.data.datasets[0].data[0] || 0;
    const text = promedio.toFixed(1);

    const fontSize = Math.min(height, width) / 4;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#2c5f2d";

    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

const PerfilCalificaciones: React.FC<PerfilCalificacionesProps> = ({ idUsuario, esMiPerfil = false,nombreUsuario }) => {
  const [promedio, setPromedio] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(0);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<"resumen" | "comentarios">("resumen");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        // Cargar promedio
        const resPromedio = await apiCalificacion.calificacion.obtenerPromedio(idUsuario);
        setPromedio(resPromedio.promedio || 0);
        setCantidad(resPromedio.cantidad || 0);
        
        // Si hay cal, cargarlas
        if (resPromedio.cantidad > 0) {
          const resCompleto = await apiCalificacion.calificacion.obtenerPorUsuario(idUsuario);
          setCalificaciones(resCompleto.calificaciones || []);
        }
        
      } catch (error: any) {
        console.error("Error al cargar calificaciones:", error);
        setError(error.message || "Error al cargar las calificaciones");
        setPromedio(0);
        setCantidad(0);
      } finally {
        setCargando(false);
      }
    };

    if (idUsuario) {
      cargarDatos();
    }
  }, [idUsuario]);

  const chartData = {
    labels: ["Promedio", "Restante"],
    datasets: [
      {
        data: [promedio, Math.max(0, 5 - promedio)],
        backgroundColor: ["#28a745", "#f1f3f5"],
        hoverBackgroundColor: ["#218838", "#e9ecef"],
        borderWidth: 0,
        borderRadius: 3,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const formatearFecha = (fecha: Date | string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderEstrellas = (puntuacion: number) => {
    return (
      <div style={{ display: "flex", gap: "1px" }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{
            color: i < puntuacion ? "#ffc107" : "#e9ecef",
            fontSize: "12px"
          }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
      overflow: "hidden"
    }}>

      <div style={{ 
        padding: "15px 15px 0 15px",
        borderBottom: "1px solid #e9ecef"
      }}>
        <div style={{ 
          color: "#495057", 
          fontSize: "15px", 
          fontWeight: "600",
          marginBottom: "10px"
        }}>
          {esMiPerfil 
            ? "Mis Calificaciones" 
            : nombreUsuario 
              ? `Calificaciones de ${nombreUsuario}`
              : "Calificaciones"}
        </div>
      </div>

      {/* Pestañas */}
      <div style={{ 
        display: "flex", 
        borderBottom: "1px solid #e9ecef"
      }}>
        <button
          onClick={() => setTabActiva("resumen")}
          style={{
            flex: 1,
            padding: "10px",
            background: tabActiva === "resumen" ? "#f8f9fa" : "transparent",
            border: "none",
            borderRight: "1px solid #e9ecef",
            cursor: "pointer",
            fontWeight: tabActiva === "resumen" ? "600" : "400",
            color: tabActiva === "resumen" ? "#2c5f2d" : "#6c757d",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          📊 Resumen
        </button>
        <button
          onClick={() => setTabActiva("comentarios")}
          style={{
            flex: 1,
            padding: "10px",
            background: tabActiva === "comentarios" ? "#f8f9fa" : "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: tabActiva === "comentarios" ? "600" : "400",
            color: tabActiva === "comentarios" ? "#2c5f2d" : "#6c757d",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          💬 Comentarios ({cantidad})
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: "15px" }}>
        {cargando ? (
          <div style={{ padding: "30px 0", textAlign: "center" }}>
            <div 
              className="spinner-border text-success" 
              role="status"
              style={{ width: "25px", height: "25px" }}
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#6c757d" }}>
              Cargando calificaciones...
            </p>
          </div>
        ) : error ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ color: "#dc3545", fontSize: "12px" }}>{error}</p>
          </div>
        ) : cantidad === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <p style={{ color: "#6c757d", fontSize: "13px", fontStyle: "italic" }}>
              {esMiPerfil 
                ? "Todavia no tenes calificaciones" 
                : "Este usuario todavia no tiene calificaciones"}
            </p>
          </div>
        ) : tabActiva === "resumen" ? (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Gráfico */}
            <div style={{ 
              position: "relative",
              width: "100px", 
              height: "100px", 
              flexShrink: 0
            }}>
              <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
            </div>
            
            {/* Información */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: "28px", 
                fontWeight: "700", 
                color: "#2c5f2d", 
                lineHeight: "1",
                marginBottom: "8px"
              }}>
                {promedio.toFixed(1)}
                <span style={{ fontSize: "14px", color: "#6c757d", fontWeight: "normal" }}>/5</span>
              </div>
              
              {/* Estrellas promedio */}
              <div style={{ marginBottom: "8px" }}>
                {renderEstrellas(Math.round(promedio))}
              </div>
              
              {/* Estadísticas */}
              <div style={{ 
                fontSize: "12px", 
                color: "#6c757d",
                backgroundColor: "#f8f9fa",
                padding: "6px 10px",
                borderRadius: "6px",
                display: "inline-block"
              }}>
                <span style={{ fontWeight: "600" }}>{cantidad}</span> {cantidad === 1 ? "calificación" : "calificaciones"} recibidas
              </div>
            </div>
          </div>
        ) : (
          /* Pestaña de Comentarios */
          <div style={{ maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
            {calificaciones.map((calif, index) => (
              <div 
                key={calif.id || index}
                style={{
                  padding: "12px",
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  border: "1px solid #e9ecef"
                }}
              >
                {/* Encabezado del comentario */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#495057" }}>
                      {calif.nombreCalificador || "Usuario anónimo"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6c757d" }}>
                      {formatearFecha(calif.fecha)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#2c5f2d" }}>
                      {calif.puntuacion}.0
                    </span>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[...Array(calif.puntuacion)].map((_, i) => (
                        <span key={i} style={{ color: "#ffc107", fontSize: "10px" }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Comentario */}
                {calif.comentario && (
                  <div style={{
                    fontSize: "13px",
                    color: "#495057",
                    lineHeight: "1.4",
                    padding: "8px",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    borderLeft: "3px solid #28a745"
                  }}>
                    "{calif.comentario}"
                  </div>
                )}
                
                {!calif.comentario && (
                  <div style={{
                    fontSize: "12px",
                    color: "#adb5bd",
                    fontStyle: "italic"
                  }}>
                    Sin comentario
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilCalificaciones;