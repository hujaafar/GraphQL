'use client';

import React from 'react';
import CrazyAuditStats from '@/components/CrazyAudit';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Welcome to Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Track your progress, stats, and achievements.
          </p>
        </header>

        {/* Crazy Audit Stats */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-4">Audit Stats</h2>
          <CrazyAuditStats />
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
