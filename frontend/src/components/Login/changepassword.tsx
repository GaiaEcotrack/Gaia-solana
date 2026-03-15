import { useState } from "react";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import Swal from "sweetalert2"; // Asegúrate de haber instalado SweetAlert2 con `npm install sweetalert2`
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Para los íconos del ojo

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para controlar la visibilidad de las contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const auth = getAuth(); // Inicializar autenticación de Firebase

  // Manejar el submit del formulario
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validar que las contraseñas nuevas coinciden
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Validar longitud mínima de la contraseña
    if (newPassword.length < 6) {
      return setError("Password should be at least 6 characters.");
    }

    try {
      setError(""); // Limpiar errores anteriores
      setLoading(true); // Deshabilitar botón mientras se procesa

      // Obtener el usuario actual de Firebase
      const user = auth.currentUser;
      if (!user || !currentPassword) {
        return setError("Failed to authenticate. Please check your current password.");
      }

      // Reautenticar al usuario con la contraseña actual
      const credential = EmailAuthProvider.credential(user.email as string, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar la contraseña con la nueva
      await updatePassword(user, newPassword);

      // Mostrar notificación de éxito
      Swal.fire({
        title: "Success!",
        text: "Your password has been updated successfully",
        icon: "success",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Ok!"
      });

      // Limpiar campos del formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      // Manejar errores de Firebase
      if (error.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        setError("New password is too weak.");
      } else {
        setError("Failed to update the password. Please try again later.");
      }
    } finally {
      setLoading(false); // Habilitar botón después de procesar
    }
  }

  // Funciones para alternar la visibilidad de las contraseñas
  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Change Password</h2>

      {/* Current Password */}
      <div className="mb-4 relative">
        <label htmlFor="currentPassword" className="block text-gray-700 font-semibold mb-2">
          Current Password
        </label>
        <input
          type={showCurrentPassword ? "text" : "password"}
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={toggleCurrentPasswordVisibility}
        >
          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      {/* New Password */}
      <div className="mb-4 relative">
        <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
          New Password
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={toggleNewPasswordVisibility}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      {/* Confirm New Password */}
      <div className="mb-4 relative">
        <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
          Confirm New Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={toggleConfirmPasswordVisibility}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}

export default ChangePassword;
