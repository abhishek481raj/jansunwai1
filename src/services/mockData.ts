const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const sla = (created: string) => new Date(new Date(created).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

export interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  email?: string;
  role: 'citizen' | 'officer' | 'admin';
  departmentId?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  departmentId: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Complaint {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  categoryId: string;
  departmentId: string;
  citizenId: string;
  officerId: string | null;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: Location;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
}

export interface Timeline {
  id: string;
  complaintId: string;
  type: 'status_change' | 'assignment' | 'comment';
  message: string;
  oldStatus: string | null;
  newStatus: string;
  userId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  users: 'jansunwai_db_users',
  complaints: 'jansunwai_db_complaints',
  timelines: 'jansunwai_db_timelines',
  notifications: 'jansunwai_db_notifications',
};

const SEED_USERS: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', phone: '9876543210', password: 'password123', role: 'citizen', createdAt: daysAgo(60) },
  { id: 'u2', name: 'Priya Sharma', phone: '9876543211', password: 'password123', role: 'citizen', createdAt: daysAgo(55) },
  { id: 'u3', name: 'Amit Patel', phone: '9876543212', password: 'password123', role: 'citizen', createdAt: daysAgo(50) },
  { id: 'u4', name: 'Suresh Reddy', phone: '9876543213', password: 'password123', role: 'officer', departmentId: 'dept1', createdAt: daysAgo(90) },
  { id: 'u5', name: 'Kavita Singh', phone: '9876543214', password: 'password123', role: 'officer', departmentId: 'dept2', createdAt: daysAgo(90) },
  { id: 'u6', name: 'Ravi Verma', phone: '9876543215', password: 'password123', role: 'officer', departmentId: 'dept3', createdAt: daysAgo(90) },
  { id: 'u7', name: 'Dr. Anil Gupta', phone: '9876543216', password: 'password123', role: 'admin', createdAt: daysAgo(120) },
];

export const departments: Department[] = [
  { id: 'dept1', name: 'Public Works Department', code: 'PWD', icon: 'Building2', description: 'Roads, bridges, infrastructure' },
  { id: 'dept2', name: 'Water Supply & Sanitation', code: 'WSS', icon: 'Droplets', description: 'Water supply, drainage' },
  { id: 'dept3', name: 'Electricity & Power', code: 'EPD', icon: 'Zap', description: 'Power supply, street lights' },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Road Damage / Potholes', departmentId: 'dept1' },
  { id: 'cat2', name: 'Street Light Malfunction', departmentId: 'dept1' },
  { id: 'cat3', name: 'Water Leakage / No Supply', departmentId: 'dept2' },
  { id: 'cat4', name: 'Drainage / Sewage Block', departmentId: 'dept2' },
  { id: 'cat5', name: 'Power Outage', departmentId: 'dept3' },
  { id: 'cat6', name: 'Transformer Issue', departmentId: 'dept3' },
];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'c1', trackingId: 'GRV-2024-00001',
    title: 'Deep pothole on MG Road near Silk Board junction',
    description: 'A massive pothole has formed on MG Road near Silk Board junction causing accidents. Multiple two-wheelers have fallen. Immediate repair needed.',
    categoryId: 'cat1', departmentId: 'dept1', citizenId: 'u1', officerId: null,
    status: 'pending', priority: 'urgent',
    location: { lat: 12.9174, lng: 77.6228, address: 'MG Road, Silk Board Junction, Bengaluru, Karnataka 560068' },
    createdAt: daysAgo(25), updatedAt: daysAgo(25), slaDeadline: sla(daysAgo(25)),
  },
  {
    id: 'c2', trackingId: 'GRV-2024-00002',
    title: 'Street lights not working for 2 weeks on Nehru Nagar main road',
    description: 'All 8 street lights on Nehru Nagar main road have been non-functional for over two weeks. The area becomes completely dark at night creating safety hazards.',
    categoryId: 'cat2', departmentId: 'dept1', citizenId: 'u2', officerId: null,
    status: 'pending', priority: 'high',
    location: { lat: 21.1702, lng: 72.8311, address: 'Nehru Nagar Main Road, Surat, Gujarat 395001' },
    createdAt: daysAgo(18), updatedAt: daysAgo(18), slaDeadline: sla(daysAgo(18)),
  },
  {
    id: 'c3', trackingId: 'GRV-2024-00003',
    title: 'Water pipeline burst on Gandhi Chowk affecting 50 households',
    description: 'A major water pipeline has burst near Gandhi Chowk. Water is flooding the road and approximately 50 households in the area have had no water supply for 3 days.',
    categoryId: 'cat3', departmentId: 'dept2', citizenId: 'u3', officerId: 'u5',
    status: 'assigned', priority: 'urgent',
    location: { lat: 23.0225, lng: 72.5714, address: 'Gandhi Chowk, Ahmedabad, Gujarat 380001' },
    createdAt: daysAgo(15), updatedAt: daysAgo(13), slaDeadline: sla(daysAgo(15)),
  },
  {
    id: 'c4', trackingId: 'GRV-2024-00004',
    title: 'Sewage overflowing on Patel Colony lane 4',
    description: 'The main sewage drain on Patel Colony lane 4 is completely blocked and overflowing. The stench is unbearable and poses serious health risks to residents.',
    categoryId: 'cat4', departmentId: 'dept2', citizenId: 'u1', officerId: 'u5',
    status: 'assigned', priority: 'high',
    location: { lat: 19.0760, lng: 72.8777, address: 'Patel Colony Lane 4, Bandra West, Mumbai, Maharashtra 400050' },
    createdAt: daysAgo(12), updatedAt: daysAgo(10), slaDeadline: sla(daysAgo(12)),
  },
  {
    id: 'c5', trackingId: 'GRV-2024-00005',
    title: 'Frequent power cuts in Indira Nagar colony',
    description: 'Residents of Indira Nagar colony are facing power cuts 4-5 times daily for the past week. Each outage lasts 2-3 hours.',
    categoryId: 'cat5', departmentId: 'dept3', citizenId: 'u2', officerId: 'u6',
    status: 'in-progress', priority: 'high',
    location: { lat: 12.9784, lng: 77.6408, address: 'Indira Nagar, Bengaluru, Karnataka 560038' },
    createdAt: daysAgo(10), updatedAt: daysAgo(5), slaDeadline: sla(daysAgo(10)),
  },
  {
    id: 'c6', trackingId: 'GRV-2024-00006',
    title: 'Transformer making loud noise and sparking on Shivaji Road',
    description: 'The electrical transformer on Shivaji Road is emitting loud crackling noises and visible sparks. This is extremely dangerous and could cause a fire.',
    categoryId: 'cat6', departmentId: 'dept3', citizenId: 'u3', officerId: 'u6',
    status: 'in-progress', priority: 'urgent',
    location: { lat: 18.5204, lng: 73.8567, address: 'Shivaji Road, Shivajinagar, Pune, Maharashtra 411005' },
    createdAt: daysAgo(8), updatedAt: daysAgo(3), slaDeadline: sla(daysAgo(8)),
  },
  {
    id: 'c7', trackingId: 'GRV-2024-00007',
    title: 'Road repair completed on Rajiv Gandhi Marg',
    description: 'The damaged stretch of road on Rajiv Gandhi Marg has been repaired. New asphalt laid and road markings redone.',
    categoryId: 'cat1', departmentId: 'dept1', citizenId: 'u1', officerId: 'u4',
    status: 'resolved', priority: 'medium',
    location: { lat: 28.6139, lng: 77.2090, address: 'Rajiv Gandhi Marg, Connaught Place, New Delhi 110001' },
    createdAt: daysAgo(30), updatedAt: daysAgo(2), slaDeadline: sla(daysAgo(30)),
  },
  {
    id: 'c8', trackingId: 'GRV-2024-00008',
    title: 'Request for speed breaker on school zone road',
    description: 'Requesting installation of speed breakers near DAV Public School on Model Town Road.',
    categoryId: 'cat1', departmentId: 'dept1', citizenId: 'u2', officerId: null,
    status: 'rejected', priority: 'low',
    location: { lat: 30.7333, lng: 76.7794, address: 'Model Town Road, Chandigarh, Punjab 160009' },
    createdAt: daysAgo(20), updatedAt: daysAgo(16), slaDeadline: sla(daysAgo(20)),
  },
];

const SEED_TIMELINES: Timeline[] = [
  { id: 'tl1', complaintId: 'c1', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u1', createdAt: daysAgo(25) },
  { id: 'tl2', complaintId: 'c2', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u2', createdAt: daysAgo(18) },
  { id: 'tl3', complaintId: 'c3', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u3', createdAt: daysAgo(15) },
  { id: 'tl4', complaintId: 'c3', type: 'assignment', message: 'Complaint assigned to Kavita Singh (WSS Department)', oldStatus: 'pending', newStatus: 'assigned', userId: 'u7', createdAt: daysAgo(13) },
  { id: 'tl5', complaintId: 'c4', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u1', createdAt: daysAgo(12) },
  { id: 'tl6', complaintId: 'c4', type: 'assignment', message: 'Complaint assigned to Kavita Singh (WSS Department)', oldStatus: 'pending', newStatus: 'assigned', userId: 'u7', createdAt: daysAgo(10) },
  { id: 'tl7', complaintId: 'c5', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u2', createdAt: daysAgo(10) },
  { id: 'tl8', complaintId: 'c5', type: 'assignment', message: 'Complaint assigned to Ravi Verma (EPD Department)', oldStatus: 'pending', newStatus: 'assigned', userId: 'u7', createdAt: daysAgo(8) },
  { id: 'tl9', complaintId: 'c5', type: 'status_change', message: 'Officer visited site. Fault identified in distribution line. Repair work initiated.', oldStatus: 'assigned', newStatus: 'in-progress', userId: 'u6', createdAt: daysAgo(5) },
  { id: 'tl10', complaintId: 'c6', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u3', createdAt: daysAgo(8) },
  { id: 'tl11', complaintId: 'c6', type: 'assignment', message: 'Complaint assigned to Ravi Verma (EPD Department) - marked urgent', oldStatus: 'pending', newStatus: 'assigned', userId: 'u7', createdAt: daysAgo(7) },
  { id: 'tl12', complaintId: 'c6', type: 'status_change', message: 'Emergency team deployed. Safety cordon established. Replacement transformer being arranged.', oldStatus: 'assigned', newStatus: 'in-progress', userId: 'u6', createdAt: daysAgo(3) },
  { id: 'tl13', complaintId: 'c7', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u1', createdAt: daysAgo(30) },
  { id: 'tl14', complaintId: 'c7', type: 'assignment', message: 'Complaint assigned to Suresh Reddy (PWD Department)', oldStatus: 'pending', newStatus: 'assigned', userId: 'u7', createdAt: daysAgo(28) },
  { id: 'tl15', complaintId: 'c7', type: 'status_change', message: 'Road inspection completed. Materials procured. Work started.', oldStatus: 'assigned', newStatus: 'in-progress', userId: 'u4', createdAt: daysAgo(20) },
  { id: 'tl16', complaintId: 'c7', type: 'status_change', message: 'Road repair work completed successfully. Quality check passed.', oldStatus: 'in-progress', newStatus: 'resolved', userId: 'u4', createdAt: daysAgo(2) },
  { id: 'tl17', complaintId: 'c8', type: 'status_change', message: 'Complaint filed successfully', oldStatus: null, newStatus: 'pending', userId: 'u2', createdAt: daysAgo(20) },
  { id: 'tl18', complaintId: 'c8', type: 'status_change', message: 'Complaint reviewed. Speed breaker installation requires traffic department approval outside PWD jurisdiction. Complaint rejected.', oldStatus: 'pending', newStatus: 'rejected', userId: 'u7', createdAt: daysAgo(16) },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Complaint Assigned', message: 'Your complaint GRV-2024-00007 has been assigned to an officer', read: false, createdAt: daysAgo(28) },
  { id: 'n2', userId: 'u1', title: 'Complaint Resolved', message: 'Your complaint GRV-2024-00007 has been resolved. Please provide feedback.', read: false, createdAt: daysAgo(2) },
  { id: 'n3', userId: 'u2', title: 'Complaint Status Update', message: 'Your complaint GRV-2024-00005 is now In Progress', read: true, createdAt: daysAgo(5) },
  { id: 'n4', userId: 'u3', title: 'Complaint Assigned', message: 'Your complaint GRV-2024-00003 has been assigned to Kavita Singh', read: false, createdAt: daysAgo(13) },
  { id: 'n5', userId: 'u6', title: 'New Complaint Assigned', message: 'A new urgent complaint GRV-2024-00006 has been assigned to you', read: false, createdAt: daysAgo(7) },
];

function seedIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.complaints)) {
    localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(SEED_COMPLAINTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.timelines)) {
    localStorage.setItem(STORAGE_KEYS.timelines, JSON.stringify(SEED_TIMELINES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.notifications)) {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(SEED_NOTIFICATIONS));
  }
}

seedIfEmpty();

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
}

export function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function getComplaints(): Complaint[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.complaints) || '[]');
}

export function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
}

export function getTimelines(): Timeline[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.timelines) || '[]');
}

export function saveTimelines(timelines: Timeline[]) {
  localStorage.setItem(STORAGE_KEYS.timelines, JSON.stringify(timelines));
}

export function getNotifications(): Notification[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || '[]');
}

export function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
}
