'use client';

import { useEffect, useState } from 'react';
import { Button, Input, TextArea, Label } from './ui';
import { Pencil } from 'lucide-react';

type ClientData = {
    clientName: string;
    phone: string;
    address: string;
};

type Props = {
    isOpen: boolean;
    initialData: ClientData;
    onClose: () => void;
    onSave: (data: ClientData) => void;
};

export const ClientEditModal = ({ isOpen, initialData, onClose, onSave }: Props) => {
    const [formData, setFormData] = useState<ClientData>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    // Phone mask within modal
    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        if (v.length > 9) v = `${v.slice(0, 9)}-${v.slice(9)}`;
        setFormData({ ...formData, phone: v });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Pencil className="w-5 h-5" /> Editar Cadastro Cliente
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <Label>👤 Nome (Cadastro):</Label>
                        <Input
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>📞 Telefone:</Label>
                        <Input
                            value={formData.phone}
                            onChange={handlePhone}
                            maxLength={15}
                        />
                    </div>
                    <div>
                        <Label>🚚 Endereço:</Label>
                        <TextArea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
                </div>
            </div>
        </div>
    );
};
