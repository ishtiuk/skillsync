
import React from 'react';

interface AuthRightSideProps {
  title: string;
  subtitle: string;
  platform: 'careerforge' | 'talenthub';
  children: React.ReactNode;
}

export const AuthRightSide: React.FC<AuthRightSideProps> = ({
  title,
  subtitle,
  platform,
  children
}) => {
  const isCareerForge = platform === 'careerforge';

  return (
    <div className={`flex-1 flex flex-col justify-center px-6 lg:px-12 relative ${
      isCareerForge
        ? 'bg-careerforge-gradient-secondary'
        : 'bg-talenthub-gradient-secondary'
    }`}>
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className={`absolute top-10 right-10 w-40 h-40 rounded-full blur-3xl animate-pulse ${
          isCareerForge ? 'bg-emerald-300/20' : 'bg-purple-300/20'
        }`}></div>
        <div className={`absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl animate-pulse delay-1000 ${
          isCareerForge ? 'bg-green-300/15' : 'bg-indigo-300/15'
        }`}></div>
        <div className={`absolute top-1/2 right-1/4 w-32 h-32 rounded-full blur-2xl animate-pulse delay-500 ${
          isCareerForge ? 'bg-teal-300/25' : 'bg-violet-300/25'
        }`}></div>
      </div>

      <div className="max-w-md mx-auto w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};
