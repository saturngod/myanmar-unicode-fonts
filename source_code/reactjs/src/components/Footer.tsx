import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-surface border-t border-default py-6 mt-auto">
            <div className="container-professional text-center">
                <p className="text-secondary text-scale-sm">
                    Myanmar Unicode Fonts Preview Tool &copy; {new Date().getFullYear()}
                </p>
                <p className="text-muted text-scale-xs mt-1">
                    A tool for previewing and testing Myanmar unicode fonts
                </p>
            </div>
        </footer>
    );
};