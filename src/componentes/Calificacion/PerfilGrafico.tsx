import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import apiCalificacion, { PromedioResponse } from "../../api/endpoints/calificacion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PerfilGraficoProps {
  idUsuario: string;
}

const PerfilGrafico: React.FC<PerfilGraficoProps> = ({ idUsuario }) => {
  const [promedio, setPromedio] = useState<number>(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        setCargando(true);
        const res: PromedioResponse = await apiCalificacion.calificacion.obtenerPromedio(idUsuario);
        setPromedio(res.promedio);
      } catch (error) {
        console.error("Error al obtener promedio:", error);
        setPromedio(0);
      } finally {
        setCargando(false);
      }
    };

    fetchPromedio();
  }, [idUsuario]);

  const chartData = {
    labels: ["Promedio", "Restante"],
    datasets: [
      {
        data: [promedio, 5 - promedio],
        backgroundColor: ["#a0d8f1", "#e0e0e0"], // colores claritos
        hoverBackgroundColor: ["#90c9e0", "#d0d0d0"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            if (tooltipItem.dataIndex === 0) return `Promedio: ${promedio.toFixed(1)}/5`;
            return "";
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "150px", textAlign: "center" }}>
      <h4 style={{ marginBottom: "10px" }}>Mi Promedio</h4>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <Doughnut data={chartData} options={options} />
      )}
      {!cargando && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{promedio.toFixed(1)} / 5</p>}
    </div>
  );
};

export default PerfilGrafico;
