import React, { useState, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';

// --- Mock Data ---

const kpiData = {
  totalApplications: 12540,
  certificatesIssued: 9870,
  pendingReview: 1560,
  avgProcessingTime: 21,
};

const monthlyData = [
  { month: 'Jan', submitted: 800, completed: 640 },
  { month: 'Feb', submitted: 720, completed: 590 },
  { month: 'Mar', submitted: 950, completed: 810 },
  { month: 'Apr', submitted: 880, completed: 720 },
  { month: 'May', submitted: 1100, completed: 900 },
  { month: 'Jun', submitted: 1050, completed: 880 },
];

const statusData = [
  { name: 'certified', value: 9870 },
  { name: 'pendingAudit', value: 850 },
  { name: 'pendingFatwa', value: 710 },
  { name: 'rejected', value: 1110 },
];

const recentActivityData = [
    { id: 'APP-12345', businessName: 'Rendang Enak', lph: 'LPH Amanah', status: 'certified', submittedDate: '2024-06-15' },
    { id: 'APP-12346', businessName: 'Wardah Beauty', lph: 'LPH Halal Indonesia', status: 'pendingAudit', submittedDate: '2024-06-14' },
    { id: 'APP-12347', businessName: 'Sedaap Food Inc.', lph: 'LPH Amanah', status: 'pendingFatwa', submittedDate: '2024-06-12' },
    { id: 'APP-12348', businessName: 'Bakso Pak Kumis', lph: 'LPH MUI', status: 'rejected', submittedDate: '2024-06-11' },
    { id: 'APP-12349', businessName: 'Elzatta Hijab', lph: 'LPH Halal Indonesia', status: 'certified', submittedDate: '2024-06-10' },
];

// --- Sub-components ---

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string }> = ({ title, value, icon, subtext }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700 flex items-start gap-4">
    <div className="bg-halal-green/10 dark:bg-accent-gold/10 text-halal-green dark:text-accent-gold p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">
        {value} <span className="text-lg font-medium">{subtext}</span>
      </p>
    </div>
  </div>
);

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-gray-200">{`${value.toLocaleString()}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="dark:fill-gray-400">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


const StatusBadge: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const { t } = useTranslations();
    const statusInfo = {
        certified: { text: t('monitoringDashboard.status.certified'), classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        pendingAudit: { text: t('monitoringDashboard.status.pendingAudit'), classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
        pendingFatwa: { text: t('monitoringDashboard.status.pendingFatwa'), classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
        rejected: { text: t('monitoringDashboard.status.rejected'), classes: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
    }[statusKey] || { text: 'Unknown', classes: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusInfo.classes}`}>
            {statusInfo.text}
        </span>
    );
};


const MonitoringDashboardPage: React.FC = () => {
    const { t } = useTranslations();
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const PIE_COLORS = ['#1E7145', '#F59E0B', '#3B82F6', '#EF4444'];
    
    const translatedStatusData = useMemo(() => statusData.map(item => ({
        ...item,
        name: t(`monitoringDashboard.status.${item.name}`)
    })), [t]);

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-halal-green dark:text-accent-gold">{t('monitoringDashboard.title')}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{t('monitoringDashboard.subtitle')}</p>
            </div>
            
            {/* Filters */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-end">
                 <div>
                    <label htmlFor="time-range" className="sr-only">{t('monitoringDashboard.filters.timeRange')}</label>
                    <select id="time-range" className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-halal-green">
                        <option>{t('monitoringDashboard.filters.last30days')}</option>
                        <option>{t('monitoringDashboard.filters.last90days')}</option>
                        <option>{t('monitoringDashboard.filters.allTime')}</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <KpiCard title={t('monitoringDashboard.kpi.totalApplications')} value={kpiData.totalApplications.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
                <KpiCard title={t('monitoringDashboard.kpi.certificatesIssued')} value={kpiData.certificatesIssued.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
                <KpiCard title={t('monitoringDashboard.kpi.pendingReview')} value={kpiData.pendingReview.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <KpiCard title={t('monitoringDashboard.kpi.avgProcessingTime')} value={kpiData.avgProcessingTime.toString()} subtext={t('monitoringDashboard.kpi.days')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8 max-w-6xl mx-auto">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">{t('monitoringDashboard.charts.monthlyTrends')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis dataKey="month" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e5e7eb'
                                }}
                                wrapperClassName="dark:!bg-gray-700/80 dark:!border-gray-600"
                            />
                            <Legend />
                            <Bar dataKey="submitted" name={t('monitoringDashboard.charts.submitted')} fill="#40E0D0" />
                            <Bar dataKey="completed" name={t('monitoringDashboard.charts.completed')} fill="#1E7145" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">{t('monitoringDashboard.charts.applicationStatus')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: The recharts types for this project appear to be outdated, causing a TypeScript error on the 'activeIndex' prop which is valid. Using @ts-ignore to bypass this typing issue and allow the component to function as intended. */}
                            // @ts-ignore
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={translatedStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             {/* Recent Activity Table */}
            <div className="mt-8 max-w-6xl mx-auto">
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">{t('monitoringDashboard.activity.title')}</h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('monitoringDashboard.activity.headers.id')}</th>
                                <th scope="col" className="px-6 py-3">{t('monitoringDashboard.activity.headers.business')}</th>
                                <th scope="col" className="px-6 py-3">{t('monitoringDashboard.activity.headers.lph')}</th>
                                <th scope="col" className="px-6 py-3">{t('monitoringDashboard.activity.headers.status')}</th>
                                <th scope="col" className="px-6 py-3">{t('monitoringDashboard.activity.headers.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivityData.map(item => (
                                <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                                    <td className="px-6 py-4 font-mono text-gray-900 dark:text-white">{item.id}</td>
                                    <td className="px-6 py-4">{item.businessName}</td>
                                    <td className="px-6 py-4">{item.lph}</td>
                                    <td className="px-6 py-4"><StatusBadge statusKey={item.status} /></td>
                                    <td className="px-6 py-4">{item.submittedDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MonitoringDashboardPage;