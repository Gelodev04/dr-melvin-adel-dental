import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      clinicId?: string;
    };
  }

  interface User {
    clinicId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    clinicId?: string;
  }
}
