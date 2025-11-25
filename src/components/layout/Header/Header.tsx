import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Settings } from "lucide-react";
import type { HeaderProps } from "./Header.types";

const Header: React.FC<HeaderProps> = () => {
    const location = useLocation();

    // Map routes to titles and descriptions
    const getPageInfo = () => {
        const path = location.pathname;
        switch (path) {
            case '/':
                return {
                    title: 'Dashboard',
                    description: 'Overview of all airport assets'
                };
            case '/assets':
                return {
                    title: 'Asset Management',
                    description: 'Manage and track all assets'
                };
            case '/admin':
                return {
                    title: 'User Management',
                    description: 'Manage system users and permissions'
                };
            default:
                return {
                    title: 'Dashboard',
                    description: 'Overview of all airport assets'
                };
        }
    };

    const { title, description } = getPageInfo();

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {description}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;