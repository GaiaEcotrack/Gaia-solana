import { SolanaProvider } from "@/components/providers/solana-provider";
import { SolanaInteract } from "@/components/solana/solana-interact";

export default function SolanaDemoPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8 text-center">
          Demostración de Integración Solana
        </h1>
        
        <p className="text-center text-gray-400 mb-12">
          Conecta tu wallet e interactúa de manera segura. El backend construirá la transacción, tu wallet la firmará,
          y el backend se encargará de retransmitirla a la red.
        </p>

        {/* El Provider debe englobar cualquier componente que use hooks de wallet */}
        <SolanaProvider>
          <SolanaInteract />
        </SolanaProvider>
      </div>
    </div>
  );
}
