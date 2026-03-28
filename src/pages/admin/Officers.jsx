import React, { useState, useEffect, useCallback } from "react";
import { Users, ClipboardList, CheckCircle, Building2 } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { adminAPI } from "../../services/api";

function getInitials(name) {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Officers() {
  const [officers, setOfficers] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [officerData, complaintsData] = await Promise.all([
        adminAPI.getOfficers(),
        adminAPI.getAllComplaints({ limit: 1000 }),
      ]);
      setOfficers(officerData);
      setAllComplaints(complaintsData.complaints);
      setError(null);
    } catch {
      setError("Failed to load officers data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <p className="text-red-500 text-sm font-medium">{error}</p>
      <button onClick={() => { setLoading(true); fetchData(); }} className="text-sm font-semibold text-[#FF9933] hover:underline">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0C2340]">Department Officers</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all officers and their workload</p>
      </div>

      {officers.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <EmptyState icon={Users} title="No officers found" description="Officers registered in the system will appear here." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {officers.map((officer) => {
            const assigned = allComplaints.filter((c) => c.officerId === officer.id).length;
            const resolved = allComplaints.filter((c) => c.officerId === officer.id && c.status === "resolved").length;
            const inProgress = allComplaints.filter((c) => c.officerId === officer.id && c.status === "in-progress").length;
            const resolveRate = assigned > 0 ? Math.round((resolved / assigned) * 100) : 0;

            return (
              <div
                key={officer.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #FF9933, #E8870D)" }}
                  >
                    {getInitials(officer.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#0C2340] truncate">{officer.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{officer.phone}</p>
                  </div>
                </div>

                {officer.department && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gray-50">
                    <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-600 truncate">{officer.department.name}</span>
                    <span
                      className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(255,153,51,0.1)", color: "#E8870D" }}
                    >
                      {officer.department.code}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-xl bg-blue-50">
                    <ClipboardList size={13} className="text-blue-500 mx-auto mb-1" />
                    <div className="text-base font-extrabold text-blue-700">{assigned}</div>
                    <div className="text-[10px] text-blue-500 font-medium">Assigned</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-orange-50">
                    <ClipboardList size={13} className="text-[#FF9933] mx-auto mb-1" />
                    <div className="text-base font-extrabold text-[#E8870D]">{inProgress}</div>
                    <div className="text-[10px] text-[#FF9933] font-medium">In Progress</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-green-50">
                    <CheckCircle size={13} className="text-green-600 mx-auto mb-1" />
                    <div className="text-base font-extrabold text-green-700">{resolved}</div>
                    <div className="text-[10px] text-green-600 font-medium">Resolved</div>
                  </div>
                </div>

                {assigned > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Resolution rate</span>
                      <span>{resolveRate}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: resolveRate + "%",
                          background: "linear-gradient(to right, #FF9933, #138808)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
