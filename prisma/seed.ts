import { prisma } from '../lib/prisma';
import { $Enums } from '@prisma/client';

const donors = [
  { name: 'Alice Smith', bloodGroup: 'O_POSITIVE', location: 'Scarborough', phone: '416-555-1234' },
  { name: 'Bob Johnson', bloodGroup: 'A_NEGATIVE', location: 'Toronto', phone: '(647) 555-2345' },
  { name: 'Carol Lee', bloodGroup: 'B_POSITIVE', location: 'North York', phone: '905.555.3456' },
  { name: 'David Kim', bloodGroup: 'AB_NEGATIVE', location: 'Mississauga', phone: '416 555 4567' },
  { name: 'Eva Brown', bloodGroup: 'O_NEGATIVE', location: 'Brampton', phone: '6475555678' },
  { name: 'Frank Green', bloodGroup: 'A_POSITIVE', location: 'Scarborough', phone: '416-555-6789' },
  { name: 'Grace White', bloodGroup: 'B_NEGATIVE', location: 'Toronto', phone: '9055557890' },
  { name: 'Henry Black', bloodGroup: 'AB_POSITIVE', location: 'North York', phone: '4165558901' },
  { name: 'Ivy Young', bloodGroup: 'O_POSITIVE', location: 'Mississauga', phone: '647-555-9012' },
  { name: 'Jack King', bloodGroup: 'A_NEGATIVE', location: 'Brampton', phone: '905 555 0123' },
  { name: 'Kara Fox', bloodGroup: 'B_POSITIVE', location: 'Scarborough', phone: '4165551235' },
  { name: 'Leo Wolf', bloodGroup: 'AB_NEGATIVE', location: 'Toronto', phone: '6475552346' },
  { name: 'Mona Swan', bloodGroup: 'O_NEGATIVE', location: 'North York', phone: '9055553457' },
  { name: 'Nina Hart', bloodGroup: 'A_POSITIVE', location: 'Mississauga', phone: '4165554568' },
  { name: 'Omar Ray', bloodGroup: 'B_NEGATIVE', location: 'Brampton', phone: '6475555679' },
  { name: 'Paul Moss', bloodGroup: 'AB_POSITIVE', location: 'Scarborough', phone: '4165556780' },
  { name: 'Quinn Dale', bloodGroup: 'O_POSITIVE', location: 'Toronto', phone: '9055557891' },
  { name: 'Rita Lane', bloodGroup: 'A_NEGATIVE', location: 'North York', phone: '4165558902' },
  { name: 'Sam Pike', bloodGroup: 'B_POSITIVE', location: 'Mississauga', phone: '6475559013' },
  { name: 'Tina Cole', bloodGroup: 'AB_NEGATIVE', location: 'Brampton', phone: '9055550124' },
];

async function main() {
  for (const donor of donors) {
    const normalizedLocation = donor.location.trim().toLowerCase();
    const normalizedPhone = donor.phone.replace(/\D/g, '');
    await prisma.donor.upsert({
      where: {
        name_bloodGroup_location: {
          name: donor.name,
          bloodGroup: donor.bloodGroup as $Enums.BloodGroup,
          location: normalizedLocation,
        },
      },
      update: {
        phone: normalizedPhone,
      },
      create: {
        name: donor.name,
        bloodGroup: donor.bloodGroup as $Enums.BloodGroup,
        location: normalizedLocation,
        phone: normalizedPhone,
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seeding complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
