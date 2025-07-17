import { db } from "../lib/db";

export const resetDb = async () => {
  console.log("Resetting database...");
  await db.formSubmission.deleteMany();
  await db.formField.deleteMany();
  await db.formSection.deleteMany();
  await db.section.deleteMany();
  await db.auditLog.deleteMany();
  await db.user.deleteMany();
  await db.college.deleteMany();
  console.log("Database reset complete");
};

export const resetSomeFields = async (name: string) => {
  console.log("Resetting some fields...");
  switch (name) {
    case "formSubmission":
      await db.formSubmission.deleteMany();
      break;
    case "formField":
      await db.formField.deleteMany();
      break;
    case "formSection":
      await db.formSection.deleteMany();
      break;
    case "section":
      await db.section.deleteMany();
      break;
    case "logs":
      await db.auditLog.deleteMany();
      break;
    case "user":
      await db.user.deleteMany();
      break;
    case "college":
      await db.college.deleteMany();
      break;
    default:
      console.log("Invalid name");
      break;
  }

  console.log("Some fields reset complete");
};

// Main execution function
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments provided, reset all
    await resetDb();
  } else if (args.length === 1) {
    // One argument provided, reset specific field
    await resetSomeFields(args[0]);
  } else {
    console.log("Usage:");
    console.log("  npm run reset-db          - Reset all database tables");
    console.log("  npm run reset-db user     - Reset only users table");
    console.log("  npm run reset-db college  - Reset only college table");
    console.log("  npm run reset-db section  - Reset only section table");
    console.log(
      "  npm run reset-db formSubmission - Reset only formSubmission table"
    );
    console.log("  npm run reset-db formField - Reset only formField table");
    console.log(
      "  npm run reset-db formSection - Reset only formSection table"
    );
    console.log("  npm run reset-db logs - Reset only logs table");
  }
};

// Run the main function if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
