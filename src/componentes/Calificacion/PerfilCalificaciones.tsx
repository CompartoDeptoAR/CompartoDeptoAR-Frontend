import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin
} from "chart.js";
import apiCalificacion from "../../api/endpoints/calificacion";
import type { Calificacion } from "../../modelos/Calificacion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PerfilCalificacionesProps {
  idUsuario: string;
  esMiPerfil?: boolean;
  nombreUsuario?: string;
  isMobile?: boolean; // Nueva prop
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

const PerfilCalificaciones: React.FC<PerfilCalificacionesProps> = ({ 
  idUsuario, 
  esMiPerfil = false,
  nombreUsuario,
  isMobile = false
}) => {
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
        
        const resPromedio = await apiCalificacion.calificacion.obtenerPromedio(idUsuario);
        setPromedio(resPromedio.promedio || 0);
        setCantidad(resPromedio.cantidad || 0);
        
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
    return isMobile 
      ? date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
      : date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderEstrellas = (puntuacion: number) => {
    return (
      <div style={{ display: "flex", gap: "1px" }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{
            color: i < puntuacion ? "#ffc107" : "#e9ecef",
            fontSize: isMobile ? "10px" : "12px"
          }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Si es móvil y hay muchas calificaciones, mostrar versión simplificada
  if (isMobile && cantidad > 3) {
    return (
      <div style={{ 
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #e0e0e0",
        overflow: "hidden"
      }}>
        {/* Encabezado simplificado para móvil */}
        <div style={{ padding: "12px", borderBottom: "1px solid #e9ecef" }}>
          <div style={{ 
            fontSize: isMobile ? "14px" : "15px", 
            fontWeight: "600",
            marginBottom: "10px",
            color: "#495057"
          }}>
            {esMiPerfil ? "Mis Calificaciones" : `Calif. de ${nombreUsuario || "Usuario"}`}
          </div>
          
          {/* Resumen compacto */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#2c5f2d", lineHeight: "1" }}>
                {promedio.toFixed(1)}
                <span style={{ fontSize: "10px", color: "#6c757d", fontWeight: "normal" }}>/5</span>
              </div>
              
              <div style={{ margin: "5px 0" }}>
                {renderEstrellas(Math.round(promedio))}
              </div>
              
              <div style={{ fontSize: "11px", color: "#6c757d" }}>
                {cantidad} {cantidad === 1 ? "calif." : "califs."}
              </div>
            </div>
          </div>
          
          {/* Botón para ver comentarios */}
          <button
            onClick={() => setTabActiva(tabActiva === "resumen" ? "comentarios" : "resumen")}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "6px",
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px"
            }}
          >
            {tabActiva === "resumen" ? "💬 Ver comentarios" : "📊 Ver resumen"}
          </button>
        </div>
        
        {/* Contenido según pestaña activa */}
        {tabActiva === "comentarios" && (
          <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>
            {calificaciones.map((calif, index) => (
              <div 
                key={calif.id || index}
                style={{
                  padding: "10px",
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  fontSize: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "600", color: "#495057" }}>
                    {calif.nombreCalificador?.split(" ")[0] || "Anónimo"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span style={{ color: "#2c5f2d", fontWeight: "600" }}>
                      {calif.puntuacion}.0
                    </span>
                    <span style={{ color: "#ffc107", fontSize: "10px" }}>★</span>
                  </div>
                </div>
                
                {calif.comentario && (
                  <div style={{ color: "#495057", lineHeight: "1.3", fontSize: "11px" }}>
                    "{calif.comentario.length > 80 ? calif.comentario.substring(0, 80) + "..." : calif.comentario}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Versión normal para desktop/tablet
  return (
    <div style={{ 
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: isMobile ? "0 2px 8px rgba(0,0,0,0.05)" : "0 3px 10px rgba(0,0,0,0.08)",
      border: "1px solid #e0e0e0",
      overflow: "hidden"
    }}>
      {/* Encabezado con título */}
      <div style={{ 
        padding: isMobile ? "12px 12px 0 12px" : "15px 15px 0 15px",
        borderBottom: "1px solid #e9ecef"
      }}>
        <div style={{ 
          color: "#495057", 
          fontSize: isMobile ? "14px" : "15px", 
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

      {/* Pestañas responsive */}
      <div style={{ 
        display: "flex", 
        borderBottom: "1px solid #e9ecef"
      }}>
        <button
          onClick={() => setTabActiva("resumen")}
          style={{
            flex: 1,
            padding: isMobile ? "8px" : "10px",
            background: tabActiva === "resumen" ? "#f8f9fa" : "transparent",
            border: "none",
            borderRight: "1px solid #e9ecef",
            cursor: "pointer",
            fontWeight: tabActiva === "resumen" ? "600" : "400",
            color: tabActiva === "resumen" ? "#2c5f2d" : "#6c757d",
            fontSize: isMobile ? "12px" : "13px",
            transition: "all 0.2s"
          }}
        >
          {isMobile ? "📊" : "📊 Resumen"}
        </button>
        <button
          onClick={() => setTabActiva("comentarios")}
          style={{
            flex: 1,
            padding: isMobile ? "8px" : "10px",
            background: tabActiva === "comentarios" ? "#f8f9fa" : "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: tabActiva === "comentarios" ? "600" : "400",
            color: tabActiva === "comentarios" ? "#2c5f2d" : "#6c757d",
            fontSize: isMobile ? "12px" : "13px",
            transition: "all 0.2s"
          }}
        >
          {isMobile ? `💬 (${cantidad})` : `💬 Comentarios (${cantidad})`}
        </button>
      </div>

      {/* Contenido */}
      <div style={{ padding: isMobile ? "12px" : "15px" }}>
        {cargando ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <div 
              className="spinner-border text-success" 
              role="status"
              style={{ width: "20px", height: "20px" }}
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{ marginTop: "8px", fontSize: "11px", color: "#6c757d" }}>
              Cargando...
            </p>
          </div>
        ) : error ? (
          <div style={{ padding: "15px 0", textAlign: "center" }}>
            <p style={{ color: "#dc3545", fontSize: "11px" }}>{error}</p>
          </div>
        ) : cantidad === 0 ? (
          <div style={{ padding: "15px 0", textAlign: "center" }}>
            <p style={{ color: "#6c757d", fontSize: "12px", fontStyle: "italic" }}>
              {esMiPerfil 
                ? "Aún no has recibido calificaciones" 
                : "Sin calificaciones aún"}
            </p>
          </div>
        ) : tabActiva === "resumen" ? (
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            gap: isMobile ? "15px" : "20px",
            textAlign: isMobile ? "center" : "left"
          }}>
            {/* Gráfico */}
            <div style={{ 
              position: "relative",
              width: isMobile ? "80px" : "100px", 
              height: isMobile ? "80px" : "100px"
            }}>
              <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
            </div>
            
            {/* Información */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: isMobile ? "24px" : "28px", 
                fontWeight: "700", 
                color: "#2c5f2d", 
                lineHeight: "1",
                marginBottom: "6px"
              }}>
                {promedio.toFixed(1)}
                <span style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", fontWeight: "normal" }}>/5</span>
              </div>
              
              {/* Estrellas promedio */}
              <div style={{ marginBottom: "6px", display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
                {renderEstrellas(Math.round(promedio))}
              </div>
              
              {/* Estadísticas */}
              <div style={{ 
                fontSize: "11px", 
                color: "#6c757d",
                backgroundColor: "#f8f9fa",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block"
              }}>
                <span style={{ fontWeight: "600" }}>{cantidad}</span> {cantidad === 1 ? "calificación" : "calificaciones"}
              </div>
            </div>
          </div>
        ) : (
          /* Pestaña de Comentarios */
          <div style={{ 
            maxHeight: isMobile ? "200px" : "300px", 
            overflowY: "auto", 
            paddingRight: "5px"
          }}>
            {calificaciones.map((calif, index) => (
              <div 
                key={calif.id || index}
                style={{
                  padding: isMobile ? "10px" : "12px",
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  border: "1px solid #e9ecef"
                }}
              >
                {/* Encabezado del comentario */}
                <div style={{ 
                  display: "flex", 
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between", 
                  alignItems: isMobile ? "flex-start" : "center",
                  marginBottom: "6px",
                  gap: isMobile ? "4px" : "0"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: isMobile ? "12px" : "13px", fontWeight: "600", color: "#495057" }}>
                      {calif.nombreCalificador || "Usuario anónimo"}
                    </div>
                    <div style={{ fontSize: isMobile ? "10px" : "11px", color: "#6c757d" }}>
                      {formatearFecha(calif.fecha)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: isMobile ? "11px" : "12px", fontWeight: "600", color: "#2c5f2d" }}>
                      {calif.puntuacion}.0
                    </span>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[...Array(calif.puntuacion)].map((_, i) => (
                        <span key={i} style={{ color: "#ffc107", fontSize: isMobile ? "9px" : "10px" }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Comentario */}
                {calif.comentario && (
                  <div style={{
                    fontSize: isMobile ? "12px" : "13px",
                    color: "#495057",
                    lineHeight: "1.4",
                    padding: "6px",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    borderLeft: "3px solid #28a745"
                  }}>
                    "{isMobile && calif.comentario.length > 100 
                      ? calif.comentario.substring(0, 100) + "..." 
                      : calif.comentario}"
                  </div>
                )}
                
                {!calif.comentario && (
                  <div style={{
                    fontSize: isMobile ? "11px" : "12px",
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