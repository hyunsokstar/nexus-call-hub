import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

const App: React.FC = () => {
    return (
        <div
            style={{
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <RouterProvider router={router} />
        </div>
    );
};

export default App;