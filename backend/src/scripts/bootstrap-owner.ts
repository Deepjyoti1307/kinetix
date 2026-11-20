import { prisma } from '../db/prisma.js';
import { hashPin } from '../utils/security.js';

async function bootstrapOwner() {
  const email = process.env.OWNER_EMAIL || 'owner@kinetix.local';
  const name = process.env.OWNER_NAME || 'Alex';
  const initialPin = process.env.OWNER_INITIAL_PIN || '123456';

  console.log(`\n👑 [Kinetix Bootstrap] Provisioning owner account: ${email}...`);

  // Hash initial PIN with Argon2id
  const { hash, salt } = await hashPin(initialPin);

  // Upsert single owner
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      role: 'OWNER',
      pinCredential: {
        create: {
          pinHash: hash,
          salt,
        },
      },
      profile: {
        create: {
          calorieTarget: 2450,
          proteinTarget: 170,
          carbsTarget: 240,
          fatTarget: 65,
          targetWeightKg: 74.0,
          unitSystem: 'METRIC',
        },
      },
      preferences: {
        create: {
          theme: 'dark',
          hapticFeedback: true,
          soundEffects: true,
        },
      },
    },
    update: {
      name,
      pinCredential: {
        upsert: {
          create: { pinHash: hash, salt },
          update: { pinHash: hash, salt, failedAttempts: 0, lockedUntil: null },
        },
      },
    },
    include: {
      pinCredential: true,
      profile: true,
    },
  });

  console.log('✅ Owner account provisioned successfully!');
  console.log(`   User ID: ${user.id}`);
  console.log(`   Email:   ${user.email}`);
  console.log(`   Name:    ${user.name}`);
  console.log(`   Initial PIN: ${initialPin}`);
  console.log('   (You can change this PIN anytime in Settings or re-provision)\n');

  await prisma.$disconnect();
}

bootstrapOwner().catch(async (e) => {
  console.error('❌ Failed to bootstrap owner:', e);
  await prisma.$disconnect();
  process.exit(1);
});
