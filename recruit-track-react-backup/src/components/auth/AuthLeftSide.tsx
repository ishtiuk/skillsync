
import React from 'react';
import { Zap, Users, Target } from 'lucide-react';
import { getPlatformContent } from './AuthPlatformContent';

interface AuthLeftSideProps {
  platform: 'careerforge' | 'talenthub';
}

export const AuthLeftSide: React.FC<AuthLeftSideProps> = ({ platform }) => {
  const isCareerForge = platform === 'careerforge';
  const currentContent = getPlatformContent(platform);

  return (
    <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${
      isCareerForge
        ? 'bg-careerforge-gradient-hero'
        : 'bg-talenthub-gradient-hero'
    }`}>
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          isCareerForge ? 'bg-emerald-300/25' : 'bg-purple-300/25'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
          isCareerForge ? 'bg-green-300/20' : 'bg-indigo-300/20'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-pulse delay-500 ${
          isCareerForge ? 'bg-teal-300/15' : 'bg-violet-300/15'
        }`}></div>

        {/* Additional floating elements */}
        <div className="absolute top-32 right-32 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
        <div className={`absolute bottom-32 left-32 w-3 h-3 rounded-full animate-bounce delay-300 ${
          isCareerForge ? 'bg-emerald-300/30' : 'bg-purple-300/30'
        }`}></div>
        <div className={`absolute top-1/3 left-1/4 w-2 h-2 rounded-full animate-bounce delay-700 ${
          isCareerForge ? 'bg-green-300/40' : 'bg-indigo-300/40'
        }`}></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-8 text-white w-full">
        {/* Top section - Main Brand with Logo */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 ${
              isCareerForge
                ? 'bg-gradient-to-br from-white/20 to-emerald-200/30'
                : 'bg-gradient-to-br from-white/20 to-purple-200/30'
            }`}>
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                SkillSync
              </h1>
              <p className={`text-xs font-medium tracking-wide ${
                isCareerForge ? 'text-emerald-100' : 'text-purple-100'
              }`}>
                {currentContent.tagline}
              </p>
            </div>
          </div>
          <p className={`text-lg leading-relaxed max-w-lg font-light ${
            isCareerForge ? 'text-emerald-100' : 'text-purple-100'
          }`}>
            {currentContent.description}
          </p>

          {/* Enhanced Sub-platforms */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className={`rounded-xl p-4 border backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-lg ${
              isCareerForge
                ? 'bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/30'
                : 'bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isCareerForge
                    ? 'bg-gradient-to-br from-emerald-300/30 to-green-400/40 border-emerald-200/40'
                    : 'bg-gradient-to-br from-purple-300/30 to-indigo-400/40 border-purple-200/40'
                }`}>
                  <Target className={`w-4 h-4 ${
                    isCareerForge ? 'text-emerald-100' : 'text-purple-100'
                  }`} strokeWidth={2} />
                </div>
                <h3 className={`font-bold text-sm ${
                  isCareerForge ? 'text-emerald-100' : 'text-purple-100'
                }`}>CareerForge</h3>
              </div>
              <p className={`text-xs leading-relaxed ${
                isCareerForge ? 'text-emerald-200' : 'text-purple-200'
              }`}>Advanced job seeker portal with AI insights</p>
            </div>

            <div className={`rounded-xl p-4 border backdrop-blur-sm hover:scale-105 transition-all duration-300 shadow-lg ${
              isCareerForge
                ? 'bg-gradient-to-br from-green-400/20 to-teal-500/20 border-green-300/30'
                : 'bg-gradient-to-br from-indigo-400/20 to-violet-500/20 border-indigo-300/30'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isCareerForge
                    ? 'bg-gradient-to-br from-green-300/30 to-teal-400/40 border-green-200/40'
                    : 'bg-gradient-to-br from-indigo-300/30 to-violet-400/40 border-indigo-200/40'
                }`}>
                  <Users className={`w-4 h-4 ${
                    isCareerForge ? 'text-green-100' : 'text-indigo-100'
                  }`} strokeWidth={2} />
                </div>
                <h3 className={`font-bold text-sm ${
                  isCareerForge ? 'text-green-100' : 'text-indigo-100'
                }`}>TalentHub</h3>
              </div>
              <p className={`text-xs leading-relaxed ${
                isCareerForge ? 'text-green-200' : 'text-indigo-200'
              }`}>Smart recruitment and talent discovery</p>
            </div>
          </div>
        </div>

        {/* Middle section - Enhanced Features with Dynamic Content */}
        <div className="space-y-6 my-6">
          <div className="space-y-6">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-all duration-300 backdrop-blur-sm shadow-lg ${
                  isCareerForge
                    ? index === 0 ? 'bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/40'
                      : index === 1 ? 'bg-gradient-to-br from-green-400/20 to-teal-500/20 border-green-300/40'
                      : 'bg-gradient-to-br from-teal-500/20 to-emerald-600/20 border-teal-400/40'
                    : index === 0 ? 'bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/40'
                      : index === 1 ? 'bg-gradient-to-br from-indigo-400/20 to-violet-500/20 border-indigo-300/40'
                      : 'bg-gradient-to-br from-violet-500/20 to-purple-600/20 border-violet-400/40'
                }`}>
                  <svg className={`w-5 h-5 ${
                    isCareerForge
                      ? index === 0 ? 'text-emerald-200'
                        : index === 1 ? 'text-green-200'
                        : 'text-teal-100'
                      : index === 0 ? 'text-purple-200'
                        : index === 1 ? 'text-indigo-200'
                        : 'text-violet-100'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{feature.title}</h3>
                  <p className={`leading-relaxed text-sm ${
                    isCareerForge ? 'text-emerald-100' : 'text-purple-100'
                  }`}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section - Enhanced Stats with Platform-specific data */}
        <div className={`border-t pt-6 ${
          isCareerForge ? 'border-emerald-300/30' : 'border-purple-300/30'
        }`}>
          <div className="grid grid-cols-3 gap-6 text-center">
            {currentContent.stats.map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className={`text-xs font-medium ${
                  isCareerForge ? 'text-emerald-100' : 'text-purple-100'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
