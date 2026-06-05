import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CLIENTS = [
  'FISHBITE',
  'JOSEPH NADER',
  'ABU HATEM',
  'SIT N DIP',
  'BACHIR',
  'JANATY',
];

const USERS = [
  { email: 'admin@rgmedia.local', name: 'RG Admin', role: UserRole.SUPER_ADMIN, password: 'ChangeMe123!' },
  { email: 'manager@rgmedia.local', name: 'Manager', role: UserRole.ADMIN, password: 'ChangeMe123!' },
  { email: 'leader@rgmedia.local', name: 'Team Leader', role: UserRole.TEAM_LEADER, password: 'ChangeMe123!' },
  { email: 'employee@rgmedia.local', name: 'Employee', role: UserRole.EMPLOYEE, password: 'ChangeMe123!' },
  { email: 'client@fishbite.local', name: 'Fishbite Client', role: UserRole.CLIENT_PORTAL, password: 'ChangeMe123!' },
];

const SAMPLE_ROWS = [
  {
    code: 'RG-000001',
    client: 'FISHBITE',
    title: 'POV: Not Your Food',
    description: 'A short 1st person comedic video of Jenny approaching the cameraman.',
    script: 'Caption: pov: فكرت طلبي خلص بس طلع لحدا تاني',
    filmingDate: '2025-05-14',
    publishingDate: '2025-05-16',
    publishTime: '04:00',
    shot: true,
    posted: true,
    reference: 'https://www.instagram.com/reel/DH5ZQvwqZ1p/',
  },
  {
    code: 'RG-000002',
    client: 'JOSEPH NADER',
    title: 'فيديو تعريفي',
    description: 'ريل قصير يعرّف الناس على مدرسة جوزيف لتعليم السواقة.',
    script: "Joseph Nader's Driving School - Scripts",
    filmingDate: '2025-05-15',
    publishingDate: '2025-05-22',
    publishTime: '02:00',
    shot: true,
    posted: true,
    reference: null,
  },
  {
    code: 'RG-000003',
    client: 'JOSEPH NADER',
    title: 'كيف تحصل على رخصة السواقة',
    description: 'ريل قصير بيشرح الخطوات للحصول على رخصة السواقة.',
    script: "Joseph Nader's Driving School - Scripts",
    filmingDate: '2025-05-15',
    shootStartTime: '16:00',
    publishingDate: '2025-05-22',
    shot: true,
    posted: true,
    reference: 'https://www.instagram.com/reel/DSIMfSakhuB/',
  },
  {
    code: 'RG-000004',
    client: 'BACHIR',
    title: 'Cinematic Cigar',
    description: 'Alexei cuts his hair at Bachir\'s Salon.',
    filmingDate: '2025-05-15',
    shootStartTime: '19:00',
    publishingDate: '2025-05-17',
    shot: true,
    posted: true,
    reference: null,
  },
  {
    code: 'RG-000005',
    client: 'SIT N DIP',
    title: 'Pancake Drizzle',
    description: 'Drizzling chocolate over SitnDip.',
    filmingDate: '2025-05-16',
    shootStartTime: '04:00',
    publishingDate: '2025-05-16',
    shot: true,
    posted: true,
    reference: 'https://www.instagram.com/reel/DMgWkM4MTn-/',
  },
  {
    code: 'RG-000006',
    client: 'ABU HATEM',
    title: 'Knife Fight',
    description: 'Comedic fight culminating in cutting a fajita sandwich.',
    filmingDate: '2025-05-18',
    shootStartTime: '05:30',
    publishingDate: '2025-05-19',
    shot: true,
    posted: true,
    reference: null,
  },
  {
    code: 'RG-000007',
    client: 'JOSEPH NADER',
    title: 'مانيوال أو أوتوماتيك بلبنان؟',
    description: 'ريل توعوي عن الفرق بين المانيوال والأوتوماتيك.',
    filmingDate: '2025-05-22',
    publishingDate: '2025-05-29',
    shot: true,
    posted: false,
    reference: null,
  },
  {
    code: 'RG-000008',
    client: 'FISHBITE',
    title: 'M3allem! M3allem!',
    description: 'Ronnie finds 10$ and orders at Fishbite.',
    filmingDate: '2025-05-26',
    publishingDate: '2025-05-28',
    shot: true,
    posted: true,
    reference: 'https://www.instagram.com/reel/DYsGKY9NiUU/',
  },
];

async function main() {
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hash, name: u.name, role: u.role },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: hash,
        locale: u.email.includes('client') ? 'ar' : 'en',
      },
    });
  }

  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: 'admin@rgmedia.local' },
  });

  const clientMap = new Map<string, string>();
  for (const name of CLIENTS) {
    let client = await prisma.client.findFirst({ where: { name } });
    if (!client) client = await prisma.client.create({ data: { name, isActive: true } });
    clientMap.set(name, client.id);
  }

  for (const row of SAMPLE_ROWS) {
    const clientId = clientMap.get(row.client)!;
    const workflowStatus = row.posted ? 'PUBLISHED' : row.shot ? 'SHOT' : 'PLANNED';
    const publishingStatus = row.posted ? 'PUBLISHED' : 'PENDING';

    await prisma.contentItem.upsert({
      where: { contentCode: row.code },
      update: {},
      create: {
        contentCode: row.code,
        clientId,
        title: row.title,
        description: row.description,
        script: row.script ?? null,
        platform: 'INSTAGRAM',
        contentType: 'REEL',
        workflowStatus,
        publishingStatus,
        filmingDate: new Date(row.filmingDate),
        shootStartTime: row.shootStartTime ?? null,
        publishingDate: row.publishingDate ? new Date(row.publishingDate) : null,
        publishTime: row.publishTime ?? null,
        assignedToId: admin.id,
        references: row.reference
          ? { create: [{ url: row.reference, label: 'Reference' }] }
          : undefined,
      },
    });
  }

  const fishbiteId = clientMap.get('FISHBITE')!;
  await prisma.shootingSession.createMany({
    data: [
      {
        clientId: fishbiteId,
        date: new Date('2025-05-14'),
        startTime: '14:00',
        location: 'Fishbite Restaurant',
        status: 'COMPLETED',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete.');
  console.log('Login: admin@rgmedia.local / ChangeMe123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
