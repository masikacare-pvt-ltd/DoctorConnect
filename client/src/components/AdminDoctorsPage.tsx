import { useState, useEffect, useCallback } from 'react';
import { Users, Search, X, Check, Ban, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { adminGet, adminPatch, adminDelete } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import ConfirmDialog from './ConfirmDialog';

interface DoctorProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  avatarData: string;
  designation: string;
  specialization: string;
  hospital: string;
  mobile: string;
  countryCode: string;
  countryIso: string;
  bio: string;
}

interface DoctorItem {
  id: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: string;
  createdAt: string;
  profile: DoctorProfile | null;
}

const PAGE_SIZE = 15;

export default function AdminDoctorsPage() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<DoctorItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DoctorItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await adminGet(`/doctors?${params}`);
      setDoctors(res.data);
      setTotal(res.total);
    } catch (e: any) {
      toast(e?.message || 'Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleApprove = async (id: string) => {
    try {
      await adminPatch(`/doctors/${id}/approve`);
      toast('Doctor approved', 'info');
      fetchDoctors();
    } catch (e: any) {
      toast(e?.message || 'Failed to approve', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminPatch(`/doctors/${id}/reject`);
      toast('Doctor rejected', 'info');
      fetchDoctors();
      setSelected(null);
    } catch (e: any) {
      toast(e?.message || 'Failed to reject', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDelete(`/users/${deleteTarget.id}`);
      toast('Doctor deleted', 'success');
      setDoctors(prev => prev.filter(d => d.id !== deleteTarget.id));
      setTotal(prev => prev - 1);
      setSelected(null);
    } catch (e: any) {
      toast(e.message || 'Failed to delete doctor', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><Users className="w-3.5 h-3.5 text-indigo-600" /></div>
          <h1 className="text-sm font-bold text-slate-900">Doctors</h1>
          <span className="text-[10px] text-slate-400 font-medium ml-auto">{total} total</span>
        </header>

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-bold text-slate-900">Doctor Management</h2>
              <div className="flex gap-1.5 flex-wrap">
                {['', 'pending', 'approved', 'rejected'].map((s) => (
                  <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{s || 'All'}</button>
                ))}
              </div>
            </div>
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                    <th className="text-right px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>{Array.from({ length: 5 }).map((__, j) => (<td key={j} className="px-4 py-3"><div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" /></td>))}</tr>
                    ))
                  ) : doctors.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs font-medium">No doctors found</td></tr>
                  ) : (
                    doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 overflow-hidden">
                              {doc.profile?.avatarData ? <img src={doc.profile.avatarData} alt="" className="w-full h-full object-cover" /> : doc.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="font-semibold text-slate-900">{doc.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{doc.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${doc.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : doc.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{doc.approvalStatus}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[10px] hidden lg:table-cell">{new Date(doc.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => setSelected(doc)} className="px-2 py-1 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">View</button>
                            <button onClick={() => setDeleteTarget(doc)} className="px-2 py-1 rounded-md text-[9px] font-bold bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"><Trash2 className="w-2.5 h-2.5" /> Delete</button>
                            {doc.approvalStatus === 'pending' && (
                              <>
                                <button onClick={() => handleApprove(doc.id)} className="px-2 py-1 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Approve</button>
                                <button onClick={() => handleReject(doc.id)} className="px-2 py-1 rounded-md text-[9px] font-bold bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"><Ban className="w-2.5 h-2.5" /> Reject</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 font-medium">Page {page} of {totalPages}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let start = Math.max(1, page - 2);
                    if (start + 4 > totalPages) start = totalPages - 4;
                    const p = start + i;
                    if (p < 1 || p > totalPages) return null;
                    return <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-md text-[10px] font-bold ${p === page ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p}</button>;
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900">Doctor Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 overflow-hidden">
                  {selected.profile?.avatarData ? <img src={selected.profile.avatarData} alt="" className="w-full h-full object-cover" /> : selected.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div><p className="text-sm font-bold text-slate-900">{selected.name}</p><p className="text-[10px] text-slate-500">{selected.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {selected.profile?.firstName && <><div><span className="text-slate-400 font-medium">First Name</span><p className="font-semibold text-slate-800">{selected.profile.firstName}</p></div><div><span className="text-slate-400 font-medium">Last Name</span><p className="font-semibold text-slate-800">{selected.profile.lastName}</p></div></>}
                {selected.profile?.designation && <div className="col-span-2"><span className="text-slate-400 font-medium">Designation</span><p className="font-semibold text-slate-800">{selected.profile.designation}</p></div>}
                {selected.profile?.specialization && <div className="col-span-2"><span className="text-slate-400 font-medium">Specialization</span><p className="font-semibold text-slate-800">{selected.profile.specialization}</p></div>}
                {selected.profile?.hospital && <div className="col-span-2"><span className="text-slate-400 font-medium">Hospital</span><p className="font-semibold text-slate-800">{selected.profile.hospital}</p></div>}
                {selected.profile?.mobile && <div className="col-span-2"><span className="text-slate-400 font-medium">Mobile</span><p className="font-semibold text-slate-800">{selected.profile.countryCode || ''} {selected.profile.mobile}</p></div>}
                {selected.profile?.bio && <div className="col-span-2"><span className="text-slate-400 font-medium">Bio</span><p className="font-semibold text-slate-800 text-[10px] leading-relaxed">{selected.profile.bio}</p></div>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${selected.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : selected.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{selected.approvalStatus}</span>
                <span className="text-[10px] text-slate-400">Joined {new Date(selected.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 pt-2">
                {selected.approvalStatus === 'pending' && (
                  <>
                    <button onClick={() => { handleApprove(selected.id); setSelected(null); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"><Check className="w-3.5 h-3.5" /> Approve</button>
                    <button onClick={() => { handleReject(selected.id); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold"><Ban className="w-3.5 h-3.5" /> Reject</button>
                  </>
                )}
                <button onClick={() => { setDeleteTarget(selected); }} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-[11px] font-bold border border-red-200"><Trash2 className="w-3.5 h-3.5" /> Delete User</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete Doctor" message={`Are you sure you want to delete "${deleteTarget?.name || ''}"? This will permanently remove the user and all associated data.`} loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminLayout>
  );
}
