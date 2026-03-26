import { useNavigate } from "react-router-dom";
import { MdDirectionsCar, MdPhone, MdLocationOn } from "react-icons/md";

interface Technician {
  id: number;
  name: string;
  specialty?: string;
  image?: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

interface Props {
  tech: Technician;
  mode?: "navigate" | "call" | "map";
}

const TechnicianCard = ({ tech, mode = "navigate" }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (mode) {
      case "call":
        if (tech.phone) window.open(`tel:${tech.phone}`);
        break;

      case "map":
        if (tech.lat && tech.lng) {
          window.open(`https://www.google.com/maps?q=${tech.lat},${tech.lng}`);
        }
        break;

      default:
        navigate("/customer/maintenancerequest", {
          state: { technician: tech },
        });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 
      bg-white dark:bg-[#111827] p-4 shadow-sm hover:shadow-lg 
      hover:-translate-y-1 transition-all flex items-center gap-3"
    >
      {/* صورة الفني */}
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {tech.image ? (
          <img
            src={tech.image}
            alt={tech.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <MdDirectionsCar className="text-gray-400" size={22} />
        )}
      </div>

      {/* البيانات */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-800 dark:text-white truncate">
          {tech.name}
        </p>
        {tech.specialty && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tech.specialty}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        {tech.phone && (
          <MdPhone
            size={18}
            className="text-gray-400 hover:text-green-500"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${tech.phone}`);
            }}
          />
        )}

        {tech.lat && tech.lng && (
          <MdLocationOn
            size={18}
            className="text-gray-400 hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://www.google.com/maps?q=${tech.lat},${tech.lng}`
              );
            }}
          />
        )}
      </div>

      {/* حالة */}
      <div className="w-2 h-2 rounded-full bg-green-400" />
    </div>
  );
};

export default TechnicianCard;