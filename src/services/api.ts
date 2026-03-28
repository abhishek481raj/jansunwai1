import {
  getUsers, saveUsers,
  getComplaints, saveComplaints,
  getTimelines, saveTimelines,
  getNotifications,
  departments, categories,
  type User, type Complaint,
} from './mockData';

const delay = () => new Promise((r) => setTimeout(r, 300));

function makeToken(id: string, role: string): string {
  return btoa(JSON.stringify({ id, role }));
}

function decodeToken(token: string): { id: string; role: string } | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

function safeUser(u: User) {
  const { password: _p, ...rest } = u;
  return {
    ...rest,
    avatar: u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
  };
}

function makeError(message: string, status = 400) {
  const err: Record<string, unknown> = new Error(message);
  (err as Record<string, unknown>).response = { data: { message }, status };
  return err;
}

function nextTrackingId(): string {
  const complaints = getComplaints();
  const num = complaints.length + 1;
  return `GRV-2024-${String(num).padStart(5, '0')}`;
}

function enrichComplaint(c: Complaint) {
  const users = getUsers();
  const timelines = getTimelines();
  const citizen = users.find((u) => u.id === c.citizenId);
  const officer = c.officerId ? users.find((u) => u.id === c.officerId) : null;
  const category = categories.find((cat) => cat.id === c.categoryId);
  const department = departments.find((d) => d.id === c.departmentId);
  const timeline = timelines
    .filter((t) => t.complaintId === c.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return {
    ...c,
    citizen: citizen ? { id: citizen.id, name: citizen.name, phone: citizen.phone } : null,
    officer: officer ? { id: officer.id, name: officer.name, phone: officer.phone } : null,
    category: category || null,
    department: department || null,
    timeline,
  };
}

export const authAPI = {
  async register(data: { name: string; email?: string; phone: string; password: string }) {
    await delay();
    const users = getUsers();
    if (users.find((u) => u.phone === data.phone)) {
      throw makeError('Phone number already registered', 409);
    }
    const newUser: User = {
      id: 'u' + Date.now(),
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      password: data.password,
      role: 'citizen',
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const token = makeToken(newUser.id, newUser.role);
    return { token, user: safeUser(newUser) };
  },

  async login(phone: string, password: string) {
    await delay();
    const users = getUsers();
    const user = users.find((u) => u.phone === phone);
    if (!user) throw makeError('Invalid phone number or password', 401);
    if (user.password !== password) throw makeError('Invalid phone number or password', 401);
    const token = makeToken(user.id, user.role);
    return { token, user: safeUser(user) };
  },

  async getMe(token: string) {
    await delay();
    const payload = decodeToken(token);
    if (!payload) throw makeError('Invalid token', 401);
    const users = getUsers();
    const user = users.find((u) => u.id === payload.id);
    if (!user) throw makeError('User not found', 401);
    return safeUser(user);
  },
};

export const complaintsAPI = {
  async getMyComplaints(userId: string, filters: { status?: string; page?: number; limit?: number } = {}) {
    await delay();
    const { status, page = 1, limit = 10 } = filters;
    let result = getComplaints().filter((c) => c.citizenId === userId);
    if (status) result = result.filter((c) => c.status === status);
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);
    return { complaints: paginated.map(enrichComplaint), total, page, limit };
  },

  async getById(id: string) {
    await delay();
    const complaint = getComplaints().find((c) => c.id === id || c.trackingId === id);
    if (!complaint) throw makeError('Complaint not found', 404);
    return enrichComplaint(complaint);
  },

  async create(data: Partial<Complaint>, userId: string) {
    await delay();
    const now = new Date().toISOString();
    const slaDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const officers: Record<string, string> = {
      'dept1': 'u4',
      'dept2': 'u5',
      'dept3': 'u6',
    };

    const assignedOfficerId = officers[data.departmentId || ''] || null;

    const newComplaint: Complaint = {
      id: 'c' + Date.now(),
      trackingId: nextTrackingId(),
      title: data.title || '',
      description: data.description || '',
      categoryId: data.categoryId || '',
      departmentId: data.departmentId || '',
      citizenId: userId,
      officerId: assignedOfficerId,
      status: 'assigned',
      priority: data.priority || 'medium',
      location: data.location || { lat: 0, lng: 0, address: '' },
      createdAt: now,
      updatedAt: now,
      slaDeadline,
    };
    const complaints = getComplaints();
    saveComplaints([...complaints, newComplaint]);
    const timelines = getTimelines();
    const notifications = getNotifications();

    saveTimelines([...timelines,
      {
        id: 't' + Date.now(),
        complaintId: newComplaint.id,
        type: 'status_change',
        message: 'Complaint submitted successfully by citizen',
        oldStatus: null,
        newStatus: 'pending',
        userId,
        createdAt: now,
      },
      {
        id: 't' + (Date.now() + 1),
        complaintId: newComplaint.id,
        type: 'assignment',
        message: 'Automatically assigned to department officer based on complaint category',
        oldStatus: 'pending',
        newStatus: 'assigned',
        userId: 'u7',
        createdAt: new Date(Date.now() + 1000).toISOString(),
      }
    ]);

    if (assignedOfficerId) {
      notifications.push({
        id: 'n' + Date.now(),
        userId: assignedOfficerId,
        title: 'New Complaint Assigned',
        message: 'You have been assigned complaint ' + newComplaint.trackingId,
        read: false,
        createdAt: now,
      });
      localStorage.setItem('jansunwai_db_notifications', JSON.stringify(notifications));
    }

    return enrichComplaint(newComplaint);
  },

  async addComment(complaintId: string, message: string, userId: string) {
    await delay();
    const complaints = getComplaints();
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) throw makeError('Complaint not found', 404);
    const now = new Date().toISOString();
    const timelines = getTimelines();
    saveTimelines([...timelines, {
      id: 'tl' + Date.now(),
      complaintId,
      type: 'comment',
      message,
      oldStatus: complaint.status,
      newStatus: complaint.status,
      userId,
      createdAt: now,
    }]);
    return enrichComplaint(complaint);
  },
};

export const officerAPI = {
  async getDashboard(officerId: string) {
    await delay();
    const assigned = getComplaints().filter((c) => c.officerId === officerId);
    return {
      total: assigned.length,
      pending: assigned.filter((c) => c.status === 'pending').length,
      assigned: assigned.filter((c) => c.status === 'assigned').length,
      inProgress: assigned.filter((c) => c.status === 'in-progress').length,
      resolved: assigned.filter((c) => c.status === 'resolved').length,
    };
  },

  async getAssigned(officerId: string, filters: { status?: string; page?: number; limit?: number } = {}) {
    await delay();
    const { status, page = 1, limit = 10 } = filters;
    let result = getComplaints().filter((c) => c.officerId === officerId);
    if (status) result = result.filter((c) => c.status === status);
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);
    return { complaints: paginated.map(enrichComplaint), total, page, limit };
  },

  async updateStatus(complaintId: string, status: string, message: string, officerId: string) {
    await delay();
    const complaints = getComplaints();
    const idx = complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) throw makeError('Complaint not found', 404);
    if (complaints[idx].officerId !== officerId) throw makeError('Access denied', 403);
    const validStatuses = ['assigned', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) throw makeError('Invalid status', 400);
    const oldStatus = complaints[idx].status;
    const now = new Date().toISOString();
    complaints[idx] = { ...complaints[idx], status: status as Complaint['status'], updatedAt: now };
    saveComplaints(complaints);
    const timelines = getTimelines();
    saveTimelines([...timelines, {
      id: 'tl' + Date.now(),
      complaintId,
      type: 'status_change',
      message: message || `Status updated to ${status}`,
      oldStatus,
      newStatus: status,
      userId: officerId,
      createdAt: now,
    }]);
    return enrichComplaint(complaints[idx]);
  },
};

export const adminAPI = {
  async getDashboard() {
    await delay();
    const complaints = getComplaints();
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
    const assigned = complaints.filter((c) => c.status === 'assigned').length;
    const rejected = complaints.filter((c) => c.status === 'rejected').length;

    const resolvedComplaints = complaints.filter((c) => c.status === 'resolved' && c.updatedAt && c.createdAt);
    const avgDays = resolvedComplaints.length > 0
      ? resolvedComplaints.reduce((sum, c) => {
          const diff = (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return sum + diff;
        }, 0) / resolvedComplaints.length
      : 0;

    const departmentStats = departments.map((dept) => {
      const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
      return {
        departmentId: dept.id, name: dept.name, code: dept.code,
        total: deptComplaints.length,
        pending: deptComplaints.filter((c) => c.status === 'pending').length,
        inProgress: deptComplaints.filter((c) => c.status === 'in-progress').length,
        resolved: deptComplaints.filter((c) => c.status === 'resolved').length,
      };
    });

    const now = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.toLocaleString('default', { month: 'short' });
      const monthComplaints = complaints.filter((c) => {
        const cd = new Date(c.createdAt);
        return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
      });
      return { month, filed: monthComplaints.length, resolved: monthComplaints.filter((c) => c.status === 'resolved').length };
    });

    return { total, resolved, pending, inProgress, assigned, rejected, avgDays: Number(avgDays.toFixed(1)), departmentStats, monthlyData };
  },

  async getAllComplaints(filters: { status?: string; departmentId?: string; priority?: string; search?: string; page?: number; limit?: number } = {}) {
    await delay();
    const { status, departmentId, priority, search, page = 1, limit = 10 } = filters;
    let result = getComplaints();
    if (status) result = result.filter((c) => c.status === status);
    if (departmentId) result = result.filter((c) => c.departmentId === departmentId);
    if (priority) result = result.filter((c) => c.priority === priority);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q) || c.trackingId.toLowerCase().includes(q));
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);
    return { complaints: paginated.map(enrichComplaint), total, page, limit };
  },

  async assignOfficer(complaintId: string, officerId: string, adminId: string) {
    await delay();
    const complaints = getComplaints();
    const idx = complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) throw makeError('Complaint not found', 404);
    const officer = getUsers().find((u) => u.id === officerId && u.role === 'officer');
    if (!officer) throw makeError('Invalid officer', 400);
    const oldStatus = complaints[idx].status;
    const now = new Date().toISOString();
    complaints[idx] = { ...complaints[idx], officerId, status: 'assigned', updatedAt: now };
    saveComplaints(complaints);
    const timelines = getTimelines();
    saveTimelines([...timelines, {
      id: 'tl' + Date.now(),
      complaintId,
      type: 'assignment',
      message: `Complaint assigned to ${officer.name}`,
      oldStatus,
      newStatus: 'assigned',
      userId: adminId,
      createdAt: now,
    }]);
    return enrichComplaint(complaints[idx]);
  },

  async getOfficers() {
    await delay();
    return getUsers()
      .filter((u) => u.role === 'officer')
      .map((u) => ({
        ...safeUser(u),
        department: departments.find((d) => d.id === u.departmentId) || null,
      }));
  },
};

export const publicAPI = {
  async track(trackingId: string) {
    await delay();
    const complaint = getComplaints().find((c) => c.trackingId === trackingId);
    if (!complaint) throw makeError('Complaint not found', 404);
    return enrichComplaint(complaint);
  },

  async getStats() {
    await delay();
    const complaints = getComplaints();
    return {
      total: complaints.length,
      resolved: complaints.filter((c) => c.status === 'resolved').length,
      pending: complaints.filter((c) => c.status === 'pending').length,
      inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    };
  },

  async getDepartments() {
    await delay();
    return departments;
  },

  async getCategories(departmentId?: string) {
    await delay();
    return departmentId ? categories.filter((c) => c.departmentId === departmentId) : categories;
  },
};

export const notificationsAPI = {
  async getMyNotifications(userId: string) {
    await delay();
    return getNotifications()
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
};

export default {
  auth: authAPI,
  complaints: complaintsAPI,
  officer: officerAPI,
  admin: adminAPI,
  public: publicAPI,
  notifications: notificationsAPI,
};
