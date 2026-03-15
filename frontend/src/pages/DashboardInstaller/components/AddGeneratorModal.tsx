import { useState } from "react";
import { TfiReload } from "react-icons/tfi";
import { CiWarning } from "react-icons/ci";

interface ModalAddGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const installationCompanies = ["Sachar", "EFEE", "Fibra Andina", "Green House", "Proselec"];
const brands = ["Growatt", "Estamos trabajando para agregar mas marcas"];

const labels = {
  username: "Nombre de Usuario de su cuenta de Growatt",
  password: "Contraseña de su cuenta de Growatt",
  user_client: "Nombre de la planta",
  brand: "Marca del dispositivo",
  name: "Nombre del Cliente",
  wallet: "Wallet Adress del cliente",
  installation_company: "Compañía Instaladora",
  country: "País",
  departament: "Departamento",
  municipality: "Municipio",
};

const ModalAddGenerator: React.FC<ModalAddGeneratorProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    user_client: "",
    brand: "Growatt",
    name: "",
    secret_name: "", // Mantén el campo pero no lo mostrarás
    wallet: "",
    installation_company: "Sachar",
    country: "",
    departament: "",
    municipality: "",
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [walletText, setWalletText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Si se cambia el campo user_client, actualiza secret_name con el mismo valor
    if (name === "user_client") {
      setFormData({
        ...formData,
        [name]: value,
        secret_name: value, // Sincroniza secret_name con user_client
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
      const response = await fetch(`${apiUrl}/installer/add-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add generator");
      }

      onClose();
    } catch (err) {
      console.log(err);
      
    } 
  };

  const handleReload = () => {
    setWalletText("5HTJkawMqHSvVRi2XrE7vdTU4t5Vq1EDv2ZDeWSwNxmmQKEK");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Agregar Generador</h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.keys(formData).map((key) =>
            key === "installation_company" || key === "brand" ? (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-semibold">
                  {labels[key] || key}
                </label>
                <select
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full"
                >
                  {(key === "installation_company" ? installationCompanies : brands).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : key === "wallet" ? (
              <div className="flex items-center gap-2" key={key}>
                <label htmlFor={key} className="block text-sm font-semibold">
                  {labels[key] || key}
                </label>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    name={key}
                    value={walletText || formData[key as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={labels[key] || key}
                    className="border p-2 rounded-md w-full"
                  />
                  <span
                    className="absolute z-10 text-xl top-2 right-3"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <CiWarning />
                  </span>
                  {showTooltip && (
                    <div className="absolute bg-white p-2 border border-gray-300 rounded-md top-8 right-0 shadow-lg">
                      Si no tiene informacion sobre la direccion del usuario, hacer click en el boton de su derecha para asignarle una direccion por defecto.
                      <br />
                      Cuando tenga una direccion propia comunicarse con el equipo de soporte.
                    </div>
                  )}
                </div>
                <button onClick={handleReload} className="p-2 text-blue-600">
                  <TfiReload />
                </button>
              </div>
            ) : key !== "secret_name" ? ( // No renderices secret_name
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-semibold">
                  {labels[key] || key}
                </label>
                <input
                  type={typeof formData[key as keyof typeof formData] === "boolean" ? "checkbox" : "text"}
                  name={key}
                  value={
                    typeof formData[key as keyof typeof formData] === "boolean"
                      ? undefined
                      : formData[key as keyof typeof formData]
                  }
                  checked={
                    typeof formData[key as keyof typeof formData] === "boolean"
                      ? (formData[key as keyof typeof formData] as boolean)
                      : undefined
                  }
                  onChange={handleChange}
                  placeholder={labels[key] || key}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            ) : null // Aquí simplemente omitimos el campo 'secret_name'
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddGenerator;
