import React, { useState } from 'react';
import { OrgHierarchyItem, FilterState } from '../types/dashboard.ts';
import { Network, Building2, Layers, FolderKanban, Briefcase, ArrowRight, Search } from 'lucide-react';

interface HierarchyViewProps {
  organizations: OrgHierarchyItem[];
  onSelectProject: (org: OrgHierarchyItem) => void;
  onSelectGroup: (groupName: string) => void;
}

export const HierarchyView: React.FC<HierarchyViewProps> = ({
  organizations,
  onSelectProject,
  onSelectGroup,
}) => {
  const [search, setSearch] = useState('');

  const filtered = organizations.filter(
    (o) =>
      o.groupName.toLowerCase().includes(search.toLowerCase()) ||
      o.unitName.toLowerCase().includes(search.toLowerCase()) ||
      o.opgName.toLowerCase().includes(search.toLowerCase()) ||
      o.projectName.toLowerCase().includes(search.toLowerCase()) ||
      o.reportingGroup.toLowerCase().includes(search.toLowerCase())
  );

  // Group by groupName
  const grouped = filtered.reduce((acc, curr) => {
    if (!acc[curr.groupName]) {
      acc[curr.groupName] = [];
    }
    acc[curr.groupName].push(curr);
    return acc;
  }, {} as Record<string, OrgHierarchyItem[]>);

  return (
    <div className="space-y-5">
      {/* Header & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Organization Hierarchy & Project Explorer</h2>
            <p className="text-xs text-slate-500">
              Explore Reporting Groups, Business Units, OPGs, and assigned Enterprise Projects
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hierarchy or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition-all"
          />
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="space-y-4">
        {(Object.entries(grouped) as [string, OrgHierarchyItem[]][]).map(([groupName, orgList]) => (
          <div key={groupName} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{groupName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                  {orgList.length} Projects
                </span>
              </div>

              <button
                onClick={() => onSelectGroup(groupName)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <span>Filter Dashboard to Group</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Sub-projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {orgList.map((org) => (
                <div
                  key={org.id}
                  onClick={() => onSelectProject(org)}
                  className="cursor-pointer bg-slate-50/70 hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-lg p-3 transition-all group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      <Briefcase size={14} className="text-indigo-600 shrink-0" />
                      <span className="truncate">{org.projectName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">#{org.id}</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Layers size={11} className="text-emerald-600 shrink-0" />
                      <span className="truncate">{org.unitName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FolderKanban size={11} className="text-amber-600 shrink-0" />
                      <span className="truncate">{org.opgName}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-blue-600 font-semibold">
                    <span>View Financials</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
