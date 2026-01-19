'use client';

import { useState } from 'react';
import { Button, Input } from './ui';
import { searchClients } from '@/app/actions';
import { Search, Loader2 } from 'lucide-react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelectClient: (client: any) => void;
};

export const ClientSearchModal = ({ isOpen, onClose, onSelectClient }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        setLoading(true);
        const data = await searchClients(searchTerm);
        setResults(data);
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">🔍 Buscar Cliente</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Digite o nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Buscar'}
                        </Button>
                    </div>

                    <div className="max-h-60 overflow-y-auto border rounded-lg bg-gray-50">
                        {results.length === 0 && !loading && (
                            <p className="p-4 text-center text-gray-500 text-sm">Nenhum cliente encontrado.</p>
                        )}
                        {results.map((client, i) => (
                            <div
                                key={i}
                                onClick={() => { onSelectClient(client); onClose(); }}
                                className="p-3 border-b last:border-b-0 hover:bg-blue-50 cursor-pointer transition-colors"
                            >
                                <p className="font-bold text-gray-800">{client.clientName}</p>
                                <p className="text-xs text-gray-600">📞 {client.phone} | 📍 {client.address}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3 border-t bg-gray-50 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
};
