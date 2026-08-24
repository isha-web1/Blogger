import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    console.log("***** Admin Seeding Started....");

    // Get admin data from .env
    const adminData = JSON.parse(process.env.ADMIN_DATA || "{}");

    const email = adminData.email.toLowerCase();

    console.log("ADMIN_DATA:", adminData);
    console.log("***** Checking Admin Exist or not");

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // ==========================================
    // ADMIN ALREADY EXISTS
    // ==========================================

    if (existingUser) {
      console.log("***** Admin already exists");

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          role: "ADMIN",
          emailVerified: true,
          status: "active",
        },
      });

      console.log("***** Existing admin updated");
      console.log("***** Role: ADMIN");
      console.log("***** Email verified: true");
      console.log("******* SUCCESS ******");

      return;
    }

    // ==========================================
    // ADMIN DOES NOT EXIST
    // ==========================================

    console.log("***** Admin does not exist");
    console.log("***** Creating admin through Better Auth");

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify({
          ...adminData,
          email,
        }),
      }
    );

    const responseText = await signUpAdmin.text();

    console.log("Better Auth status:", signUpAdmin.status);

    if (!signUpAdmin.ok) {
      throw new Error(
        `Admin signup failed: ${signUpAdmin.status} - ${responseText}`
      );
    }

    console.log("Better Auth response:", responseText);
    console.log("***** Admin created");

    // ==========================================
    // FIND CREATED ADMIN
    // ==========================================

    const createdAdmin = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!createdAdmin) {
      throw new Error(
        "Better Auth signup succeeded, but admin was not found in database."
      );
    }

    // ==========================================
    // UPDATE ADMIN
    // ==========================================

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: "ADMIN",
        emailVerified: true,
        status: "active",
      },
    });

    console.log("***** Email verification status updated");
    console.log("***** Admin role updated");
    console.log("******* SUCCESS ******");

  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();