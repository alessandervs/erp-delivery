import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' }) => {
    const base = "px-4 py-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        outline: "border-2 border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400"
    };

    return <button className={twMerge(base, variants[variant], className)} {...props} />;
};

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
    return <input className={twMerge("w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all", className)} {...props} />;
};

export const TextArea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    return <textarea className={twMerge("w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[80px]", className)} {...props} />;
};

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
    return <label className={twMerge("block mb-1 font-semibold text-gray-700 text-sm", className)} {...props} />;
};

export const Select = ({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    return <select className={twMerge("w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white", className)} {...props} />;
};
