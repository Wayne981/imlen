import { redirect } from 'next/navigation';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByID, createUser } from '@/neo4j.action';

export default async function CallbackPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000");
  }

  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000");
  }

  // Check if user exists in Neo4j and create if not
  const dbUser = await getUserByID(user.id);
  if (!dbUser) {
    await createUser({
      applicationId: user.id,
      email: user.email ?? '',
      firstname: user.given_name ?? '',
      lastname: user.family_name ?? undefined,
    });
  }

  // Redirect to home or dashboard
  return redirect("/");  // or "/dashboard" if you've created that page
}