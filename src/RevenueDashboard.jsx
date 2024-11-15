"use client"

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, subDays, differenceInDays } from 'date-fns';
import { InfoIcon as Analytics, ArrowLeft, BarChart2, CalendarIcon, ChevronDown, FileText, HelpCircle, Layout, MessageSquare, Search, Settings, Share2, Tags, Upload, Users, Bot, DollarSign, UserPlus, XCircle, ArrowRight,X, Menu as MenuIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import dashboardIcon from '/src/images/dashboard.svg'
import affiliateIcon from '/src/images/affiliate.svg'
import analysisIcon from '/src/images/analysis.svg'
import analyticsIcon from '/src/images/analytics.svg'
import api_managementIcon from '/src/images/api-management.svg'
import campaignIcon from '/src/images/campaign.svg'
import category_tagsIcon from '/src/images/category&tags.svg'
import content_analysisIcon from '/src/images/content-analysis.svg'
import content_managementIcon from '/src/images/content-management.svg'
import content_uploadIcon from '/src/images/content-upload.svg'
import help_supportIcon from '/src/images/help&support.svg'
import import_issuesIcon from '/src/images/import-issues.svg'
import invite_peopleIcon from '/src/images/invite-people.svg'
import managementIcon from '/src/images/management.svg'
import sales_commissionsIcon from '/src/images/sales&commissions.svg'
import settingIcon from '/src/images/setting.svg'
import survery_reportIcon from '/src/images/survery-report.svg'
import user_analysisIcon from '/src/images/user-analysis.svg'
import avatarIcon from '/src/images/Avatar.svg'


const generateMockData = (startDate, endDate) => {
  const days = differenceInDays(endDate, startDate) + 1;
  const baseValue = 50000;
  const peakValue = 200000;

  return Array.from({ length: days }, (_, i) => {
    const progress = i / (days - 1);
    const growthValue = baseValue + (peakValue - baseValue) * progress;
    const randomFactor = (Math.random() - 0.5) * 0.2 * growthValue;
    const totalMRR = Math.max(0, growthValue + randomFactor);

    const newMRR = Math.round(totalMRR * 0.15);
    const upgrades = Math.round(totalMRR * 0.1);
    const reactivations = Math.round(totalMRR * 0.05);
    const existing = Math.round(totalMRR * 0.6);
    const downgrades = Math.round(totalMRR * 0.03);
    const churn = Math.round(totalMRR * 0.02);
    const arpu = Math.round(totalMRR * 0.001);

    return {
      date: subDays(endDate, days - i - 1),
      'New MRR': newMRR,
      'Upgrades': upgrades,
      'Reactivations': reactivations,
      'Existing': existing,
      'Downgrades': downgrades,
      'Churn': churn,
      'ARPU': arpu,
      'Total MRR': Math.round(totalMRR),
    };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalMRR = payload.find(entry => entry.name === 'Total MRR')?.value || 0;
    const metrics = [
      { name: 'New MRR', color: '#8987FD' },
      { name: 'Upgrades', color: '#4AF26F' },
      { name: 'Reactivations', color: '#5ED8FF' },
      { name: 'Existing', color: '#6C79FF' },
      { name: 'Downgrades', color: '#BB87FC' },
      { name: 'Churn', color: '#FF64D4' },
      { name: 'ARPU', color: '#F2E205' },
    ];

    return (
      <div className="bg-[#1E1E2E] p-4 rounded-lg shadow-lg" style={{ width: '240px' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-white text-sm font-semibold">MRR Breakdown</h4>
          <span className="text-gray-400 text-xs">{format(new Date(label), 'd MMM yyyy')}</span>
        </div>
        <div className="space-y-2">
          {metrics.map((metric) => {
            const entry = payload.find(p => p.name === metric.name);
            return (
              <div key={metric.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }}></div>
                  <span className="text-gray-400 text-xs">{metric.name}</span>
                </div>
                <span className="text-white text-xs font-semibold">
                  ${entry ? entry.value.toLocaleString() : '0'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-400 text-xs">Total MRR</span>
            </div>
            <span className="text-white text-xs font-semibold">${totalMRR.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


const formatYAxis = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value;
};


const MetricCard = ({ title, value, color }) => (
  <div className="flex items-center justify-between bg-[#4345632C] p-3 lg:p-4 rounded-lg border" style={{ borderColor: '#52526F40' }}>
    <div className="flex items-center gap-2">
      <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-${color}`}></div>
      <div className="text-xs lg:text-sm text-white">{title}</div>
    </div>
    <div className="text-sm lg:text-lg font-semibold text-white">{value}</div>
  </div>
);

const SidebarItem = ({ iconSrc, text, isActive, hasSubItems, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button
        onClick={() => hasSubItems && setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
          isActive ? 'bg-[#292A35] text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <img src={iconSrc} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
        <span className="flex-1 text-left">{text}</span>
        {hasSubItems && <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
      {isOpen && children && (
        <div className="ml-8 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

const CustomAvatar = () => (
  <img src={avatarIcon} alt="User profile" className="w-10 h-10 rounded-full" />
)

export default function RevenueDashboard() {
  const [endDate, setEndDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(30);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('MRR');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const startDate = subDays(endDate, selectedRange - 1);
    setChartData(generateMockData(startDate, endDate));
  }, [endDate, selectedRange]);

  const handleDateChange = (date) => {
    setEndDate(date);
    setIsCalendarOpen(false);
  };

  const handleRangeChange = (days) => {
    setSelectedRange(days);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#13131A]">
      {/* Mobile Header - Lowered z-index */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-[#191A23] border-b border-gray-800">
        <button
          onClick={toggleMobileMenu}
          className="text-white"
        >
          <MenuIcon size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 text-white text-xs rounded-lg flex items-center justify-center" style={{ backgroundColor: '#575BC7' }}>
            MW
          </div>
          <CustomAvatar />
        </div>
      </div>

      {/* Sidebar - Increased z-index */}
      <div className={`
        w-64 bg-[#191A23] border-r border-gray-800 fixed h-screen overflow-hidden
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        z-50
      `}>
        {/* Mobile close button - Repositioned */}
        <div className="lg:hidden absolute top-2 right-2">
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Original Sidebar Content */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex flex-col">
          <div className="p-4 flex-1">
            {/* Workspace header */}
            <div className="flex items-center justify-between mb-4 mt-8 lg:mt-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 text-white text-xs rounded-lg flex items-center justify-center" style={{ backgroundColor: '#575BC7' }}>
                  MW
                </div>
                <span className="text-white text-sm font-medium">My Workspace</span>
              </div>
              <CustomAvatar/>
            </div>

            <div className="h-1"></div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                className="w-full text-white pl-10 pr-4 py-2 rounded-lg text-sm" 
                style={{ backgroundColor: '#292A35' }}
              />
            </div>

            <div className="h-4"></div>
            <nav className="space-y-1">
              <SidebarItem iconSrc={dashboardIcon} text="Dashboard" isActive />
              <div className="h-2"></div>
              <SidebarItem iconSrc={analysisIcon} text="Analysis" hasSubItems>
                <SidebarItem iconSrc={user_analysisIcon} text="User Analysis" />
                <SidebarItem iconSrc={content_analysisIcon} text="Content Analysis" />
                <SidebarItem iconSrc={survery_reportIcon} text="Survey Report" />
              </SidebarItem>
              <SidebarItem iconSrc={managementIcon} text="Management" hasSubItems>
                <SidebarItem iconSrc={content_uploadIcon} text="Content Upload" />
                <SidebarItem iconSrc={content_managementIcon} text="Content Management" />
                <SidebarItem iconSrc={category_tagsIcon} text="Category & Tags" />
              </SidebarItem>

              <SidebarItem iconSrc={affiliateIcon} text="Affiliate" hasSubItems>
                <SidebarItem iconSrc={analyticsIcon} text="Analytics" />
                <SidebarItem iconSrc={campaignIcon} text="Campaign" />
                <SidebarItem iconSrc={affiliateIcon} text="Affiliate" />
                <SidebarItem iconSrc={sales_commissionsIcon} text="Sales & Commissions" />
                <SidebarItem iconSrc={settingIcon} text="Setting" />
              </SidebarItem>

              <SidebarItem iconSrc={api_managementIcon} text="API Management" />

              <div className="h-4"></div>
              <SidebarItem iconSrc={invite_peopleIcon} text="Invite people" />
              <SidebarItem iconSrc={help_supportIcon} text="Help & Support" />
            </nav>
          </div>

          {/* Bottom boxes */}
          <div className="p-4 space-y-2">
            <div className="bg-[#1D1E2B] rounded-lg p-4 relative border border-[#292B41]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">App version 3.1</span>
              </div>
            </div>

            <div className="bg-[#1D1E2B] rounded-lg p-4 relative border border-[#292B41]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <SidebarItem iconSrc={import_issuesIcon}/>
                  </div>
                  <span className="text-sm font-medium text-white">Import Issues</span>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 mb-3">
                Use our Migration Assistant to copy issues from another service.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-1 text-xs hover:text-purple-400" 
                style={{ color: '#575BC7' }}
              >
                Try Now
                <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay background */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-45 lg:hidden" 
          onClick={toggleMobileMenu}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 bg-[#181921] pt-[72px] lg:pt-0">
        <div className="p-4 lg:p-8 lg:pr-4 bg-[#181921]">
          {/* Original content structure */}
          <div className="flex gap-2">
            <ArrowLeft className="w-6 h-6" style={{ color: '#6E79D6' }} />
            <span className="text-white">Back</span>
          </div>

          <div className="h-4"></div>
          <div className="bg-[#1D1E2B7F] p-4 rounded-md border" style={{ borderColor: '#52526F70' }}>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-xl lg:text-2xl font-semibold text-white">Revenue</h1>
              
              <div className="bg-[#1E1E2E] md:ml-[200px] rounded-md overflow-hidden">
                <button
                  onClick={() => setActiveTab('MRR')}
                  className={`px-4 py-2 text-sm ${
                    activeTab === 'MRR' ? 'bg-[#575BC7] text-white' : 'text-gray-400'
                  }`}
                >
                  MRR
                </button>
                <button
                  onClick={() => setActiveTab('ARPU')}
                  className={`px-4 py-2 text-sm ${
                    activeTab === 'ARPU' ? 'bg-[#575BC7] text-white' : 'text-gray-400'
                  }`}
                >
                  ARPU
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#1E1E2E] w-full sm:w-auto"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {format(endDate, 'MMM d, yyyy')}
                  </button>
                  {isCalendarOpen && (
                    <div className="absolute top-full xs:left-0 left-1/2 -translate-x-1/2 xs:translate-x-0 mt-2 z-10">
                      <Calendar
                        onChange={handleDateChange}
                        value={endDate}
                        className="border border-gray-700 rounded-lg shadow-lg bg-white"
                      />
                    </div>
                  )}
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[#1E1E2E] w-full sm:w-auto"
                  >
                    Last {selectedRange} Days
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#1E1E2E] border border-gray-700 rounded-lg shadow-lg z-10">
                      {[7, 14, 30, 60, 90].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleRangeChange(days)}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Last {days} Days
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard title="Total MRR" value="$14,775" />
              <MetricCard title="New MRR" value="$14,775" />
              <MetricCard title="Upgrades" value="$13,000" />
              <MetricCard title="Downgrades" value="$755" />
              <MetricCard title="ARPU" value="$10,000" />
              <MetricCard title="Reactivations" value="$10,000" />
              <MetricCard title="Existing" value="$10,000" />
              <MetricCard title="Churn" value="$100" />
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-end overflow-x-auto">
              {[
                { label: 'Total MRR', color: '#F24A4A' },
                { label: 'New MRP', color: '#8987FD' },
                { label: 'Reactivations', color: '#5ED8FF' },
                { label: 'Upgrades', color: '#4AF26F' },
                { label: 'Existing', color: '#6C79FF' },
                { label: 'Downgrades', color: '#BB87FC' },
                { label: 'Churn', color: '#FF64D4' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="h-[300px] lg:h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="15%" margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'd MMM')}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" tickFormatter={formatYAxis} />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar dataKey="Churn" stackId="a" fill="#FF64D4" />
                  <Bar dataKey="Downgrades" stackId="a" fill="#BB87FC" />
                  <Bar dataKey="Existing" stackId="a" fill="#6C79FF" />
                  <Bar dataKey="Reactivations" stackId="a" fill="#5ED8FF" />
                  <Bar dataKey="Upgrades" stackId="a" fill="#4AF26F" />
                  <Bar dataKey="New MRR" stackId="a" fill="#8987FD" />
                  <Bar dataKey="ARPU" stackId="a" fill="#F2E205" />
                  <Bar dataKey="Total MRR" stackId="a" fill="#F24A4A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}